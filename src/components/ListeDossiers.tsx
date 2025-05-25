
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Calendar, Users, DollarSign } from "lucide-react";
import { obtenirDossiers } from "@/utils/fondsUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ListeDossiersProps {
  refreshTrigger: number;
}

export const ListeDossiers = ({ refreshTrigger }: ListeDossiersProps) => {
  const [dossiers, setDossiers] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [dossierSelectionne, setDossierSelectionne] = useState(null);

  useEffect(() => {
    setDossiers(obtenirDossiers());
  }, [refreshTrigger]);

  const dossiersFiltres = dossiers.filter(dossier =>
    dossier.numeroRepartition.toLowerCase().includes(recherche.toLowerCase())
  );

  const afficherDetails = (dossier) => {
    setDossierSelectionne(dossier);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par numéro de répartition..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {dossiersFiltres.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucun dossier trouvé.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {dossiersFiltres.map((dossier, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{dossier.numeroRepartition}</Badge>
                      <span className="text-sm text-gray-500">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(dossier.dateCreation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Montant Net</p>
                          <p className="font-semibold">{dossier.montantNet.toLocaleString()} FCFA</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Ayants Droits</p>
                          <p className="font-semibold">{dossier.ayantsDroits.length}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Part FSP</p>
                        <p className="font-semibold">{dossier.partFsp.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => afficherDetails(dossier)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Détails du Dossier {dossier.numeroRepartition}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Montant Affaire</p>
                            <p className="font-semibold">{dossier.montantAffaire.toLocaleString()} FCFA</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Part Indicateur</p>
                            <p className="font-semibold">{dossier.partIndicateur.toLocaleString()} FCFA</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold">Ayants Droits</h4>
                          {dossier.ayantsDroits.map((ayant, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span>{ayant.nom}</span>
                              <span className="font-medium">{ayant.montant.toLocaleString()} FCFA</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
