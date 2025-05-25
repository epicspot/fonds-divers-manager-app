
export interface AyantDroit {
  nom: string;
  montant: number;
}

export interface Dossier {
  numeroRepartition: string;
  montantAffaire: number;
  partIndicateur: number;
  montantNet: number;
  partFsp: number;
  ayantsDroits: AyantDroit[];
  dateCreation: string;
}

export const genererNumeroRepartition = (): string => {
  const annee = new Date().getFullYear();
  const dossiers = obtenirDossiers();
  const dossiersAnnee = dossiers.filter(d => 
    d.numeroRepartition.startsWith(`GRP-${annee}-`)
  );
  
  const prochainNumero = dossiersAnnee.length + 1;
  return `GRP-${annee}-${prochainNumero.toString().padStart(3, '0')}`;
};

export const calculerMontantNet = (montantAffaire: number, partIndicateur: number) => {
  const tauxFsp = montantAffaire < 500000 ? 0.05 : 0.045;
  const partFsp = montantAffaire * tauxFsp;
  const montantNet = montantAffaire - partIndicateur - partFsp;
  
  return {
    partFsp: Math.round(partFsp),
    montantNet: Math.round(montantNet)
  };
};

export const sauvegarderDossier = (dossier: Dossier): void => {
  const dossiers = obtenirDossiers();
  dossiers.push(dossier);
  localStorage.setItem('fondsdivers_dossiers', JSON.stringify(dossiers));
};

export const obtenirDossiers = (): Dossier[] => {
  const dossiersStr = localStorage.getItem('fondsdivers_dossiers');
  return dossiersStr ? JSON.parse(dossiersStr) : [];
};

export const supprimerDossier = (numeroRepartition: string): void => {
  const dossiers = obtenirDossiers();
  const nouveauxDossiers = dossiers.filter(d => d.numeroRepartition !== numeroRepartition);
  localStorage.setItem('fondsdivers_dossiers', JSON.stringify(nouveauxDossiers));
};
