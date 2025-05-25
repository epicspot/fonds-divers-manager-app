
import { AyantDroitRepartition, ParametresRepartition } from "@/types/repartition";

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

export const calculerPartsFixes = (montantNet: number) => {
  return {
    partTresor: Math.round(montantNet * 0.40),
    partMutuelle: Math.round(montantNet * 0.10),
    partFondsSolidarite: Math.round(montantNet * 0.08),
    partFondsFormation: Math.round(montantNet * 0.07),
    partFondsEquipement: Math.round(montantNet * 0.05),
    partPrimeRendement: Math.round(montantNet * 0.05)
  };
};

export const creerAyantsDroitsFixes = (
  montantNet: number,
  montantTotal: number,
  partFsp: number
): AyantDroitRepartition[] => {
  const parts = calculerPartsFixes(montantNet);
  
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
      pourcentage: 40,
      montantCalcule: parts.partTresor,
      priorite: 1
    },
    {
      id: 'mutuelle',
      nom: 'Mutuelle des Douanes',
      type: 'mutuelle',
      pourcentage: 10,
      montantCalcule: parts.partMutuelle,
      priorite: 2
    },
    {
      id: 'fonds_solidarite',
      nom: 'Fonds de Solidarité',
      type: 'fonds_solidarite',
      pourcentage: 8,
      montantCalcule: parts.partFondsSolidarite,
      priorite: 3
    },
    {
      id: 'fonds_formation',
      nom: 'Fonds de Formation',
      type: 'fonds_formation',
      pourcentage: 7,
      montantCalcule: parts.partFondsFormation,
      priorite: 4
    },
    {
      id: 'fonds_equipement',
      nom: 'Fonds d\'Équipement',
      type: 'fonds_equipement',
      pourcentage: 5,
      montantCalcule: parts.partFondsEquipement,
      priorite: 5
    },
    {
      id: 'prime_rendement',
      nom: 'Primes de Rendement',
      type: 'prime_rendement',
      pourcentage: 5,
      montantCalcule: parts.partPrimeRendement,
      priorite: 6
    }
  ];
};

export const creerAyantsDroitsPoursuivants = (
  parametres: ParametresRepartition,
  montantNet: number
): AyantDroitRepartition[] => {
  const {
    nombreSaisissants,
    nombreChefs,
    nombreInformateurs = 0,
    saisissants,
    chefs,
    informateurs = []
  } = parametres;

  const montantPoursuivants = Math.round(montantNet * 0.25);
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
