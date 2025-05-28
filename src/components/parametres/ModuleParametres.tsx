import { useState } from "react";
import { Settings, MapPin, Users, BookOpen, FileText, Calculator, Cog } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParametresGeneraux } from "./ParametresGeneraux";
import { ParametresRegionsBureaux } from "./ParametresRegionsBureaux";
import { ParametresPersonnel } from "./ParametresPersonnel";
import { ParametresReferences } from "./ParametresReferences";
import { ParametresRapports } from "./ParametresRapports";
import { ParametresRepartition } from "./ParametresRepartition";
import { ParametresSysteme } from "./ParametresSysteme";

export const ModuleParametres = () => {
  const [activeTab, setActiveTab] = useState("generaux");

  const tabs = [
    {
      id: "generaux",
      label: "Paramètres Généraux",
      icon: Settings,
      component: <ParametresGeneraux />
    },
    {
      id: "regions",
      label: "Régions & Bureaux", 
      icon: MapPin,
      component: <ParametresRegionsBureaux />
    },
    {
      id: "personnel",
      label: "Personnel",
      icon: Users,
      component: <ParametresPersonnel />
    },
    {
      id: "references",
      label: "Listes de Référence",
      icon: BookOpen,
      component: <ParametresReferences />
    },
    {
      id: "rapports",
      label: "Rapports",
      icon: FileText,
      component: <ParametresRapports />
    },
    {
      id: "repartition",
      label: "Répartition",
      icon: Calculator,
      component: <ParametresRepartition />
    },
    {
      id: "systeme",
      label: "Système",
      icon: Cog,
      component: <ParametresSysteme />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Module Paramètres
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Configurez les différents paramètres de l'application.
        </p>
      </div>

      <Tabs defaultValue={activeTab} className="space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} onClick={() => setActiveTab(tab.id)} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
