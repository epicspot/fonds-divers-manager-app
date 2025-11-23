# Changelog - Application de Gestion des Affaires Contentieuses

## [2025-11-23] - Activation/Désactivation des Comptes Utilisateurs

### Ajouté
- **Gestion du statut des comptes** :
  - Nouvelle colonne `is_active` dans la table profiles pour suivre le statut des comptes
  - Index de performance sur la colonne is_active
  
- **Interface de gestion du statut** :
  - Colonne "Statut" dans la liste des utilisateurs (Actif/Inactif)
  - Badges visuels pour identifier rapidement les comptes désactivés
  - Boutons "Activer" / "Désactiver" pour chaque utilisateur
  - Les comptes désactivés sont affichés avec une opacité réduite
  - Désactivation automatique du sélecteur de rôle pour les comptes inactifs
  
- **Nouvelle fonction API** :
  - `toggleUserActiveStatus()` dans userRolesApi pour basculer le statut d'activation
  - Messages de confirmation appropriés lors du changement de statut

### Fonctionnalités
- ✅ Désactivation des comptes sans suppression des données
- ✅ Réactivation simple des comptes désactivés
- ✅ Protection contre la modification des rôles pour les comptes inactifs
- ✅ Interface visuelle claire pour distinguer les comptes actifs/inactifs
- ✅ Accessible uniquement aux administrateurs

### Technique
- Migration SQL pour ajouter la colonne is_active avec valeur par défaut true
- Mise à jour de l'interface UserWithRole pour inclure le statut
- Intégration complète dans le système de gestion des rôles existant

## [2025-11-23] - Création de Comptes Utilisateurs avec Rôle

### Ajouté
- **Interface de création d'utilisateurs** :
  - Nouveau composant modal `CreateUserModal` pour créer des comptes utilisateurs
  - Formulaire complet avec validation :
    - Nom complet (requis)
    - Email (validation format email)
    - Mot de passe (minimum 6 caractères)
    - Sélection du rôle (admin, superviseur ou utilisateur)
  - Création automatique du profil utilisateur avec les métadonnées
  - Assignation immédiate du rôle sélectionné dans la table user_roles
  
- **Intégration dans la gestion des rôles** :
  - Bouton "Créer un utilisateur" dans l'onglet Rôles de l'administration
  - Rafraîchissement automatique de la liste après création
  - Messages de succès/erreur appropriés
  - Accessible uniquement aux administrateurs

### Fonctionnalités
- ✅ Création complète de comptes utilisateurs
- ✅ Assignation immédiate des rôles lors de la création
- ✅ Validation des données saisies (email, mot de passe)
- ✅ Gestion des erreurs (email déjà existant, etc.)
- ✅ Interface intuitive et sécurisée

## [2025-11-23] - Tableau de Bord des Statistiques d'Audit

### Ajouté
- **Fonctions de statistiques avancées** dans `auditLogsService` :
  - `getStatsByUser()` : Statistiques par utilisateur
  - `getStatsByPeriod()` : Statistiques par période (7, 30, 90, 365 jours)
  - `getDetailedStats()` : Statistiques détaillées par action, type et utilisateur

- **Hook personnalisé** (`useAuditStatistics`) :
  - Charge toutes les statistiques en parallèle
  - Gestion de la période configurable
  - Refresh manuel disponible
  - Agrégation des données pour les graphiques

- **Composant StatistiquesAudit** :
  - **4 cartes de métriques clés** :
    - Total des modifications
    - Nombre d'utilisateurs actifs
    - Types d'entités modifiées
    - Moyenne quotidienne de modifications
  
  - **5 graphiques interactifs** (Recharts) :
    - **Graphique camembert** : Répartition par type d'action (CREATE, UPDATE, DELETE, ACTIVATE)
    - **Graphique en barres** : Top 5 des types d'entités les plus modifiées
    - **Graphique linéaire temporel** : Évolution quotidienne des modifications
    - **Graphique en barres horizontal** : Top 10 des utilisateurs les plus actifs
    - **Liste classée** : Top 8 des combinaisons utilisateur/action
  
  - **Filtres et contrôles** :
    - Sélection de période (7, 30, 90, 365 jours)
    - Bouton de rafraîchissement
    - États de chargement avec squelettes
  
  - **Localisation** :
    - Dates formatées en français
    - Labels d'actions traduits
    - Tooltips détaillés

- **Intégration dans l'interface** :
  - Nouvel onglet "Statistiques" dans la page Administration
  - Accessible aux utilisateurs avec permission 'audit'
  - Design cohérent avec le reste de l'interface

### Fonctionnalités
- ✅ Visualisation complète des statistiques d'audit
- ✅ Analyse temporelle des modifications
- ✅ Identification des utilisateurs les plus actifs
- ✅ Détection des patterns de modifications
- ✅ Filtrage par période flexible
- ✅ Graphiques interactifs et responsive
- ✅ Mise à jour en temps réel

### Visualisations
- **Métriques globales** : Vue d'ensemble rapide
- **Distribution des actions** : Comprendre les types de modifications
- **Entités modifiées** : Identifier les zones à forte activité
- **Tendances temporelles** : Détecter les pics d'activité
- **Activité utilisateurs** : Suivre les contributeurs
- **Top combinaisons** : Identifier les actions récurrentes

### Performance
- Requêtes optimisées avec agrégation côté client
- Chargement parallèle des statistiques
- Graphiques performants avec Recharts
- Pagination et limitation des données

### UX/UI
- Design moderne et professionnel
- Couleurs cohérentes avec le design system
- Animations fluides
- Responsive sur tous les écrans
- Tooltips informatifs
- États de chargement élégants

---

## [2025-11-23] - Système de Notifications en Temps Réel

### Ajouté
- **Table `notifications`** : Nouvelle table pour stocker les notifications utilisateur
  - Champs : id, user_id, type, title, message, data (JSONB), is_read, created_at, updated_at
  - RLS activé avec politiques de sécurité appropriées
  - Realtime activé pour les mises à jour en temps réel

- **Trigger automatique** : `notify_role_change()`
  - Crée automatiquement une notification lors d'un changement de rôle
  - Détecte les modifications dans la table `user_roles`
  - Format les labels de rôles en français (Admin, Superviseur, Utilisateur)

- **Service de notifications** (`notificationsService.ts`) :
  - `createNotification()` : Créer une notification
  - `getNotifications()` : Récupérer les notifications d'un utilisateur
  - `markAsRead()` : Marquer une notification comme lue
  - `markAllAsRead()` : Marquer toutes les notifications comme lues
  - `deleteNotification()` : Supprimer une notification
  - `deleteReadNotifications()` : Supprimer toutes les notifications lues
  - `getUnreadCount()` : Compter les notifications non lues

- **Hook personnalisé** (`useNotifications`) :
  - Gestion d'état réactif des notifications
  - Écoute des changements en temps réel via Supabase Realtime
  - Mise à jour automatique du compteur de notifications non lues
  - Toast automatique pour les nouvelles notifications
  - Méthodes pour marquer comme lu et supprimer

- **Composant NotificationCenter** :
  - Interface utilisateur dans un Sheet latéral
  - Badge avec compteur de notifications non lues
  - Affichage des notifications avec icônes contextuelles
  - Actions : marquer comme lu, supprimer, tout marquer comme lu
  - Suppression groupée des notifications lues
  - Horodatage relatif (ex: "il y a 2 minutes")
  - États de chargement avec squelettes
  - Design responsive et accessible

- **Intégration dans l'interface** :
  - Icône de notification dans le header du sidebar
  - Badge rouge avec compteur si notifications non lues
  - Accès rapide depuis toutes les pages

### Fonctionnalités
- ✅ Notifications en temps réel sans rafraîchissement
- ✅ Alertes automatiques lors des changements de rôles
- ✅ Distinction visuelle entre notifications lues/non lues
- ✅ Gestion complète du cycle de vie des notifications
- ✅ Interface intuitive et non intrusive
- ✅ Toast notifications pour alertes immédiates
- ✅ Suppression en masse des notifications lues

### Sécurité
- ✅ RLS configuré : utilisateurs ne voient que leurs notifications
- ✅ Triggers sécurisés avec SECURITY DEFINER
- ✅ Validation des permissions pour toutes les opérations
- ✅ Isolation complète des données par utilisateur

### UX/UI
- Design cohérent avec le système de design existant
- Animations fluides et transitions
- Indicateurs visuels clairs
- Actions accessibles et intuitives

---

## [2025-11-22] - Système de Permissions Granulaires
- ✨ Ajout d'un système de permissions granulaires par rôle et section
- ✨ Nouvelle interface de gestion des rôles utilisateurs
- ✨ Matrice de permissions visuelle par rôle
- 🔒 Protection des onglets d'administration selon les permissions
- 📋 Permissions définies pour: admin, superviseur, utilisateur
- 🎯 Contrôle d'accès granulaire sur: view, create, edit, delete
- 📊 Visualisation claire des permissions par section
- 👥 Gestion centralisée des rôles utilisateurs

---

# Corrections et Améliorations - Création d'Affaire Contentieuse

## Version 2.3.0 - Système d'Audit Log (2025-01-22)

### Nouvelles Fonctionnalités

#### 1. **Table Audit Logs**
**Ajout** : Nouvelle table `audit_logs` pour la traçabilité complète

**Champs enregistrés** :
- Utilisateur (ID et email)
- Action effectuée (CREATE, UPDATE, DELETE, ACTIVATE)
- Type d'entité modifiée
- Nom et ID de l'entité
- Anciennes et nouvelles valeurs (JSONB)
- Détails textuels de la modification
- Adresse IP et User Agent
- Date et heure exacte

**Index optimisés** :
- Par utilisateur
- Par type d'entité
- Par date (DESC pour requêtes récentes)
- Par action

#### 2. **Service Audit Logs**
**Ajout** : `auditLogsService.ts` avec fonctionnalités complètes

**Fonctions** :
- `createLog()` : Enregistrement automatique avec contexte utilisateur
- `getLogs()` : Récupération avec filtres multiples
- `getLogsForEntity()` : Historique d'une entité spécifique
- `cleanOldLogs()` : Nettoyage automatique (conservation 6 mois)
- `getStatistics()` : Statistiques sur les modifications

#### 3. **Intégration Automatique**
**Modification** : `configurationsService.ts`

Enregistrement automatique pour :
- Sauvegarde de configurations système (CREATE/UPDATE)
- Création de configurations de validation
- Modification de configurations de validation
- Activation de configurations de validation
- Suppression de configurations de validation

**Données capturées** :
- Différences avant/après (anciennes_valeurs vs nouvelles_valeurs)
- Utilisateur authentifié
- Timestamp précis
- Navigateur et contexte

#### 4. **Interface d'Historique**
**Ajout** : Onglet "Audit" dans l'interface d'administration

**Fonctionnalités** :
- Liste chronologique des modifications (plus récentes en premier)
- Filtres par type d'entité et action
- Pagination (50 logs par page)
- Vue détaillée avec diff complet
- Badges colorés par type d'action
- Format de date localisé (français)

**Détails visibles** :
- Action avec badge coloré
- Utilisateur et timestamp
- Anciennes vs nouvelles valeurs (JSON formaté)
- User agent du navigateur

### Sécurité

✅ **Accès Restreint** : Seuls les administrateurs peuvent consulter les logs
✅ **Insertion Universelle** : Tout utilisateur authentifié peut créer un log
✅ **RLS Policies** : Protection au niveau base de données
✅ **Immutabilité** : Pas de modification/suppression des logs (sauf nettoyage automatique)
✅ **Rétention** : Conservation de 6 mois pour conformité

### Performance

- Index optimisés pour requêtes rapides
- Pagination pour gérer de grands volumes
- Nettoyage automatique des anciens logs
- Chargement asynchrone avec skeletons

### Fichiers Créés

- `src/services/auditLogsService.ts` - Service de gestion des logs
- `src/hooks/useAuditLogs.ts` - Hook React pour charger les logs
- `src/components/admin/HistoriqueAudit.tsx` - Interface de visualisation

### Fichiers Modifiés

- `src/services/configurationsService.ts` - Intégration des logs
- `src/pages/Administration.tsx` - Ajout onglet Audit

### Cas d'Usage

1. **Traçabilité** : Savoir qui a modifié quoi et quand
2. **Conformité** : Répondre aux exigences d'audit
3. **Débogage** : Identifier les changements problématiques
4. **Sécurité** : Détecter les modifications suspectes
5. **Formation** : Analyser les patterns d'utilisation

### Avantages

🔍 **Transparence Totale** : Chaque modification est tracée
📊 **Filtres Puissants** : Recherche par type, action, utilisateur
🔒 **Sécurité** : Logs immuables et protégés
⚡ **Performance** : Index et pagination optimisés
📅 **Rétention** : Nettoyage automatique après 6 mois

---

## Version 2.2.0 - Interface d'Administration Centralisée (2025-01-22)

### Nouvelles Fonctionnalités

#### 1. **Page d'Administration Unifiée**
**Ajout** : Création de `/administration` - Interface centralisée pour toute la configuration système

**Fonctionnalités** :
- Interface avec 7 onglets organisés pour une navigation intuitive
- Gestion visuelle de toutes les configurations sans toucher au code
- Accès restreint aux administrateurs uniquement
- Navigation depuis le sidebar avec icône dédiée

#### 2. **Modules de Configuration**
Chaque module offre une interface CRUD complète :

**Saisissants** (`ConfigurationsSaisissants`)
- Ajout/suppression d'agents saisissants (ayants droits)
- Gestion des noms et codes
- Persistance en base de données

**Chefs** (`ConfigurationsChefs`)
- Gestion des chefs de brigade, service et bureau
- Configuration personnalisée avec labels et codes

**Intervenants** (`ConfigurationsIntervenants`)
- Gestion des intervenants externes (experts, commissaires-priseurs)
- Liste configurable selon les besoins

**Pièces** (`ConfigurationsPieces`)
- Types de pièces disponibles pour les dossiers
- Personnalisation des documents requis

**Paramètres Généraux** (`ParametresGeneraux`)
- Délai de validation (jours)
- Montant minimal des affaires (FCFA)
- Nombre maximum d'informateurs
- Sauvegarde en base de données

**Règles de Validation** (`ConfigurationsValidation`)
- Création de configurations de validation multiples
- Activation/désactivation des configurations
- Une seule configuration active à la fois

**Base de Données** (`GestionBDD`)
- Lien vers l'interface Lovable Cloud
- Statistiques sur les tables et données
- Guide pour export/import

#### 3. **Intégration avec Supabase**
- Nouveau service `configurationsService.ts` pour gérer les configurations
- Hook `useConfigurationsSysteme` pour charger/sauvegarder facilement
- Tables `configurations_systeme` et `configurations_validation` créées
- Toutes les données persistées en base de données

#### 4. **Améliorations UX**
- Interface moderne avec cartes et tabs
- Skeletons pendant le chargement
- Messages de succès/erreur clairs
- Bouton de retour vers le dashboard
- Filtrage automatique selon les rôles (admin uniquement)

### Architecture

**Nouveaux Fichiers** :
- `src/pages/Administration.tsx` - Page principale
- `src/components/admin/ConfigurationsSaisissants.tsx`
- `src/components/admin/ConfigurationsChefs.tsx`
- `src/components/admin/ConfigurationsIntervenants.tsx`
- `src/components/admin/ConfigurationsPieces.tsx`
- `src/components/admin/ParametresGeneraux.tsx`
- `src/components/admin/ConfigurationsValidation.tsx`
- `src/components/admin/GestionBDD.tsx`
- `src/services/configurationsService.ts`
- `src/hooks/useConfigurationsSysteme.ts`

**Fichiers Modifiés** :
- `src/App.tsx` - Ajout de la route `/administration`
- `src/components/dashboard/AppSidebar.tsx` - Lien admin dans la navigation

### Sécurité

✅ **Contrôle d'Accès** : Page accessible uniquement aux administrateurs
✅ **Validation Serveur** : Toutes les modifications validées côté serveur
✅ **RLS Policies** : Politiques de sécurité au niveau base de données
✅ **Persistance Fiable** : Données stockées en base, plus de localStorage

### Avantages

1. **Centralisation** : Toutes les configurations au même endroit
2. **Accessibilité** : Interface graphique, pas besoin de modifier le code
3. **Traçabilité** : Toutes les modifications enregistrées en base
4. **Sécurité** : Accès restreint et données protégées
5. **Maintenance** : Plus facile de gérer et auditer les configurations

---

## Version 2.1.0 - Validation Côté Serveur (2025-01-22)

### Nouvelles Fonctionnalités

#### 1. **Edge Function de Validation**
**Ajout** : Création de `supabase/functions/validate-affaire/index.ts`

**Fonctionnalités** :
- Validation complète côté serveur de toutes les données d'affaire
- Vérification des champs obligatoires (numeroAffaire, numeroReference, dates, montant)
- Validation des types (string, number, array, date)
- Contrôle des longueurs maximales pour tous les champs texte
- Validation des plages de valeurs pour les nombres (min: 0)
- Vérification de cohérence des dates (dateAffaire >= dateReference)
- Validation des tableaux (type des éléments, nombre max d'éléments)
- Retour d'erreurs détaillées avec codes d'erreur structurés

**Codes d'erreur** :
- `REQUIRED` : Champ obligatoire manquant
- `MAX_LENGTH` : Longueur maximale dépassée
- `INVALID_TYPE` : Type de données incorrect
- `MIN_VALUE` : Valeur inférieure au minimum
- `INVALID_DATE` : Format de date invalide
- `DATE_COHERENCE` : Incohérence entre les dates
- `MAX_ITEMS` : Nombre maximum d'éléments dépassé
- `INVALID_ITEM_TYPE` : Type d'élément de tableau incorrect
- `INVALID_STATUS` : Statut invalide
- `SERVER_ERROR` : Erreur serveur générique

#### 2. **Intégration dans le Service**
**Modification** : `src/services/affairesService.ts`

**Ajouts** :
- Fonction `validerAffaireCoteServeur()` : Appelle la edge function de validation
- Intégration dans `creerAffaire()` : Validation automatique avant insertion
- Intégration dans `mettreAJourAffaire()` : Validation automatique avant mise à jour
- Gestion des erreurs de validation avec messages détaillés
- Logs pour tracer les validations échouées

### Sécurité Renforcée

✅ **Double Validation** : Client + Serveur (impossible de contourner)
✅ **Protection Base de Données** : Données invalides rejetées avant insertion
✅ **Traçabilité** : Logs serveur de toutes les tentatives de validation
✅ **Messages Clairs** : Retour détaillé des erreurs de validation
✅ **Type Safety** : Validation stricte des types côté serveur

### Avantages

1. **Sécurité Maximale** : Même si la validation client est contournée, le serveur rejette les données invalides
2. **Cohérence des Données** : Garantit l'intégrité des données en base
3. **Débogage Facilité** : Logs serveur détaillés pour identifier les problèmes
4. **Maintenabilité** : Règles de validation centralisées dans la edge function
5. **Évolutivité** : Facile d'ajouter de nouvelles règles de validation

### Tests Recommandés

- [ ] Créer une affaire valide et vérifier qu'elle passe la validation serveur
- [ ] Tester avec des champs manquants (validation doit échouer)
- [ ] Tester avec des longueurs dépassées (validation doit échouer)
- [ ] Tester avec des montants négatifs (validation doit échouer)
- [ ] Tester avec dateAffaire < dateReference (validation doit échouer)
- [ ] Vérifier les logs serveur pour les validations échouées
- [ ] Tester la mise à jour d'une affaire existante

---

## Version 2.0.0 - Refonte Complète de la Validation (2025-01-22)

### Problèmes Identifiés et Corrigés

#### 1. **Duplication de Génération de Numéro**
**Problème** : La fonction `genererNumeroAffaire()` était dupliquée dans `useAffaireForm.ts` et `useAffaireSubmit.ts`

**Solution** : 
- Création de `src/utils/affaireUtils.ts` centralisant toutes les fonctions utilitaires
- Amélioration de l'algorithme de génération pour garantir l'unicité (ajout du mois et d'un nombre aléatoire)

#### 2. **Incohérence Type/Validation**
**Problème** : Le champ `descriptionAffaire` était requis dans le type `AffaireContentieuse` mais absent du formulaire

**Solution** :
- Ajout du champ dans le formulaire `InformationsBaseForm`
- Modification du type pour rendre le champ optionnel (cohérent avec le statut brouillon)
- Ajout dans le schéma de validation Zod avec limite de 1000 caractères

#### 3. **Validation Insuffisante**
**Problème** : Manque de validation sur les montants, dates, et longueurs de chaînes

**Solution** :
- Ajout de validations Zod complètes :
  - Limites min/max pour tous les nombres
  - Validation de format de date
  - Trim automatique sur toutes les chaînes
  - Limites de longueur pour tous les champs texte
  - Limites sur le nombre d'éléments dans les tableaux (max 20-50 selon le type)

#### 4. **Sanitisation des Entrées Utilisateur**
**Problème** : Aucune sanitisation des données avant enregistrement en base

**Solution** : Création de fonctions utilitaires dans `affaireUtils.ts` :
- `sanitizeString()` : Nettoie et limite les chaînes
- `sanitizeNumber()` : Valide et normalise les nombres
- `sanitizeArray()` : Filtre et limite les tableaux
- `validateDate()` : Valide le format des dates
- `validateDateCoherence()` : Vérifie la cohérence temporelle

#### 5. **Sécurité - Injection de Données**
**Problème** : Risque d'injection de données malveillantes

**Solution** :
- Application systématique de `trim()` sur toutes les entrées texte
- Validation stricte des types et formats
- Limites de longueur pour prévenir les attaques DoS
- Validation de cohérence des dates (date d'affaire >= date de référence)

#### 6. **Type Safety**
**Problème** : Utilisation de `as any` et types lâches

**Solution** :
- Remplacement du cast `as any` par une vérification de champ
- Import du type `FormData` pour typage strict
- Ajout de validation lors de l'application des suggestions

#### 7. **Gestion des Erreurs**
**Problème** : Gestion des erreurs minimale

**Solution** :
- Ajout de try-catch avec messages d'erreur détaillés
- Validation de cohérence avant soumission
- Messages toast informatifs pour l'utilisateur

### Nouveaux Fichiers

#### `src/utils/affaireUtils.ts`
Fichier utilitaire centralisant :
- Génération de numéros d'affaire
- Fonctions de sanitisation
- Fonctions de validation
- Utilitaires de conversion de types

### Fichiers Modifiés

1. **`src/components/affaires/useAffaireForm.ts`**
   - Import de `genererNumeroAffaire` depuis utils
   - Ajout de validations Zod complètes
   - Initialisation de `descriptionAffaire`

2. **`src/components/affaires/useAffaireSubmit.ts`**
   - Suppression de la duplication de code
   - Ajout de sanitisation complète des données
   - Validation de cohérence des dates
   - Gestion d'erreurs améliorée
   - Conversion correcte des types

3. **`src/components/ModalCreationAffaireContentieuse.tsx`**
   - Amélioration du handleApplySuggestion avec validation
   - Meilleur feedback utilisateur

4. **`src/types/affaire.ts`**
   - `descriptionAffaire` rendu optionnel

5. **`src/components/forms/InformationsBaseForm.tsx`**
   - Ajout du champ `descriptionAffaire`
   - Ajout de limites min/max sur les inputs numériques

### Bénéfices

✅ **Sécurité Renforcée** : Protection contre les injections et données malveillantes
✅ **Cohérence des Données** : Validation stricte à tous les niveaux
✅ **Maintenabilité** : Code centralisé et réutilisable
✅ **Expérience Utilisateur** : Messages d'erreur clairs et validations en temps réel
✅ **Performance** : Génération de numéros uniques optimisée
✅ **Type Safety** : Typage TypeScript strict sans `any`

### Tests Recommandés

- [ ] Créer une affaire avec tous les champs remplis
- [ ] Créer une affaire avec uniquement les champs obligatoires
- [ ] Tester les limites de caractères sur les champs texte
- [ ] Tester les validations de montants (négatifs, très grands)
- [ ] Tester la cohérence des dates (date affaire < date référence)
- [ ] Vérifier l'unicité des numéros d'affaire générés
- [ ] Tester l'application de suggestions
- [ ] Vérifier le comportement avec des données malveillantes (XSS, injection)
