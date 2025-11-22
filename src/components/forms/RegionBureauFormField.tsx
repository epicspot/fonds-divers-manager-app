
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useRegions } from "@/hooks/useRegions";
import { useBureauxData } from "@/hooks/useBureauxData";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface RegionBureauFormFieldProps {
  form: UseFormReturn<any>;
}

export const RegionBureauFormField = ({ form }: RegionBureauFormFieldProps) => {
  const { regions } = useRegions();
  const { bureaux, chargerBureauxParRegion } = useBureauxData();
  const { profile } = useUserProfile();
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [isFromProfile, setIsFromProfile] = useState(false);

  const regionValue = form.watch("regionDgd");
  
  useEffect(() => {
    if (regionValue && regionValue.length > 0) {
      const regionId = regionValue[0];
      setSelectedRegion(regionId);
      chargerBureauxParRegion(regionId);
      
      // Vérifier si la valeur provient du profil
      if (profile?.region_id === regionId) {
        setIsFromProfile(true);
      }
    }
  }, [regionValue, chargerBureauxParRegion, profile]);

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    form.setValue("regionDgd", [regionId]);
    form.setValue("bureauPoste", []);
    chargerBureauxParRegion(regionId);
    setIsFromProfile(false);
  };

  const handleBureauChange = (bureauId: string) => {
    form.setValue("bureauPoste", [bureauId]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name="regionDgd"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel className="text-xs">Région DGD</FormLabel>
              {isFromProfile && (
                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                  Profil
                </Badge>
              )}
            </div>
            <FormControl>
              <Select 
                onValueChange={handleRegionChange}
                value={selectedRegion}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Sélectionnez une région" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bureauPoste"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel className="text-xs">Bureau/Poste</FormLabel>
              {isFromProfile && profile?.bureau_id && field.value?.[0] === profile.bureau_id && (
                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                  Profil
                </Badge>
              )}
            </div>
            <FormControl>
              <Select 
                onValueChange={handleBureauChange}
                value={field.value?.[0] || ""}
                disabled={!selectedRegion}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder={selectedRegion ? "Sélectionnez un bureau" : "Sélectionnez d'abord une région"} />
                </SelectTrigger>
                <SelectContent>
                  {bureaux.map((bureau) => (
                    <SelectItem key={bureau.id} value={bureau.id}>
                      {bureau.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
