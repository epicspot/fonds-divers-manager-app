
import { ModuleRapports } from "@/components/rapports/ModuleRapports";

export const ParametresRapports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Gestion des Rapports
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Générez et imprimez les rapports nécessaires pour le suivi des affaires contentieuses.
        </p>
      </div>
      
      <ModuleRapports />
    </div>
  );
};
