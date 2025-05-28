
import { AffaireContentieuse } from '@/types/affaire';

export const genererFicheSynthese = (affaire: AffaireContentieuse): string => {
  const date = new Date().toLocaleDateString('fr-FR');
  
  let fiche = `FICHE DE SYNTHÈSE - ${affaire.numeroAffaire}\n`;
  fiche += `==========================================\n\n`;
  
  fiche += `RÉSUMÉ EXÉCUTIF:\n`;
  fiche += `Affaire n°${affaire.numeroAffaire} du ${new Date(affaire.dateAffaire).toLocaleDateString('fr-FR')}\n`;
  fiche += `Montant en jeu: ${affaire.montantAffaire.toLocaleString()} FCFA\n`;
  fiche += `Statut actuel: ${affaire.statut.toUpperCase()}\n\n`;
  
  fiche += `DESCRIPTION:\n`;
  fiche += `${affaire.descriptionAffaire}\n\n`;
  
  if (affaire.natureInfraction?.length) {
    fiche += `NATURE DE L'INFRACTION:\n`;
    fiche += `${affaire.natureInfraction.join(', ')}\n\n`;
  }
  
  if (affaire.nomsSaisissant?.length) {
    fiche += `ÉQUIPE INTERVENANTE:\n`;
    fiche += `- Saisissants: ${affaire.nomsSaisissant.join(', ')}\n`;
    if (affaire.nomsChefs?.length) {
      fiche += `- Chefs: ${affaire.nomsChefs.join(', ')}\n`;
    }
    if (affaire.nomsIntervenants?.length) {
      fiche += `- Intervenants: ${affaire.nomsIntervenants.join(', ')}\n`;
    }
    fiche += `\n`;
  }
  
  if (affaire.suiteAffaire === 'transaction' && affaire.produitNetRepartir) {
    fiche += `RÉSULTAT FINANCIER:\n`;
    fiche += `Produit net à répartir: ${affaire.produitNetRepartir.toLocaleString()} FCFA\n\n`;
  }
  
  fiche += `RECOMMANDATIONS:\n`;
  if (affaire.statut === 'brouillon') {
    fiche += `- Finaliser la saisie et valider le dossier\n`;
  } else if (affaire.statut === 'validee') {
    fiche += `- Procéder à la répartition des montants\n`;
  } else {
    fiche += `- Dossier en cours de traitement\n`;
  }
  
  fiche += `\nDocument généré le ${date}`;
  
  return fiche;
};
