
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { genererNumeroAffaire } from "@/utils/affaireUtils";

const formSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est requis"),
  dateAffaire: z.string().min(1, "La date d'affaire est requise"),
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

export type FormData = z.infer<typeof formSchema>;

export const useAffaireForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroAffaire: genererNumeroAffaire(),
      dateAffaire: new Date().toISOString().split('T')[0],
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

  const resetForm = () => {
    form.reset({
      numeroAffaire: genererNumeroAffaire(),
      dateAffaire: new Date().toISOString().split('T')[0],
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
  };

  return { form, resetForm };
};
