import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bureau } from '@/types/regions';
import { bureauxService } from '@/services/bureauxService';

const REGION_USAGE_KEY = 'region_usage_stats';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

interface RegionUsageStats {
  [regionId: string]: number;
}

// Track region usage
const trackRegionUsage = (regionId: string) => {
  try {
    const stats: RegionUsageStats = JSON.parse(localStorage.getItem(REGION_USAGE_KEY) || '{}');
    stats[regionId] = (stats[regionId] || 0) + 1;
    localStorage.setItem(REGION_USAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error tracking region usage:', error);
  }
};

// Get most used regions
const getMostUsedRegions = (limit: number = 3): string[] => {
  try {
    const stats: RegionUsageStats = JSON.parse(localStorage.getItem(REGION_USAGE_KEY) || '{}');
    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([regionId]) => regionId);
  } catch (error) {
    console.error('Error getting most used regions:', error);
    return [];
  }
};

export function useBureauxData() {
  const [bureaux, setBureaux] = useState<Bureau[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { toast } = useToast();
  const cache = useRef<{ data: Bureau[] | null, timestamp: number }>({ data: null, timestamp: 0 });
  const regionCache = useRef<Map<string, { data: Bureau[], timestamp: number }>>(new Map());
  const preloadStarted = useRef(false);

  const fetchBureaux = async (forceRefresh = false) => {
    const now = Date.now();
    
    // Use cache if available and not expired, unless force refresh
    if (!forceRefresh && cache.current.data && (now - cache.current.timestamp) < CACHE_DURATION) {
      setBureaux(cache.current.data);
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    try {
      setLoading(true);
      const data = await bureauxService.fetchAll();
      setBureaux(data);
      // Update cache
      cache.current = { data, timestamp: now };
    } catch (error) {
      console.error('Error fetching bureaux:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les bureaux",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Preload bureaux for a region in background
  const preloadBureauxForRegion = async (regionId: string) => {
    const now = Date.now();
    const cachedRegion = regionCache.current.get(regionId);
    
    // Skip if already cached and fresh
    if (cachedRegion && (now - cachedRegion.timestamp) < CACHE_DURATION) {
      return;
    }

    try {
      const data = await bureauxService.fetchByRegion(regionId);
      regionCache.current.set(regionId, { data, timestamp: now });
      console.log(`Préchargé ${data.length} bureaux pour la région ${regionId}`);
    } catch (error) {
      console.error('Error preloading bureaux for region:', error);
    }
  };

  // Preload most used regions in background
  const preloadMostUsedRegions = async () => {
    const mostUsedRegions = getMostUsedRegions(3);
    
    if (mostUsedRegions.length === 0) return;

    console.log('Préchargement des régions populaires:', mostUsedRegions);
    
    // Preload in background without blocking UI
    await Promise.allSettled(
      mostUsedRegions.map(regionId => preloadBureauxForRegion(regionId))
    );
  };

  const chargerBureauxParRegion = async (regionId: string) => {
    const now = Date.now();
    
    // Track usage for intelligent preloading
    trackRegionUsage(regionId);
    
    // Check region-specific cache
    const cachedRegion = regionCache.current.get(regionId);
    if (cachedRegion && (now - cachedRegion.timestamp) < CACHE_DURATION) {
      setBureaux(cachedRegion.data);
      return;
    }

    try {
      setLoading(true);
      const data = await bureauxService.fetchByRegion(regionId);
      setBureaux(data);
      // Update region cache
      regionCache.current.set(regionId, { data, timestamp: now });
    } catch (error) {
      console.error('Error fetching bureaux by region:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les bureaux de cette région",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createBureau = async (bureau: Omit<Bureau, 'id'>) => {
    try {
      await bureauxService.create(bureau);
      await fetchBureaux(true); // Force refresh after create
      toast({
        title: "Succès",
        description: "Bureau ajouté avec succès"
      });
    } catch (error) {
      console.error('Error creating bureau:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le bureau",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateBureau = async (id: string, updates: Partial<Bureau>) => {
    try {
      await bureauxService.update(id, updates);
      await fetchBureaux(true); // Force refresh after update
      toast({
        title: "Succès",
        description: "Bureau modifié avec succès"
      });
    } catch (error) {
      console.error('Error updating bureau:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le bureau",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteBureau = async (id: string) => {
    try {
      await bureauxService.delete(id);
      await fetchBureaux(true); // Force refresh after delete
      toast({
        title: "Succès",
        description: "Bureau supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting bureau:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le bureau",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getBureauById = (id: string): Bureau | undefined => {
    return bureaux.find(bureau => bureau.id === id);
  };

  const getBureauxByRegion = (regionId: string): Bureau[] => {
    return bureaux.filter(bureau => bureau.region_id === regionId);
  };

  useEffect(() => {
    if (initialLoad) {
      fetchBureaux();
    }
  }, [initialLoad]);

  // Preload most used regions on mount (only once)
  useEffect(() => {
    if (!preloadStarted.current) {
      preloadStarted.current = true;
      // Delay preload to not block initial render
      setTimeout(() => {
        preloadMostUsedRegions();
      }, 1000);
    }
  }, []);

  return {
    bureaux,
    loading,
    createBureau,
    updateBureau,
    deleteBureau,
    refetch: () => fetchBureaux(true),
    chargerBureauxParRegion,
    getBureauById,
    getBureauxByRegion
  };
}
