
import { AyantDroitRepartition, ParametresRepartition } from "@/types/repartition";

// Fonction pour obtenir les règles configurées
const obtenirReglesRepartition = () => {
  const reglesStockees = localStorage.getItem('regles_repartition');
  if (reglesStockees) {
    return JSON.parse(reglesStockees);
  }
  
  // Règles par défaut si aucune configuration
  return {
    fsp: { pourcentageBase: 5, pourcentageMax: 5 },
    tresor: { pourcentageBase: 40, pourcentageMax: 40 },
    mutuelle: { pourcentageBase: 10, pourcentageMax: 10 },
    poursuivants: { pourcentageBase: 25, pourcentageMax: 30 },
    fonds_solidarite: { pourcentageBase: 8, pourcentageMax: 10 },
    fonds_formation: { pourcentageBase: 7, pourcentageMax: 10 },
    fonds_equipement: { pourcentageBase: 5, pourcentageMax: 8 },
    prime_rendement: { pourcentageBase: 5, pourcentageMax: 7 }
  };
};

export const calculerPartFsp = (montantAffaire: number): number => {
  const regles = obtenirReglesRepartition();
  const regleFsp = regles.fsp;
  
  // Utilise la règle configurée, avec fallback sur l'ancienne logique
  const taux = montantAffaire < 500000 ? 
    (regleFsp?.pourcentageBase || 5) / 100 : 
    0.045; // 4.5% pour montants >= 500k
  
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

export const calculerPartsFixes = (montantNet: number) => {
  const regles = obtenirReglesRepartition();
  
  return {
    partTresor: Math.round(montantNet * (regles.tresor?.pourcentageBase || 40) / 100),
    partMutuelle: Math.round(montantNet * (regles.mutuelle?.pourcentageBase || 10) / 100),
    partFondsSolidarite: Math.round(montantNet * (regles.fonds_solidarite?.pourcentageBase || 8) / 100),
    partFondsFormation: Math.round(montantNet * (regles.fonds_formation?.pourcentageBase || 7) / 100),
    partFondsEquipement: Math.round(montantNet * (regles.fonds_equipement?.pourcentageBase || 5) / 100),
    partPrimeRendement: Math.round(montantNet * (regles.prime_rendement?.pourcentageBase || 5) / 100)
  };
};

export const creerAyantsDroitsFixes = (
  montantNet: number,
  montantTotal: number,
  partFsp: number
): AyantDroitRepartition[] => {
  const parts = calculerPartsFixes(montantNet);
  const regles = obtenirReglesRepartition();
  
  return [
    {
      id: 'fsp',
      nom: 'Fonds de Soutien aux Politiques (FSP)',
      type: 'fsp',
      pourcentage: (partFsp / montantTotal) * 100,
      montantCalcule: partFsp,
      priorite: 0
    },
    {
      id: 'tresor',
      nom: 'Trésor Public',
      type: 'tresor',
      pourcentage: regles.tresor?.pourcentageBase || 40,
      montantCalcule: parts.partTresor,
      priorite: 1
    },
    {
      id: 'mutuelle',
      nom: 'Mutuelle des Douanes',
      type: 'mutuelle',
      pourcentage: regles.mutuelle?.pourcentageBase || 10,
      montantCalcule: parts.partMutuelle,
      priorite: 2
    },
    {
      id: 'fonds_solidarite',
      nom: 'Fonds de Solidarité',
      type: 'fonds_solidarite',
      pourcentage: regles.fonds_solidarite?.pourcentageBase || 8,
      montantCalcule: parts.partFondsSolidarite,
      priorite: 3
    },
    {
      id: 'fonds_formation',
      nom: 'Fonds de Formation',
      type: 'fonds_formation',
      pourcentage: regles.fonds_formation?.pourcentageBase || 7,
      montantCalcule: parts.partFondsFormation,
      priorite: 4
    },
    {
      id: 'fonds_equipement',
      nom: 'Fonds d\'Équipement',
      type: 'fonds_equipement',
      pourcentage: regles.fonds_equipement?.pourcentageBase || 5,
      montantCalcule: parts.partFondsEquipement,
      priorite: 5
    },
    {
      id: 'prime_rendement',
      nom: 'Primes de Rendement',
      type: 'prime_rendement',
      pourcentage: regles.prime_rendement?.pourcentageBase || 5,
      montantCalcule: parts.partPrimeRendement,
      priorite: 6
    }
  ];
};

export const creerAyantsDroitsPoursuivants = (
  parametres: ParametresRepartition,
  montantNet: number
): AyantDroitRepartition[] => {
  const regles = obtenirReglesRepartition();
  const {
    nombreSaisissants,
    nombreChefs,
    nombreInformateurs = 0,
    saisissants,
    chefs,
    informateurs = []
  } = parametres;

  const pourcentagePoursuivants = regles.poursuivants?.pourcentageBase || 25;
  const montantPoursuivants = Math.round(montantNet * pourcentagePoursuivants / 100);
  const totalPoursuivants = nombreSaisissants + nombreChefs + nombreInformateurs;
  
  if (totalPoursuivants === 0) return [];

  const montantParPoursuivant = Math.round(montantPoursuivants / totalPoursuivants);
  const ayantsDroits: AyantDroitRepartition[] = [];

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

  return ayantsDroits;
};
