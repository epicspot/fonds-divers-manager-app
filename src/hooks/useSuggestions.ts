import { useState, useEffect } from 'react';
import { AffaireContentieuse } from '@/types/affaire';
import { generateSuggestions, Suggestion, SuggestionsResult } from '@/services/suggestionsService';
import { useToast } from '@/hooks/use-toast';

export const useSuggestions = (partialAffaire: Partial<AffaireContentieuse>) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [similarCasesCount, setSimilarCasesCount] = useState(0);
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
        setSuggestions(result.suggestions);
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
  ]);

  const applySuggestion = (field: string): Suggestion | undefined => {
    return suggestions.find(s => s.field === field);
  };

  const dismissSuggestion = (field: string) => {
    setSuggestions(prev => prev.filter(s => s.field !== field));
  };

  const dismissAllSuggestions = () => {
    setSuggestions([]);
  };

  return {
    suggestions,
    loading,
    similarCasesCount,
    applySuggestion,
    dismissSuggestion,
    dismissAllSuggestions,
  };
};
