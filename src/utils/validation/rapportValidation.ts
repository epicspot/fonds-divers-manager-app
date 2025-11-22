import { z } from 'zod';
import { AffaireContentieuse } from '@/types/affaire';

// Schémas de validation pour chaque type de rapport
export const ct8ValidationSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est obligatoire"),
  dateAffaire: z.string().min(1, "La date de l'affaire est obligatoire"),
  regionDgd: z.array(z.string()).min(1, "La région DGD est obligatoire"),
  bureauPoste: z.array(z.string()).min(1, "Le bureau/poste est obligatoire"),
  nomPrenomContrevenant: z.string().min(1, "Le nom du contrevenant est obligatoire"),
  descriptionAffaire: z.string().min(1, "La description de l'affaire est obligatoire"),
  natureInfraction: z.array(z.string()).min(1, "La nature de l'infraction est obligatoire"),
  droitsCompromis: z.number().positive("Les droits compromis doivent être supérieurs à 0"),
  nomsSaisissant: z.array(z.string()).min(1, "Au moins un saisissant est requis"),
  nomsChefs: z.array(z.string()).min(1, "Au moins un chef est requis"),
});

export const ct3ValidationSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est obligatoire"),
  dateAffaire: z.string().min(1, "La date de l'affaire est obligatoire"),
  bureauPoste: z.array(z.string()).min(1, "Le bureau/poste est obligatoire"),
  nomPrenomContrevenant: z.string().min(1, "Le nom du contrevenant est obligatoire"),
  dateTransaction: z.string().min(1, "La date de transaction est obligatoire"),
  montantAmende: z.number().positive("Le montant de l'amende doit être supérieur à 0"),
  numeroQuittanceDateTransaction: z.string().min(1, "Le numéro de quittance est obligatoire"),
  nomsSaisissant: z.array(z.string()).min(1, "Au moins un saisissant est requis"),
  nomsChefs: z.array(z.string()).min(1, "Au moins un chef est requis"),
  suiteAffaire: z.string().min(1, "La suite de l'affaire est obligatoire"),
});

export const edpnValidationSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est obligatoire"),
  dateAffaire: z.string().min(1, "La date de l'affaire est obligatoire"),
  numeroReference: z.string().min(1, "Le numéro de référence est obligatoire"),
  bureauPoste: z.array(z.string()).min(1, "Le bureau/poste est obligatoire"),
  regionDgd: z.array(z.string()).min(1, "La région DGD est obligatoire"),
  nomPrenomContrevenant: z.string().min(1, "Le nom du contrevenant est obligatoire"),
  descriptionAffaire: z.string().min(1, "La description de l'affaire est obligatoire"),
  montantAffaire: z.number().positive("Le montant de l'affaire doit être supérieur à 0"),
  dateTransaction: z.string().optional(),
  montantAmende: z.number().nonnegative("Le montant de l'amende ne peut être négatif").optional(),
  montantVente: z.number().nonnegative("Le montant de la vente ne peut être négatif").optional(),
  montantTotalFrais: z.number().nonnegative("Les frais ne peuvent être négatifs").optional(),
  nomsSaisissant: z.array(z.string()).min(1, "Au moins un saisissant est requis"),
  nomsChefs: z.array(z.string()).min(1, "Au moins un chef est requis"),
});

export const bordereauValidationSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est obligatoire"),
  dateAffaire: z.string().min(1, "La date de l'affaire est obligatoire"),
  nomPrenomContrevenant: z.string().min(1, "Le nom du contrevenant est obligatoire"),
  montantAffaire: z.number().positive("Le montant de l'affaire doit être supérieur à 0"),
  nomsSaisissant: z.array(z.string()).min(1, "Au moins un saisissant est requis"),
});

export const ficheIndicateurValidationSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est obligatoire"),
  dateAffaire: z.string().min(1, "La date de l'affaire est obligatoire"),
  bureauPoste: z.array(z.string()).min(1, "Le bureau/poste est obligatoire"),
  montantAffaire: z.number().positive("Le montant de l'affaire doit être supérieur à 0"),
  nomsSaisissant: z.array(z.string()).min(1, "Au moins un saisissant est requis"),
});

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Fonction principale de validation selon le type de rapport
export const validateAffaireForRapport = (
  affaire: AffaireContentieuse,
  typeRapport: string
): ValidationResult => {
  let schema: z.ZodSchema;
  
  switch (typeRapport) {
    case 'bordereau_officiel':
      schema = ct8ValidationSchema;
      break;
    case 'transaction_ct3':
      schema = ct3ValidationSchema;
      break;
    case 'edpn':
      schema = edpnValidationSchema;
      break;
    case 'bordereau':
      schema = bordereauValidationSchema;
      break;
    case 'fiche_indicateur':
      schema = ficheIndicateurValidationSchema;
      break;
    default:
      // Validation minimale pour les autres rapports
      schema = z.object({
        numeroAffaire: z.string().min(1, "Le numéro d'affaire est obligatoire"),
        dateAffaire: z.string().min(1, "La date de l'affaire est obligatoire"),
      });
  }

  const result = schema.safeParse(affaire);
  
  if (result.success) {
    // Vérifications supplémentaires (warnings)
    const warnings: ValidationError[] = [];
    
    if (!affaire.observations) {
      warnings.push({
        field: 'observations',
        message: 'Les observations ne sont pas renseignées',
      });
    }
    
    if (!affaire.adresseComplete) {
      warnings.push({
        field: 'adresseComplete',
        message: "L'adresse complète du contrevenant n'est pas renseignée",
      });
    }
    
    if (typeRapport === 'edpn' && !affaire.ifu) {
      warnings.push({
        field: 'ifu',
        message: "L'IFU du contrevenant n'est pas renseigné",
      });
    }
    
    return {
      isValid: true,
      errors: [],
      warnings,
    };
  } else {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    
    return {
      isValid: false,
      errors,
      warnings: [],
    };
  }
};

// Fonction pour obtenir le label lisible d'un champ
export const getFieldLabel = (field: string): string => {
  const labels: Record<string, string> = {
    numeroAffaire: "Numéro d'affaire",
    dateAffaire: "Date de l'affaire",
    regionDgd: "Région DGD",
    bureauPoste: "Bureau/Poste",
    nomPrenomContrevenant: "Nom du contrevenant",
    descriptionAffaire: "Description de l'affaire",
    natureInfraction: "Nature de l'infraction",
    droitsCompromis: "Droits compromis",
    nomsSaisissant: "Saisissants",
    nomsChefs: "Chefs",
    dateTransaction: "Date de transaction",
    montantAmende: "Montant de l'amende",
    numeroQuittanceDateTransaction: "Numéro de quittance",
    suiteAffaire: "Suite de l'affaire",
    numeroReference: "Numéro de référence",
    montantAffaire: "Montant de l'affaire",
    observations: "Observations",
    adresseComplete: "Adresse complète",
    ifu: "IFU",
  };
  
  return labels[field] || field;
};
