/**
 * Utilitaires pour la gestion des affaires contentieuses
 */

/**
 * Génère un numéro d'affaire unique
 */
export const genererNumeroAffaire = (): string => {
  const annee = new Date().getFullYear();
  const mois = String(new Date().getMonth() + 1).padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `AFF-${annee}${mois}-${timestamp}${random}`;
};

/**
 * Valide et nettoie une chaîne de caractères
 */
export const sanitizeString = (value: string | undefined | null, maxLength: number = 500): string => {
  if (!value) return '';
  return value.trim().slice(0, maxLength);
};

/**
 * Valide et convertit un nombre
 */
export const sanitizeNumber = (value: number | string | undefined | null, min: number = 0): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (typeof num !== 'number' || isNaN(num)) return 0;
  return Math.max(min, num);
};

/**
 * Valide et nettoie un tableau de strings
 */
export const sanitizeArray = (value: string[] | undefined | null, maxItems: number = 50): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(item => typeof item === 'string' && item.trim().length > 0)
    .map(item => item.trim())
    .slice(0, maxItems);
};

/**
 * Valide une date
 */
export const validateDate = (dateString: string | undefined): string => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  
  return dateString;
};

/**
 * Valide la cohérence des dates
 */
export const validateDateCoherence = (dateRef: string, dateAffaire: string): boolean => {
  const ref = new Date(dateRef);
  const affaire = new Date(dateAffaire);
  
  // La date d'affaire ne peut pas être antérieure à la date de référence
  return affaire >= ref;
};

/**
 * Extrait le premier élément d'un tableau (pour les champs uniques)
 */
export const extractFirst = (value: string[] | undefined | null): string | undefined => {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  return value[0];
};

/**
 * Convertit une valeur en tableau si nécessaire
 */
export const ensureArray = (value: string | string[] | undefined | null): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) return [value];
  return [];
};
