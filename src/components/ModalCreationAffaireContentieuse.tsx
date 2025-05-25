
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
import { sauvegarderAffaire, genererNumeroAffaire } from "@/utils/affaireUtils";
import { AffaireContentieuse, AyantDroitAffaire } from "@/types/affaire";
import { toast } from "sonner";

const formSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est requis"),
  dateAffaire: z.string().min(1, "La date d'affaire est requise"),
  descriptionAffaire: z.string().min(1, "La description est requise"),
  montantAffaire: z.number().min(1, "Le montant doit être supérieur à 0"),
  partIndicateur: z.number().min(0, "La part indicateur ne peut pas être négative"),
  
  // Informations du bureau/poste
  regionDgd: z.string().optional(),
  bureauPoste: z.string().optional(),
  
  // Informations de la déclaration
  numeroDeclaration: z.string().optional(),
  dateDeclaration: z.string().optional(),
  
  // Informations du contrevenant
  nomPrenomContrevenant: z.string().optional(),
  adresseComplete: z.string().optional(),
  ifu: z.string().optional(),
  
  // Transport et marchandises
  natureTransport: z.string().optional(),
  identificationTransport: z.string().optional(),
  commissionnaireDouane: z.string().optional(),
  procedureDetectionFraude: z.string().optional(),
  natureMarchandisesFraude: z.string().optional(),
  
  // Sucrerie
  origineProvenance: z.string().optional(),
  poidsKg: z.number().optional(),
  
  // Valeurs et droits
  valeurMarchandisesLitigieuses: z.number().optional(),
  natureInfraction: z.string().optional(),
  droitsCompromis: z.number().optional(),
  numeroQuittanceDate: z.string().optional(),
  nombreInformateurs: z.number().optional(),
  
  // Transaction
  suiteAffaire: z.string().optional(),
  dateTransaction: z.string().optional(),
  montantAmende: z.number().optional(),
  montantVente: z.number().optional(),
  numeroQuittanceDateTransaction: z.string().optional(),
  montantTotalFrais: z.number().optional(),
  produitNetRepartir: z.number().optional(),
  nomsChefs: z.string().optional(),
  
  // Saisissant et intervenants
  nomsSaisissant: z.string().optional(),
  nomsIntervenants: z.string().optional(),
  dateRepartition: z.string().optional(),
  numeroBordereauRatification: z.string().optional(),
  circonstancesParticulieres: z.string().optional(),
  
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

    const nouvelleAffaire: AffaireContentieuse = {
      id: crypto.randomUUID(),
      numeroAffaire: values.numeroAffaire,
      dateAffaire: values.dateAffaire,
      descriptionAffaire: values.descriptionAffaire,
      montantAffaire: values.montantAffaire,
      partIndicateur: values.partIndicateur,
      
      // Informations du bureau/poste
      regionDgd: values.regionDgd,
      bureauPoste: values.bureauPoste,
      
      // Informations de la déclaration
      numeroDeclaration: values.numeroDeclaration,
      dateDeclaration: values.dateDeclaration,
      
      // Informations du contrevenant
      nomPrenomContrevenant: values.nomPrenomContrevenant,
      adresseComplete: values.adresseComplete,
      ifu: values.ifu,
      
      // Transport et marchandises
      natureTransport: values.natureTransport,
      identificationTransport: values.identificationTransport,
      commissionnaireDouane: values.commissionnaireDouane,
      procedureDetectionFraude: values.procedureDetectionFraude,
      natureMarchandisesFraude: values.natureMarchandisesFraude,
      
      // Sucrerie
      origineProvenance: values.origineProvenance,
      poidsKg: values.poidsKg,
      
      // Valeurs et droits
      valeurMarchandisesLitigieuses: values.valeurMarchandisesLitigieuses,
      natureInfraction: values.natureInfraction,
      droitsCompromis: values.droitsCompromis,
      numeroQuittanceDate: values.numeroQuittanceDate,
      nombreInformateurs: values.nombreInformateurs,
      
      // Transaction
      suiteAffaire: values.suiteAffaire,
      dateTransaction: values.dateTransaction,
      montantAmende: values.montantAmende,
      montantVente: values.montantVente,
      numeroQuittanceDateTransaction: values.numeroQuittanceDateTransaction,
      montantTotalFrais: values.montantTotalFrais,
      produitNetRepartir: values.produitNetRepartir,
      nomsChefs: values.nomsChefs,
      
      // Saisissant et intervenants
      nomsSaisissant: values.nomsSaisissant,
      nomsIntervenants: values.nomsIntervenants,
      dateRepartition: values.dateRepartition,
      numeroBordereauRatification: values.numeroBordereauRatification,
      circonstancesParticulieres: values.circonstancesParticulieres,

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Affaire Contentieuse
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Bureau/Poste */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Bureau/Poste</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="regionDgd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Région/DGD</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bureauPoste"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bureau du Poste</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Déclaration */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Déclaration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numeroDeclaration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de la Déclaration</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateDeclaration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de la Déclaration</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contrevenant */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Contrevenant</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="nomPrenomContrevenant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom et Prénom du Contrevenant</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adresseComplete"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse Complète</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ifu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFU</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Transport et Marchandises */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Transport et Marchandises</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="natureTransport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nature et Moyen de Transport</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="identificationTransport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identification du Moyen de Transport</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commissionnaireDouane"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commissionnaire en Douane</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="procedureDetectionFraude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procédé de Détection de la Fraude</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="natureMarchandisesFraude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nature des Marchandises de Fraude</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sucrerie */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Sucrerie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="origineProvenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origine ou Provenance</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poidsKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poids en KG</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Valeurs et Droits */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Valeurs et Droits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valeurMarchandisesLitigieuses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valeur des Marchandises Litigieuses</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="natureInfraction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nature de l'Infraction</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="droitsCompromis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Droits Compromis ou Éludés</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numeroQuittanceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de Quittance et Date</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nombreInformateurs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre d'Informateurs</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Transaction */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Transaction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="suiteAffaire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suite de l'Affaire (Justice ou Transaction)</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          {...field}
                        >
                          <option value="">Sélectionner...</option>
                          <option value="justice">Justice</option>
                          <option value="transaction">Transaction</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateTransaction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de la Transaction</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="montantAmende"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant de l'Amende ou de la Vente</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numeroQuittanceDateTransaction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de Quittance et Date (Transaction)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="montantTotalFrais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant Total des Frais</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="produitNetRepartir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produit Net à Répartir</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nomsChefs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Noms des Chefs</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Saisissant et Intervenants */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-4">Saisissant et Intervenants</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="nomsSaisissant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Noms du Saisissant</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nomsIntervenants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Noms des Intervenants</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateRepartition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de Répartition</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numeroBordereauRatification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>N° de Bordereau de Ratification</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="circonstancesParticulieres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Circonstances Particulières à l'Affaire</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
