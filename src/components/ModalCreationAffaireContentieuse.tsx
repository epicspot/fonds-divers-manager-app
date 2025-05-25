
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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { sauvegarderAffaire, genererNumeroAffaire } from "@/utils/affaireUtils";
import { AffaireContentieuse } from "@/types/affaire";
import { toast } from "sonner";

// Import form sections
import { InformationsBaseForm } from "./forms/InformationsBaseForm";
import { BureauPosteForm } from "./forms/BureauPosteForm";
import { DeclarationForm } from "./forms/DeclarationForm";
import { ContrevenantForm } from "./forms/ContrevenantForm";
import { TransportMarchandisesForm } from "./forms/TransportMarchandisesForm";
import { SucrerieForm } from "./forms/SucrerieForm";
import { ValeursDroitsForm } from "./forms/ValeursDroitsForm";
import { TransactionForm } from "./forms/TransactionForm";
import { SaisissantIntervenantsForm } from "./forms/SaisissantIntervenantsForm";
import { AyantsDroitsSection } from "./forms/AyantsDroitsSection";

const formSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est requis"),
  dateAffaire: z.string().min(1, "La date d'affaire est requise"),
  descriptionAffaire: z.string().min(1, "La description est requise"),
  montantAffaire: z.number().min(1, "Le montant doit être supérieur à 0"),
  
  // Informations du bureau/poste
  regionDgd: z.array(z.string()).optional(),
  bureauPoste: z.array(z.string()).optional(),
  
  // Informations de la déclaration
  numeroDeclaration: z.string().optional(),
  dateDeclaration: z.string().optional(),
  
  // Informations du contrevenant
  nomPrenomContrevenant: z.string().optional(),
  adresseComplete: z.string().optional(),
  ifu: z.string().optional(),
  
  // Transport et marchandises
  natureTransport: z.array(z.string()).optional(),
  identificationTransport: z.string().optional(),
  commissionnaireDouane: z.array(z.string()).optional(),
  procedureDetectionFraude: z.array(z.string()).optional(),
  natureMarchandisesFraude: z.string().optional(),
  
  // Sucrerie
  origineProvenance: z.array(z.string()).optional(),
  poidsKg: z.number().optional(),
  
  // Valeurs et droits
  valeurMarchandisesLitigieuses: z.number().optional(),
  natureInfraction: z.array(z.string()).optional(),
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
  nomsChefs: z.array(z.string()).optional(),
  detailsFrais: z.array(z.string()).optional(),
  
  // Saisissant et intervenants
  nomsSaisissant: z.array(z.string()).optional(),
  nomsIntervenants: z.array(z.string()).optional(),
  natureNombrePieces: z.array(z.string()).optional(),
  suiteReserveeMarchandises: z.array(z.string()).optional(),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroAffaire: genererNumeroAffaire(),
      dateAffaire: new Date().toISOString().split('T')[0],
      descriptionAffaire: "",
      montantAffaire: 0,
      regionDgd: [],
      bureauPoste: [],
      natureTransport: [],
      commissionnaireDouane: [],
      procedureDetectionFraude: [],
      origineProvenance: [],
      natureInfraction: [],
      nomsChefs: [],
      detailsFrais: [],
      nomsSaisissant: [],
      nomsIntervenants: [],
      natureNombrePieces: [],
      suiteReserveeMarchandises: [],
      observations: "",
    },
  });

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
      detailsFrais: values.detailsFrais,
      
      // Saisissant et intervenants
      nomsSaisissant: values.nomsSaisissant,
      nomsIntervenants: values.nomsIntervenants,
      natureNombrePieces: values.natureNombrePieces,
      suiteReserveeMarchandises: values.suiteReserveeMarchandises,
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
      regionDgd: [],
      bureauPoste: [],
      natureTransport: [],
      commissionnaireDouane: [],
      procedureDetectionFraude: [],
      origineProvenance: [],
      natureInfraction: [],
      nomsChefs: [],
      detailsFrais: [],
      nomsSaisissant: [],
      nomsIntervenants: [],
      natureNombrePieces: [],
      suiteReserveeMarchandises: [],
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
            <InformationsBaseForm form={form} />
            <BureauPosteForm form={form} />
            <DeclarationForm form={form} />
            <ContrevenantForm form={form} />
            <TransportMarchandisesForm form={form} />
            <SucrerieForm form={form} />
            <ValeursDroitsForm form={form} />
            <TransactionForm form={form} />
            <SaisissantIntervenantsForm form={form} />
            <AyantsDroitsSection 
              ayantsDroits={ayantsDroits} 
              setAyantsDroits={setAyantsDroits} 
            />

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
