
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
