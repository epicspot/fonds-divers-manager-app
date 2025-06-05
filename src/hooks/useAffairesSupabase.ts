
import { useState, useEffect } from "react";
import { AffaireContentieuse } from "@/types/affaire";
import { affairesService } from "@/services/affairesService";
import { useToast } from "@/hooks/use-toast";

export const useAffairesSupabase = () => {
  const [affaires, setAffaires] = useState<AffaireContentieuse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const chargerAffaires = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await affairesService.obtenirAffaires();
      setAffaires(data);
    } catch (err) {
      console.error('Erreur lors du chargement des affaires:', err);
      setError('Erreur lors du chargement des affaires');
      toast({
        title: "Erreur",
        description: "Impossible de charger les affaires",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chargerAffaires();
  }, []);

  const creerAffaire = async (affaire: Partial<AffaireContentieuse>) => {
    try {
      const nouvelleAffaire = await affairesService.creerAffaire(affaire);
      setAffaires(prev => [nouvelleAffaire, ...prev]);
      toast({
        title: "Succès",
        description: "Affaire créée avec succès"
      });
      return nouvelleAffaire;
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'affaire",
        variant: "destructive"
      });
      throw err;
    }
  };

  const mettreAJourAffaire = async (id: string, affaire: Partial<AffaireContentieuse>) => {
    try {
      const affaireMiseAJour = await affairesService.mettreAJourAffaire(id, affaire);
      setAffaires(prev => prev.map(a => a.id === id ? affaireMiseAJour : a));
      toast({
        title: "Succès",
        description: "Affaire mise à jour avec succès"
      });
      return affaireMiseAJour;
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'affaire",
        variant: "destructive"
      });
      throw err;
    }
  };

  const supprimerAffaire = async (id: string) => {
    try {
      await affairesService.supprimerAffaire(id);
      setAffaires(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Succès",
        description: "Affaire supprimée avec succès"
      });
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'affaire",
        variant: "destructive"
      });
      throw err;
    }
  };

  const validerAffaire = async (id: string) => {
    try {
      await affairesService.validerAffaire(id);
      await chargerAffaires(); // Recharger pour avoir les données à jour
      toast({
        title: "Succès",
        description: "Affaire validée avec succès"
      });
    } catch (err) {
      console.error('Erreur lors de la validation:', err);
      toast({
        title: "Erreur",
        description: "Impossible de valider l'affaire",
        variant: "destructive"
      });
      throw err;
    }
  };

  return {
    affaires,
    isLoading,
    error,
    chargerAffaires,
    creerAffaire,
    mettreAJourAffaire,
    supprimerAffaire,
    validerAffaire
  };
};
