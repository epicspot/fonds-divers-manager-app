
import { useState, useEffect } from "react";
import { AffaireContentieuse } from "@/types/affaire";

export const useAffairesData = (refreshTrigger: number) => {
  const [affaires, setAffaires] = useState<AffaireContentieuse[]>([]);

  const loadAffaires = () => {
    try {
      const storedAffaires = localStorage.getItem('affaires_contentieuses');
      if (storedAffaires) {
        setAffaires(JSON.parse(storedAffaires));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des affaires:', error);
      setAffaires([]);
    }
  };

  useEffect(() => {
    loadAffaires();
  }, [refreshTrigger]);

  const handleSupprimer = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette affaire ?')) {
      const updatedAffaires = affaires.filter(affaire => affaire.id !== id);
      setAffaires(updatedAffaires);
      localStorage.setItem('affaires_contentieuses', JSON.stringify(updatedAffaires));
    }
  };

  const handleAffaireModifiee = () => {
    loadAffaires();
  };

  return {
    affaires,
    handleSupprimer,
    handleAffaireModifiee
  };
};
