import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const validateString = (value: any, fieldName: string, maxLength: number, required: boolean = false): ValidationError | null => {
  if (required && (!value || typeof value !== 'string' || value.trim().length === 0)) {
    return { field: fieldName, message: `${fieldName} est requis`, code: 'REQUIRED' };
  }
  if (value && typeof value === 'string' && value.length > maxLength) {
    return { field: fieldName, message: `${fieldName} dépasse la longueur maximale de ${maxLength} caractères`, code: 'MAX_LENGTH' };
  }
  return null;
};

const validateNumber = (value: any, fieldName: string, min: number, required: boolean = false): ValidationError | null => {
  if (required && (value === undefined || value === null)) {
    return { field: fieldName, message: `${fieldName} est requis`, code: 'REQUIRED' };
  }
  if (value !== undefined && value !== null) {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (typeof num !== 'number' || isNaN(num)) {
      return { field: fieldName, message: `${fieldName} doit être un nombre valide`, code: 'INVALID_TYPE' };
    }
    if (num < min) {
      return { field: fieldName, message: `${fieldName} doit être supérieur ou égal à ${min}`, code: 'MIN_VALUE' };
    }
  }
  return null;
};

const validateDate = (value: any, fieldName: string, required: boolean = false): ValidationError | null => {
  if (required && !value) {
    return { field: fieldName, message: `${fieldName} est requise`, code: 'REQUIRED' };
  }
  if (value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { field: fieldName, message: `${fieldName} n'est pas une date valide`, code: 'INVALID_DATE' };
    }
  }
  return null;
};

const validateDateCoherence = (dateRef: string, dateAffaire: string): ValidationError | null => {
  const ref = new Date(dateRef);
  const affaire = new Date(dateAffaire);
  
  if (affaire < ref) {
    return { 
      field: 'dateAffaire', 
      message: 'La date d\'affaire ne peut pas être antérieure à la date de référence', 
      code: 'DATE_COHERENCE' 
    };
  }
  return null;
};

const validateArray = (value: any, fieldName: string, maxItems: number): ValidationError | null => {
  if (value !== undefined && value !== null) {
    if (!Array.isArray(value)) {
      return { field: fieldName, message: `${fieldName} doit être un tableau`, code: 'INVALID_TYPE' };
    }
    if (value.length > maxItems) {
      return { field: fieldName, message: `${fieldName} dépasse le nombre maximum d'éléments (${maxItems})`, code: 'MAX_ITEMS' };
    }
    for (const item of value) {
      if (typeof item !== 'string') {
        return { field: fieldName, message: `Tous les éléments de ${fieldName} doivent être des chaînes`, code: 'INVALID_ITEM_TYPE' };
      }
    }
  }
  return null;
};

const validateAffaire = (affaire: any): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Validation des champs obligatoires
  const requiredValidations = [
    validateString(affaire.numeroAffaire, 'numeroAffaire', 50, true),
    validateString(affaire.numeroReference, 'numeroReference', 100, true),
    validateDate(affaire.dateReference, 'dateReference', true),
    validateDate(affaire.dateAffaire, 'dateAffaire', true),
    validateNumber(affaire.montantAffaire, 'montantAffaire', 1, true),
  ];
  
  requiredValidations.forEach(error => {
    if (error) errors.push(error);
  });
  
  // Validation de cohérence des dates
  if (affaire.dateReference && affaire.dateAffaire) {
    const coherenceError = validateDateCoherence(affaire.dateReference, affaire.dateAffaire);
    if (coherenceError) errors.push(coherenceError);
  }
  
  // Validation des champs optionnels de type string
  const stringValidations = [
    validateString(affaire.descriptionAffaire, 'descriptionAffaire', 1000),
    validateString(affaire.numeroDeclaration, 'numeroDeclaration', 100),
    validateString(affaire.nomPrenomContrevenant, 'nomPrenomContrevenant', 200),
    validateString(affaire.adresseComplete, 'adresseComplete', 500),
    validateString(affaire.ifu, 'ifu', 50),
    validateString(affaire.identificationTransport, 'identificationTransport', 200),
    validateString(affaire.natureMarchandisesFraude, 'natureMarchandisesFraude', 500),
    validateString(affaire.numeroQuittanceDate, 'numeroQuittanceDate', 100),
    validateString(affaire.suiteAffaire, 'suiteAffaire', 100),
    validateString(affaire.numeroQuittanceDateTransaction, 'numeroQuittanceDateTransaction', 100),
    validateString(affaire.numeroBordereauRatification, 'numeroBordereauRatification', 100),
    validateString(affaire.circonstancesParticulieres, 'circonstancesParticulieres', 1000),
    validateString(affaire.observations, 'observations', 2000),
  ];
  
  stringValidations.forEach(error => {
    if (error) errors.push(error);
  });
  
  // Validation des champs numériques optionnels
  const numberValidations = [
    validateNumber(affaire.poidsKg, 'poidsKg', 0),
    validateNumber(affaire.valeurMarchandisesLitigieuses, 'valeurMarchandisesLitigieuses', 0),
    validateNumber(affaire.droitsCompromis, 'droitsCompromis', 0),
    validateNumber(affaire.nombreInformateurs, 'nombreInformateurs', 0),
    validateNumber(affaire.montantAmende, 'montantAmende', 0),
    validateNumber(affaire.montantVente, 'montantVente', 0),
    validateNumber(affaire.montantTotalFrais, 'montantTotalFrais', 0),
    validateNumber(affaire.produitNetRepartir, 'produitNetRepartir', 0),
  ];
  
  numberValidations.forEach(error => {
    if (error) errors.push(error);
  });
  
  // Validation des dates optionnelles
  const dateValidations = [
    validateDate(affaire.dateDeclaration, 'dateDeclaration'),
    validateDate(affaire.dateTransaction, 'dateTransaction'),
    validateDate(affaire.dateRepartition, 'dateRepartition'),
  ];
  
  dateValidations.forEach(error => {
    if (error) errors.push(error);
  });
  
  // Validation des tableaux
  const arrayValidations = [
    validateArray(affaire.regionDgd, 'regionDgd', 20),
    validateArray(affaire.bureauPoste, 'bureauPoste', 20),
    validateArray(affaire.natureTransport, 'natureTransport', 20),
    validateArray(affaire.commissionnaireDouane, 'commissionnaireDouane', 20),
    validateArray(affaire.procedureDetectionFraude, 'procedureDetectionFraude', 20),
    validateArray(affaire.origineProvenance, 'origineProvenance', 20),
    validateArray(affaire.natureInfraction, 'natureInfraction', 20),
    validateArray(affaire.nomsChefs, 'nomsChefs', 50),
    validateArray(affaire.detailsFrais, 'detailsFrais', 50),
    validateArray(affaire.nomsSaisissant, 'nomsSaisissant', 50),
    validateArray(affaire.nomsIntervenants, 'nomsIntervenants', 50),
    validateArray(affaire.natureNombrePieces, 'natureNombrePieces', 50),
    validateArray(affaire.suiteReserveeMarchandises, 'suiteReserveeMarchandises', 50),
  ];
  
  arrayValidations.forEach(error => {
    if (error) errors.push(error);
  });
  
  // Validation du statut
  const validStatuts = ['brouillon', 'validee', 'en_repartition', 'en_attente_hierarchie', 'cloturee'];
  if (affaire.statut && !validStatuts.includes(affaire.statut)) {
    errors.push({ 
      field: 'statut', 
      message: `Le statut doit être l'un des suivants: ${validStatuts.join(', ')}`, 
      code: 'INVALID_STATUS' 
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const affaire = await req.json();
    
    console.log('Validation d\'affaire reçue:', {
      numeroAffaire: affaire.numeroAffaire,
      numeroReference: affaire.numeroReference
    });
    
    const result = validateAffaire(affaire);
    
    if (!result.valid) {
      console.error('Validation échouée:', result.errors);
      return new Response(
        JSON.stringify(result),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log('Validation réussie pour:', affaire.numeroAffaire);
    
    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Erreur dans validate-affaire:', error);
    return new Response(
      JSON.stringify({ 
        valid: false, 
        errors: [{ 
          field: 'general', 
          message: error.message || 'Erreur de validation serveur', 
          code: 'SERVER_ERROR' 
        }] 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
