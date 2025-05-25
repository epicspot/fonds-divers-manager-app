
import { RegleRepartition, AyantDroitRepartition, ResultatRepartition, ParametresRepartition } from "@/types/repartition";

// Règles métier pour la répartition selon le tableau détaillé
const REGLES_REPARTITION: Record<string, RegleRepartition> = {
  fsp: {
    type: 'fsp',
    pourcentageBase: 5, // 5% pour montants < 500k, 4.5% pour >= 500k
    pourcentageMax: 5,
    conditions: { montantMin: 0 }
  },
  tresor: {
    type: 'tresor',
    pourcentageBase: 40, // 40% du montant net
    pourcentageMax: 40
  },
  mutuelle: {
    type: 'mutuelle',
    pourcentageBase: 10, // 10% pour la Mutuelle des Douanes
    pourcentageMax: 10
  },
  poursuivants: {
    type: 'poursuivants',
    pourcentageBase: 25, // 25% réparti entre les poursuivants
    pourcentageMax: 30,
    conditions: { nombrePersonnes: 1 }
  },
  fonds_solidarite: {
    type: 'fonds_solidarite',
    pourcentageBase: 8, // 8% pour le Fonds de Solidarité
    pourcentageMax: 10
  },
  fonds_formation: {
    type: 'fonds_formation',
    pourcentageBase: 7, // 7% pour le Fonds de Formation
    pourcentageMax: 10
  },
  fonds_equipement: {
    type: 'fonds_equipement',
    pourcentageBase: 5, // 5% pour le Fonds d'Équipement
    pourcentageMax: 8
  },
  prime_rendement: {
    type: 'prime_rendement',
    pourcentageBase: 5, // 5% pour les Primes de Rendement
    pourcentageMax: 7
  }
};

export const calculerPartFsp = (montantAffaire: number): number => {
  const taux = montantAffaire < 500000 ? 0.05 : 0.045;
  return Math.round(montantAffaire * taux);
};

export const calculerMontantNet = (
  montantAffaire: number, 
  montantAmende: number = 0, 
  montantVente: number = 0, 
  fraisDivers: number = 0
): number => {
  const partFsp = calculerPartFsp(montantAffaire);
  const montantTotal = montantAffaire + montantAmende + montantVente;
  return Math.round(montantTotal - partFsp - fraisDivers);
};

export const repartirMontants = (parametres: ParametresRepartition): ResultatRepartition => {
  const {
    montantAffaire,
    montantAmende = 0,
    montantVente = 0,
    fraisDivers = 0,
    nombreSaisissants,
    nombreChefs,
    nombreInformateurs = 0,
    saisissants,
    chefs,
    informateurs = []
  } = parametres;

  const erreurs: string[] = [];
  const ayantsDroits: AyantDroitRepartition[] = [];

  // Calculs de base
  const partFsp = calculerPartFsp(montantAffaire);
  const montantTotal = montantAffaire + montantAmende + montantVente;
  const montantNet = calculerMontantNet(montantAffaire, montantAmende, montantVente, fraisDivers);

  if (montantNet <= 0) {
    erreurs.push("Le montant net à répartir doit être positif");
    return {
      montantTotal,
      montantNet: 0,
      partFsp,
      partTresor: 0,
      partMutuelle: 0,
      partFondsSolidarite: 0,
      partFondsFormation: 0,
      partFondsEquipement: 0,
      partPrimeRendement: 0,
      ayantsDroits: [],
      verificationsOk: false,
      erreurs
    };
  }

  // 1. Part du Trésor (40% du montant net)
  const partTresor = Math.round(montantNet * 0.40);
  ayantsDroits.push({
    id: 'tresor',
    nom: 'Trésor Public',
    type: 'tresor',
    pourcentage: 40,
    montantCalcule: partTresor,
    priorite: 1
  });

  // 2. Part de la Mutuelle des Douanes (10% du montant net)
  const partMutuelle = Math.round(montantNet * 0.10);
  ayantsDroits.push({
    id: 'mutuelle',
    nom: 'Mutuelle des Douanes',
    type: 'mutuelle',
    pourcentage: 10,
    montantCalcule: partMutuelle,
    priorite: 2
  });

  // 3. Fonds de Solidarité (8% du montant net)
  const partFondsSolidarite = Math.round(montantNet * 0.08);
  ayantsDroits.push({
    id: 'fonds_solidarite',
    nom: 'Fonds de Solidarité',
    type: 'fonds_solidarite',
    pourcentage: 8,
    montantCalcule: partFondsSolidarite,
    priorite: 3
  });

  // 4. Fonds de Formation (7% du montant net)
  const partFondsFormation = Math.round(montantNet * 0.07);
  ayantsDroits.push({
    id: 'fonds_formation',
    nom: 'Fonds de Formation',
    type: 'fonds_formation',
    pourcentage: 7,
    montantCalcule: partFondsFormation,
    priorite: 4
  });

  // 5. Fonds d'Équipement (5% du montant net)
  const partFondsEquipement = Math.round(montantNet * 0.05);
  ayantsDroits.push({
    id: 'fonds_equipement',
    nom: 'Fonds d\'Équipement',
    type: 'fonds_equipement',
    pourcentage: 5,
    montantCalcule: partFondsEquipement,
    priorite: 5
  });

  // 6. Primes de Rendement (5% du montant net)
  const partPrimeRendement = Math.round(montantNet * 0.05);
  ayantsDroits.push({
    id: 'prime_rendement',
    nom: 'Primes de Rendement',
    type: 'prime_rendement',
    pourcentage: 5,
    montantCalcule: partPrimeRendement,
    priorite: 6
  });

  // 7. Part FSP (calculée séparément du montant total)
  ayantsDroits.push({
    id: 'fsp',
    nom: 'Fonds de Soutien aux Politiques (FSP)',
    type: 'fsp',
    pourcentage: (partFsp / montantTotal) * 100,
    montantCalcule: partFsp,
    priorite: 0
  });

  // 8. Poursuivants (25% du montant net réparti entre saisissants, chefs et informateurs)
  const montantPoursuivants = Math.round(montantNet * 0.25);
  
  // Calcul du nombre total de poursuivants
  const totalPoursuivants = nombreSaisissants + nombreChefs + nombreInformateurs;
  
  if (totalPoursuivants > 0) {
    // Répartition équitable entre tous les poursuivants
    const montantParPoursuivant = Math.round(montantPoursuivants / totalPoursuivants);
    
    // Saisissants
    saisissants.forEach((nom, index) => {
      ayantsDroits.push({
        id: `saisissant_${index}`,
        nom: `${nom} (Saisissant)`,
        type: 'saisissant',
        pourcentage: (montantParPoursuivant / montantNet) * 100,
        montantCalcule: montantParPoursuivant,
        priorite: 7
      });
    });
    
    // Chefs
    chefs.forEach((nom, index) => {
      ayantsDroits.push({
        id: `chef_${index}`,
        nom: `${nom} (Chef)`,
        type: 'chef',
        pourcentage: (montantParPoursuivant / montantNet) * 100,
        montantCalcule: montantParPoursuivant,
        priorite: 8
      });
    });
    
    // Informateurs
    informateurs.forEach((nom, index) => {
      ayantsDroits.push({
        id: `informateur_${index}`,
        nom: nom || `Informateur ${index + 1}`,
        type: 'informateur',
        pourcentage: (montantParPoursuivant / montantNet) * 100,
        montantCalcule: montantParPoursuivant,
        priorite: 9
      });
    });
  }

  // Vérifications
  const totalCalcule = ayantsDroits.reduce((sum, ayant) => sum + ayant.montantCalcule, 0);
  const difference = Math.abs(montantTotal - totalCalcule);

  if (difference > 10) { // Tolérance de 10 FCFA pour les arrondis
    erreurs.push(`Écart de répartition détecté: ${difference} FCFA`);
  }

  return {
    montantTotal,
    montantNet,
    partFsp,
    partTresor,
    partMutuelle,
    partFondsSolidarite,
    partFondsFormation,
    partFondsEquipement,
    partPrimeRendement,
    ayantsDroits: ayantsDroits.sort((a, b) => a.priorite - b.priorite),
    verificationsOk: erreurs.length === 0,
    erreurs
  };
};

export const genererBordereauRepartition = (resultat: ResultatRepartition): string => {
  const date = new Date().toLocaleDateString('fr-FR');
  let bordereau = `BORDEREAU DE RÉPARTITION - ${date}\n`;
  bordereau += `==========================================\n\n`;
  bordereau += `MONTANT TOTAL DE L'AFFAIRE: ${resultat.montantTotal.toLocaleString()} FCFA\n`;
  bordereau += `MONTANT NET À RÉPARTIR: ${resultat.montantNet.toLocaleString()} FCFA\n\n`;
  
  bordereau += `RÉPARTITION DES MONTANTS:\n`;
  bordereau += `-------------------------\n`;
  
  // Groupement par type d'ayant droit
  const groupes = {
    'Prélèvements': ['fsp'],
    'Administration': ['tresor'],
    'Fonds et Mutuelles': ['mutuelle', 'fonds_solidarite', 'fonds_formation', 'fonds_equipement', 'prime_rendement'],
    'Poursuivants': ['saisissant', 'chef', 'informateur']
  };
  
  Object.entries(groupes).forEach(([nomGroupe, types]) => {
    const ayantsDuGroupe = resultat.ayantsDroits.filter(a => types.includes(a.type));
    if (ayantsDuGroupe.length > 0) {
      bordereau += `\n${nomGroupe.toUpperCase()}:\n`;
      ayantsDuGroupe.forEach((ayant, index) => {
        bordereau += `  ${index + 1}. ${ayant.nom}: ${ayant.montantCalcule.toLocaleString()} FCFA (${ayant.pourcentage.toFixed(2)}%)\n`;
      });
    }
  });
  
  bordereau += `\nTOTAL RÉPARTI: ${resultat.ayantsDroits.reduce((sum, a) => sum + a.montantCalcule, 0).toLocaleString()} FCFA\n`;
  
  if (!resultat.verificationsOk) {
    bordereau += `\nERREURS DÉTECTÉES:\n`;
    resultat.erreurs.forEach(erreur => {
      bordereau += `- ${erreur}\n`;
    });
  }
  
  return bordereau;
};
