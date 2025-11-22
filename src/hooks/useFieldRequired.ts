import { useValidationRules } from './useValidationRules';

/**
 * Hook pour vérifier si un champ est requis selon la configuration active
 */
export const useFieldRequired = () => {
  const { activeConfig } = useValidationRules();

  const isFieldRequired = (fieldName: string): boolean => {
    const rule = activeConfig.rules.find(r => r.field === fieldName);
    return rule?.required || false;
  };

  return { isFieldRequired };
};
