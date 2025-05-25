
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Download, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { repartirMontants, genererBordereauRepartition } from "@/utils/repartitionUtils";
import { ParametresRepartition, ResultatRepartition } from "@/types/repartition";

interface CalculateurRepartitionProps {
  parametresInitiaux?: Partial<ParametresRepartition>;
  onResultatChange?: (resultat: ResultatRepartition) => void;
}

export const CalculateurRepartition = ({ 
  parametresInitiaux, 
  onResultatChange 
}: CalculateurRepartitionProps) => {
  const [parametres, setParametres] = useState<ParametresRepartition>({
    montantAffaire: 0,
    montantAmende: 0,
    montantVente: 0,
    fraisDivers: 0,
    nombreSaisissants: 1,
    nombreChefs: 1,
    nombreInformateurs: 0,
    saisissants: [""],
    chefs: [""],
    informateurs: [],
    ...parametresInitiaux
  });

  const [resultat, setResultat] = useState<ResultatRepartition | null>(null);

  const calculerRepartition = () => {
    if (parametres.montantAffaire <= 0) {
      toast.error("Le montant de l'affaire doit être supérieur à 0");
      return;
    }

    if (parametres.saisissants.some(s => !s.trim())) {
      toast.error("Tous les noms des saisissants doivent être renseignés");
      return;
    }

    if (parametres.chefs.some(c => !c.trim())) {
      toast.error("Tous les noms des chefs doivent être renseignés");
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

  const ajouterSaisissant = () => {
    setParametres(prev => ({
      ...prev,
      nombreSaisissants: prev.nombreSaisissants + 1,
      saisissants: [...prev.saisissants, ""]
    }));
  };

  const supprimerSaisissant = (index: number) => {
    if (parametres.nombreSaisissants <= 1) return;
    
    setParametres(prev => ({
      ...prev,
      nombreSaisissants: prev.nombreSaisissants - 1,
      saisissants: prev.saisissants.filter((_, i) => i !== index)
    }));
  };

  const ajouterChef = () => {
    setParametres(prev => ({
      ...prev,
      nombreChefs: prev.nombreChefs + 1,
      chefs: [...prev.chefs, ""]
    }));
  };

  const supprimerChef = (index: number) => {
    if (parametres.nombreChefs <= 1) return;
    
    setParametres(prev => ({
      ...prev,
      nombreChefs: prev.nombreChefs - 1,
      chefs: prev.chefs.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Paramètres de calcul */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Paramètres de Répartition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="montantAffaire">Montant Affaire (FCFA)</Label>
              <Input
                id="montantAffaire"
                type="number"
                value={parametres.montantAffaire}
                onChange={(e) => setParametres(prev => ({
                  ...prev,
                  montantAffaire: Number(e.target.value)
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="montantAmende">Montant Amende (FCFA)</Label>
              <Input
                id="montantAmende"
                type="number"
                value={parametres.montantAmende}
                onChange={(e) => setParametres(prev => ({
                  ...prev,
                  montantAmende: Number(e.target.value)
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="montantVente">Montant Vente (FCFA)</Label>
              <Input
                id="montantVente"
                type="number"
                value={parametres.montantVente}
                onChange={(e) => setParametres(prev => ({
                  ...prev,
                  montantVente: Number(e.target.value)
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="fraisDivers">Frais Divers (FCFA)</Label>
              <Input
                id="fraisDivers"
                type="number"
                value={parametres.fraisDivers}
                onChange={(e) => setParametres(prev => ({
                  ...prev,
                  fraisDivers: Number(e.target.value)
                }))}
              />
            </div>
          </div>

          {/* Saisissants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Saisissants (Ayants Droits)</Label>
              <Button size="sm" onClick={ajouterSaisissant}>Ajouter</Button>
            </div>
            <div className="space-y-2">
              {parametres.saisissants.map((saisissant, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Nom du saisissant ${index + 1}`}
                    value={saisissant}
                    onChange={(e) => {
                      const nouveauxSaisissants = [...parametres.saisissants];
                      nouveauxSaisissants[index] = e.target.value;
                      setParametres(prev => ({
                        ...prev,
                        saisissants: nouveauxSaisissants
                      }));
                    }}
                  />
                  {parametres.nombreSaisissants > 1 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => supprimerSaisissant(index)}
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chefs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Chefs</Label>
              <Button size="sm" onClick={ajouterChef}>Ajouter</Button>
            </div>
            <div className="space-y-2">
              {parametres.chefs.map((chef, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Nom du chef ${index + 1}`}
                    value={chef}
                    onChange={(e) => {
                      const nouveauxChefs = [...parametres.chefs];
                      nouveauxChefs[index] = e.target.value;
                      setParametres(prev => ({
                        ...prev,
                        chefs: nouveauxChefs
                      }));
                    }}
                  />
                  {parametres.nombreChefs > 1 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => supprimerChef(index)}
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
              ))}
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
