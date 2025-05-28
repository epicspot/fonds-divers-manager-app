
import { ConfigurationManager } from "@/components/configuration/ConfigurationManager";

export const ParametresPersonnel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Configuration du Personnel
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Gérez les agents saisissants, chefs, intervenants et autres personnels impliqués dans les dossiers.
        </p>
      </div>
      
      <ConfigurationManager />
    </div>
  );
};
