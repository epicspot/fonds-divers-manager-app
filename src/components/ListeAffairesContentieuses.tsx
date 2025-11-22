
import { useState } from "react";
import { AffaireContentieuse } from "@/types/affaire";
import { DetailAffaire } from "./affaires/DetailAffaire";
import { ModifierAffaire } from "./affaires/ModifierAffaire";
import { FiltresAffaires } from "./affaires/FiltresAffaires";
import { ListeAffaires } from "./affaires/ListeAffaires";
import { useAffairesData } from "./affaires/useAffairesData";

interface ListeAffairesContentieuseProps {
  refreshTrigger: number;
}

export const ListeAffairesContentieuses = ({
  refreshTrigger,
}: ListeAffairesContentieuseProps) => {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [affaireSelectionnee, setAffaireSelectionnee] = useState<AffaireContentieuse | null>(null);
  const [modeVue, setModeVue] = useState<'detail' | 'modifier' | null>(null);

  const { affaires, isLoading, handleSupprimer, handleAffaireModifiee } = useAffairesData(refreshTrigger);

  const handleModifier = (affaire: AffaireContentieuse) => {
    setAffaireSelectionnee(affaire);
    setModeVue('modifier');
  };

  const handleVoir = (affaire: AffaireContentieuse) => {
    setAffaireSelectionnee(affaire);
    setModeVue('detail');
  };

  const handleCloseModal = () => {
    setAffaireSelectionnee(null);
    setModeVue(null);
  };

  const handleEditFromDetail = () => {
    // Passer de la vue détail à la vue modification
    setModeVue('modifier');
  };

  const affairesFiltrees = affaires.filter((affaire) => {
    const correspondRecherche =
      affaire.numeroAffaire.toLowerCase().includes(recherche.toLowerCase()) ||
      affaire.descriptionAffaire.toLowerCase().includes(recherche.toLowerCase()) ||
      (affaire.nomPrenomContrevenant || "").toLowerCase().includes(recherche.toLowerCase());

    const correspondStatut = filtreStatut === "tous" || affaire.statut === filtreStatut;

    return correspondRecherche && correspondStatut;
  });

  return (
    <div className="space-y-6">
      <FiltresAffaires
        recherche={recherche}
        setRecherche={setRecherche}
        filtreStatut={filtreStatut}
        setFiltreStatut={setFiltreStatut}
      />

      <ListeAffaires
        affaires={affaires}
        affairesFiltrees={affairesFiltrees}
        onVoir={handleVoir}
        onModifier={handleModifier}
        onSupprimer={handleSupprimer}
        onAffaireModifiee={handleAffaireModifiee}
        isLoading={isLoading}
      />

      <DetailAffaire
        affaire={affaireSelectionnee}
        isOpen={modeVue === 'detail'}
        onClose={handleCloseModal}
        onEditAffaire={handleEditFromDetail}
      />

      <ModifierAffaire
        affaire={affaireSelectionnee}
        isOpen={modeVue === 'modifier'}
        onClose={handleCloseModal}
        onAffaireModifiee={handleAffaireModifiee}
      />
    </div>
  );
};
