import { supabase } from "@/integrations/supabase/client";
import { Suggestion } from "./suggestionsService";

export interface SuggestionEvent {
  bureauNom: string;
  region?: string;
  fieldName: string;
  suggestedValue: any;
  action: 'accepted' | 'rejected' | 'ignored';
  confidence: 'high' | 'medium' | 'low';
  source: string;
  contextData?: Record<string, any>;
}

export interface LearningInsight {
  patterns: string[];
  preferences: string[];
  recommendations: string[];
  confidenceScore: number;
}

// Fonction pour logger un événement de suggestion
export const logSuggestionEvent = async (event: SuggestionEvent) => {
  try {
    const { error } = await supabase
      .from('suggestions_events')
      .insert({
        bureau_nom: event.bureauNom,
        region: event.region,
        field_name: event.fieldName,
        suggested_value: event.suggestedValue,
        action: event.action,
        confidence: event.confidence,
        source: event.source,
        context_data: event.contextData || {}
      });

    if (error) {
      console.error('Erreur lors du logging de l\'événement:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
};

// Fonction pour obtenir les insights d'apprentissage pour un champ
export const getLearningInsights = async (
  bureauNom: string,
  fieldName: string
): Promise<LearningInsight | null> => {
  try {
    const { data, error } = await supabase
      .from('suggestions_insights')
      .select('*')
      .eq('bureau_nom', bureauNom)
      .eq('field_name', fieldName)
      .eq('insight_type', 'pattern')
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la récupération des insights:', error);
      return null;
    }

    if (!data) return null;

    const insightData = data.insight_data as any;
    return {
      patterns: insightData.patterns || [],
      preferences: insightData.preferences || [],
      recommendations: insightData.recommendations || [],
      confidenceScore: insightData.confidenceScore || 0.5
    } as LearningInsight;
  } catch (error) {
    console.error('Erreur:', error);
    return null;
  }
};

// Fonction pour déclencher l'analyse IA
export const triggerAIAnalysis = async (
  bureauNom: string,
  fieldName: string
): Promise<{ success: boolean; insights?: LearningInsight; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-suggestions', {
      body: { bureauNom, fieldName, minEvents: 10 }
    });

    if (error) throw error;

    return {
      success: true,
      insights: data?.insights
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse IA:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// Fonction pour obtenir les statistiques d'apprentissage
export const getLearningStats = async (bureauNom?: string) => {
  try {
    let query = supabase
      .from('suggestions_events')
      .select('field_name, action, confidence', { count: 'exact' });

    if (bureauNom) {
      query = query.eq('bureau_nom', bureauNom);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Calculer les statistiques
    const stats: Record<string, any> = {};
    
    if (data) {
      data.forEach((event: any) => {
        if (!stats[event.field_name]) {
          stats[event.field_name] = {
            total: 0,
            accepted: 0,
            rejected: 0,
            ignored: 0,
            acceptanceRate: 0
          };
        }
        
        stats[event.field_name].total++;
        stats[event.field_name][event.action]++;
      });

      // Calculer les taux d'acceptation
      Object.keys(stats).forEach(field => {
        const fieldStats = stats[field];
        fieldStats.acceptanceRate = fieldStats.total > 0
          ? Math.round((fieldStats.accepted / fieldStats.total) * 100)
          : 0;
      });
    }

    return {
      stats,
      totalEvents: count || 0
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return { stats: {}, totalEvents: 0 };
  }
};

// Fonction pour appliquer les insights d'apprentissage aux suggestions
export const applyLearningToSuggestions = async (
  suggestions: Suggestion[],
  bureauNom: string
): Promise<Suggestion[]> => {
  const improvedSuggestions = [...suggestions];

  for (let i = 0; i < improvedSuggestions.length; i++) {
    const suggestion = improvedSuggestions[i];
    const insights = await getLearningInsights(bureauNom, suggestion.field);

    if (insights && insights.confidenceScore > 0.6) {
      // Améliorer la confiance basée sur les insights
      if (suggestion.confidence === 'low' && insights.confidenceScore > 0.7) {
        improvedSuggestions[i] = {
          ...suggestion,
          confidence: 'medium',
          source: 'ml_improved',
          reason: `${suggestion.reason} + Amélioré par apprentissage (score: ${(insights.confidenceScore * 100).toFixed(0)}%)`
        };
      }

      // Ajouter des recommandations si disponibles
      if (insights.recommendations && insights.recommendations.length > 0) {
        improvedSuggestions[i] = {
          ...improvedSuggestions[i],
          reason: `${improvedSuggestions[i].reason}\nRecommandation IA: ${insights.recommendations[0]}`
        };
      }
    }
  }

  return improvedSuggestions;
};
