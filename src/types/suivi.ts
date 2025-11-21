
export interface ActionSuivi {
  id: string;
  affaireId: string;
  type: 'transmission' | 'validation' | 'rejet' | 'modification' | 'approbation' | 'creation';
  statut: 'en_cours' | 'termine' | 'rejete';
  utilisateur: string;
  commentaire?: string;
  dateAction: string;
  delaiPrevu?: number; // en jours
  dateEcheance?: string;
}

export interface SuiviHierarchique {
  affaireId: string;
  numeroAffaire: string;
  statutActuel: string;
  dateTransmission?: string;
  dateValidation?: string;
  delaiTransmission?: number;
  responsableActuel?: string;
  actions: ActionSuivi[];
}

export interface NotificationSuivi {
  id: string;
  affaireId: string;
  type: 'retard' | 'echeance' | 'validation_requise';
  message: string;
  dateCreation: string;
  lu: boolean;
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
}
