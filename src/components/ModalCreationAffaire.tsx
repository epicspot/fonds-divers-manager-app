
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
import { genererNumeroRepartition, calculerMontantNet, sauvegarderDossier, type AyantDroit, type Dossier } from "@/utils/fondsUtils";
import { toast } from "sonner";

const formSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est requis"),
  descriptionAffaire: z.string().min(1, "La description est requise"),
  montantAffaire: z.number().min(1, "Le montant doit être supérieur à 0"),
  partIndicateur: z.number().min(0, "La part indicateur ne peut pas être négative"),
  observations: z.string().optional(),
});

interface AyantDroitForm {
  nom: string;
  montant: number;
}

interface ModalCreationAffaireProps {
  onAffaireCreee: () => void;
}

export const ModalCreationAffaire = ({ onAffaireCreee }: ModalCreationAffaireProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ayantsDroits, setAyantsDroits] = useState<AyantDroitForm[]>([]);
  const [nomAyant, setNomAyant] = useState("");
  const [montantAyant, setMontantAyant] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroAffaire: "",
      descriptionAffaire: "",
      montantAffaire: 0,
      partIndicateur: 0,
      observations: "",
    },
  });

  const ajouterAyantDroit = () => {
    if (!nomAyant.trim() || !montantAyant || Number(montantAyant) <= 0) {
      toast.error("Veuillez saisir un nom et un montant valide pour l'ayant droit");
      return;
    }

    const nouveauAyant: AyantDroitForm = {
      nom: nomAyant.trim(),
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

    const totalAyantsDroits = ayantsDroits.reduce((sum, ayant) => sum + ayant.montant, 0);
    const { partFsp, montantNet } = calculerMontantNet(values.montantAffaire, values.partIndicateur);

    if (totalAyantsDroits > montantNet) {
      toast.error("La somme des montants des ayants droits dépasse le montant net disponible");
      return;
    }

    const nouveauDossier: Dossier = {
      numeroRepartition: genererNumeroRepartition(),
      montantAffaire: values.montantAffaire,
      partIndicateur: values.partIndicateur,
      montantNet,
      partFsp,
      ayantsDroits: ayantsDroits.map(ayant => ({
        nom: ayant.nom,
        montant: ayant.montant,
      })),
      dateCreation: new Date().toISOString(),
    };

    sauvegarderDossier(nouveauDossier);
    toast.success("Affaire créée avec succès");

    // Reset du formulaire
    form.reset();
    setAyantsDroits([]);
    setIsOpen(false);
    onAffaireCreee();
  };

  const montantAffaire = form.watch("montantAffaire") || 0;
  const partIndicateur = form.watch("partIndicateur") || 0;
  const { partFsp, montantNet } = calculerMontantNet(montantAffaire, partIndicateur);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Affaire
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Création d'une Nouvelle Affaire</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numeroAffaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro d'Affaire</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: AFF-2024-001" {...field} />
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
                        placeholder="Montant en FCFA"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descriptionAffaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description de l'Affaire</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description détaillée de l'affaire..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="partIndicateur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Part Indicateur (FCFA)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Part indicateur"
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

            {/* Section Ayants Droits */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Ayants Droits</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  placeholder="Nom de l'ayant droit"
                  value={nomAyant}
                  onChange={(e) => setNomAyant(e.target.value)}
                />
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
                      <span className="font-medium">{ayant.nom}</span>
                      <span className="text-gray-600">{ayant.montant.toLocaleString()} FCFA</span>
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
                  <div className="text-sm text-gray-600 mt-2">
                    Total attribué: {ayantsDroits.reduce((sum, ayant) => sum + ayant.montant, 0).toLocaleString()} FCFA
                    {montantNet > 0 && (
                      <span className="ml-2">
                        / Disponible: {montantNet.toLocaleString()} FCFA
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

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
