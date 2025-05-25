
export interface AyantDroitRepartition {
  id: string;
  nom: string;
  type: 'saisissant' | 'chef' | 'informateur' | 'tresor' | 'fsp';
  pourcentage: number;
  montantCalcule: number;
  priorite: number;
}

export interface RegleRepartition {
  type: string;
  pourcentageBase: number;
  pourcentageMax: number;
  conditions?: {
    montantMin?: number;
    montantMax?: number;
    nombrePersonnes?: number;
  };
}

export interface ResultatRepartition {
  montantTotal: number;
  montantNet: number;
  partFsp: number;
  partTresor: number;
  ayantsDroits: AyantDroitRepartition[];
  verificationsOk: boolean;
  erreurs: string[];
}

export interface ParametresRepartition {
  montantAffaire: number;
  montantAmende?: number;
  montantVente?: number;
  fraisDivers?: number;
  nombreSaisissants: number;
  nombreChefs: number;
  nombreInformateurs: number;
  saisissants: string[];
  chefs: string[];
  informateurs?: string[];
}
