
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calculator, Download, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { repartirMontants, genererBordereauRepartition } from "@/utils/repartitionUtils";
import { ParametresRepartition, ResultatRepartition } from "@/types/repartition";
import { SelecteurAffaire } from "./SelecteurAffaire";

interface CalculateurRepartitionProps {
  onResultatChange?: (resultat: ResultatRepartition) => void;
}

export const CalculateurRepartition = ({ onResultatChange }: CalculateurRepartitionProps) => {
  const [parametres, setParametres] = useState<ParametresRepartition | null>(null);
  const [resultat, setResultat] = useState<ResultatRepartition | null>(null);

  const calculerRepartition = () => {
    if (!parametres) {
      toast.error("Veuillez d'abord sélectionner une affaire");
      return;
    }

    if (parametres.montantAffaire <= 0) {
      toast.error("Le montant de l'affaire doit être supérieur à 0");
      return;
    }

    const nouveauResultat = repartirMontants(parametres);
    setResultat(nouveauResultat);
    onResultatChange?.(nouveauResultat);

    if (nouveauResultat.verificationsOk) {
      toast.success("Répartition calculée avec succès");
    } else {
      toast.warning("Répartition calculée avec des avertissements");
    }
  };

  const telechargerBordereau = () => {
    if (!resultat) return;

    const bordereau = genererBordereauRepartition(resultat);
    const blob = new Blob([bordereau], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bordereau_repartition_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Bordereau téléchargé");
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur d'affaire */}
      <SelecteurAffaire onAffaireSelectionnee={setParametres} />

      {/* Paramètres sélectionnés */}
      {parametres && (
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
              <Button onClick={calculerRepartition} className="flex-1">
                <Calculator className="h-4 w-4 mr-2" />
                Calculer la Répartition
              </Button>
              
              {resultat && (
                <Button variant="outline" onClick={telechargerBordereau}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger Bordereau
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats */}
      {resultat && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {resultat.verificationsOk ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-500" />
              )}
              Résultat de la Répartition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <Label className="text-sm text-gray-600">Montant Total</Label>
                <p className="text-lg font-bold">{resultat.montantTotal.toLocaleString()} FCFA</p>
              </div>
              <div className="text-center">
                <Label className="text-sm text-gray-600">Part FSP</Label>
                <p className="text-lg font-bold text-blue-600">{resultat.partFsp.toLocaleString()} FCFA</p>
              </div>
              <div className="text-center">
                <Label className="text-sm text-gray-600">Montant Net</Label>
                <p className="text-lg font-bold text-green-600">{resultat.montantNet.toLocaleString()} FCFA</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">Répartition par Ayant Droit</Label>
              {resultat.ayantsDroits.map((ayant, index) => (
                <div key={ayant.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={ayant.type === 'tresor' ? 'default' : 'secondary'}>
                      {ayant.type.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{ayant.nom}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{ayant.montantCalcule.toLocaleString()} FCFA</p>
                    <p className="text-sm text-gray-600">{ayant.pourcentage.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
            </div>

            {!resultat.verificationsOk && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <Label className="font-semibold text-orange-800">Avertissements:</Label>
                <ul className="list-disc list-inside text-orange-700">
                  {resultat.erreurs.map((erreur, index) => (
                    <li key={index}>{erreur}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
