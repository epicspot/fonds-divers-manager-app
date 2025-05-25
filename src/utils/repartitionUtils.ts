
import { RegleRepartition, AyantDroitRepartition, ResultatRepartition, ParametresRepartition } from "@/types/repartition";

// Règles métier pour la répartition
const REGLES_REPARTITION: Record<string, RegleRepartition> = {
  fsp: {
    type: 'fsp',
    pourcentageBase: 5, // 5% pour montants < 500k, 4.5% pour >= 500k
    pourcentageMax: 5,
    conditions: { montantMin: 0 }
  },
  tresor: {
    type: 'tresor',
    pourcentageBase: 50, // 50% du montant net
    pourcentageMax: 50
  },
  saisissants: {
    type: 'saisissants',
    pourcentageBase: 30, // 30% réparti entre les saisissants
    pourcentageMax: 40,
    conditions: { nombrePersonnes: 1 }
  },
  chefs: {
    type: 'chefs',
    pourcentageBase: 15, // 15% réparti entre les chefs
    pourcentageMax: 20,
    conditions: { nombrePersonnes: 1 }
  },
  informateurs: {
    type: 'informateurs',
    pourcentageBase: 5, // 5% réparti entre les informateurs
    pourcentageMax: 10,
    conditions: { nombrePersonnes: 0 }
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
      ayantsDroits: [],
      verificationsOk: false,
      erreurs
    };
  }

  // Part du Trésor (50% du montant net)
  const partTresor = Math.round(montantNet * 0.5);
  const montantARepartir = montantNet - partTresor;

  // Ajout du Trésor
  ayantsDroits.push({
    id: 'tresor',
    nom: 'Trésor Public',
    type: 'tresor',
    pourcentage: 50,
    montantCalcule: partTresor,
    priorite: 1
  });

  // Ajout de la FSP
  ayantsDroits.push({
    id: 'fsp',
    nom: 'Fonds de Soutien aux Politiques (FSP)',
    type: 'fsp',
    pourcentage: (partFsp / montantTotal) * 100,
    montantCalcule: partFsp,
    priorite: 0
  });

  // Répartition du montant restant (50% du montant net)
  let montantRestant = montantARepartir;
  
  // 1. Saisissants (60% du montant à répartir)
  if (nombreSaisissants > 0) {
    const montantSaisissants = Math.round(montantARepartir * 0.6);
    const montantParSaisissant = Math.round(montantSaisissants / nombreSaisissants);
    
    saisissants.forEach((nom, index) => {
      ayantsDroits.push({
        id: `saisissant_${index}`,
        nom: nom,
        type: 'saisissant',
        pourcentage: (montantParSaisissant / montantNet) * 100,
        montantCalcule: montantParSaisissant,
        priorite: 2
      });
    });
    
    montantRestant -= montantSaisissants;
  }

  // 2. Chefs (30% du montant à répartir)
  if (nombreChefs > 0) {
    const montantChefs = Math.round(montantARepartir * 0.3);
    const montantParChef = Math.round(montantChefs / nombreChefs);
    
    chefs.forEach((nom, index) => {
      ayantsDroits.push({
        id: `chef_${index}`,
        nom: nom,
        type: 'chef',
        pourcentage: (montantParChef / montantNet) * 100,
        montantCalcule: montantParChef,
        priorite: 3
      });
    });
    
    montantRestant -= montantChefs;
  }

  // 3. Informateurs (10% du montant à répartir, si présents)
  if (nombreInformateurs > 0 && informateurs.length > 0) {
    const montantInformateurs = Math.round(montantARepartir * 0.1);
    const montantParInformateur = Math.round(montantInformateurs / nombreInformateurs);
    
    informateurs.forEach((nom, index) => {
      ayantsDroits.push({
        id: `informateur_${index}`,
        nom: nom || `Informateur ${index + 1}`,
        type: 'informateur',
        pourcentage: (montantParInformateur / montantNet) * 100,
        montantCalcule: montantParInformateur,
        priorite: 4
      });
    });
    
    montantRestant -= montantInformateurs;
  }

  // Vérifications
  const totalCalcule = ayantsDroits.reduce((sum, ayant) => sum + ayant.montantCalcule, 0);
  const difference = Math.abs(montantTotal - totalCalcule);

  if (difference > 10) { // Tolérance de 10 FCFA pour les arrondis
    erreurs.push(`Écart de répartition détecté: ${difference} FCFA`);
  }

  // Si il reste un montant non réparti, l'attribuer au Trésor
  if (montantRestant > 0) {
    const tresorIndex = ayantsDroits.findIndex(a => a.type === 'tresor');
    if (tresorIndex >= 0) {
      ayantsDroits[tresorIndex].montantCalcule += montantRestant;
    }
  }

  return {
    montantTotal,
    montantNet,
    partFsp,
    partTresor,
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
  
  resultat.ayantsDroits.forEach((ayant, index) => {
    bordereau += `${index + 1}. ${ayant.nom}: ${ayant.montantCalcule.toLocaleString()} FCFA (${ayant.pourcentage.toFixed(2)}%)\n`;
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
