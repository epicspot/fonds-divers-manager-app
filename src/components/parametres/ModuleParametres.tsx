
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Building, List, Calculator, Database } from "lucide-react";
import { ParametresGeneraux } from "./ParametresGeneraux";
import { ParametresPersonnel } from "./ParametresPersonnel";
import { ParametresRegionsBureaux } from "./ParametresRegionsBureaux";
import { ParametresReferences } from "./ParametresReferences";
import { ParametresRepartition } from "./ParametresRepartition";
import { ParametresSysteme } from "./ParametresSysteme";

export const ModuleParametres = () => {
  const [activeTab, setActiveTab] = useState("generaux");

  const tabs = [
    {
      id: "generaux",
      label: "Général",
      icon: Settings,
      description: "Paramètres généraux de l'application"
    },
    {
      id: "personnel",
      label: "Personnel",
      icon: Users,
      description: "Gestion des agents et intervenants"
    },
    {
      id: "regions",
      label: "Régions & Bureaux",
      icon: Building,
      description: "Organisation territoriale"
    },
    {
      id: "references",
      label: "Références",
      icon: List,
      description: "Listes de référence et nomenclatures"
    },
    {
      id: "repartition",
      label: "Répartition",
      icon: Calculator,
      description: "Règles de répartition automatique"
    },
    {
      id: "systeme",
      label: "Système",
      icon: Database,
      description: "Configuration système et sauvegardes"
    }
  ];

  return (
    <div className="h-full bg-gray-50">
      <div className="p-4 border-b bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 text-sm">
          Configuration et gestion des paramètres de l'application
        </p>
      </div>

      <div className="p-4 h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-6 mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-auto">
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="h-full m-0">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <tab.icon className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle>{tab.label}</CardTitle>
                        <CardDescription>{tab.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    {tab.id === "generaux" && <ParametresGeneraux />}
                    {tab.id === "personnel" && <ParametresPersonnel />}
                    {tab.id === "regions" && <ParametresRegionsBureaux />}
                    {tab.id === "references" && <ParametresReferences />}
                    {tab.id === "repartition" && <ParametresRepartition />}
                    {tab.id === "systeme" && <ParametresSysteme />}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};
