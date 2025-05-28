
import { useGlobalState } from "@/hooks/useGlobalState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { RegionModal } from "@/components/dashboard/modals/RegionModal";
import { BureauModal } from "@/components/dashboard/modals/BureauModal";

export const ParametresRegionsBureaux = () => {
  const { regions } = useGlobalState();
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showBureauModal, setShowBureauModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState<any>(null);
  const [editingBureau, setEditingBureau] = useState<any>(null);

  const handleEditRegion = (region: any) => {
    setEditingRegion(region);
    setShowRegionModal(true);
  };

  const handleEditBureau = (bureau: any) => {
    setEditingBureau(bureau);
    setShowBureauModal(true);
  };

  const handleCloseRegionModal = () => {
    setShowRegionModal(false);
    setEditingRegion(null);
  };

  const handleCloseBureauModal = () => {
    setShowBureauModal(false);
    setEditingBureau(null);
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
            <Button onClick={() => setShowRegionModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle région
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {regions.regions.map((region) => (
                <div key={region.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span>{region.nom}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRegion(region)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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
            <Button onClick={() => setShowBureauModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau bureau
            </Button>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditBureau(bureau)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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

      <RegionModal
        isOpen={showRegionModal}
        onClose={handleCloseRegionModal}
        region={editingRegion}
      />

      <BureauModal
        isOpen={showBureauModal}
        onClose={handleCloseBureauModal}
        bureau={editingBureau}
      />
    </div>
  );
};
