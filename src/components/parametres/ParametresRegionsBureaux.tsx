
import { useGlobalState } from "@/hooks/useGlobalState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { RegionModal } from "@/components/dashboard/modals/RegionModal";
import { BureauModal } from "@/components/dashboard/modals/BureauModal";

export const ParametresRegionsBureaux = () => {
  const { regions } = useGlobalState();

  const handleSubmitRegion = async (nom: string) => {
    await regions.createRegion(nom);
  };

  const handleSubmitEditRegion = (region: any) => async (nom: string) => {
    await regions.updateRegion(region.id, nom);
  };

  const handleSubmitBureau = async (data: any) => {
    await regions.createBureau(data);
  };

  const handleSubmitEditBureau = (bureau: any) => async (data: any) => {
    await regions.updateBureau(bureau.id, data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Gestion des Régions et Bureaux
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Configurez l'organisation territoriale des bureaux douaniers.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Régions</CardTitle>
            <RegionModal
              trigger={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvelle région
                </Button>
              }
              onSubmit={handleSubmitRegion}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {regions.regions.map((region) => (
                <div key={region.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span>{region.nom}</span>
                  <div className="flex gap-2">
                    <RegionModal
                      trigger={
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                      region={region}
                      onSubmit={handleSubmitEditRegion(region)}
                      isEdit={true}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regions.deleteRegion(region.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bureaux</CardTitle>
            <BureauModal
              trigger={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nouveau bureau
                </Button>
              }
              onSubmit={handleSubmitBureau}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {regions.bureaux.map((bureau) => (
                <div key={bureau.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">{bureau.nom}</span>
                    <p className="text-sm text-gray-500">
                      {regions.getRegionById(bureau.region_id || "")?.nom || "Sans région"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <BureauModal
                      trigger={
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                      bureau={bureau}
                      onSubmit={handleSubmitEditBureau(bureau)}
                      isEdit={true}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regions.deleteBureau(bureau.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
