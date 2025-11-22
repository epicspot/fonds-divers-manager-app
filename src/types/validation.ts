export interface ValidationRule {
  field: string;
  label: string;
  step: number;
  required: boolean;
  conditions?: {
    field: string;
    operator: 'equals' | 'contains' | 'greaterThan';
    value: any;
  }[];
}

export interface ValidationConfig {
  id: string;
  name: string;
  description?: string;
  rules: ValidationRule[];
  isDefault?: boolean;
}

export const DEFAULT_VALIDATION_RULES: ValidationRule[] = [
  { field: 'numeroAffaire', label: 'N° d\'Affaire', step: 1, required: true },
  { field: 'numeroReference', label: 'N° de Référence', step: 1, required: true },
  { field: 'dateReference', label: 'Date de Référence', step: 1, required: true },
  { field: 'dateAffaire', label: 'Date d\'Affaire', step: 1, required: true },
  { field: 'montantAffaire', label: 'Montant', step: 1, required: true },
];

export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  id: 'default',
  name: 'Configuration par défaut',
  description: 'Règles de validation standard pour toutes les affaires',
  rules: DEFAULT_VALIDATION_RULES,
  isDefault: true,
};
