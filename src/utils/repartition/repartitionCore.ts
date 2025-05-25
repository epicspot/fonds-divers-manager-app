
import { ParametresRepartition, ResultatRepartition } from "@/types/repartition";
import { 
  calculerPartFsp, 
  calculerMontantNet, 
  calculerPartsFixes,
  creerAyantsDroitsFixes,
  creerAyantsDroitsPoursuivants
} from "./repartitionCalculations";

export const repartirMontants = (parametres: ParametresRepartition): ResultatRepartition => {
  const {
    montantAffaire,
    montantAmende = 0,
    montantVente = 0,
    fraisDivers = 0
  } = parametres;

  const erreurs: string[] = [];

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

  // Calcul des parts fixes
  const partsFixes = calculerPartsFixes(montantNet);
  
  // Création des ayants droits fixes
  const ayantsDroitsFixes = creerAyantsDroitsFixes(montantNet, montantTotal, partFsp);
  
  // Création des ayants droits poursuivants
  const ayantsDroitsPoursuivants = creerAyantsDroitsPoursuivants(parametres, montantNet);
  
  // Combinaison de tous les ayants droits
  const ayantsDroits = [...ayantsDroitsFixes, ...ayantsDroitsPoursuivants];

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
    partTresor: partsFixes.partTresor,
    partMutuelle: partsFixes.partMutuelle,
    partFondsSolidarite: partsFixes.partFondsSolidarite,
    partFondsFormation: partsFixes.partFondsFormation,
    partFondsEquipement: partsFixes.partFondsEquipement,
    partPrimeRendement: partsFixes.partPrimeRendement,
    ayantsDroits: ayantsDroits.sort((a, b) => a.priorite - b.priorite),
    verificationsOk: erreurs.length === 0,
    erreurs
  };
};
