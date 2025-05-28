
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useGlobalState } from '@/hooks/useGlobalState';

interface RegionBureauSelectorProps {
  selectedRegionId?: string;
  selectedBureauId?: string;
  onRegionChange: (regionId: string) => void;
  onBureauChange: (bureauId: string) => void;
  showBureau?: boolean;
  required?: boolean;
}

export function RegionBureauSelector({
  selectedRegionId,
  selectedBureauId,
  onRegionChange,
  onBureauChange,
  showBureau = true,
  required = false
}: RegionBureauSelectorProps) {
  const { regions } = useGlobalState();
  const [currentRegionId, setCurrentRegionId] = useState(selectedRegionId || '');

  const handleRegionChange = (regionId: string) => {
    setCurrentRegionId(regionId);
    onRegionChange(regionId);
    // Reset bureau selection when region changes
    if (showBureau) {
      onBureauChange('');
    }
  };

  const availableBureaux = currentRegionId 
    ? regions.getBureauxByRegion(currentRegionId)
    : [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="region">Région {required && '*'}</Label>
        <Select value={currentRegionId} onValueChange={handleRegionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une région" />
          </SelectTrigger>
          <SelectContent>
            {regions.regions.map((region) => (
              <SelectItem key={region.id} value={region.id}>
                {region.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showBureau && currentRegionId && (
        <div className="space-y-2">
          <Label htmlFor="bureau">Bureau {required && '*'}</Label>
          <Select value={selectedBureauId} onValueChange={onBureauChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un bureau" />
            </SelectTrigger>
            <SelectContent>
              {availableBureaux.map((bureau) => (
                <SelectItem key={bureau.id} value={bureau.id}>
                  {bureau.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
