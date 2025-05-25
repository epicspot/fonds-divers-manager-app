
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2, Search, Filter } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";

interface ListeAffairesContentieuseProps {
  refreshTrigger: number;
}

export const ListeAffairesContentieuses = ({
  refreshTrigger,
}: ListeAffairesContentieuseProps) => {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [affaires, setAffaires] = useState<AffaireContentieuse[]>([]);

  // Load affaires from localStorage
  useEffect(() => {
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

    loadAffaires();
  }, [refreshTrigger]);

  const handleModifier = (affaire: AffaireContentieuse) => {
    console.log('Modifier affaire:', affaire);
    // TODO: Implement edit functionality
  };

  const handleSupprimer = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette affaire ?')) {
      const updatedAffaires = affaires.filter(affaire => affaire.id !== id);
      setAffaires(updatedAffaires);
      localStorage.setItem('affaires_contentieuses', JSON.stringify(updatedAffaires));
    }
  };

  const handleVoir = (affaire: AffaireContentieuse) => {
    console.log('Voir affaire:', affaire);
    // TODO: Implement view functionality
  };

  const affairesFiltrees = affaires.filter((affaire) => {
    const correspondRecherche =
      affaire.numeroAffaire.toLowerCase().includes(recherche.toLowerCase()) ||
      affaire.descriptionAffaire.toLowerCase().includes(recherche.toLowerCase()) ||
      (affaire.nomPrenomContrevenant || "").toLowerCase().includes(recherche.toLowerCase());

    const correspondStatut = filtreStatut === "tous" || affaire.statut === filtreStatut;

    return correspondRecherche && correspondStatut;
  });

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "brouillon":
        return <Badge variant="secondary">Brouillon</Badge>;
      case "validee":
        return <Badge variant="default">Validée</Badge>;
      case "en_repartition":
        return <Badge variant="outline">En Répartition</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par numéro, description ou contrevenant..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="tous">Tous les statuts</option>
            <option value="brouillon">Brouillon</option>
            <option value="validee">Validée</option>
            <option value="en_repartition">En Répartition</option>
          </select>
        </div>
      </div>

      {/* Liste des affaires */}
      <div className="grid gap-4">
        {affairesFiltrees.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              {affaires.length === 0
                ? "Aucune affaire contentieuse enregistrée"
                : "Aucune affaire ne correspond aux critères de recherche"}
            </CardContent>
          </Card>
        ) : (
          affairesFiltrees.map((affaire) => (
            <Card key={affaire.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {affaire.numeroAffaire}
                      {getStatutBadge(affaire.statut)}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{affaire.dateAffaire}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVoir(affaire)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModifier(affaire)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSupprimer(affaire.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-gray-600 truncate">
                      {affaire.descriptionAffaire}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Montant:</span>
                    <p className="text-gray-600">
                      {affaire.montantAffaire?.toLocaleString()} FCFA
                    </p>
                  </div>
                  {affaire.nomPrenomContrevenant && (
                    <div>
                      <span className="font-medium">Contrevenant:</span>
                      <p className="text-gray-600 truncate">
                        {affaire.nomPrenomContrevenant}
                      </p>
                    </div>
                  )}
                  {affaire.produitNetRepartir && (
                    <div>
                      <span className="font-medium">Produit Net:</span>
                      <p className="text-gray-600">
                        {affaire.produitNetRepartir.toLocaleString()} FCFA
                      </p>
                    </div>
                  )}
                  {affaire.observations && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <span className="font-medium">Observations:</span>
                      <p className="text-gray-600 truncate">
                        {affaire.observations}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {affairesFiltrees.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          {affairesFiltrees.length} affaire(s) affichée(s) sur {affaires.length}
        </div>
      )}
    </div>
  );
};
