
import { AffaireContentieuse } from '@/types/affaire';

export const genererBordereauAffaire = (affaire: AffaireContentieuse): string => {
  const date = new Date().toLocaleDateString('fr-FR');
  
  let bordereau = `BORDEREAU D'AFFAIRE CONTENTIEUSE - ${date}\n`;
  bordereau += `=============================================\n\n`;
  
  bordereau += `INFORMATIONS GÉNÉRALES:\n`;
  bordereau += `- Numéro d'affaire: ${affaire.numeroAffaire}\n`;
  bordereau += `- Numéro de référence: ${affaire.numeroReference}\n`;
  bordereau += `- Date de l'affaire: ${new Date(affaire.dateAffaire).toLocaleDateString('fr-FR')}\n`;
  bordereau += `- Description: ${affaire.descriptionAffaire}\n`;
  bordereau += `- Montant: ${affaire.montantAffaire.toLocaleString()} FCFA\n`;
  bordereau += `- Statut: ${affaire.statut.toUpperCase()}\n\n`;
  
  if (affaire.regionDgd?.length) {
    bordereau += `RÉGION/BUREAU:\n`;
    bordereau += `- Région: ${affaire.regionDgd.join(', ')}\n`;
    if (affaire.bureauPoste?.length) {
      bordereau += `- Bureau/Poste: ${affaire.bureauPoste.join(', ')}\n`;
    }
    bordereau += `\n`;
  }
  
  if (affaire.nomPrenomContrevenant) {
    bordereau += `CONTREVENANT:\n`;
    bordereau += `- Nom/Prénom: ${affaire.nomPrenomContrevenant}\n`;
    if (affaire.adresseComplete) {
      bordereau += `- Adresse: ${affaire.adresseComplete}\n`;
    }
    if (affaire.ifu) {
      bordereau += `- IFU: ${affaire.ifu}\n`;
    }
    bordereau += `\n`;
  }
  
  if (affaire.numeroDeclaration) {
    bordereau += `DÉCLARATION:\n`;
    bordereau += `- Numéro: ${affaire.numeroDeclaration}\n`;
    if (affaire.dateDeclaration) {
      bordereau += `- Date: ${new Date(affaire.dateDeclaration).toLocaleDateString('fr-FR')}\n`;
    }
    bordereau += `\n`;
  }
  
  if (affaire.valeurMarchandisesLitigieuses) {
    bordereau += `VALEURS ET DROITS:\n`;
    bordereau += `- Valeur marchandises: ${affaire.valeurMarchandisesLitigieuses.toLocaleString()} FCFA\n`;
    if (affaire.droitsCompromis) {
      bordereau += `- Droits compromis: ${affaire.droitsCompromis.toLocaleString()} FCFA\n`;
    }
    bordereau += `\n`;
  }
  
  if (affaire.suiteAffaire) {
    bordereau += `SUITE DONNÉE:\n`;
    bordereau += `- Type: ${affaire.suiteAffaire.toUpperCase()}\n`;
    if (affaire.montantAmende) {
      bordereau += `- Montant amende: ${affaire.montantAmende.toLocaleString()} FCFA\n`;
    }
    if (affaire.montantVente) {
      bordereau += `- Montant vente: ${affaire.montantVente.toLocaleString()} FCFA\n`;
    }
    bordereau += `\n`;
  }
  
  if (affaire.observations) {
    bordereau += `OBSERVATIONS:\n`;
    bordereau += `${affaire.observations}\n\n`;
  }
  
  bordereau += `Document généré le ${date}\n`;
  bordereau += `Système de Gestion des Affaires Contentieuses`;
  
  return bordereau;
};
