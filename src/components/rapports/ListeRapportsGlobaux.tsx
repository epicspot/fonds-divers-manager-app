
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Printer, Download } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { RapportsGlobaux, TypeRapport } from "@/hooks/useRapports";
import { TYPES_RAPPORTS } from "./SelecteurRapport";

interface ListeRapportsGlobauxProps {
  rapportsGlobaux: RapportsGlobaux[];
  affaires: AffaireContentieuse[];
  onVoirApercu: (type: TypeRapport) => void;
  onImprimer: (type: TypeRapport) => void;
}

export const ListeRapportsGlobaux = ({
  rapportsGlobaux,
  affaires,
  onVoirApercu,
  onImprimer
}: ListeRapportsGlobauxProps) => {
  if (rapportsGlobaux.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun rapport généré pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rapportsGlobaux.slice(-5).reverse().map((rapportGlobal, index) => {
        const affaire = affaires.find(a => a.id === rapportGlobal.affaireId);
        
        return (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium">
                  Affaire {affaire?.numeroAffaire} - {affaire?.descriptionAffaire}
                </div>
                <div className="text-sm text-gray-500">
                  Généré le {new Date(rapportGlobal.dateGeneration).toLocaleString('fr-FR')}
                </div>
              </div>
              <Badge variant="outline">
                {Object.keys(rapportGlobal.rapports).length} rapports
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {TYPES_RAPPORTS.map((typeRapport) => (
                <div key={typeRapport.value} className="flex flex-col gap-1">
                  <div className="text-xs font-medium text-gray-600 truncate">
                    {typeRapport.label}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onVoirApercu(typeRapport.value)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onImprimer(typeRapport.value)}
                      className="flex-1"
                    >
                      <Printer className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
