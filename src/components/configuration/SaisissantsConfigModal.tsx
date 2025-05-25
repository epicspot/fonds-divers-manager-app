
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface SaisissantsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Saisissant {
  id: string;
  label: string;
  value: string;
}

export const SaisissantsConfigModal = ({ isOpen, onClose }: SaisissantsConfigModalProps) => {
  const [saisissants, setSaisissants] = useState<Saisissant[]>([]);
  const [newSaisissant, setNewSaisissant] = useState({ label: "", value: "" });

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("saisissants_config");
      if (saved) {
        setSaisissants(JSON.parse(saved));
      } else {
        // Données par défaut
        setSaisissants([
          { id: "1", label: "Agent Amadou Diallo", value: "amadou_diallo" },
          { id: "2", label: "Agent Fatou Sow", value: "fatou_sow" },
          { id: "3", label: "Agent Moussa Traoré", value: "moussa_traore" },
        ]);
      }
    }
  }, [isOpen]);

  const saveSaisissants = (newList: Saisissant[]) => {
    setSaisissants(newList);
    localStorage.setItem("saisissants_config", JSON.stringify(newList));
    toast.success("Configuration sauvegardée");
  };

  const addSaisissant = () => {
    if (!newSaisissant.label.trim()) return;

    const saisissant: Saisissant = {
      id: crypto.randomUUID(),
      label: newSaisissant.label,
      value: newSaisissant.value || newSaisissant.label.toLowerCase().replace(/\s+/g, "_"),
    };

    saveSaisissants([...saisissants, saisissant]);
    setNewSaisissant({ label: "", value: "" });
  };

  const removeSaisissant = (id: string) => {
    saveSaisissants(saisissants.filter(s => s.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configuration des Agents Saisissants (Ayants Droits)</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Liste existante */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {saisissants.map((saisissant) => (
              <div key={saisissant.id} className="flex items-center gap-2 p-2 border rounded">
                <span className="flex-1">{saisissant.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSaisissant(saisissant.id)}
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
                <Label htmlFor="label">Nom de l'agent</Label>
                <Input
                  id="label"
                  value={newSaisissant.label}
                  onChange={(e) => setNewSaisissant({ ...newSaisissant, label: e.target.value })}
                  placeholder="Ex: Agent John Doe"
                />
              </div>
              <div>
                <Label htmlFor="value">Code (optionnel)</Label>
                <Input
                  id="value"
                  value={newSaisissant.value}
                  onChange={(e) => setNewSaisissant({ ...newSaisissant, value: e.target.value })}
                  placeholder="Ex: john_doe"
                />
              </div>
            </div>
            <Button onClick={addSaisissant} className="mt-2 gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
