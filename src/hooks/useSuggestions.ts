import { useState, useEffect } from 'react';
import { AffaireContentieuse } from '@/types/affaire';
import { generateSuggestions, Suggestion, SuggestionsResult } from '@/services/suggestionsService';
import { 
  logSuggestionEvent, 
  applyLearningToSuggestions,
  getLearningInsights
} from '@/services/learningService';
import { useToast } from '@/hooks/use-toast';

export const useSuggestions = (partialAffaire: Partial<AffaireContentieuse>) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [similarCasesCount, setSimilarCasesCount] = useState(0);
  const [learningActive, setLearningActive] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSuggestions = async () => {
      // Ne générer des suggestions que si on a un bureau ou une région
      if (!partialAffaire.bureauPoste?.[0] && !partialAffaire.regionDgd?.[0]) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const result: SuggestionsResult = await generateSuggestions(partialAffaire);
        let finalSuggestions = result.suggestions;
        
        // Appliquer l'apprentissage automatique si activé
        if (learningActive && partialAffaire.bureauPoste?.[0]) {
          finalSuggestions = await applyLearningToSuggestions(
            finalSuggestions,
            partialAffaire.bureauPoste[0]
          );
        }
        
        setSuggestions(finalSuggestions);
        setSimilarCasesCount(result.similarCasesCount);
      } catch (error) {
        console.error('Erreur lors du chargement des suggestions:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les suggestions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [
    partialAffaire.bureauPoste?.[0],
    partialAffaire.regionDgd?.[0],
    learningActive,
  ]);

  const applySuggestion = (field: string): Suggestion | undefined => {
    return suggestions.find(s => s.field === field);
  };

  const dismissSuggestion = async (field: string) => {
    const suggestion = suggestions.find(s => s.field === field);
    
    // Logger le rejet si le bureau est défini
    if (suggestion && partialAffaire.bureauPoste?.[0]) {
      await logSuggestionEvent({
        bureauNom: partialAffaire.bureauPoste[0],
        region: partialAffaire.regionDgd?.[0],
        fieldName: field,
        suggestedValue: suggestion.value,
        action: 'rejected',
        confidence: suggestion.confidence,
        source: suggestion.source
      });
    }
    
    setSuggestions(prev => prev.filter(s => s.field !== field));
  };

  const acceptSuggestion = async (field: string) => {
    const suggestion = suggestions.find(s => s.field === field);
    
    // Logger l'acceptation si le bureau est défini
    if (suggestion && partialAffaire.bureauPoste?.[0]) {
      await logSuggestionEvent({
        bureauNom: partialAffaire.bureauPoste[0],
        region: partialAffaire.regionDgd?.[0],
        fieldName: field,
        suggestedValue: suggestion.value,
        action: 'accepted',
        confidence: suggestion.confidence,
        source: suggestion.source
      });
    }
  };

  const dismissAllSuggestions = async () => {
    // Logger tous les rejets
    if (partialAffaire.bureauPoste?.[0]) {
      await Promise.all(
        suggestions.map(s =>
          logSuggestionEvent({
            bureauNom: partialAffaire.bureauPoste![0],
            region: partialAffaire.regionDgd?.[0],
            fieldName: s.field,
            suggestedValue: s.value,
            action: 'ignored',
            confidence: s.confidence,
            source: s.source
          })
        )
      );
    }
    
    setSuggestions([]);
  };

  const toggleLearning = () => {
    setLearningActive(prev => !prev);
  };

  return {
    suggestions,
    loading,
    similarCasesCount,
    learningActive,
    applySuggestion,
    dismissSuggestion,
    acceptSuggestion,
    dismissAllSuggestions,
    toggleLearning,
  };
};
