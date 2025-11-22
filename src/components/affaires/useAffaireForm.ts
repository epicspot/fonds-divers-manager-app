import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { genererNumeroAffaire } from "@/utils/affaireUtils";

const formSchema = z.object({
  numeroAffaire: z.string().trim().min(1, "Le numéro d'affaire est requis").max(50),
  numeroReference: z.string().trim().min(1, "Le numéro de référence est requis").max(100),
  dateReference: z.string().min(1, "La date de référence est requise"),
  dateAffaire: z.string().min(1, "La date d'affaire est requise")
    .refine((date) => {
      const d = new Date(date);
      return !isNaN(d.getTime());
    }, "Date invalide"),
  montantAffaire: z.number().min(1, "Le montant doit être supérieur à 0").max(999999999999, "Montant trop élevé"),
  descriptionAffaire: z.string().trim().max(1000, "Description trop longue").optional(),
  
  // Informations du bureau/poste
  regionDgd: z.array(z.string()).optional(),
  bureauPoste: z.array(z.string()).optional(),
  
  // Informations de la déclaration
  numeroDeclaration: z.string().trim().max(100).optional(),
  dateDeclaration: z.string().optional(),
  
  // Informations du contrevenant
  nomPrenomContrevenant: z.string().trim().max(200).optional(),
  adresseComplete: z.string().trim().max(500).optional(),
  ifu: z.string().trim().max(50).optional(),
  
  // Transport et marchandises
  natureTransport: z.array(z.string()).max(20, "Trop d'éléments sélectionnés").optional(),
  identificationTransport: z.string().trim().max(200).optional(),
  commissionnaireDouane: z.array(z.string()).max(20).optional(),
  procedureDetectionFraude: z.array(z.string()).max(20).optional(),
  natureMarchandisesFraude: z.string().trim().max(500).optional(),
  
  // Sucrerie
  origineProvenance: z.array(z.string()).max(20).optional(),
  poidsKg: z.number().min(0, "Le poids ne peut pas être négatif").max(999999999, "Poids trop élevé").optional(),
  
  // Valeurs et droits
  valeurMarchandisesLitigieuses: z.number().min(0).max(999999999999).optional(),
  natureInfraction: z.array(z.string()).max(20).optional(),
  droitsCompromis: z.number().min(0).max(999999999999).optional(),
  numeroQuittanceDate: z.string().trim().max(100).optional(),
  nombreInformateurs: z.number().int().min(0).max(999).optional(),
  
  // Transaction
  suiteAffaire: z.string().max(100).optional(),
  dateTransaction: z.string().optional(),
  montantAmende: z.number().min(0).max(999999999999).optional(),
  montantVente: z.number().min(0).max(999999999999).optional(),
  numeroQuittanceDateTransaction: z.string().trim().max(100).optional(),
  montantTotalFrais: z.number().min(0).max(999999999999).optional(),
  produitNetRepartir: z.number().min(0).max(999999999999).optional(),
  nomsChefs: z.array(z.string()).max(50).optional(),
  detailsFrais: z.array(z.string()).max(50).optional(),
  
  // Saisissant et intervenants
  nomsSaisissant: z.array(z.string()).max(50).optional(),
  nomsIntervenants: z.array(z.string()).max(50).optional(),
  natureNombrePieces: z.array(z.string()).max(50).optional(),
  suiteReserveeMarchandises: z.array(z.string()).max(50).optional(),
  dateRepartition: z.string().optional(),
  numeroBordereauRatification: z.string().trim().max(100).optional(),
  circonstancesParticulieres: z.string().trim().max(1000).optional(),
  
  observations: z.string().trim().max(2000, "Observations trop longues").optional(),
});

export type FormData = z.infer<typeof formSchema>;

export const useAffaireForm = () => {
  const { profile } = useUserProfile();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroAffaire: genererNumeroAffaire(),
      numeroReference: "",
      dateReference: new Date().toISOString().split('T')[0],
      dateAffaire: new Date().toISOString().split('T')[0],
      montantAffaire: 0,
      descriptionAffaire: "",
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

  // Précharger la région et le bureau depuis le profil utilisateur
  useEffect(() => {
    if (profile) {
      if (profile.region_id) {
        form.setValue('regionDgd', [profile.region_id]);
      }
      if (profile.bureau_id) {
        form.setValue('bureauPoste', [profile.bureau_id]);
      }
    }
  }, [profile, form]);

  const resetForm = () => {
    form.reset({
      numeroAffaire: genererNumeroAffaire(),
      numeroReference: "",
      dateReference: new Date().toISOString().split('T')[0],
      dateAffaire: new Date().toISOString().split('T')[0],
      montantAffaire: 0,
      descriptionAffaire: "",
      regionDgd: profile?.region_id ? [profile.region_id] : [],
      bureauPoste: profile?.bureau_id ? [profile.bureau_id] : [],
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
