import { useState, useEffect } from "react";
import {
  getModelesRapports,
  getModeleParDefaut,
  ModeleRapport,
} from "@/services/modelesRapportsService";
import { toast } from "sonner";

export const useModelesRapports = (typeRapport?: string) => {
  const [modeles, setModeles] = useState<ModeleRapport[]>([]);
  const [modeleDefaut, setModeleDefaut] = useState<ModeleRapport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chargerModeles();
  }, []);

  useEffect(() => {
    if (typeRapport) {
      chargerModeleDefaut(typeRapport);
    }
  }, [typeRapport]);

  const chargerModeles = async () => {
    try {
      setIsLoading(true);
      const data = await getModelesRapports();
      setModeles(data);
    } catch (error) {
      console.error("Erreur lors du chargement des modèles:", error);
      toast.error("Erreur lors du chargement des modèles");
    } finally {
      setIsLoading(false);
    }
  };

  const chargerModeleDefaut = async (type: string) => {
    try {
      const modele = await getModeleParDefaut(type);
      setModeleDefaut(modele);
    } catch (error) {
      console.error("Erreur lors du chargement du modèle par défaut:", error);
    }
  };

  const getModelesPourType = (type: string) => {
    return modeles.filter((m) => m.typeRapport === type);
  };

  return {
    modeles,
    modeleDefaut,
    isLoading,
    chargerModeles,
    getModelesPourType,
  };
};
