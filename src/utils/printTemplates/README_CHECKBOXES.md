# Système de remplissage automatique des cases à cocher

Ce document explique comment les cases à cocher sont automatiquement remplies dans les rapports CT8 et CT3 en fonction des données de l'affaire.

## CT8 - Bordereau d'Affaire Contentieuse

### Cases automatiques dans l'en-tête

Les cases à cocher dans l'en-tête du CT8 sont remplies selon les règles suivantes :

- **DCD (Direction du Contentieux des Douanes)** : Cochée si l'affaire est validée ou clôturée
  - `statut === 'validee' || statut === 'cloturee'`

- **D.R (Direction Régionale)** : Cochée si l'affaire a été transmise à la hiérarchie
  - `dateTransmissionHierarchie !== undefined`

- **Office** : Cochée si l'affaire est en attente de validation hiérarchique
  - `statut === 'en_attente_hierarchie'`

## CT3 - Transaction tenant lieu de procès-verbal

### Recto - Cases de disposition des marchandises

Les cases suivantes sont cochées automatiquement en fonction du champ `suiteReserveeMarchandises` :

- **Confiscation des marchandises** : Cochée si le texte contient "confiscation" ou "saisie"
  - Également cochée par défaut si c'est une transaction et qu'aucune autre option n'est spécifiée

- **Main levée accordée** : Cochée si le texte contient "main", "levée" ou "restitution"
  - Également cochée par défaut pour les transactions sans confiscation spécifiée

- **Abandon des moyens de transport** : Cochée si le texte contient "abandon" ou "véhicule"

### Verso - Cases d'approbation

Les cases d'approbation sont remplies selon :

- **Transaction approuvée** : Cochée si l'affaire est clôturée ou a une date d'approbation hiérarchique
  - `statut === 'cloturee' || dateApprobationHierarchie !== undefined`

- **Transaction rejetée** : Cochée si l'affaire est en brouillon mais a été transmise à la hiérarchie
  - `statut === 'brouillon' && dateTransmissionHierarchie !== undefined`

## Modification des règles

Pour modifier les règles de remplissage automatique, éditer les fonctions suivantes :

- **CT8** : `getCheckedBoxes()` dans `src/utils/printTemplates/ct8Template.ts`
- **CT3 Recto** : `getCt3CheckedBoxes()` dans `src/utils/printTemplates/shared/ct3Recto.ts`
- **CT3 Verso** : `getApprobationStatus()` dans `src/utils/printTemplates/shared/ct3Verso.ts`

## Logique intelligente

Le système essaie de déduire intelligemment l'état des cases à partir de :
1. Les champs spécifiques (suiteReserveeMarchandises, etc.)
2. Le statut de l'affaire
3. Les dates de transmission et approbation
4. Le type de suite donnée (transaction vs justice)

Si plusieurs options semblent possibles, le système privilégie la cohérence avec le statut global de l'affaire.
