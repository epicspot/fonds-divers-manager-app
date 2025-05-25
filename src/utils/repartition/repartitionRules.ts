
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

// Règles métier pour la répartition selon le tableau détaillé
export const REGLES_REPARTITION: Record<string, RegleRepartition> = {
  fsp: {
    type: 'fsp',
    pourcentageBase: 5, // 5% pour montants < 500k, 4.5% pour >= 500k
    pourcentageMax: 5,
    conditions: { montantMin: 0 }
  },
  tresor: {
    type: 'tresor',
    pourcentageBase: 40, // 40% du montant net
    pourcentageMax: 40
  },
  mutuelle: {
    type: 'mutuelle',
    pourcentageBase: 10, // 10% pour la Mutuelle des Douanes
    pourcentageMax: 10
  },
  poursuivants: {
    type: 'poursuivants',
    pourcentageBase: 25, // 25% réparti entre les poursuivants
    pourcentageMax: 30,
    conditions: { nombrePersonnes: 1 }
  },
  fonds_solidarite: {
    type: 'fonds_solidarite',
    pourcentageBase: 8, // 8% pour le Fonds de Solidarité
    pourcentageMax: 10
  },
  fonds_formation: {
    type: 'fonds_formation',
    pourcentageBase: 7, // 7% pour le Fonds de Formation
    pourcentageMax: 10
  },
  fonds_equipement: {
    type: 'fonds_equipement',
    pourcentageBase: 5, // 5% pour le Fonds d'Équipement
    pourcentageMax: 8
  },
  prime_rendement: {
    type: 'prime_rendement',
    pourcentageBase: 5, // 5% pour les Primes de Rendement
    pourcentageMax: 7
  }
};
