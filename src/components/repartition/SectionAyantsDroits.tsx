
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AyantDroitRepartition } from "@/types/repartition";

interface SectionAyantsDroitsProps {
  titre: string;
  ayantsDroits: AyantDroitRepartition[];
  couleurFond: string;
  varianteBadge: "default" | "secondary" | "outline";
  labelBadge: string;
}

export const SectionAyantsDroits = ({ 
  titre, 
  ayantsDroits, 
  couleurFond, 
  varianteBadge, 
  labelBadge 
}: SectionAyantsDroitsProps) => {
  if (ayantsDroits.length === 0) return null;

  return (
    <div>
      <Label className="text-lg font-semibold mb-3 block">{titre}</Label>
      <div className="space-y-2">
        {ayantsDroits.map((ayant) => (
          <div key={ayant.id} className={`flex items-center justify-between p-3 border rounded-lg ${couleurFond}`}>
            <div className="flex items-center gap-3">
              <Badge variant={varianteBadge}>{labelBadge}</Badge>
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
  );
};
