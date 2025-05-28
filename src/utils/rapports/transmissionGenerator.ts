
import { AffaireContentieuse } from '@/types/affaire';

export const genererRapportTransmission = (affaire: AffaireContentieuse): string => {
  const date = new Date().toLocaleDateString('fr-FR');
  
  let rapport = `RAPPORT DE TRANSMISSION\n`;
  rapport += `========================\n\n`;
  
  rapport += `À: Direction Générale des Douanes\n`;
  rapport += `De: ${affaire.regionDgd?.join(', ') || 'Non spécifié'}\n`;
  rapport += `Date: ${date}\n`;
  rapport += `Objet: Transmission dossier contentieux n°${affaire.numeroAffaire}\n\n`;
  
  rapport += `Monsieur le Directeur Général,\n\n`;
  
  rapport += `J'ai l'honneur de vous transmettre ci-joint le dossier de l'affaire contentieuse `;
  rapport += `n°${affaire.numeroAffaire} en date du ${new Date(affaire.dateAffaire).toLocaleDateString('fr-FR')}.\n\n`;
  
  rapport += `DÉTAILS DE L'AFFAIRE:\n`;
  rapport += `- Référence: ${affaire.numeroReference}\n`;
  rapport += `- Description: ${affaire.descriptionAffaire}\n`;
  rapport += `- Montant en cause: ${affaire.montantAffaire.toLocaleString()} FCFA\n`;
  
  if (affaire.nomPrenomContrevenant) {
    rapport += `- Contrevenant: ${affaire.nomPrenomContrevenant}\n`;
  }
  
  if (affaire.natureInfraction?.length) {
    rapport += `- Nature infraction: ${affaire.natureInfraction.join(', ')}\n`;
  }
  
  rapport += `\nSUITE PROPOSÉE:\n`;
  if (affaire.suiteAffaire) {
    rapport += `- ${affaire.suiteAffaire.toUpperCase()}\n`;
    if (affaire.montantAmende) {
      rapport += `- Montant amende proposé: ${affaire.montantAmende.toLocaleString()} FCFA\n`;
    }
  } else {
    rapport += `- À déterminer selon vos instructions\n`;
  }
  
  rapport += `\nJe sollicite vos instructions pour la suite à donner à cette affaire.\n\n`;
  
  rapport += `Je vous prie d'agréer, Monsieur le Directeur Général, l'expression de ma `;
  rapport += `très haute considération.\n\n`;
  
  rapport += `Le Chef de ${affaire.regionDgd?.join(', ') || 'la Région'}\n\n`;
  
  rapport += `PJ: Dossier complet de l'affaire`;
  
  return rapport;
};
