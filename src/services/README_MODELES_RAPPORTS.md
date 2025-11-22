# Système de Modèles de Rapports Personnalisables

Ce système permet aux utilisateurs de créer et gérer des modèles de rapports personnalisés avec des configurations d'en-têtes, logos et mise en page.

## Architecture

### Base de données

Table `modeles_rapports`:
```sql
- id: UUID (clé primaire)
- nom: TEXT (nom du modèle)
- type_rapport: TEXT (type de rapport associé)
- configuration: JSONB (configuration du modèle)
- est_defaut: BOOLEAN (indique si c'est le modèle par défaut)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Services

**`modelesRapportsService.ts`**
- `getModelesRapports()`: Récupère tous les modèles
- `getModeleRapport(id)`: Récupère un modèle spécifique
- `getModeleParDefaut(typeRapport)`: Récupère le modèle par défaut pour un type
- `creerModeleRapport(modele)`: Crée un nouveau modèle
- `updateModeleRapport(id, updates)`: Met à jour un modèle
- `deleteModeleRapport(id)`: Supprime un modèle
- `setModeleParDefaut(id)`: Définit un modèle comme défaut

### Configuration du modèle

```typescript
interface ConfigurationModele {
  enTete?: {
    titre?: string;
    sousTitre?: string;
    logo?: string; // Base64 image
    couleurFond?: string;
    couleurTexte?: string;
  };
  piedPage?: {
    texte?: string;
    afficherNumeroPage?: boolean;
    afficherDate?: boolean;
  };
  miseEnPage?: {
    marges?: {
      haut?: number;
      bas?: number;
      gauche?: number;
      droite?: number;
    };
    police?: string;
    taillePolice?: number;
    couleurPrincipale?: string;
    couleurSecondaire?: string;
  };
  sections?: {
    afficherLogo?: boolean;
    afficherEntete?: boolean;
    afficherSignature?: boolean;
    afficherCachet?: boolean;
  };
}
```

## Composants

### GestionnaireModeles
Composant principal pour gérer les modèles:
- Affiche la liste des modèles existants
- Permet de créer/modifier/supprimer des modèles
- Définir un modèle comme défaut
- Avec badges pour identifier les modèles par défaut

### ConfigurationModeleComponent
Interface de configuration avec 3 onglets:
1. **En-tête**: Logo, titre, sous-titre, couleurs
2. **Mise en page**: Marges, police, taille, couleurs
3. **Sections**: Options d'affichage

### Utilisation dans les templates

Les templates (CT3, EDPN, Fiche Indicateur) ont été mis à jour pour accepter une configuration:

```typescript
generateHTML: (
  content: string, 
  affaire?: AffaireContentieuse, 
  resultat?: ResultatRepartition,
  config?: ConfigurationModele
) => string
```

La fonction `applyTemplateConfiguration()` applique les styles personnalisés au HTML de base.

## Hook personnalisé

**`useModelesRapports`**
```typescript
const { 
  modeles, 
  modeleDefaut, 
  isLoading, 
  getModelesPourType 
} = useModelesRapports(typeRapport);
```

## Intégration dans ModuleRapports

Le `ModuleRapports` a été étendu avec un nouvel onglet "Modèles" qui affiche le `GestionnaireModeles`.

## Upload de logos

- Les logos sont encodés en Base64 et stockés directement dans la configuration
- Limite de taille: 1 Mo
- Formats acceptés: tous les formats d'images

## Sécurité

- RLS activé sur la table `modeles_rapports`
- Permissions: lecture, création, modification et suppression pour tous les utilisateurs authentifiés
- Lors de la définition d'un modèle comme défaut, les autres modèles du même type sont automatiquement désactivés

## Modèles par défaut

- Un seul modèle peut être défini comme défaut par type de rapport
- Le système charge automatiquement le modèle par défaut lors de la génération d'un rapport
- Si aucun modèle par défaut n'existe, le template de base est utilisé

## Fonctionnalités futures possibles

- Export/Import de modèles
- Modèles partagés entre utilisateurs
- Prévisualisation en temps réel
- Bibliothèque de modèles prédéfinis
- Duplication de modèles existants
