
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { UseFormReturn } from "react-hook-form";

interface TransportMarchandisesFormProps {
  form: UseFormReturn<any>;
}

const natureTransportOptions = [
  { label: "Camion", value: "camion" },
  { label: "Voiture particulière", value: "voiture_particuliere" },
  { label: "Moto", value: "moto" },
  { label: "Vélo", value: "velo" },
  { label: "À pied", value: "a_pied" },
  { label: "Bateau", value: "bateau" },
  { label: "Pirogue", value: "pirogue" },
  { label: "Avion", value: "avion" },
  { label: "Train", value: "train" },
  { label: "Autre", value: "autre" },
];

const commissionnaireOptions = [
  { label: "GETMA", value: "getma" },
  { label: "SOBEMAP", value: "sobemap" },
  { label: "MAERSK", value: "maersk" },
  { label: "BOLLORE", value: "bollore" },
  { label: "NECOTRANS", value: "necotrans" },
  { label: "SDV", value: "sdv" },
  { label: "Autre", value: "autre" },
];

const procedureDetectionOptions = [
  { label: "Contrôle routier", value: "controle_routier" },
  { label: "Fouille physique", value: "fouille_physique" },
  { label: "Scanner", value: "scanner" },
  { label: "Renseignement", value: "renseignement" },
  { label: "Dénonciation", value: "denonciation" },
  { label: "Patrouille", value: "patrouille" },
  { label: "Contrôle documentaire", value: "controle_documentaire" },
  { label: "Autre", value: "autre" },
];

export const TransportMarchandisesForm = ({ form }: TransportMarchandisesFormProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Transport et Marchandises</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="natureTransport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nature et Moyen de Transport</FormLabel>
              <FormControl>
                <MultiSelect
                  options={natureTransportOptions}
                  selected={Array.isArray(field.value) ? field.value : (field.value ? [field.value] : [])}
                  onChange={field.onChange}
                  placeholder="Sélectionner le moyen de transport..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="identificationTransport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identification du Moyen de Transport</FormLabel>
              <FormControl>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commissionnaireDouane"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commissionnaire en Douane</FormLabel>
              <FormControl>
                <MultiSelect
                  options={commissionnaireOptions}
                  selected={Array.isArray(field.value) ? field.value : (field.value ? [field.value] : [])}
                  onChange={field.onChange}
                  placeholder="Sélectionner le commissionnaire..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="procedureDetectionFraude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procédé de Détection de la Fraude</FormLabel>
              <FormControl>
                <MultiSelect
                  options={procedureDetectionOptions}
                  selected={Array.isArray(field.value) ? field.value : (field.value ? [field.value] : [])}
                  onChange={field.onChange}
                  placeholder="Sélectionner la procédure..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="natureMarchandisesFraude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nature des Marchandises de Fraude</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
