
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Printer } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { RapportGenere, TypeRapport } from "@/hooks/useRapports";
import { TYPES_RAPPORTS } from "./SelecteurRapport";

interface HistoriqueRapportsProps {
  rapportsGeneres: RapportGenere[];
  affaires: AffaireContentieuse[];
  onVoirApercu: (contenu: string) => void;
  onImprimer: (contenu: string, type: TypeRapport, affaire?: AffaireContentieuse) => void;
}

export const HistoriqueRapports = ({
  rapportsGeneres,
  affaires,
  onVoirApercu,
  onImprimer
}: HistoriqueRapportsProps) => {
  if (rapportsGeneres.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {rapportsGeneres.slice(-5).reverse().map((rapport, index) => (
        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <div className="font-medium">
              {TYPES_RAPPORTS.find(t => t.value === rapport.type)?.label}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(rapport.dateGeneration).toLocaleString('fr-FR')}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onVoirApercu(rapport.contenu)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const affaire = affaires.find(a => a.id === rapport.affaireId);
                onImprimer(rapport.contenu, rapport.type, affaire);
              }}
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
