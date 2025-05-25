
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Calendar, Users, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { obtenirAffaires, validerAffaire, supprimerAffaire } from "@/utils/affaireUtils";
import { AffaireContentieuse } from "@/types/affaire";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ListeAffairesContentieusesProps {
  refreshTrigger: number;
}

const getStatutBadge = (statut: string) => {
  switch (statut) {
    case 'brouillon':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Brouillon</Badge>;
    case 'validee':
      return <Badge variant="default" className="bg-green-100 text-green-800">Validée</Badge>;
    case 'en_repartition':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">En Répartition</Badge>;
    default:
      return <Badge variant="outline">{statut}</Badge>;
  }
};

export const ListeAffairesContentieuses = ({ refreshTrigger }: ListeAffairesContentieusesProps) => {
  const [affaires, setAffaires] = useState<AffaireContentieuse[]>([]);
  const [recherche, setRecherche] = useState("");
  const [affaireSelectionnee, setAffaireSelectionnee] = useState<AffaireContentieuse | null>(null);

  useEffect(() => {
    setAffaires(obtenirAffaires());
  }, [refreshTrigger]);

  const affairesFiltrees = affaires.filter(affaire =>
    affaire.numeroAffaire.toLowerCase().includes(recherche.toLowerCase()) ||
    affaire.descriptionAffaire.toLowerCase().includes(recherche.toLowerCase())
  );

  const handleValiderAffaire = (id: string) => {
    validerAffaire(id);
    setAffaires(obtenirAffaires());
    toast.success("Affaire validée avec succès");
  };

  const handleSupprimerAffaire = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette affaire ?")) {
      supprimerAffaire(id);
      setAffaires(obtenirAffaires());
      toast.success("Affaire supprimée");
    }
  };

  const afficherDetails = (affaire: AffaireContentieuse) => {
    setAffaireSelectionnee(affaire);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par numéro ou description..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {affairesFiltrees.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune affaire trouvée.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {affairesFiltrees.map((affaire) => (
            <Card key={affaire.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{affaire.numeroAffaire}</Badge>
                      {getStatutBadge(affaire.statut)}
                      <span className="text-sm text-gray-500">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(affaire.dateAffaire).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700">{affaire.descriptionAffaire}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Montant Affaire</p>
                          <p className="font-semibold">{affaire.montantAffaire.toLocaleString()} FCFA</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Ayants Droits</p>
                          <p className="font-semibold">{affaire.ayantsDroits.length}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Part Indicateur</p>
                        <p className="font-semibold">{affaire.partIndicateur.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => afficherDetails(affaire)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Détails de l'Affaire {affaire.numeroAffaire}</DialogTitle>
                        </DialogHeader>
                        {affaireSelectionnee && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Date de l'Affaire</p>
                                <p className="font-semibold">{new Date(affaireSelectionnee.dateAffaire).toLocaleDateString('fr-FR')}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Statut</p>
                                {getStatutBadge(affaireSelectionnee.statut)}
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Montant Affaire</p>
                                <p className="font-semibold">{affaireSelectionnee.montantAffaire.toLocaleString()} FCFA</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Part Indicateur</p>
                                <p className="font-semibold">{affaireSelectionnee.partIndicateur.toLocaleString()} FCFA</p>
                              </div>
                            </div>

                            {/* Informations détaillées supplémentaires */}
                            {(affaireSelectionnee.nomPrenomContrevenant || affaireSelectionnee.regionDgd) && (
                              <div className="grid grid-cols-2 gap-4">
                                {affaireSelectionnee.nomPrenomContrevenant && (
                                  <div>
                                    <p className="text-sm text-gray-600">Contrevenant</p>
                                    <p className="font-semibold">{affaireSelectionnee.nomPrenomContrevenant}</p>
                                  </div>
                                )}
                                {affaireSelectionnee.regionDgd && (
                                  <div>
                                    <p className="text-sm text-gray-600">Région/DGD</p>
                                    <p className="font-semibold">{affaireSelectionnee.regionDgd}</p>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {affaireSelectionnee.observations && (
                              <div>
                                <p className="text-sm text-gray-600">Observations</p>
                                <p className="text-sm">{affaireSelectionnee.observations}</p>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <h4 className="font-semibold">Ayants Droits</h4>
                              {affaireSelectionnee.ayantsDroits.map((ayant, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                  <div>
                                    <span className="font-medium">{ayant.nom}</span>
                                    <span className="text-gray-600 ml-2">({ayant.typeAyantDroit})</span>
                                  </div>
                                  <span className="font-medium">{ayant.montant.toLocaleString()} FCFA</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {affaire.statut === 'brouillon' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleValiderAffaire(affaire.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Valider
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleSupprimerAffaire(affaire.id)}
                        >
                          Supprimer
                        </Button>
                      </>
                    )}
                    
                    {affaire.statut === 'validee' && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Prête pour répartition
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
