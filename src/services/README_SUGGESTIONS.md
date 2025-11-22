# Système de Pré-remplissage Intelligent

Ce document explique le fonctionnement du système de suggestions intelligentes pour accélérer la saisie des affaires contentieuses.

## Vue d'ensemble

Le système analyse automatiquement :
1. **Les valeurs par défaut du bureau** : Configurations spécifiques à chaque bureau
2. **Les affaires similaires** : Patterns et valeurs fréquentes dans les affaires validées

## Architecture

### Base de données

**Table `configurations_bureau`** :
```sql
- id: UUID (primary key)
- bureau_nom: TEXT (unique)
- region: TEXT
- valeurs_defaut: JSONB
- created_at, updated_at: TIMESTAMP
```

Le champ `valeurs_defaut` contient un objet JSON avec les valeurs par défaut pour chaque champ :
```json
{
  "natureInfraction": ["Exportation sans déclaration"],
  "procedureDetectionFraude": ["Contrôle physique"],
  "natureTransport": ["Véhicule"],
  "suiteReserveeMarchandises": ["Confiscation"],
  "nomsChefs": ["KOUTOU HAMADOU"],
  "commissionnaireDouane": ["SARL TRANSIT"]
}
```

### Services

**`src/services/suggestionsService.ts`** :

1. `getDefaultValuesByBureau(bureauNom)` 
   - Récupère les valeurs par défaut configurées pour un bureau

2. `getFrequentValues(bureauNom?, regionDgd?, limit)`
   - Analyse les affaires validées similaires
   - Filtre par bureau et/ou région
   - Retourne les N dernières affaires

3. `generateSuggestions(partialAffaire)`
   - Fonction principale qui génère toutes les suggestions
   - Combine valeurs par défaut + analyse des affaires similaires
   - Retourne les suggestions avec niveau de confiance

4. `saveDefaultValues(bureauNom, region, valeursDefaut)`
   - Sauvegarde les valeurs par défaut pour un bureau

### Hooks

**`src/hooks/useSuggestions.ts`** :
- Hook React pour gérer les suggestions dans les composants
- Se déclenche automatiquement quand bureau/région change
- Gère l'état de chargement et les actions (appliquer/rejeter)

### Composants UI

**`src/components/affaires/SuggestionsPanel.tsx`** :
- Panneau d'affichage des suggestions
- Badges de confiance (haute/moyenne/faible)
- Boutons pour appliquer ou rejeter chaque suggestion

**`src/components/configuration/ConfigurationValeursDefaut.tsx`** :
- Interface de configuration des valeurs par défaut
- Accessible dans Paramètres > Valeurs défaut
- Permet de définir les valeurs pour chaque bureau

## Algorithme de suggestion

### 1. Collecte des données

Pour chaque champ à suggérer :
1. Vérifier si une valeur par défaut existe pour le bureau
2. Sinon, analyser les N dernières affaires similaires
3. Calculer la fréquence de chaque valeur

### 2. Calcul du niveau de confiance

```
Confiance HAUTE   : ≥ 70% des affaires utilisent cette valeur
Confiance MOYENNE : 40-69% des affaires utilisent cette valeur  
Confiance FAIBLE  : < 40% des affaires utilisent cette valeur
```

### 3. Priorisation des sources

1. **Bureau default** (confiance: HIGH)
   - Valeurs configurées spécifiquement pour le bureau
   - Priorité maximale car explicitement définies

2. **Frequent value** (confiance: VARIABLE)
   - Valeurs les plus utilisées dans les affaires similaires
   - Niveau de confiance basé sur la fréquence

## Utilisation

### Dans le formulaire de création

Les suggestions apparaissent automatiquement dans l'onglet "Générale" du formulaire de création d'affaire :

1. **Déclenchement** : Dès qu'un bureau ou une région est sélectionné
2. **Affichage** : Panneau avec toutes les suggestions disponibles
3. **Actions** :
   - ✓ Appliquer : Remplit automatiquement le champ
   - ✗ Ignorer : Masque la suggestion pour ce champ
   - Tout ignorer : Masque toutes les suggestions

### Configuration des valeurs par défaut

Dans **Paramètres > Valeurs défaut** :

1. Sélectionner un bureau dans la liste
2. Ajouter des valeurs par défaut pour chaque champ
3. Les valeurs sont des tableaux (liste de choix possibles)
4. Enregistrer les modifications

## Champs suggérés

Le système génère des suggestions pour les champs suivants :

- **natureInfraction** : Types d'infractions communes
- **procedureDetectionFraude** : Méthodes de détection
- **natureTransport** : Moyens de transport utilisés
- **suiteReserveeMarchandises** : Décisions sur les marchandises
- **nomsChefs** : Chefs de bureau
- **commissionnaireDouane** : Commissionnaires habituels

## Exemples d'utilisation

### Exemple 1 : Bureau avec valeurs par défaut

```typescript
// Configuration pour Bureau de Dakola
{
  "natureInfraction": ["Exportation sans déclaration", "Fraude documentaire"],
  "nomsChefs": ["KOUTOU HAMADOU"],
  "suiteReserveeMarchandises": ["Confiscation", "Main levée"]
}

// Résultat : suggestions avec confiance HAUTE pour tous ces champs
```

### Exemple 2 : Analyse des affaires similaires

```typescript
// 50 affaires analysées du même bureau
// "Contrôle physique" utilisé dans 80% des cas
// → Suggestion avec confiance HAUTE

// "Camion" utilisé dans 45% des cas
// → Suggestion avec confiance MOYENNE
```

## Performance

### Optimisations implémentées

1. **Cache des valeurs par défaut** : Chargées une seule fois par bureau
2. **Limite des affaires analysées** : Par défaut 50 affaires max
3. **Filtrage en mémoire** : Après récupération des données
4. **Debouncing** : Les suggestions ne se rechargent pas à chaque frappe

### Recommandations

- Configurer les valeurs par défaut pour les bureaux fréquemment utilisés
- Maintenir la base de données propre (affaires validées uniquement)
- Limiter l'analyse à 50-100 affaires pour de bonnes performances

## Extensibilité

### Ajouter un nouveau champ à suggérer

1. **Dans `suggestionsService.ts`** :
```typescript
const fieldsToSuggest = [
  // ... champs existants
  {
    field: 'monNouveauChamp',
    label: 'Mon nouveau champ',
    path: 'monNouveauChamp'
  }
];
```

2. **Dans `ConfigurationValeursDefaut.tsx`** :
```typescript
const fieldsConfig = [
  // ... champs existants
  { 
    field: 'monNouveauChamp', 
    label: 'Mon nouveau champ', 
    type: 'array',
    placeholder: 'Ex: Valeur exemple'
  }
];
```

### Ajouter une nouvelle source de suggestions

Créer une nouvelle fonction dans `suggestionsService.ts` :
```typescript
export const getSuggestionsFromNewSource = async (params) => {
  // Votre logique
  return suggestions;
};
```

Intégrer dans `generateSuggestions()` :
```typescript
// 4. Nouvelle source
const newSourceSuggestions = await getSuggestionsFromNewSource(params);
suggestions.push(...newSourceSuggestions);
```

## Debugging

### Logs utiles

```typescript
console.log('Suggestions générées:', suggestions);
console.log('Affaires similaires:', similarCasesCount);
console.log('Valeurs par défaut:', defaultValues);
```

### Problèmes communs

1. **Aucune suggestion** :
   - Vérifier que le bureau/région est sélectionné
   - Vérifier qu'il existe des affaires validées similaires
   - Vérifier les valeurs par défaut du bureau

2. **Suggestions incorrectes** :
   - Vérifier la qualité des données historiques
   - Affiner les critères de similarité
   - Configurer des valeurs par défaut explicites

3. **Performance lente** :
   - Réduire la limite d'affaires analysées
   - Optimiser les requêtes Supabase
   - Ajouter des index si nécessaire

## Sécurité

- Les suggestions sont générées côté client
- Pas d'exécution de code côté serveur
- Les valeurs par défaut sont stockées de manière sécurisée dans Supabase
- RLS activé sur la table `configurations_bureau`
