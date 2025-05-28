
import { PageConfigurationEntites } from "@/components/configuration/PageConfigurationEntites";

export const ParametresReferences = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Listes de Référence
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Gérez les nomenclatures et listes de référence utilisées dans l'application.
        </p>
      </div>
      
      <PageConfigurationEntites />
    </div>
  );
};
