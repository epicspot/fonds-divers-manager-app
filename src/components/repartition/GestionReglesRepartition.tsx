import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, RefreshCw, Download } from "lucide-react";
import { useReglesRepartition } from "@/hooks/useReglesRepartition";
import { RegleRepartition } from "@/types/repartition";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const regleSchema = z.object({
  type: z.string()
    .trim()
    .min(1, "Le type est requis")
    .max(50, "Le type ne peut pas dépasser 50 caractères")
    .regex(/^[a-z_]+$/, "Le type doit contenir uniquement des lettres minuscules et underscores"),
  pourcentageBase: z.number()
    .min(0, "Le pourcentage doit être positif")
    .max(100, "Le pourcentage ne peut pas dépasser 100"),
  pourcentageMax: z.number()
    .min(0, "Le pourcentage doit être positif")
    .max(100, "Le pourcentage ne peut pas dépasser 100"),
  montantMin: z.number().min(0).optional(),
  montantMax: z.number().min(0).optional(),
  nombrePersonnes: z.number().min(0).optional(),
}).refine(data => data.pourcentageBase <= data.pourcentageMax, {
  message: "Le pourcentage de base ne peut pas être supérieur au pourcentage maximum",
  path: ["pourcentageMax"],
});

type RegleFormData = z.infer<typeof regleSchema>;

const typesLabels: Record<string, string> = {
  fsp: "FSP",
  tresor: "Trésor Public",
  mutuelle: "Mutuelle",
  poursuivants: "Poursuivants",
  fonds_solidarite: "Fonds de Solidarité",
  fonds_formation: "Fonds de Formation",
  fonds_equipement: "Fonds d'Équipement",
  prime_rendement: "Prime de Rendement",
};

export const GestionReglesRepartition = () => {
  const { regles, loading, sauvegarderRegle, supprimerRegle, reinitialiserRegles, exporterRegles } = useReglesRepartition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [regleSelectionnee, setRegleSelectionnee] = useState<{ cle: string; regle: RegleRepartition } | null>(null);
  const [modeEdition, setModeEdition] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<RegleFormData>({
    resolver: zodResolver(regleSchema),
  });

  const handleNouvelleRegle = () => {
    setModeEdition(false);
    reset({
      type: "",
      pourcentageBase: 0,
      pourcentageMax: 0,
      montantMin: 0,
      montantMax: undefined,
      nombrePersonnes: undefined,
    });
    setDialogOpen(true);
  };

  const handleModifierRegle = (cle: string, regle: RegleRepartition) => {
    setModeEdition(true);
    setRegleSelectionnee({ cle, regle });
    setValue("type", cle);
    setValue("pourcentageBase", regle.pourcentageBase);
    setValue("pourcentageMax", regle.pourcentageMax);
    setValue("montantMin", regle.conditions?.montantMin || 0);
    setValue("montantMax", regle.conditions?.montantMax);
    setValue("nombrePersonnes", regle.conditions?.nombrePersonnes);
    setDialogOpen(true);
  };

  const handleSupprimerRegle = (cle: string, regle: RegleRepartition) => {
    setRegleSelectionnee({ cle, regle });
    setAlertOpen(true);
  };

  const confirmerSuppression = async () => {
    if (!regleSelectionnee) return;
    
    await supprimerRegle(regleSelectionnee.cle);
    setAlertOpen(false);
    setRegleSelectionnee(null);
  };

  const onSubmit = async (data: RegleFormData) => {
    try {
      const regle: RegleRepartition = {
        type: data.type,
        pourcentageBase: data.pourcentageBase,
        pourcentageMax: data.pourcentageMax,
        conditions: {
          montantMin: data.montantMin,
          montantMax: data.montantMax,
          nombrePersonnes: data.nombrePersonnes,
        },
      };

      await sauvegarderRegle(data.type, regle);
      setDialogOpen(false);
      reset();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Règles de Répartition</CardTitle>
              <CardDescription>
                Gérez les pourcentages et conditions de répartition des montants
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exporterRegles}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm" onClick={reinitialiserRegles}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              <Button onClick={handleNouvelleRegle}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Règle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>% Base</TableHead>
                  <TableHead>% Max</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(regles).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Aucune règle configurée
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(regles).map(([cle, regle]) => (
                    <TableRow key={cle}>
                      <TableCell className="font-medium">
                        {typesLabels[cle] || cle}
                      </TableCell>
                      <TableCell>{regle.pourcentageBase}%</TableCell>
                      <TableCell>{regle.pourcentageMax}%</TableCell>
                      <TableCell>
                        {regle.conditions?.montantMin && (
                          <span className="text-sm">Min: {regle.conditions.montantMin.toLocaleString()}</span>
                        )}
                        {regle.conditions?.nombrePersonnes && (
                          <span className="text-sm ml-2">Pers: {regle.conditions.nombrePersonnes}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleModifierRegle(cle, regle)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSupprimerRegle(cle, regle)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {modeEdition ? "Modifier la règle" : "Nouvelle règle de répartition"}
            </DialogTitle>
            <DialogDescription>
              Définissez les pourcentages et conditions pour cette règle
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de règle *</Label>
                <Input
                  id="type"
                  {...register("type")}
                  disabled={modeEdition}
                  placeholder="ex: fsp, tresor, mutuelle..."
                />
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pourcentageBase">Pourcentage de base (%) *</Label>
                <Input
                  id="pourcentageBase"
                  type="number"
                  step="0.01"
                  {...register("pourcentageBase", { valueAsNumber: true })}
                />
                {errors.pourcentageBase && (
                  <p className="text-sm text-destructive">{errors.pourcentageBase.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pourcentageMax">Pourcentage maximum (%) *</Label>
                <Input
                  id="pourcentageMax"
                  type="number"
                  step="0.01"
                  {...register("pourcentageMax", { valueAsNumber: true })}
                />
                {errors.pourcentageMax && (
                  <p className="text-sm text-destructive">{errors.pourcentageMax.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="montantMin">Montant minimum</Label>
                <Input
                  id="montantMin"
                  type="number"
                  {...register("montantMin", { valueAsNumber: true })}
                />
                {errors.montantMin && (
                  <p className="text-sm text-destructive">{errors.montantMin.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="montantMax">Montant maximum</Label>
                <Input
                  id="montantMax"
                  type="number"
                  {...register("montantMax", { valueAsNumber: true })}
                />
                {errors.montantMax && (
                  <p className="text-sm text-destructive">{errors.montantMax.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombrePersonnes">Nombre de personnes</Label>
                <Input
                  id="nombrePersonnes"
                  type="number"
                  {...register("nombrePersonnes", { valueAsNumber: true })}
                />
                {errors.nombrePersonnes && (
                  <p className="text-sm text-destructive">{errors.nombrePersonnes.message}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {modeEdition ? "Mettre à jour" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la règle "{regleSelectionnee && typesLabels[regleSelectionnee.cle]}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmerSuppression} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
