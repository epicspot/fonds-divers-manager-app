
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, Printer, CheckCircle, Eye } from "lucide-react";
import { ParametresRepartition, ResultatRepartition } from "@/types/repartition";

interface ParametresAffichageProps {
  parametres: ParametresRepartition;
  resultat: ResultatRepartition | null;
  onCalculer: () => void;
  onTelecharger: () => void;
  onApercu?: () => void;
  onValider?: () => void;
  affaireId?: string;
}

export const ParametresAffichage = ({ 
  parametres, 
  resultat, 
  onCalculer, 
  onTelecharger,
  onApercu,
  onValider,
  affaireId
}: ParametresAffichageProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Paramètres de Répartition
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Label className="text-sm text-gray-600">Montant Affaire</Label>
            <p className="text-lg font-bold">{parametres.montantAffaire.toLocaleString()} FCFA</p>
          </div>
          <div className="text-center">
            <Label className="text-sm text-gray-600">Montant Amende</Label>
            <p className="text-lg font-bold">{parametres.montantAmende?.toLocaleString() || 0} FCFA</p>
          </div>
          <div className="text-center">
            <Label className="text-sm text-gray-600">Montant Vente</Label>
            <p className="text-lg font-bold">{parametres.montantVente?.toLocaleString() || 0} FCFA</p>
          </div>
          <div className="text-center">
            <Label className="text-sm text-gray-600">Frais Divers</Label>
            <p className="text-lg font-bold">{parametres.fraisDivers?.toLocaleString() || 0} FCFA</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">Saisissants ({parametres.nombreSaisissants})</Label>
            <div className="mt-1 space-y-1">
              {parametres.saisissants.map((nom, index) => (
                <div key={index} className="text-sm p-2 bg-blue-50 rounded">
                  {nom}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Chefs ({parametres.nombreChefs})</Label>
            <div className="mt-1 space-y-1">
              {parametres.chefs.map((nom, index) => (
                <div key={index} className="text-sm p-2 bg-green-50 rounded">
                  {nom}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Informateurs ({parametres.nombreInformateurs})</Label>
            <div className="mt-1 space-y-1">
              {parametres.informateurs?.map((nom, index) => (
                <div key={index} className="text-sm p-2 bg-yellow-50 rounded">
                  {nom || `Informateur ${index + 1}`}
                </div>
              )) || <p className="text-sm text-gray-500">Aucun informateur</p>}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={onCalculer} className="flex-1">
            <Calculator className="h-4 w-4 mr-2" />
            Calculer la Répartition
          </Button>
          
          {resultat && (
            <>
              {onApercu && (
                <Button variant="outline" onClick={onApercu}>
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu Bordereau
                </Button>
              )}
              
              <Button variant="outline" onClick={onTelecharger}>
                <Printer className="h-4 w-4 mr-2" />
                Impression Rapide
              </Button>
              
              {affaireId && onValider && (
                <Button onClick={onValider} variant="default">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Valider l'Affaire
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
