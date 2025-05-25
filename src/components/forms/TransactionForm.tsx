
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { UseFormReturn } from "react-hook-form";

interface TransactionFormProps {
  form: UseFormReturn<any>;
}

const chefsOptions = [
  { label: "Chef de Brigade", value: "chef_brigade" },
  { label: "Chef de Bureau", value: "chef_bureau" },
  { label: "Chef de Service", value: "chef_service" },
  { label: "Directeur Régional", value: "directeur_regional" },
  { label: "Autre", value: "autre" },
];

const detailsFraisOptions = [
  { label: "Frais de transport", value: "frais_transport" },
  { label: "Frais de stockage", value: "frais_stockage" },
  { label: "Frais d'expertise", value: "frais_expertise" },
  { label: "Frais de justice", value: "frais_justice" },
  { label: "Autres frais", value: "autres_frais" },
];

export const TransactionForm = ({ form }: TransactionFormProps) => {
  return (
    <div className="border-b pb-2">
      <h3 className="text-sm font-semibold mb-2">Transaction</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <FormField
          control={form.control}
          name="suiteAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Suite de l'Affaire</FormLabel>
              <FormControl>
                <select 
                  className="flex h-7 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                  {...field}
                >
                  <option value="">Sélectionner...</option>
                  <option value="justice">Justice</option>
                  <option value="transaction">Transaction</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateTransaction"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Date Transaction</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="h-7 text-xs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="montantAmende"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Montant Amende</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  className="h-7 text-xs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numeroQuittanceDateTransaction"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">N° Quittance</FormLabel>
              <FormControl>
                <Input {...field} className="h-7 text-xs" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="montantTotalFrais"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Total Frais</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  className="h-7 text-xs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="produitNetRepartir"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Produit Net</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  className="h-7 text-xs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nomsChefs"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Noms des Chefs</FormLabel>
              <FormControl>
                <MultiSelect
                  options={chefsOptions}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Sélectionner..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detailsFrais"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs">Détails des Frais</FormLabel>
              <FormControl>
                <MultiSelect
                  options={detailsFraisOptions}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Sélectionner..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
