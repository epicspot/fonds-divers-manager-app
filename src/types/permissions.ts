/**
 * Système de permissions granulaires pour contrôler l'accès aux différentes sections
 */

import { AppRole } from '@/hooks/useUserRole';

/**
 * Sections disponibles dans l'administration
 */
export type AdminSection = 
  | 'saisissants'
  | 'chefs'
  | 'intervenants'
  | 'pieces'
  | 'parametres'
  | 'validation'
  | 'bdd'
  | 'audit'
  | 'roles';

/**
 * Actions possibles sur une section
 */
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

/**
 * Matrice de permissions par rôle et section
 */
export const PERMISSIONS_MATRIX: Record<AppRole, Record<AdminSection, PermissionAction[]>> = {
  admin: {
    saisissants: ['view', 'create', 'edit', 'delete'],
    chefs: ['view', 'create', 'edit', 'delete'],
    intervenants: ['view', 'create', 'edit', 'delete'],
    pieces: ['view', 'create', 'edit', 'delete'],
    parametres: ['view', 'create', 'edit', 'delete'],
    validation: ['view', 'create', 'edit', 'delete'],
    bdd: ['view', 'create', 'edit', 'delete'],
    audit: ['view'],
    roles: ['view', 'create', 'edit', 'delete'],
  },
  superviseur: {
    saisissants: ['view', 'create', 'edit'],
    chefs: ['view', 'create', 'edit'],
    intervenants: ['view', 'create', 'edit'],
    pieces: ['view', 'create', 'edit'],
    parametres: ['view'],
    validation: ['view', 'create', 'edit'],
    bdd: ['view'],
    audit: ['view'],
    roles: ['view'],
  },
  utilisateur: {
    saisissants: ['view'],
    chefs: ['view'],
    intervenants: ['view'],
    pieces: ['view'],
    parametres: [],
    validation: [],
    bdd: [],
    audit: [],
    roles: [],
  },
};

/**
 * Descriptions des sections pour l'interface
 */
export const SECTION_DESCRIPTIONS: Record<AdminSection, { title: string; description: string }> = {
  saisissants: {
    title: 'Saisissants',
    description: 'Gérez la liste des agents saisissants (ayants droits)',
  },
  chefs: {
    title: 'Chefs',
    description: 'Gérez la liste des chefs de brigade, de service et de bureau',
  },
  intervenants: {
    title: 'Intervenants',
    description: 'Gérez la liste des intervenants externes (experts, commissaires-priseurs, etc.)',
  },
  pieces: {
    title: 'Pièces',
    description: 'Gérez les types de pièces disponibles pour les dossiers',
  },
  parametres: {
    title: 'Paramètres Généraux',
    description: 'Configurez les paramètres généraux de l\'application',
  },
  validation: {
    title: 'Règles de Validation',
    description: 'Gérez les configurations de validation des affaires',
  },
  bdd: {
    title: 'Base de Données',
    description: 'Gérez les régions, bureaux et personnel',
  },
  audit: {
    title: 'Historique des Modifications',
    description: 'Traçabilité complète de toutes les modifications de configuration',
  },
  roles: {
    title: 'Gestion des Rôles',
    description: 'Gérez les rôles et permissions des utilisateurs',
  },
};
