import { useUserRole } from './useUserRole';
import type { AffaireContentieuse } from '@/types/affaire';
import { PERMISSIONS_MATRIX, type AdminSection, type PermissionAction } from '@/types/permissions';

/**
 * Hook pour gérer les permissions basées sur les rôles
 */
export const usePermissions = () => {
  const { role, isAdmin, isSuperviseur, loading } = useUserRole();

  // Permissions de modification des dossiers
  const canModifier = (affaire?: AffaireContentieuse) => {
    if (loading) return false;
    
    // Admin et superviseur peuvent tout modifier
    if (isAdmin || isSuperviseur) return true;
    
    // Utilisateur peut modifier uniquement ses brouillons
    if (affaire) {
      return affaire.statut === 'brouillon';
    }
    
    return false;
  };

  // Permissions de suppression des dossiers
  const canSupprimer = (affaire?: AffaireContentieuse) => {
    if (loading) return false;
    
    // Seul l'admin peut supprimer
    if (isAdmin) return true;
    
    return false;
  };

  // Permissions de validation des dossiers
  const canValider = () => {
    if (loading) return false;
    
    // Admin et superviseur peuvent valider
    return isAdmin || isSuperviseur;
  };

  // Permissions de transmission à la hiérarchie
  const canTransmettre = () => {
    if (loading) return false;
    
    // Admin et superviseur peuvent transmettre
    return isAdmin || isSuperviseur;
  };

  // Permissions d'approbation de répartition
  const canApprouver = () => {
    if (loading) return false;
    
    // Admin et superviseur peuvent approuver
    return isAdmin || isSuperviseur;
  };

  // Permission de voir les détails
  const canVoir = () => {
    // Tout le monde peut voir
    return !loading;
  };

  // Permission de créer de nouveaux dossiers
  const canCreer = () => {
    // Tout le monde peut créer
    return !loading;
  };

  // Permissions d'accès aux sections d'administration
  const canAccessAdminSection = (section: AdminSection): boolean => {
    if (loading || !role) return false;
    const permissions = PERMISSIONS_MATRIX[role][section];
    return permissions.length > 0;
  };

  // Permissions d'action sur une section d'administration
  const hasAdminPermission = (section: AdminSection, action: PermissionAction): boolean => {
    if (loading || !role) return false;
    const permissions = PERMISSIONS_MATRIX[role][section];
    return permissions.includes(action);
  };

  // Récupérer toutes les sections accessibles pour le rôle actuel
  const getAccessibleAdminSections = (): AdminSection[] => {
    if (loading || !role) return [];
    return (Object.keys(PERMISSIONS_MATRIX[role]) as AdminSection[])
      .filter(section => PERMISSIONS_MATRIX[role][section].length > 0);
  };

  return {
    role,
    loading,
    isAdmin,
    isSuperviseur,
    canModifier,
    canSupprimer,
    canValider,
    canTransmettre,
    canApprouver,
    canVoir,
    canCreer,
    canAccessAdminSection,
    hasAdminPermission,
    getAccessibleAdminSections,
  };
};
