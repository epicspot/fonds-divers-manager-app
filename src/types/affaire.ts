
export interface AffaireContentieuse {
  id: string;
  numeroAffaire: string;
  dateAffaire: string;
  descriptionAffaire: string;
  montantAffaire: number;
  partIndicateur: number;
  
  // Informations du bureau/poste
  regionDgd?: string;
  bureauPoste?: string;
  
  // Informations de la déclaration
  numeroDeclaration?: string;
  dateDeclaration?: string;
  
  // Informations du contrevenant
  nomPrenomContrevenant?: string;
  adresseComplete?: string;
  ifu?: string;
  
  // Transport et marchandises
  natureTransport?: string;
  identificationTransport?: string;
  commissionnaireDouane?: string;
  procedureDetectionFraude?: string;
  natureMarchandisesFraude?: string;
  
  // Sucrerie
  origineProvenance?: string;
  poidsKg?: number;
  
  // Valeurs et droits
  valeurMarchandisesLitigieuses?: number;
  natureInfraction?: string;
  droitsCompromis?: number;
  numeroQuittanceDate?: string;
  nombreInformateurs?: number;
  
  // Transaction
  suiteAffaire?: string; // justice ou transaction
  dateTransaction?: string;
  montantAmende?: number;
  montantVente?: number;
  numeroQuittanceDateTransaction?: string;
  montantTotalFrais?: number;
  produitNetRepartir?: number;
  nomsChefs?: string[]; // Changed to array
  
  // Saisissant et intervenants
  nomsSaisissant?: string[]; // Changed to array
  nomsIntervenants?: string[]; // Changed to array
  dateRepartition?: string;
  numeroBordereauRatification?: string;
  circonstancesParticulieres?: string;
  
  // Additional fields from the table
  natureNombrePieces?: string[]; // Changed to array
  suiteReserveeMarchandises?: string[]; // Changed to array
  detailsFrais?: string[]; // Changed to array
  
  ayantsDroits: AyantDroitAffaire[];
  statut: 'brouillon' | 'validee' | 'en_repartition';
  observations?: string;
  dateCreation: string;
  dateValidation?: string;
}

export interface AyantDroitAffaire {
  nom: string;
  typeAyantDroit: 'syndicat' | 'mutuelle' | 'poursuivant' | 'autre';
  montant: number;
  pourcentage?: number;
}
