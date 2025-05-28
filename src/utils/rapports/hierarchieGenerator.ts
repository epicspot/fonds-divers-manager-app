
import { AffaireContentieuse } from '@/types/affaire';

export const genererRapportHierarchie = (affaire: AffaireContentieuse): string => {
  const date = new Date().toLocaleDateString('fr-FR');
  
  let rapport = `RAPPORT HIÉRARCHIQUE\n`;
  rapport += `=====================\n\n`;
  
  rapport += `AFFAIRE N°: ${affaire.numeroAffaire}\n`;
  rapport += `DATE: ${date}\n`;
  rapport += `RÉGION: ${affaire.regionDgd?.join(', ') || 'Non spécifié'}\n\n`;
  
  rapport += `CONTEXTE:\n`;
  rapport += `${affaire.descriptionAffaire}\n\n`;
  
  rapport += `FAITS CONSTATÉS:\n`;
  if (affaire.natureInfraction?.length) {
    rapport += `- Infractions: ${affaire.natureInfraction.join(', ')}\n`;
  }
  if (affaire.natureMarchandisesFraude) {
    rapport += `- Marchandises: ${affaire.natureMarchandisesFraude}\n`;
  }
  if (affaire.valeurMarchandisesLitigieuses) {
    rapport += `- Valeur litigieuse: ${affaire.valeurMarchandisesLitigieuses.toLocaleString()} FCFA\n`;
  }
  if (affaire.droitsCompromis) {
    rapport += `- Droits compromis: ${affaire.droitsCompromis.toLocaleString()} FCFA\n`;
  }
  
  rapport += `\nPROCÉDURE SUIVIE:\n`;
  if (affaire.procedureDetectionFraude?.length) {
    rapport += `- Détection: ${affaire.procedureDetectionFraude.join(', ')}\n`;
  }
  if (affaire.nomsSaisissant?.length) {
    rapport += `- Agents saisissants: ${affaire.nomsSaisissant.join(', ')}\n`;
  }
  if (affaire.nomsChefs?.length) {
    rapport += `- Encadrement: ${affaire.nomsChefs.join(', ')}\n`;
  }
  
  rapport += `\nPROPOSITION:\n`;
  if (affaire.suiteAffaire === 'transaction') {
    rapport += `Transaction amiable proposée\n`;
    if (affaire.montantAmende) {
      rapport += `Montant: ${affaire.montantAmende.toLocaleString()} FCFA\n`;
    }
  } else if (affaire.suiteAffaire === 'justice') {
    rapport += `Poursuite judiciaire recommandée\n`;
  } else {
    rapport += `Suite à déterminer\n`;
  }
  
  if (affaire.observations) {
    rapport += `\nOBSERVATIONS:\n`;
    rapport += `${affaire.observations}\n`;
  }
  
  if (affaire.circonstancesParticulieres) {
    rapport += `\nCIRCONSTANCES PARTICULIÈRES:\n`;
    rapport += `${affaire.circonstancesParticulieres}\n`;
  }
  
  rapport += `\nCONCLUSION:\n`;
  rapport += `Dossier transmis pour validation et instructions.\n\n`;
  
  rapport += `Établi le ${date}\n`;
  rapport += `Pour validation hiérarchique`;
  
  return rapport;
};
