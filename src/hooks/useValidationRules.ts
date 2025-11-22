import { useState, useEffect } from 'react';
import { ValidationConfig, DEFAULT_VALIDATION_CONFIG, ValidationRule } from '@/types/validation';

const STORAGE_KEY = 'affaires_validation_configs';
const ACTIVE_CONFIG_KEY = 'affaires_active_validation_config';

export const useValidationRules = () => {
  const [configs, setConfigs] = useState<ValidationConfig[]>([DEFAULT_VALIDATION_CONFIG]);
  const [activeConfigId, setActiveConfigId] = useState<string>('default');

  // Charger les configurations depuis localStorage
  useEffect(() => {
    const storedConfigs = localStorage.getItem(STORAGE_KEY);
    const storedActiveId = localStorage.getItem(ACTIVE_CONFIG_KEY);
    
    if (storedConfigs) {
      try {
        const parsedConfigs = JSON.parse(storedConfigs);
        setConfigs(parsedConfigs);
      } catch (error) {
        console.error('Erreur lors du chargement des configurations:', error);
      }
    }
    
    if (storedActiveId) {
      setActiveConfigId(storedActiveId);
    }
  }, []);

  // Sauvegarder les configurations dans localStorage
  const saveConfigs = (newConfigs: ValidationConfig[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfigs));
    setConfigs(newConfigs);
  };

  // Obtenir la configuration active
  const getActiveConfig = (): ValidationConfig => {
    return configs.find(c => c.id === activeConfigId) || DEFAULT_VALIDATION_CONFIG;
  };

  // Obtenir les champs requis pour une étape spécifique
  const getRequiredFieldsForStep = (step: number, formValues?: any): string[] => {
    const activeConfig = getActiveConfig();
    
    return activeConfig.rules
      .filter(rule => {
        // Vérifier si le champ est pour cette étape
        if (rule.step !== step || !rule.required) return false;
        
        // Vérifier les conditions si elles existent
        if (rule.conditions && formValues) {
          return rule.conditions.every(condition => {
            const fieldValue = formValues[condition.field];
            
            switch (condition.operator) {
              case 'equals':
                return fieldValue === condition.value;
              case 'contains':
                return Array.isArray(fieldValue) && fieldValue.includes(condition.value);
              case 'greaterThan':
                return Number(fieldValue) > Number(condition.value);
              default:
                return true;
            }
          });
        }
        
        return true;
      })
      .map(rule => rule.field);
  };

  // Ajouter une nouvelle configuration
  const addConfig = (config: ValidationConfig) => {
    const newConfigs = [...configs, config];
    saveConfigs(newConfigs);
  };

  // Mettre à jour une configuration
  const updateConfig = (id: string, updates: Partial<ValidationConfig>) => {
    const newConfigs = configs.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    saveConfigs(newConfigs);
  };

  // Supprimer une configuration (sauf la configuration par défaut)
  const deleteConfig = (id: string) => {
    if (id === 'default') return;
    
    const newConfigs = configs.filter(c => c.id !== id);
    saveConfigs(newConfigs);
    
    if (activeConfigId === id) {
      setActiveConfigId('default');
      localStorage.setItem(ACTIVE_CONFIG_KEY, 'default');
    }
  };

  // Définir la configuration active
  const setActiveConfig = (id: string) => {
    setActiveConfigId(id);
    localStorage.setItem(ACTIVE_CONFIG_KEY, id);
  };

  // Ajouter une règle à une configuration
  const addRule = (configId: string, rule: ValidationRule) => {
    const config = configs.find(c => c.id === configId);
    if (!config) return;
    
    const updatedRules = [...config.rules, rule];
    updateConfig(configId, { rules: updatedRules });
  };

  // Supprimer une règle d'une configuration
  const removeRule = (configId: string, fieldName: string) => {
    const config = configs.find(c => c.id === configId);
    if (!config) return;
    
    const updatedRules = config.rules.filter(r => r.field !== fieldName);
    updateConfig(configId, { rules: updatedRules });
  };

  // Basculer le statut requis d'un champ
  const toggleFieldRequired = (configId: string, fieldName: string) => {
    const config = configs.find(c => c.id === configId);
    if (!config) return;
    
    const updatedRules = config.rules.map(rule =>
      rule.field === fieldName ? { ...rule, required: !rule.required } : rule
    );
    updateConfig(configId, { rules: updatedRules });
  };

  return {
    configs,
    activeConfig: getActiveConfig(),
    activeConfigId,
    getRequiredFieldsForStep,
    addConfig,
    updateConfig,
    deleteConfig,
    setActiveConfig,
    addRule,
    removeRule,
    toggleFieldRequired,
  };
};
