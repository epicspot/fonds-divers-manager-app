
import { createContext, useContext } from 'react';
import { useRegions } from './useRegions';
import { usePersonnel } from './usePersonnel';
import { useReferences } from './useReferences';

interface GlobalStateContextType {
  regions: ReturnType<typeof useRegions>;
  personnel: ReturnType<typeof usePersonnel>;
  references: ReturnType<typeof useReferences>;
}

const GlobalStateContext = createContext<GlobalStateContextType | null>(null);

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

export { GlobalStateContext };
