
import { useState, useEffect } from 'react';
import { RegleRepartition } from '@/types/repartition';

const REGLES_PAR_DEFAUT: Record<string, RegleRepartition> = {
  fsp: {
    type: 'fsp',
    pourcentageBase: 5,
    pourcentageMax: 5,
    conditions: { montantMin: 0 }
  },
  tresor: {
    type: 'tresor',
    pourcentageBase: 40,
    pourcentageMax: 40
  },
  mutuelle: {
    type: 'mutuelle',
    pourcentageBase: 10,
    pourcentageMax: 10
  },
  poursuivants: {
    type: 'poursuivants',
    pourcentageBase: 25,
    pourcentageMax: 30,
    conditions: { nombrePersonnes: 1 }
  },
  fonds_solidarite: {
    type: 'fonds_solidarite',
    pourcentageBase: 8,
    pourcentageMax: 10
  },
  fonds_formation: {
    type: 'fonds_formation',
    pourcentageBase: 7,
    pourcentageMax: 10
  },
  fonds_equipement: {
    type: 'fonds_equipement',
    pourcentageBase: 5,
    pourcentageMax: 8
  },
  prime_rendement: {
    type: 'prime_rendement',
    pourcentageBase: 5,
    pourcentageMax: 7
  }
};

export const useReglesRepartition = () => {
  const [regles, setRegles] = useState<Record<string, RegleRepartition>>(REGLES_PAR_DEFAUT);

  useEffect(() => {
    const reglesStockees = localStorage.getItem('regles_repartition');
    if (reglesStockees) {
      setRegles(JSON.parse(reglesStockees));
    }
  }, []);

  const sauvegarderRegle = (cle: string, regle: RegleRepartition) => {
    const nouvellesRegles = { ...regles, [cle]: regle };
    setRegles(nouvellesRegles);
    localStorage.setItem('regles_repartition', JSON.stringify(nouvellesRegles));
  };

  const reinitialiserRegles = () => {
    setRegles(REGLES_PAR_DEFAUT);
    localStorage.setItem('regles_repartition', JSON.stringify(REGLES_PAR_DEFAUT));
  };

  const exporterRegles = () => {
    const dataStr = JSON.stringify(regles, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `regles_repartition_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    regles,
    sauvegarderRegle,
    reinitialiserRegles,
    exporterRegles
  };
};
