
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Plus, Users, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRegions } from "@/hooks/useRegions";
import { RegionModal } from "@/components/dashboard/modals/RegionModal";
import { BureauModal } from "@/components/dashboard/modals/BureauModal";

export function RegionsSection() {
  const { regions, bureaux, loading, createRegion, createBureau, deleteRegion, deleteBureau, updateRegion, updateBureau } = useRegions();

  const getBureauxForRegion = (regionId: string) => {
    return bureaux.filter(bureau => bureau.region_id === regionId);
  };

  const handleDeleteRegion = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette région ?")) {
      await deleteRegion(id);
    }
  };

  const handleDeleteBureau = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bureau ?")) {
      await deleteBureau(id);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des régions...</p>
        </div>
      </div>
    );
  }

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
              <RegionModal
                trigger={
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg">
                    <Plus className="h-4 w-4" />
                    Nouvelle Région
                  </Button>
                }
                onSubmit={createRegion}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions.map((region) => {
                const regionBureaux = getBureauxForRegion(region.id);
                return (
                  <Card key={region.id} className="h-fit shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex gap-1">
                          <RegionModal
                            trigger={
                              <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-600 hover:bg-emerald-50">
                                <Edit className="h-3 w-3" />
                              </Button>
                            }
                            region={region}
                            onSubmit={(nom) => updateRegion(region.id, nom)}
                            isEdit={true}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteRegion(region.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-xl text-gray-800">{region.nom}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Bureaux:</span>
                          <span className="font-semibold text-emerald-600">{regionBureaux.length}</span>
                        </div>
                        {regionBureaux.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 font-medium">Bureaux dans cette région:</p>
                            {regionBureaux.slice(0, 3).map((bureau) => (
                              <p key={bureau.id} className="text-xs text-gray-600 bg-gray-50 p-1 rounded">
                                {bureau.nom}
                              </p>
                            ))}
                            {regionBureaux.length > 3 && (
                              <p className="text-xs text-gray-500">et {regionBureaux.length - 3} autre(s)...</p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="bureaux" className="flex-1 overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Liste des Bureaux</h2>
              <BureauModal
                trigger={
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg">
                    <Plus className="h-4 w-4" />
                    Nouveau Bureau
                  </Button>
                }
                regions={regions}
                onSubmit={createBureau}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bureaux.map((bureau) => {
                const region = regions.find(r => r.id === bureau.region_id);
                return (
                  <Card key={bureau.id} className="h-fit shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex gap-1">
                          <BureauModal
                            trigger={
                              <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                                <Edit className="h-3 w-3" />
                              </Button>
                            }
                            bureau={bureau}
                            regions={regions}
                            onSubmit={(data) => updateBureau(bureau.id, data)}
                            isEdit={true}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteBureau(bureau.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg text-gray-800">{bureau.nom}</CardTitle>
                      <CardDescription className="text-gray-600">
                        <span className="font-medium text-blue-600">Région: {region?.nom}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{bureau.adresse}</p>
                        <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                          actif
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
