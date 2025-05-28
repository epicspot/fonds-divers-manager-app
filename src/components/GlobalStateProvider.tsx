
import React from 'react';
import { GlobalStateContext } from '@/hooks/useGlobalState';
import { useRegions } from '@/hooks/useRegions';
import { usePersonnel } from '@/hooks/usePersonnel';
import { useReferences } from '@/hooks/useReferences';

interface GlobalStateProviderProps {
  children: React.ReactNode;
}

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const regions = useRegions();
  const personnel = usePersonnel();
  const references = useReferences();

  return (
    <GlobalStateContext.Provider value={{ regions, personnel, references }}>
      {children}
    </GlobalStateContext.Provider>
  );
}
