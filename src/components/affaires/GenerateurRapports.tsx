import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Printer, Download, FileText } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface GenerateurRapportsProps {
  affaire: AffaireContentieuse;
}

const RAPPORTS_DISPONIBLES = [
  { value: 'bordereau_officiel', label: 'CT8 - Bordereau Officiel', template: 'bordereau_officiel' },
  { value: 'transaction_ct3', label: 'CT3 - Transaction', template: 'transaction_ct3' },
  { value: 'edpn', label: 'EDPN - État Produit Net', template: 'edpn' },
  { value: 'fiche_indicateur', label: 'Fiche Indicateur', template: 'fiche_indicateur' },
  { value: 'synthese', label: 'Fiche de Synthèse', template: 'synthese' },
  { value: 'transmission', label: 'Rapport Transmission', template: 'transmission' },
  { value: 'hierarchie', label: 'Rapport Hiérarchique', template: 'hierarchie' }
];

export const GenerateurRapports = ({ affaire }: GenerateurRapportsProps) => {
  const [typeRapport, setTypeRapport] = useState<string>("");
  const [apercuOuvert, setApercuOuvert] = useState(false);
  const [htmlApercu, setHtmlApercu] = useState("");

  const genererHTML = (template: string) => {
    try {
      const { printTemplates } = require('@/utils/printTemplates');
      const templateObj = printTemplates[template];
      if (!templateObj) {
        throw new Error("Template introuvable");
      }
      return templateObj.generateHTML('', affaire);
    } catch (error) {
      console.error('Erreur génération HTML:', error);
      throw error;
    }
  };

  const ouvrirApercu = () => {
    if (!typeRapport) {
      toast.error("Veuillez sélectionner un type de rapport");
      return;
    }

    try {
      const rapport = RAPPORTS_DISPONIBLES.find(r => r.value === typeRapport);
      if (!rapport) return;

      const html = genererHTML(rapport.template);
      setHtmlApercu(html);
      setApercuOuvert(true);
    } catch (error) {
      toast.error("Erreur lors de la génération de l'aperçu");
    }
  };

  const imprimerRapport = () => {
    if (!typeRapport) {
      toast.error("Veuillez sélectionner un type de rapport");
      return;
    }

    try {
      const rapport = RAPPORTS_DISPONIBLES.find(r => r.value === typeRapport);
      if (!rapport) return;

      const html = genererHTML(rapport.template);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        toast.success("Rapport prêt à imprimer");
      } else {
        toast.error("Impossible d'ouvrir la fenêtre d'impression");
      }
    } catch (error) {
      toast.error("Erreur lors de l'impression");
    }
  };

  const telechargerRapport = () => {
    if (!typeRapport) {
      toast.error("Veuillez sélectionner un type de rapport");
      return;
    }

    try {
      const rapport = RAPPORTS_DISPONIBLES.find(r => r.value === typeRapport);
      if (!rapport) return;

      const html = genererHTML(rapport.template);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${rapport.value}_${affaire.numeroAffaire}_${new Date().toISOString().split('T')[0]}.html`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success("Rapport téléchargé");
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Génération de Rapports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type de rapport</label>
            <Select value={typeRapport} onValueChange={setTypeRapport}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rapport" />
              </SelectTrigger>
              <SelectContent>
                {RAPPORTS_DISPONIBLES.map((rapport) => (
                  <SelectItem key={rapport.value} value={rapport.value}>
                    {rapport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={ouvrirApercu} variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button onClick={imprimerRapport} variant="outline" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button onClick={telechargerRapport} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={apercuOuvert} onOpenChange={setApercuOuvert}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Aperçu - {RAPPORTS_DISPONIBLES.find(r => r.value === typeRapport)?.label}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto border rounded-lg bg-white">
            <iframe
              srcDoc={htmlApercu}
              className="w-full h-full min-h-[600px]"
              title="Aperçu rapport"
            />
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setApercuOuvert(false)}>
              Fermer
            </Button>
            <Button variant="outline" onClick={imprimerRapport}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button onClick={telechargerRapport}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
