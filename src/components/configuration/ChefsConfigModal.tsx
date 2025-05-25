
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface ChefsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Chef {
  id: string;
  label: string;
  value: string;
}

export const ChefsConfigModal = ({ isOpen, onClose }: ChefsConfigModalProps) => {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [newChef, setNewChef] = useState({ label: "", value: "" });

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("chefs_config");
      if (saved) {
        setChefs(JSON.parse(saved));
      } else {
        // Données par défaut
        setChefs([
          { id: "1", label: "Chef de Brigade Mamadou Niang", value: "mamadou_niang" },
          { id: "2", label: "Chef de Service Aminata Diop", value: "aminata_diop" },
          { id: "3", label: "Chef de Bureau Seydou Camara", value: "seydou_camara" },
        ]);
      }
    }
  }, [isOpen]);

  const saveChefs = (newList: Chef[]) => {
    setChefs(newList);
    localStorage.setItem("chefs_config", JSON.stringify(newList));
    toast.success("Configuration sauvegardée");
  };

  const addChef = () => {
    if (!newChef.label.trim()) return;

    const chef: Chef = {
      id: crypto.randomUUID(),
      label: newChef.label,
      value: newChef.value || newChef.label.toLowerCase().replace(/\s+/g, "_"),
    };

    saveChefs([...chefs, chef]);
    setNewChef({ label: "", value: "" });
  };

  const removeChef = (id: string) => {
    saveChefs(chefs.filter(c => c.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configuration des Chefs</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Liste existante */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {chefs.map((chef) => (
              <div key={chef.id} className="flex items-center gap-2 p-2 border rounded">
                <span className="flex-1">{chef.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeChef(chef.id)}
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
                <Label htmlFor="label">Nom du chef</Label>
                <Input
                  id="label"
                  value={newChef.label}
                  onChange={(e) => setNewChef({ ...newChef, label: e.target.value })}
                  placeholder="Ex: Chef de Service John Doe"
                />
              </div>
              <div>
                <Label htmlFor="value">Code (optionnel)</Label>
                <Input
                  id="value"
                  value={newChef.value}
                  onChange={(e) => setNewChef({ ...newChef, value: e.target.value })}
                  placeholder="Ex: john_doe"
                />
              </div>
            </div>
            <Button onClick={addChef} className="mt-2 gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
