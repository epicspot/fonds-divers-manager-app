import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X } from "lucide-react";
import { ResultatRepartition } from "@/types/repartition";
import { AffaireContentieuse } from "@/types/affaire";
import { toast } from "sonner";

interface ModalApercuBordereauProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  affaire: AffaireContentieuse | null;
  resultat: ResultatRepartition;
}

export const ModalApercuBordereau = ({
  open,
  onOpenChange,
  affaire,
  resultat
}: ModalApercuBordereauProps) => {
  
  const genererHTML = () => {
    const { printTemplates } = require('@/utils/printTemplates');
    const template = printTemplates.bordereau_repartition;
    return template.generateHTML('', affaire, resultat);
  };

  const imprimerBordereau = () => {
    try {
      const html = genererHTML();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        toast.success("Bordereau prêt à imprimer");
        onOpenChange(false);
      } else {
        toast.error("Impossible d'ouvrir la fenêtre d'impression");
      }
    } catch (error) {
      console.error('Erreur impression:', error);
      toast.error("Erreur lors de l'impression");
    }
  };

  const telechargerBordereau = () => {
    try {
      const html = genererHTML();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = affaire?.numeroAffaire 
        ? `bordereau_${affaire.numeroAffaire}_${new Date().toISOString().split('T')[0]}.html`
        : `bordereau_${new Date().toISOString().split('T')[0]}.html`;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success("Bordereau téléchargé - Ouvrez le fichier et utilisez 'Imprimer > Enregistrer en PDF'");
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      toast.error("Erreur lors du téléchargement");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Aperçu du Bordereau de Répartition</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto border rounded-lg bg-white">
          <iframe
            srcDoc={genererHTML()}
            className="w-full h-full min-h-[600px]"
            title="Aperçu bordereau"
          />
        </div>

        <div className="flex gap-4 justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button variant="outline" onClick={imprimerBordereau}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={telechargerBordereau}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
