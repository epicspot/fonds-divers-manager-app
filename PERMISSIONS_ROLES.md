# Système de Permissions par Rôle

## Vue d'ensemble

Le système implémente trois niveaux de rôles avec des permissions spécifiques pour les actions sur les dossiers contentieux.

## Rôles et Permissions

### 🔴 Administrateur
**Accès complet** à toutes les fonctionnalités :
- ✅ Créer des dossiers
- ✅ Voir tous les dossiers
- ✅ Modifier tous les dossiers
- ✅ **Supprimer** tous les dossiers
- ✅ Valider les dossiers
- ✅ Transmettre à la hiérarchie
- ✅ Approuver les répartitions
- ✅ Gérer les rôles des utilisateurs (interface d'administration)

### 🟡 Superviseur
**Accès étendu** avec restrictions sur la suppression :
- ✅ Créer des dossiers
- ✅ Voir tous les dossiers
- ✅ Modifier tous les dossiers
- ❌ Supprimer des dossiers
- ✅ Valider les dossiers
- ✅ Transmettre à la hiérarchie
- ✅ Approuver les répartitions
- ❌ Gérer les rôles

### 🟢 Utilisateur
**Accès standard** limité aux opérations courantes :
- ✅ Créer des dossiers
- ✅ Voir tous les dossiers
- ✅ Modifier uniquement les **brouillons**
- ❌ Supprimer des dossiers
- ❌ Valider les dossiers
- ❌ Transmettre à la hiérarchie
- ❌ Approuver les répartitions
- ❌ Gérer les rôles

## Statuts des Dossiers et Actions

### Brouillon
- **Tous** : Peuvent voir
- **Utilisateur, Superviseur, Admin** : Peuvent modifier
- **Admin uniquement** : Peut supprimer
- **Superviseur, Admin** : Peuvent valider

### Validée
- **Tous** : Peuvent voir
- **Superviseur, Admin** : Peuvent modifier et transmettre à la hiérarchie
- **Admin uniquement** : Peut supprimer

### En Attente Hiérarchie
- **Tous** : Peuvent voir
- **Superviseur, Admin** : Peuvent approuver la répartition
- **Admin uniquement** : Peut supprimer

### En Répartition
- **Tous** : Peuvent voir
- **Admin uniquement** : Peut supprimer

## Indicateurs Visuels

Lorsqu'une action n'est pas permise :
- Le bouton est désactivé
- Une icône de bouclier (🛡️) remplace l'icône normale
- Un tooltip explique la raison de la restriction au survol

## Fichiers Implémentés

- `src/hooks/usePermissions.ts` - Hook centralisé pour les vérifications de permissions
- `src/hooks/useUserRole.ts` - Hook pour récupérer le rôle de l'utilisateur
- `src/lib/userRolesApi.ts` - API helper pour la table user_roles
- `src/components/affaires/ActionsAffaire.tsx` - Actions avec contrôles de permissions
- `src/components/affaires/ListeAffaires.tsx` - Liste avec boutons conditionnels
- `src/components/affaires/CarteAffaire.tsx` - Cartes avec boutons conditionnels
- `src/components/admin/RoleManagement.tsx` - Interface de gestion des rôles (admin uniquement)
