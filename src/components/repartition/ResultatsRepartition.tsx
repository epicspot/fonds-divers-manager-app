
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Printer } from "lucide-react";
import { ResultatRepartition } from "@/types/repartition";
import { SectionAyantsDroits } from "./SectionAyantsDroits";
import { toast } from "sonner";

interface ResultatsRepartitionProps {
  resultat: ResultatRepartition;
}

export const ResultatsRepartition = ({ resultat }: ResultatsRepartitionProps) => {
  const imprimerBordereau = () => {
    const { printTemplates } = require('@/utils/printTemplates');
    const template = printTemplates.bordereau_repartition;
    
    const html = template.generateHTML('', undefined, resultat);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      toast.success("Bordereau prêt à imprimer");
    } else {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {resultat.verificationsOk ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
            Résultat de la Répartition
          </CardTitle>
          <Button 
            onClick={imprimerBordereau}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
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
          <div className="text-center">
            <Label className="text-sm text-gray-600">Part Trésor</Label>
            <p className="text-lg font-bold text-purple-600">{resultat.partTresor.toLocaleString()} FCFA</p>
          </div>
        </div>

        <div className="space-y-4">
          <SectionAyantsDroits
            titre="Prélèvements"
            ayantsDroits={resultat.ayantsDroits.filter(a => a.type === 'fsp')}
            couleurFond="bg-blue-50"
            varianteBadge="default"
            labelBadge="FSP"
          />

          <SectionAyantsDroits
            titre="Administration"
            ayantsDroits={resultat.ayantsDroits.filter(a => a.type === 'tresor')}
            couleurFond="bg-purple-50"
            varianteBadge="secondary"
            labelBadge="TRÉSOR"
          />

          <SectionAyantsDroits
            titre="Fonds et Mutuelles"
            ayantsDroits={resultat.ayantsDroits.filter(a => 
              ['mutuelle', 'fonds_solidarite', 'fonds_formation', 'fonds_equipement', 'prime_rendement'].includes(a.type)
            )}
            couleurFond="bg-green-50"
            varianteBadge="outline"
            labelBadge="FONDS"
          />

          <div>
            <Label className="text-lg font-semibold mb-3 block">Poursuivants</Label>
            <div className="space-y-2">
              {resultat.ayantsDroits.filter(a => ['saisissant', 'chef', 'informateur'].includes(a.type)).map((ayant) => (
                <div key={ayant.id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                  <div className="flex items-center gap-3">
                    <Badge variant={ayant.type === 'saisissant' ? 'default' : ayant.type === 'chef' ? 'secondary' : 'outline'}>
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
          </div>
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
  );
};
