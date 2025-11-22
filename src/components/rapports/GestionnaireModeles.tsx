import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import {
  getModelesRapports,
  creerModeleRapport,
  updateModeleRapport,
  deleteModeleRapport,
  setModeleParDefaut,
  ModeleRapport,
  ConfigurationModele,
} from "@/services/modelesRapportsService";
import { ConfigurationModeleComponent } from "./ConfigurationModele";
import { TYPES_RAPPORTS } from "./SelecteurRapport";

export const GestionnaireModeles = () => {
  const [modeles, setModeles] = useState<ModeleRapport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingModele, setEditingModele] = useState<ModeleRapport | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // État pour le nouveau modèle
  const [nom, setNom] = useState("");
  const [typeRapport, setTypeRapport] = useState("");
  const [configuration, setConfiguration] = useState<ConfigurationModele>({});

  useEffect(() => {
    chargerModeles();
  }, []);

  const chargerModeles = async () => {
    try {
      setIsLoading(true);
      const data = await getModelesRapports();
      setModeles(data);
    } catch (error) {
      console.error("Erreur lors du chargement des modèles:", error);
      toast.error("Erreur lors du chargement des modèles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNouveauModele = () => {
    setEditingModele(null);
    setNom("");
    setTypeRapport("");
    setConfiguration({});
    setOpenDialog(true);
  };

  const handleModifierModele = (modele: ModeleRapport) => {
    setEditingModele(modele);
    setNom(modele.nom);
    setTypeRapport(modele.typeRapport);
    setConfiguration(modele.configuration);
    setOpenDialog(true);
  };

  const handleSauvegarder = async () => {
    if (!nom || !typeRapport) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setIsSaving(true);
      if (editingModele) {
        await updateModeleRapport(editingModele.id, {
          nom,
          typeRapport,
          configuration,
        });
        toast.success("Modèle mis à jour avec succès");
      } else {
        await creerModeleRapport({
          nom,
          typeRapport,
          configuration,
          estDefaut: false,
        });
        toast.success("Modèle créé avec succès");
      }
      await chargerModeles();
      setOpenDialog(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde du modèle");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSupprimer = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce modèle ?")) return;

    try {
      await deleteModeleRapport(id);
      toast.success("Modèle supprimé avec succès");
      await chargerModeles();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du modèle");
    }
  };

  const handleDefinirDefaut = async (id: string) => {
    try {
      await setModeleParDefaut(id);
      toast.success("Modèle défini par défaut");
      await chargerModeles();
    } catch (error) {
      console.error("Erreur lors de la définition du modèle par défaut:", error);
      toast.error("Erreur lors de la définition du modèle par défaut");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Modèles de rapports</CardTitle>
            <CardDescription>
              Gérez vos modèles personnalisés pour les rapports
            </CardDescription>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={handleNouveauModele}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau modèle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingModele ? "Modifier le modèle" : "Créer un nouveau modèle"}
                </DialogTitle>
                <DialogDescription>
                  Configurez l'apparence et la mise en page de votre rapport
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom du modèle</Label>
                  <Input
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Modèle par défaut"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="typeRapport">Type de rapport</Label>
                  <Select value={typeRapport} onValueChange={setTypeRapport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPES_RAPPORTS.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ConfigurationModeleComponent
                  configuration={configuration}
                  onChange={setConfiguration}
                  onSave={handleSauvegarder}
                  isSaving={isSaving}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Chargement des modèles...
          </div>
        ) : modeles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun modèle personnalisé. Créez-en un pour commencer.
          </div>
        ) : (
          <div className="space-y-4">
            {modeles.map((modele) => (
              <div
                key={modele.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{modele.nom}</h4>
                    {modele.estDefaut && (
                      <Badge variant="default">
                        <Star className="h-3 w-3 mr-1" />
                        Par défaut
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {TYPES_RAPPORTS.find((t) => t.value === modele.typeRapport)
                      ?.label || modele.typeRapport}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!modele.estDefaut && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDefinirDefaut(modele.id)}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleModifierModele(modele)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSupprimer(modele.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
