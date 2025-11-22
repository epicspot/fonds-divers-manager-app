export interface AffaireContentieuse {
  id: string;
  numeroAffaire: string;
  numeroReference: string;
  dateReference: string;
  dateAffaire: string;
  descriptionAffaire?: string; // Optionnel car peut être vide au brouillon
  montantAffaire: number;
  
  // Informations du bureau/poste
  regionDgd?: string[];
  bureauPoste?: string[];
  
  // Informations de la déclaration
  numeroDeclaration?: string;
  dateDeclaration?: string;
  
  // Informations du contrevenant
  nomPrenomContrevenant?: string;
  adresseComplete?: string;
  ifu?: string;
  
  // Transport et marchandises
  natureTransport?: string[];
  identificationTransport?: string;
  commissionnaireDouane?: string[];
  procedureDetectionFraude?: string[];
  natureMarchandisesFraude?: string;
  
  // Sucrerie
  origineProvenance?: string[];
  poidsKg?: number;
  
  // Valeurs et droits
  valeurMarchandisesLitigieuses?: number;
  natureInfraction?: string[];
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
  nomsChefs?: string[];
  
  // Saisissant et intervenants
  nomsSaisissant?: string[];
  nomsIntervenants?: string[];
  dateRepartition?: string;
  numeroBordereauRatification?: string;
  circonstancesParticulieres?: string;
  
  // Additional fields from the table
  natureNombrePieces?: string[];
  suiteReserveeMarchandises?: string[];
  detailsFrais?: string[];
  
  statut: 'brouillon' | 'validee' | 'en_repartition' | 'en_attente_hierarchie' | 'cloturee';
  observations?: string;
  dateCreation: string;
  dateValidation?: string;
  dateTransmissionHierarchie?: string;
  dateApprobationHierarchie?: string;
  donnees?: Record<string, any>; // Données JSONB supplémentaires
}
