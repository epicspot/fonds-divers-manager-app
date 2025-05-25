
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { AffaireContentieuse } from "@/types/affaire";

const formSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est requis"),
  dateAffaire: z.string().min(1, "La date d'affaire est requise"),
  montantAffaire: z.number().min(1, "Le montant doit être supérieur à 0"),
  
  regionDgd: z.array(z.string()).optional(),
  bureauPoste: z.array(z.string()).optional(),
  numeroDeclaration: z.string().optional(),
  dateDeclaration: z.string().optional(),
  nomPrenomContrevenant: z.string().optional(),
  adresseComplete: z.string().optional(),
  ifu: z.string().optional(),
  natureTransport: z.array(z.string()).optional(),
  identificationTransport: z.string().optional(),
  commissionnaireDouane: z.array(z.string()).optional(),
  procedureDetectionFraude: z.array(z.string()).optional(),
  natureMarchandisesFraude: z.string().optional(),
  origineProvenance: z.array(z.string()).optional(),
  poidsKg: z.number().optional(),
  valeurMarchandisesLitigieuses: z.number().optional(),
  natureInfraction: z.array(z.string()).optional(),
  droitsCompromis: z.number().optional(),
  numeroQuittanceDate: z.string().optional(),
  nombreInformateurs: z.number().optional(),
  suiteAffaire: z.string().optional(),
  dateTransaction: z.string().optional(),
  montantAmende: z.number().optional(),
  montantVente: z.number().optional(),
  numeroQuittanceDateTransaction: z.string().optional(),
  montantTotalFrais: z.number().optional(),
  produitNetRepartir: z.number().optional(),
  nomsChefs: z.array(z.string()).optional(),
  detailsFrais: z.array(z.string()).optional(),
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

export const useAffaireEditForm = (affaire: AffaireContentieuse | null) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroAffaire: "",
      dateAffaire: "",
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

  useEffect(() => {
    if (affaire) {
      form.reset({
        numeroAffaire: affaire.numeroAffaire,
        dateAffaire: affaire.dateAffaire,
        montantAffaire: affaire.montantAffaire,
        regionDgd: affaire.regionDgd || [],
        bureauPoste: affaire.bureauPoste || [],
        numeroDeclaration: affaire.numeroDeclaration || "",
        dateDeclaration: affaire.dateDeclaration || "",
        nomPrenomContrevenant: affaire.nomPrenomContrevenant || "",
        adresseComplete: affaire.adresseComplete || "",
        ifu: affaire.ifu || "",
        natureTransport: affaire.natureTransport || [],
        identificationTransport: affaire.identificationTransport || "",
        commissionnaireDouane: affaire.commissionnaireDouane || [],
        procedureDetectionFraude: affaire.procedureDetectionFraude || [],
        natureMarchandisesFraude: affaire.natureMarchandisesFraude || "",
        origineProvenance: affaire.origineProvenance || [],
        poidsKg: affaire.poidsKg || undefined,
        valeurMarchandisesLitigieuses: affaire.valeurMarchandisesLitigieuses || undefined,
        natureInfraction: affaire.natureInfraction || [],
        droitsCompromis: affaire.droitsCompromis || undefined,
        numeroQuittanceDate: affaire.numeroQuittanceDate || "",
        nombreInformateurs: affaire.nombreInformateurs || undefined,
        suiteAffaire: affaire.suiteAffaire || "",
        dateTransaction: affaire.dateTransaction || "",
        montantAmende: affaire.montantAmende || undefined,
        montantVente: affaire.montantVente || undefined,
        numeroQuittanceDateTransaction: affaire.numeroQuittanceDateTransaction || "",
        montantTotalFrais: affaire.montantTotalFrais || undefined,
        produitNetRepartir: affaire.produitNetRepartir || undefined,
        nomsChefs: affaire.nomsChefs || [],
        detailsFrais: affaire.detailsFrais || [],
        nomsSaisissant: affaire.nomsSaisissant || [],
        nomsIntervenants: affaire.nomsIntervenants || [],
        natureNombrePieces: affaire.natureNombrePieces || [],
        suiteReserveeMarchandises: affaire.suiteReserveeMarchandises || [],
        dateRepartition: affaire.dateRepartition || "",
        numeroBordereauRatification: affaire.numeroBordereauRatification || "",
        circonstancesParticulieres: affaire.circonstancesParticulieres || "",
        observations: affaire.observations || "",
      });
    }
  }, [affaire, form]);

  const resetForm = () => {
    form.reset();
  };

  return { form, resetForm };
};
