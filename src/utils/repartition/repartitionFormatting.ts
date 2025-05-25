
import { ResultatRepartition } from "@/types/repartition";

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
