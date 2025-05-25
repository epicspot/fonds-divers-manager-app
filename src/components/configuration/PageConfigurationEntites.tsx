
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EntitesConfigManager } from "./EntitesConfigManager";

const regionsData = [
  { id: "1", label: "DGD Cotonou", value: "dgd_cotonou" },
  { id: "2", label: "DGD Porto-Novo", value: "dgd_porto_novo" },
  { id: "3", label: "DGD Parakou", value: "dgd_parakou" },
];

const bureauxData = [
  { id: "1", label: "Bureau Principal de Cotonou", value: "bureau_principal_cotonou" },
  { id: "2", label: "Bureau de l'Aéroport", value: "bureau_aeroport" },
  { id: "3", label: "Bureau du Port", value: "bureau_port" },
];

const transportsData = [
  { id: "1", label: "Camion", value: "camion" },
  { id: "2", label: "Voiture particulière", value: "voiture_particuliere" },
  { id: "3", label: "Bateau", value: "bateau" },
];

const commissionnairesData = [
  { id: "1", label: "GETMA", value: "getma" },
  { id: "2", label: "SOBEMAP", value: "sobemap" },
  { id: "3", label: "MAERSK", value: "maersk" },
];

const infractionsData = [
  { id: "1", label: "Contrebande", value: "contrebande" },
  { id: "2", label: "Sous-évaluation", value: "sous_evaluation" },
  { id: "3", label: "Fausse déclaration", value: "fausse_declaration" },
];

export const PageConfigurationEntites = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuration des Entités
        </h2>
        <p className="text-gray-600">
          Gérez les différentes entités utilisées dans le système
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EntitesConfigManager
          type="regions"
          title="Régions/DGD"
          defaultEntites={regionsData}
        />

        <EntitesConfigManager
          type="bureaux"
          title="Bureaux/Postes"
          defaultEntites={bureauxData}
        />

        <EntitesConfigManager
          type="transports"
          title="Moyens de Transport"
          defaultEntites={transportsData}
        />

        <EntitesConfigManager
          type="commissionnaires"
          title="Commissionnaires en Douane"
          defaultEntites={commissionnairesData}
        />

        <EntitesConfigManager
          type="infractions"
          title="Types d'Infractions"
          defaultEntites={infractionsData}
        />
      </div>
    </div>
  );
};
