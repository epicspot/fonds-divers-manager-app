
import { useRegionsData } from './useRegionsData';
import { useBureauxData } from './useBureauxData';

export function useRegions() {
  const regionsData = useRegionsData();
  const bureauxData = useBureauxData();

  const refetch = async () => {
    await Promise.all([regionsData.refetch(), bureauxData.refetch()]);
  };

  return {
    // Regions
    regions: regionsData.regions,
    createRegion: regionsData.createRegion,
    updateRegion: regionsData.updateRegion,
    deleteRegion: regionsData.deleteRegion,
    getRegionById: regionsData.getRegionById,

    // Bureaux
    bureaux: bureauxData.bureaux,
    createBureau: bureauxData.createBureau,
    updateBureau: bureauxData.updateBureau,
    deleteBureau: bureauxData.deleteBureau,
    getBureauById: bureauxData.getBureauById,
    getBureauxByRegion: bureauxData.getBureauxByRegion,

    // Combined
    loading: regionsData.loading || bureauxData.loading,
    refetch
  };
}

// Re-export types for backward compatibility
export type { Region, Bureau } from '@/types/regions';
