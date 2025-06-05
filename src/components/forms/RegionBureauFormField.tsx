
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useRegions } from "@/hooks/useRegions";
import { useBureauxData } from "@/hooks/useBureauxData";
import { useState, useEffect } from "react";

interface RegionBureauFormFieldProps {
  form: UseFormReturn<any>;
}

export const RegionBureauFormField = ({ form }: RegionBureauFormFieldProps) => {
  const { regions } = useRegions();
  const { bureaux, chargerBureauxParRegion } = useBureauxData();
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const regionValue = form.watch("regionDgd");
  
  useEffect(() => {
    if (regionValue && regionValue.length > 0) {
      const regionId = regionValue[0];
      setSelectedRegion(regionId);
      chargerBureauxParRegion(regionId);
    }
  }, [regionValue, chargerBureauxParRegion]);

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    form.setValue("regionDgd", [regionId]);
    form.setValue("bureauPoste", []);
    chargerBureauxParRegion(regionId);
  };

  const handleBureauChange = (bureauId: string) => {
    form.setValue("bureauPoste", [bureauId]);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="regionDgd"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Région DGD</FormLabel>
            <FormControl>
              <Select 
                onValueChange={handleRegionChange}
                value={selectedRegion}
              >
                <SelectTrigger>
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
            <FormLabel>Bureau/Poste</FormLabel>
            <FormControl>
              <Select 
                onValueChange={handleBureauChange}
                value={field.value?.[0] || ""}
                disabled={!selectedRegion}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un bureau" />
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
    </>
  );
};
