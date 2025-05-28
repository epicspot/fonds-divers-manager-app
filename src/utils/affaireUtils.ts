
import { AffaireContentieuse } from "@/types/affaire";

export const genererNumeroAffaire = (): string => {
  const annee = new Date().getFullYear();
  const affaires = obtenirAffaires();
  const affairesAnnee = affaires.filter(a => 
    a.numeroAffaire.startsWith(`AFF-${annee}-`)
  );
  
  const prochainNumero = affairesAnnee.length + 1;
  return `AFF-${annee}-${prochainNumero.toString().padStart(3, '0')}`;
};

export const sauvegarderAffaire = (affaire: AffaireContentieuse): void => {
  const affaires = obtenirAffaires();
  const index = affaires.findIndex(a => a.id === affaire.id);
  
  if (index >= 0) {
    affaires[index] = affaire;
  } else {
    affaires.push(affaire);
  }
  
  localStorage.setItem('affaires_contentieuses', JSON.stringify(affaires));
};

export const obtenirAffaires = (): AffaireContentieuse[] => {
  const affairesStr = localStorage.getItem('affaires_contentieuses');
  return affairesStr ? JSON.parse(affairesStr) : [];
};

export const obtenirAffaire = (id: string): AffaireContentieuse | undefined => {
  const affaires = obtenirAffaires();
  return affaires.find(a => a.id === id);
};

export const validerAffaire = (id: string): void => {
  const affaires = obtenirAffaires();
  const affaire = affaires.find(a => a.id === id);
  
  if (affaire && affaire.statut === 'brouillon') {
    affaire.statut = 'validee';
    affaire.dateValidation = new Date().toISOString();
    localStorage.setItem('affaires_contentieuses', JSON.stringify(affaires));
  }
};

export const supprimerAffaire = (id: string): void => {
  const affaires = obtenirAffaires();
  const nouvelles = affaires.filter(a => a.id !== id);
  localStorage.setItem('affaires_contentieuses', JSON.stringify(nouvelles));
};
