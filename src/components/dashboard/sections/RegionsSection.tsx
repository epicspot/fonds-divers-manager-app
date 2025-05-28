
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
    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 h-full">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Régions & Bureaux
            </h1>
            <p className="text-gray-600 text-sm">Gérez les régions et bureaux douaniers du territoire</p>
          </div>
        </div>

        <Tabs defaultValue="regions" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-6 flex-shrink-0 bg-white/80 backdrop-blur border-2 border-emerald-200">
            <TabsTrigger 
              value="regions" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              Régions
            </TabsTrigger>
            <TabsTrigger 
              value="bureaux"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              Bureaux
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regions" className="flex-1 overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Liste des Régions</h2>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg">
                <Plus className="h-4 w-4" />
                Nouvelle Région
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionsData.map((region) => (
                <Card key={region.id} className="h-fit shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <Badge 
                        variant={region.statut === 'actif' ? 'default' : 'secondary'}
                        className={region.statut === 'actif' 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                        }
                      >
                        {region.statut}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-gray-800">{region.nom}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bureaux:</span>
                        <span className="font-semibold text-emerald-600">{region.nombreBureaux}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Personnel:</span>
                        <span className="font-semibold text-teal-600">{region.nombrePersonnel}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500"
                      >
                        Gérer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bureaux" className="flex-1 overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Liste des Bureaux</h2>
              <Button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg">
                <Plus className="h-4 w-4" />
                Nouveau Bureau
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bureauxData.map((bureau) => (
                <Card key={bureau.id} className="h-fit shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                        <Building className="h-5 w-5 text-white" />
                      </div>
                      <Badge 
                        variant={bureau.statut === 'actif' ? 'default' : 'secondary'}
                        className={bureau.statut === 'actif' 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                        }
                      >
                        {bureau.statut}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-gray-800">{bureau.nom}</CardTitle>
                    <CardDescription className="text-gray-600">
                      <span className="font-medium text-blue-600">Région: {bureau.region}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{bureau.adresse}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-purple-600">{bureau.nombrePersonnel} agents</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500"
                      >
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
