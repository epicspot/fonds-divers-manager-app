
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface IntervenantsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Intervenant {
  id: string;
  label: string;
  value: string;
}

export const IntervenantsConfigModal = ({ isOpen, onClose }: IntervenantsConfigModalProps) => {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const [newIntervenant, setNewIntervenant] = useState({ label: "", value: "" });

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("intervenants_config");
      if (saved) {
        setIntervenants(JSON.parse(saved));
      } else {
        // Données par défaut
        setIntervenants([
          { id: "1", label: "Commissaire Priseur Alioune Diouf", value: "alioune_diouf" },
          { id: "2", label: "Expert Évaluateur Bineta Thiam", value: "bineta_thiam" },
          { id: "3", label: "Transporteur Mamadou Sy", value: "mamadou_sy" },
        ]);
      }
    }
  }, [isOpen]);

  const saveIntervenants = (newList: Intervenant[]) => {
    setIntervenants(newList);
    localStorage.setItem("intervenants_config", JSON.stringify(newList));
    toast.success("Configuration sauvegardée");
  };

  const addIntervenant = () => {
    if (!newIntervenant.label.trim()) return;

    const intervenant: Intervenant = {
      id: crypto.randomUUID(),
      label: newIntervenant.label,
      value: newIntervenant.value || newIntervenant.label.toLowerCase().replace(/\s+/g, "_"),
    };

    saveIntervenants([...intervenants, intervenant]);
    setNewIntervenant({ label: "", value: "" });
  };

  const removeIntervenant = (id: string) => {
    saveIntervenants(intervenants.filter(i => i.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configuration des Intervenants</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Liste existante */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {intervenants.map((intervenant) => (
              <div key={intervenant.id} className="flex items-center gap-2 p-2 border rounded">
                <span className="flex-1">{intervenant.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIntervenant(intervenant.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Ajouter nouveau */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="label">Nom de l'intervenant</Label>
                <Input
                  id="label"
                  value={newIntervenant.label}
                  onChange={(e) => setNewIntervenant({ ...newIntervenant, label: e.target.value })}
                  placeholder="Ex: Expert John Doe"
                />
              </div>
              <div>
                <Label htmlFor="value">Code (optionnel)</Label>
                <Input
                  id="value"
                  value={newIntervenant.value}
                  onChange={(e) => setNewIntervenant({ ...newIntervenant, value: e.target.value })}
                  placeholder="Ex: john_doe"
                />
              </div>
            </div>
            <Button onClick={addIntervenant} className="mt-2 gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
