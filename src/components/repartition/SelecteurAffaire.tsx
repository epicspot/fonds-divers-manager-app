
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, DollarSign, RefreshCw } from "lucide-react";
import { obtenirAffaires } from "@/utils/affaireUtils";
import { AffaireContentieuse } from "@/types/affaire";
import { ParametresRepartition } from "@/types/repartition";

interface SelecteurAffaireProps {
  onAffaireSelectionnee: (parametres: ParametresRepartition) => void;
}

export const SelecteurAffaire = ({ onAffaireSelectionnee }: SelecteurAffaireProps) => {
  const [affaires, setAffaires] = useState<AffaireContentieuse[]>([]);
  const [affaireSelectionnee, setAffaireSelectionnee] = useState<string>("");

  const chargerAffaires = () => {
    // Inclure les affaires validées ET en répartition
    const affairesDisponibles = obtenirAffaires().filter(a => 
      a.statut === 'validee' || a.statut === 'en_repartition'
    );
    setAffaires(affairesDisponibles);
  };

  useEffect(() => {
    chargerAffaires();
    
    // Ajouter un listener pour détecter les changements dans localStorage
    const handleStorageChange = () => {
      chargerAffaires();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Ajouter un listener personnalisé pour les mises à jour locales
    const handleLocalUpdate = () => {
      chargerAffaires();
    };
    
    window.addEventListener('affaire-updated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('affaire-updated', handleLocalUpdate);
    };
  }, []);

  const handleSelectionAffaire = (affaireId: string) => {
    setAffaireSelectionnee(affaireId);
    const affaire = affaires.find(a => a.id === affaireId);
    
    if (affaire) {
      const parametres: ParametresRepartition = {
        montantAffaire: affaire.montantAffaire,
        montantAmende: affaire.montantAmende || 0,
        montantVente: affaire.montantVente || 0,
        fraisDivers: affaire.montantTotalFrais || 0,
        nombreSaisissants: affaire.nomsSaisissant?.length || 0,
        nombreChefs: affaire.nomsChefs?.length || 0,
        nombreInformateurs: affaire.nombreInformateurs || 0,
        saisissants: affaire.nomsSaisissant || [],
        chefs: affaire.nomsChefs || [],
        informateurs: []
      };
      
      onAffaireSelectionnee(parametres);
    }
  };

  const affaireDetails = affaires.find(a => a.id === affaireSelectionnee);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sélectionner une Affaire Contentieuse
          </CardTitle>
          <Button variant="outline" size="sm" onClick={chargerAffaires}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Select value={affaireSelectionnee} onValueChange={handleSelectionAffaire}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une affaire disponible..." />
            </SelectTrigger>
            <SelectContent>
              {affaires.map((affaire) => (
                <SelectItem key={affaire.id} value={affaire.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{affaire.numeroAffaire}</span>
                    <Badge variant="secondary">
                      {affaire.montantAffaire.toLocaleString()} FCFA
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {affaireDetails && (
          <div className="p-4 bg-blue-50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-blue-900">Détails de l'Affaire</h4>
              <Badge>{affaireDetails.statut}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Date: {new Date(affaireDetails.dateAffaire).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span>Montant: {affaireDetails.montantAffaire.toLocaleString()} FCFA</span>
              </div>
            </div>

            <div className="text-sm">
              <p className="text-gray-700">{affaireDetails.descriptionAffaire}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-white rounded">
                <span className="font-medium">{affaireDetails.nomsSaisissant?.length || 0}</span>
                <p className="text-gray-600">Saisissants</p>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <span className="font-medium">{affaireDetails.nomsChefs?.length || 0}</span>
                <p className="text-gray-600">Chefs</p>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <span className="font-medium">{affaireDetails.nombreInformateurs || 0}</span>
                <p className="text-gray-600">Informateurs</p>
              </div>
            </div>
          </div>
        )}

        {affaires.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune affaire disponible</p>
            <p className="text-sm">Créez et validez d'abord des affaires contentieuses</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
