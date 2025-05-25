
export interface AffaireContentieuse {
  id: string;
  numeroAffaire: string;
  dateAffaire: string;
  descriptionAffaire: string;
  montantAffaire: number;
  partIndicateur: number;
  montantNet: number;
  partFsp: number;
  
  // Répartitions principales
  partSyndicats: number;
  partMutuelle: number;
  partPoursuivants: number;
  
  // Fonds spécialisés
  fondsSolidarite: number;
  fondsMedical: number;
  fondsOeuvresSociales: number;
  fondsFormation: number;
  fondsEquipement: number;
  
  // Autres parts
  partAssurance: number;
  partFraisGeneraux: number;
  partReserves: number;
  
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
