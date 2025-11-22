# Système de validation des rapports

Ce document explique comment fonctionne le système de validation des données avant la génération de rapports.

## Vue d'ensemble

Le système de validation vérifie automatiquement que toutes les données essentielles sont présentes avant de générer un rapport. Il distingue deux niveaux de validation :

1. **Erreurs bloquantes** : Empêchent la génération du rapport
2. **Avertissements** : Permettent de générer le rapport mais signalent des données manquantes

## Architecture

### Fichiers principaux

- `src/utils/validation/rapportValidation.ts` : Schémas de validation Zod pour chaque type de rapport
- `src/components/affaires/ValidationAlertDialog.tsx` : Composant d'affichage des erreurs et avertissements
- `src/components/affaires/GenerateurRapports.tsx` : Intégration de la validation dans le générateur

## Schémas de validation

### CT8 - Bordereau d'Affaire Contentieuse

**Champs obligatoires :**
- Numéro d'affaire
- Date de l'affaire
- Région DGD
- Bureau/Poste
- Nom du contrevenant
- Description de l'affaire
- Nature de l'infraction
- Droits compromis (> 0)
- Au moins un saisissant
- Au moins un chef

### CT3 - Transaction

**Champs obligatoires :**
- Numéro d'affaire
- Date de l'affaire
- Bureau/Poste
- Nom du contrevenant
- Date de transaction
- Montant de l'amende (> 0)
- Numéro de quittance
- Au moins un saisissant
- Au moins un chef
- Suite de l'affaire

### EDPN - État Dégageant le Produit Net

**Champs obligatoires :**
- Numéro d'affaire
- Date de l'affaire
- Numéro de référence
- Bureau/Poste
- Région DGD
- Nom du contrevenant
- Description de l'affaire
- Montant de l'affaire (> 0)
- Au moins un saisissant
- Au moins un chef

**Champs optionnels mais recommandés :**
- Date de transaction
- Montant de l'amende
- Montant de la vente
- Frais divers
- IFU du contrevenant
- Adresse complète

### Bordereau de répartition

**Champs obligatoires :**
- Numéro d'affaire
- Date de l'affaire
- Nom du contrevenant
- Montant de l'affaire (> 0)
- Au moins un saisissant

### Fiche indicateur

**Champs obligatoires :**
- Numéro d'affaire
- Date de l'affaire
- Bureau/Poste
- Montant de l'affaire (> 0)
- Au moins un saisissant

## Utilisation

### Dans le composant GenerateurRapports

```typescript
import { validateAffaireForRapport } from "@/utils/validation/rapportValidation";

// Valider une affaire pour un type de rapport spécifique
const validation = validateAffaireForRapport(affaire, 'edpn');

if (!validation.isValid) {
  // Afficher les erreurs bloquantes
  console.error("Erreurs:", validation.errors);
} else if (validation.warnings.length > 0) {
  // Afficher les avertissements
  console.warn("Avertissements:", validation.warnings);
} else {
  // Tout est OK, générer le rapport
  genererRapport();
}
```

### Structure du résultat de validation

```typescript
interface ValidationResult {
  isValid: boolean;           // true si aucune erreur
  errors: ValidationError[];   // Liste des erreurs bloquantes
  warnings: ValidationError[]; // Liste des avertissements
}

interface ValidationError {
  field: string;   // Nom du champ (ex: "numeroAffaire")
  message: string; // Message d'erreur lisible
}
```

## Interface utilisateur

### Indicateurs visuels

Le système affiche des indicateurs de couleur pour chaque rapport :

- 🔴 **Rouge (AlertCircle)** : Erreurs bloquantes - impossible de générer
- 🟡 **Jaune (AlertCircle)** : Avertissements - génération possible mais données incomplètes
- 🟢 **Vert (CheckCircle)** : Toutes les données sont complètes

### Dialogue de validation

Lorsqu'une validation échoue ou génère des avertissements :

1. Un dialogue s'affiche automatiquement
2. Liste toutes les erreurs et avertissements avec les champs concernés
3. Pour les erreurs : Bouton "Fermer" uniquement
4. Pour les avertissements : Boutons "Annuler" et "Générer quand même"

## Ajout d'un nouveau rapport

Pour ajouter un nouveau type de rapport avec validation :

1. **Créer un schéma Zod** dans `rapportValidation.ts` :
```typescript
export const monNouveauRapportSchema = z.object({
  champObligatoire: z.string().min(1, "Message d'erreur"),
  montant: z.number().positive("Doit être supérieur à 0"),
  // ...
});
```

2. **Ajouter le cas dans la fonction `validateAffaireForRapport`** :
```typescript
case 'mon_nouveau_rapport':
  schema = monNouveauRapportSchema;
  break;
```

3. **Ajouter un label** dans `getFieldLabel()` pour les nouveaux champs

## Bonnes pratiques

1. **Messages clairs** : Les messages d'erreur doivent être compréhensibles par les utilisateurs
2. **Validation côté client ET serveur** : Ne pas se fier uniquement à la validation client
3. **Avertissements vs Erreurs** : 
   - Erreurs = Données critiques manquantes pour le document officiel
   - Avertissements = Données complémentaires recommandées mais pas obligatoires
4. **Tests réguliers** : Vérifier que la validation fonctionne pour tous les scénarios

## Sécurité

Le système utilise Zod pour la validation, ce qui offre :

- Protection contre les injections
- Validation de type stricte
- Nettoyage automatique des données (trim, etc.)
- Messages d'erreur sécurisés (pas de fuite de données sensibles)

## Amélioration future

- Validation conditionnelle (ex: si transaction alors amende obligatoire)
- Validation de format (numéros de référence, dates)
- Validation croisée entre champs
- Suggestions de correction automatique
- Export des erreurs de validation pour audit
