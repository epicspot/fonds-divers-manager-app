
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParametresGeneraux } from "./ParametresGeneraux";
import { ParametresPersonnel } from "./ParametresPersonnel";
import { ParametresRepartition } from "./ParametresRepartition";
import { ParametresRapports } from "./ParametresRapports";
import { ParametresRegionsBureaux } from "./ParametresRegionsBureaux";
import { ParametresReferences } from "./ParametresReferences";
import { ParametresSysteme } from "./ParametresSysteme";
import { ModuleSuivi } from "@/components/suivi/ModuleSuivi";

export const ModuleParametres = () => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres et Configuration</h1>
        <p className="text-gray-600">Gérez tous les paramètres du système</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="personnel">Personnel</TabsTrigger>
          <TabsTrigger value="regions">Régions</TabsTrigger>
          <TabsTrigger value="references">Références</TabsTrigger>
          <TabsTrigger value="repartition">Répartition</TabsTrigger>
          <TabsTrigger value="rapports">Rapports</TabsTrigger>
          <TabsTrigger value="suivi">Suivi</TabsTrigger>
          <TabsTrigger value="systeme">Système</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Généraux</CardTitle>
              <CardDescription>Configuration générale de l'application</CardDescription>
            </CardHeader>
            <CardContent>
              <ParametresGeneraux />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personnel">
          <Card>
            <CardHeader>
              <CardTitle>Gestion du Personnel</CardTitle>
              <CardDescription>Configuration des utilisateurs et rôles</CardDescription>
            </CardHeader>
            <CardContent>
              <ParametresPersonnel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <CardTitle>Régions et Bureaux</CardTitle>
              <CardDescription>Configuration des régions et bureaux de poste</CardDescription>
            </CardHeader>
            <CardContent>
              <ParametresRegionsBureaux />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="references">
          <Card>
            <CardHeader>
              <CardTitle>Listes de Références</CardTitle>
              <CardDescription>Gestion des listes de référence du système</CardDescription>
            </CardHeader>
            <CardContent>
              <ParametresReferences />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repartition">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Répartition</CardTitle>
              <CardDescription>Configuration des règles de répartition</CardDescription>
            </CardHeader>
            <CardContent>
              <ParametresRepartition />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rapports">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des Rapports</CardTitle>
              <CardDescription>Paramètres des modèles de rapports</CardDescription>
            </CardHeader>
            <CardContent>
              <ParametresRapports />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suivi">
          <Card>
            <CardHeader>
              <CardTitle>Suivi Hiérarchique</CardTitle>
              <CardDescription>Suivi des transmissions et validations hiérarchiques</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ModuleSuivi />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="systeme">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Système</CardTitle>
              <CardDescription>Configuration avancée du système</CardDescription>
            </CardHeader>
            <CardContent>
              <ParametresSysteme />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
