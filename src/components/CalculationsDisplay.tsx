
import { FormLabel } from "@/components/ui/form";

interface CalculationsDisplayProps {
  partIndicateur: number;
  partFsp: number;
  montantNet: number;
}

export const CalculationsDisplay = ({ 
  partIndicateur, 
  partFsp, 
  montantNet 
}: CalculationsDisplayProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <FormLabel>Part Indicateur (FCFA)</FormLabel>
        <div className="p-2 bg-gray-100 rounded-md text-sm">
          {partIndicateur.toLocaleString()} FCFA
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel>Part FSP (calculée)</FormLabel>
        <div className="p-2 bg-gray-100 rounded-md text-sm">
          {partFsp.toLocaleString()} FCFA
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel>Montant Net (calculé)</FormLabel>
        <div className="p-2 bg-green-100 rounded-md text-sm font-medium">
          {montantNet.toLocaleString()} FCFA
        </div>
      </div>
    </div>
  );
};
