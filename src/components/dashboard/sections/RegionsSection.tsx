
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Plus, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Region {
  id: string;
  nom: string;
  nombreBureaux: number;
  nombrePersonnel: number;
  statut: 'actif' | 'inactif';
}

interface Bureau {
  id: string;
  nom: string;
  region: string;
  adresse: string;
  nombrePersonnel: number;
  statut: 'actif' | 'inactif';
}

const regionsData: Region[] = [
  { id: '1', nom: 'Abidjan', nombreBureaux: 8, nombrePersonnel: 45, statut: 'actif' },
  { id: '2', nom: 'Bouaké', nombreBureaux: 3, nombrePersonnel: 18, statut: 'actif' },
  { id: '3', nom: 'San Pedro', nombreBureaux: 4, nombrePersonnel: 22, statut: 'actif' },
  { id: '4', nom: 'Yamoussoukro', nombreBureaux: 2, nombrePersonnel: 12, statut: 'actif' },
  { id: '5', nom: 'Korhogo', nombreBureaux: 2, nombrePersonnel: 10, statut: 'inactif' },
];

const bureauxData: Bureau[] = [
  { id: '1', nom: 'Bureau Principal Abidjan', region: 'Abidjan', adresse: 'Plateau, Abidjan', nombrePersonnel: 15, statut: 'actif' },
  { id: '2', nom: 'Port Autonome', region: 'Abidjan', adresse: 'Zone Portuaire', nombrePersonnel: 20, statut: 'actif' },
  { id: '3', nom: 'Aéroport FHB', region: 'Abidjan', adresse: 'Aéroport International', nombrePersonnel: 10, statut: 'actif' },
  { id: '4', nom: 'Bureau Bouaké Centre', region: 'Bouaké', adresse: 'Centre-ville Bouaké', nombrePersonnel: 8, statut: 'actif' },
  { id: '5', nom: 'Bureau San Pedro Port', region: 'San Pedro', adresse: 'Zone Portuaire San Pedro', nombrePersonnel: 12, statut: 'actif' },
];

export function RegionsSection() {
  return (
    <div className="p-4 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Régions & Bureaux</h1>
            <p className="text-gray-600 text-sm">Gérez les régions et bureaux douaniers du territoire</p>
          </div>
        </div>

        <Tabs defaultValue="regions" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4 flex-shrink-0">
            <TabsTrigger value="regions">Régions</TabsTrigger>
            <TabsTrigger value="bureaux">Bureaux</TabsTrigger>
          </TabsList>

          <TabsContent value="regions" className="flex-1 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Liste des Régions</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle Région
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {regionsData.map((region) => (
                <Card key={region.id} className="h-fit">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <Badge variant={region.statut === 'actif' ? 'default' : 'secondary'}>
                        {region.statut}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{region.nom}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bureaux:</span>
                        <span className="font-medium">{region.nombreBureaux}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Personnel:</span>
                        <span className="font-medium">{region.nombrePersonnel}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        Gérer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bureaux" className="flex-1 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Liste des Bureaux</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouveau Bureau
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bureauxData.map((bureau) => (
                <Card key={bureau.id} className="h-fit">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Building className="h-5 w-5 text-gray-600" />
                      <Badge variant={bureau.statut === 'actif' ? 'default' : 'secondary'}>
                        {bureau.statut}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{bureau.nom}</CardTitle>
                    <CardDescription className="text-sm">Région: {bureau.region}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{bureau.adresse}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{bureau.nombrePersonnel} agents</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        Gérer Bureau
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
