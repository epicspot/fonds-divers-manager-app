
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { calculerMontantNetAffaire, sauvegarderAffaire, genererNumeroAffaire } from "@/utils/affaireUtils";
import { AffaireContentieuse, AyantDroitAffaire } from "@/types/affaire";
import { toast } from "sonner";

const formSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est requis"),
  dateAffaire: z.string().min(1, "La date d'affaire est requise"),
  descriptionAffaire: z.string().min(1, "La description est requise"),
  montantAffaire: z.number().min(1, "Le montant doit être supérieur à 0"),
  partIndicateur: z.number().min(0, "La part indicateur ne peut pas être négative"),
  observations: z.string().optional(),
});

interface AyantDroitForm {
  nom: string;
  typeAyantDroit: 'syndicat' | 'mutuelle' | 'poursuivant' | 'autre';
  montant: number;
}

interface ModalCreationAffaireContentieuseProps {
  onAffaireCreee: () => void;
}

export const ModalCreationAffaireContentieuse = ({ onAffaireCreee }: ModalCreationAffaireContentieuseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ayantsDroits, setAyantsDroits] = useState<AyantDroitForm[]>([]);
  const [nomAyant, setNomAyant] = useState("");
  const [typeAyant, setTypeAyant] = useState<'syndicat' | 'mutuelle' | 'poursuivant' | 'autre'>('syndicat');
  const [montantAyant, setMontantAyant] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroAffaire: genererNumeroAffaire(),
      dateAffaire: new Date().toISOString().split('T')[0],
      descriptionAffaire: "",
      montantAffaire: 0,
      partIndicateur: 0,
      observations: "",
    },
  });

  const ajouterAyantDroit = () => {
    if (!nomAyant.trim() || !montantAyant || Number(montantAyant) <= 0) {
      toast.error("Veuillez saisir toutes les informations de l'ayant droit");
      return;
    }

    const nouveauAyant: AyantDroitForm = {
      nom: nomAyant.trim(),
      typeAyantDroit: typeAyant,
      montant: Number(montantAyant),
    };

    setAyantsDroits([...ayantsDroits, nouveauAyant]);
    setNomAyant("");
    setMontantAyant("");
    toast.success("Ayant droit ajouté");
  };

  const supprimerAyantDroit = (index: number) => {
    const nouveauxAyants = ayantsDroits.filter((_, i) => i !== index);
    setAyantsDroits(nouveauxAyants);
    toast.success("Ayant droit supprimé");
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (ayantsDroits.length === 0) {
      toast.error("Veuillez ajouter au moins un ayant droit");
      return;
    }

    const { partFsp, montantNet } = calculerMontantNetAffaire(values.montantAffaire, values.partIndicateur);

    const nouvelleAffaire: AffaireContentieuse = {
      id: crypto.randomUUID(),
      numeroAffaire: values.numeroAffaire,
      dateAffaire: values.dateAffaire,
      descriptionAffaire: values.descriptionAffaire,
      montantAffaire: values.montantAffaire,
      partIndicateur: values.partIndicateur,
      montantNet,
      partFsp,
      ayantsDroits: ayantsDroits.map(ayant => ({
        nom: ayant.nom,
        typeAyantDroit: ayant.typeAyantDroit,
        montant: ayant.montant,
      })),
      statut: 'brouillon',
      observations: values.observations,
      dateCreation: new Date().toISOString(),
    };

    sauvegarderAffaire(nouvelleAffaire);
    toast.success("Affaire contentieuse créée avec succès");

    // Reset du formulaire
    form.reset({
      numeroAffaire: genererNumeroAffaire(),
      dateAffaire: new Date().toISOString().split('T')[0],
      descriptionAffaire: "",
      montantAffaire: 0,
      partIndicateur: 0,
      observations: "",
    });
    setAyantsDroits([]);
    setIsOpen(false);
    onAffaireCreee();
  };

  const montantAffaire = form.watch("montantAffaire") || 0;
  const partIndicateur = form.watch("partIndicateur") || 0;
  const { partFsp, montantNet } = calculerMontantNetAffaire(montantAffaire, partIndicateur);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Affaire Contentieuse
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Création d'une Nouvelle Affaire Contentieuse</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations de base */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Informations de Base</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="numeroAffaire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro d'Affaire</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateAffaire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de l'Affaire</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="montantAffaire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant de l'Affaire (FCFA)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="descriptionAffaire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description de l'Affaire</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description détaillée de l'affaire contentieuse..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Calculs automatiques */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Calculs Automatiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="partIndicateur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Part Indicateur (FCFA)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Part FSP (calculée)</FormLabel>
                  <div className="p-2 bg-gray-100 rounded-md text-sm">
                    {partFsp.toLocaleString()} FCFA
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel>Montant Net (calculé)</FormLabel>
                  <div className="p-2 bg-green-100 rounded-md text-sm font-medium">
                    {montantNet.toLocaleString()} FCFA
                  </div>
                </div>
              </div>
            </div>

            {/* Section Ayants Droits */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Ayants Droits</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="Nom de l'ayant droit"
                  value={nomAyant}
                  onChange={(e) => setNomAyant(e.target.value)}
                />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={typeAyant}
                  onChange={(e) => setTypeAyant(e.target.value as any)}
                >
                  <option value="syndicat">Syndicat</option>
                  <option value="mutuelle">Mutuelle</option>
                  <option value="poursuivant">Poursuivant</option>
                  <option value="autre">Autre</option>
                </select>
                <Input
                  type="number"
                  placeholder="Montant (FCFA)"
                  value={montantAyant}
                  onChange={(e) => setMontantAyant(e.target.value)}
                />
                <Button type="button" onClick={ajouterAyantDroit} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              {ayantsDroits.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Liste des Ayants Droits:</h4>
                  {ayantsDroits.map((ayant, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <span className="font-medium">{ayant.nom}</span>
                        <span className="text-gray-600 ml-2">({ayant.typeAyantDroit})</span>
                      </div>
                      <span className="text-gray-600 mr-4">{ayant.montant.toLocaleString()} FCFA</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => supprimerAyantDroit(index)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Observations */}
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observations (Optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observations particulières..."
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Créer l'Affaire
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
