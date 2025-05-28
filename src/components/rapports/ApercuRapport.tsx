
import { Button } from "@/components/ui/button";
import { FileText, Printer, Download } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { TypeRapport } from "@/hooks/useRapports";

interface ApercuRapportProps {
  showApercu: boolean;
  contenuApercu: string;
  typeRapport: TypeRapport | "";
  affaireSelectionnee?: AffaireContentieuse;
  onImprimer: () => void;
}

export const ApercuRapport = ({
  showApercu,
  contenuApercu,
  typeRapport,
  affaireSelectionnee,
  onImprimer
}: ApercuRapportProps) => {
  if (!showApercu || !contenuApercu) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Générez un rapport pour le prévisualiser ici</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={onImprimer} size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Imprimer (Modèle)
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            const blob = new Blob([contenuApercu], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rapport_${typeRapport}_${affaireSelectionnee?.numeroAffaire || 'affaire'}.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
      </div>
      <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
        <pre className="text-sm whitespace-pre-wrap font-mono">
          {contenuApercu}
        </pre>
      </div>
    </div>
  );
};
