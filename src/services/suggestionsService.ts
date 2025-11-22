import { supabase } from "@/integrations/supabase/client";
import { AffaireContentieuse } from "@/types/affaire";

export interface Suggestion {
  field: string;
  label: string;
  value: any;
  confidence: 'high' | 'medium' | 'low';
  source: 'bureau_default' | 'similar_cases' | 'frequent_value';
  reason: string;
}

export interface SuggestionsResult {
  suggestions: Suggestion[];
  similarCasesCount: number;
}

// Fonction pour obtenir les valeurs par défaut du bureau
export const getDefaultValuesByBureau = async (bureauNom: string) => {
  try {
    const { data, error } = await supabase
      .from('configurations_bureau')
      .select('valeurs_defaut')
      .eq('bureau_nom', bureauNom)
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la récupération des valeurs par défaut:', error);
      return {};
    }

    return data?.valeurs_defaut || {};
  } catch (error) {
    console.error('Erreur:', error);
    return {};
  }
};

// Fonction pour analyser les affaires similaires
export const getFrequentValues = async (
  bureauNom?: string,
  regionDgd?: string,
  limit: number = 20
) => {
  try {
    let query = supabase
      .from('affaires_contentieuses')
      .select('donnees')
      .eq('statut', 'validee')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Pas de filtrage direct sur JSONB, on récupère et filtre en mémoire
    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la récupération des affaires:', error);
      return [];
    }

    // Filtrer les affaires correspondantes en mémoire
    const affairesFiltrees = (data || []).filter(affaire => {
      const donnees = affaire.donnees as any;
      if (bureauNom && !donnees?.bureauPoste?.includes(bureauNom)) {
        return false;
      }
      if (regionDgd && !donnees?.regionDgd?.includes(regionDgd)) {
        return false;
      }
      return true;
    });

    return affairesFiltrees.map(a => a.donnees);
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};

// Fonction pour calculer la fréquence d'une valeur dans un champ
const calculateFieldFrequency = (
  affaires: any[],
  fieldPath: string
): Map<any, number> => {
  const frequency = new Map<any, number>();

  affaires.forEach(affaire => {
    const value = getNestedValue(affaire, fieldPath);
    if (value !== undefined && value !== null && value !== '') {
      const key = Array.isArray(value) ? JSON.stringify(value) : value;
      frequency.set(key, (frequency.get(key) || 0) + 1);
    }
  });

  return frequency;
};

// Fonction helper pour accéder aux valeurs imbriquées
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Fonction pour obtenir la valeur la plus fréquente
const getMostFrequentValue = (frequency: Map<any, number>): any => {
  if (frequency.size === 0) return null;

  let maxCount = 0;
  let mostFrequent = null;

  frequency.forEach((count, value) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = value;
    }
  });

  return mostFrequent;
};

// Fonction principale pour générer les suggestions
export const generateSuggestions = async (
  partialAffaire: Partial<AffaireContentieuse>
): Promise<SuggestionsResult> => {
  const suggestions: Suggestion[] = [];
  const bureau = partialAffaire.bureauPoste?.[0];
  const region = partialAffaire.regionDgd?.[0];

  // 1. Récupérer les valeurs par défaut du bureau
  let defaultValues = {};
  if (bureau) {
    defaultValues = await getDefaultValuesByBureau(bureau);
  }

  // 2. Analyser les affaires similaires
  const similarCases = await getFrequentValues(bureau, region, 50);

  // 3. Générer des suggestions pour les champs importants
  const fieldsToSuggest = [
    {
      field: 'natureInfraction',
      label: 'Nature de l\'infraction',
      path: 'natureInfraction'
    },
    {
      field: 'procedureDetectionFraude',
      label: 'Procédure de détection',
      path: 'procedureDetectionFraude'
    },
    {
      field: 'natureTransport',
      label: 'Nature du transport',
      path: 'natureTransport'
    },
    {
      field: 'suiteReserveeMarchandises',
      label: 'Suite réservée aux marchandises',
      path: 'suiteReserveeMarchandises'
    },
    {
      field: 'nomsChefs',
      label: 'Chef(s) de bureau',
      path: 'nomsChefs'
    },
    {
      field: 'commissionnaireDouane',
      label: 'Commissionnaire en douane',
      path: 'commissionnaireDouane'
    }
  ];

  for (const fieldConfig of fieldsToSuggest) {
    const currentValue = getNestedValue(partialAffaire, fieldConfig.path);
    
    // Si le champ est déjà rempli, ne pas suggérer
    if (currentValue && (Array.isArray(currentValue) ? currentValue.length > 0 : true)) {
      continue;
    }

    // Vérifier les valeurs par défaut du bureau
    const defaultValue = defaultValues[fieldConfig.field];
    if (defaultValue) {
      suggestions.push({
        field: fieldConfig.field,
        label: fieldConfig.label,
        value: defaultValue,
        confidence: 'high',
        source: 'bureau_default',
        reason: `Valeur par défaut configurée pour ${bureau}`
      });
      continue;
    }

    // Analyser les affaires similaires
    const frequency = calculateFieldFrequency(similarCases, fieldConfig.path);
    const mostFrequent = getMostFrequentValue(frequency);

    if (mostFrequent) {
      const count = frequency.get(mostFrequent) || 0;
      const percentage = similarCases.length > 0 
        ? Math.round((count / similarCases.length) * 100) 
        : 0;

      let confidence: 'high' | 'medium' | 'low' = 'low';
      if (percentage >= 70) confidence = 'high';
      else if (percentage >= 40) confidence = 'medium';

      // Parse si c'était un array stringifié
      let value = mostFrequent;
      try {
        const parsed = JSON.parse(mostFrequent);
        if (Array.isArray(parsed)) value = parsed;
      } catch {
        // Pas un JSON, garder la valeur telle quelle
      }

      suggestions.push({
        field: fieldConfig.field,
        label: fieldConfig.label,
        value,
        confidence,
        source: 'frequent_value',
        reason: `Utilisé dans ${percentage}% des ${similarCases.length} affaires similaires`
      });
    }
  }

  return {
    suggestions,
    similarCasesCount: similarCases.length
  };
};

// Fonction pour sauvegarder les valeurs par défaut d'un bureau
export const saveDefaultValues = async (
  bureauNom: string,
  region: string,
  valeursDefaut: Record<string, any>
) => {
  try {
    const { data, error } = await supabase
      .from('configurations_bureau')
      .upsert({
        bureau_nom: bureauNom,
        region,
        valeurs_defaut: valeursDefaut
      }, {
        onConflict: 'bureau_nom'
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return { success: false, error };
  }
};
