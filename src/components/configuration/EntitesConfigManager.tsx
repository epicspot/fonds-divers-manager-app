
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Entite {
  id: string;
  label: string;
  value: string;
}

interface EntitesConfigManagerProps {
  type: 'regions' | 'bureaux' | 'transports' | 'commissionnaires' | 'infractions' | 'pieces';
  title: string;
  defaultEntites: Entite[];
}

export const EntitesConfigManager = ({ type, title, defaultEntites }: EntitesConfigManagerProps) => {
  const [entites, setEntites] = useState<Entite[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntite, setEditingEntite] = useState<Entite | null>(null);
  const [formData, setFormData] = useState({ label: "", value: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  const loadEntites = () => {
    if (!isLoaded) {
      const saved = localStorage.getItem(`${type}_config`);
      if (saved) {
        setEntites(JSON.parse(saved));
      } else {
        setEntites(defaultEntites);
      }
      setIsLoaded(true);
    }
  };

  const saveEntites = (newEntites: Entite[]) => {
    setEntites(newEntites);
    localStorage.setItem(`${type}_config`, JSON.stringify(newEntites));
    toast.success("Configuration sauvegardée");
  };

  const handleAdd = () => {
    if (!formData.label.trim()) return;

    const newEntite: Entite = {
      id: crypto.randomUUID(),
      label: formData.label,
      value: formData.value || formData.label.toLowerCase().replace(/\s+/g, "_"),
    };

    saveEntites([...entites, newEntite]);
    setFormData({ label: "", value: "" });
    setIsModalOpen(false);
  };

  const handleEdit = (entite: Entite) => {
    setEditingEntite(entite);
    setFormData({ label: entite.label, value: entite.value });
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    if (!editingEntite || !formData.label.trim()) return;

    const updatedEntites = entites.map(e => 
      e.id === editingEntite.id 
        ? { ...e, label: formData.label, value: formData.value || formData.label.toLowerCase().replace(/\s+/g, "_") }
        : e
    );

    saveEntites(updatedEntites);
    setFormData({ label: "", value: "" });
    setEditingEntite(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette entité ?")) {
      saveEntites(entites.filter(e => e.id !== id));
    }
  };

  const openModal = () => {
    loadEntites();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntite(null);
    setFormData({ label: "", value: "" });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {title}
          </CardTitle>
          <Button variant="outline" onClick={openModal}>
            Gérer
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Configurez les {title.toLowerCase()} disponibles dans le système
          </p>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gestion des {title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Liste des entités */}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {entites.map((entite) => (
                <div key={entite.id} className="flex items-center gap-2 p-2 border rounded">
                  <span className="flex-1">{entite.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(entite)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(entite.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Formulaire d'ajout/modification */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="label">Nom</Label>
                  <Input
                    id="label"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Ex: Nom de l'entité"
                  />
                </div>
                <div>
                  <Label htmlFor="value">Code (optionnel)</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Ex: code_entite"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button 
                  onClick={editingEntite ? handleUpdate : handleAdd} 
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {editingEntite ? "Modifier" : "Ajouter"}
                </Button>
                {editingEntite && (
                  <Button variant="outline" onClick={closeModal}>
                    Annuler
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
