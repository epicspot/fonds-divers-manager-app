
import { useState, useEffect } from "react";
import { AffaireContentieuse } from "@/types/affaire";
import { useAffairesSupabase } from "@/hooks/useAffairesSupabase";

export const useAffairesData = (refreshTrigger: number) => {
  const { 
    affaires, 
    isLoading, 
    error, 
    chargerAffaires, 
    supprimerAffaire: supprimerAffaireSupabase 
  } = useAffairesSupabase();

  useEffect(() => {
    chargerAffaires();
  }, [refreshTrigger]);

  const handleSupprimer = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette affaire ?')) {
      try {
        await supprimerAffaireSupabase(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleAffaireModifiee = () => {
    chargerAffaires();
  };

  return {
    affaires,
    isLoading,
    error,
    handleSupprimer,
    handleAffaireModifiee
  };
};
