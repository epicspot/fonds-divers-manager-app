
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface TransactionFormProps {
  form: UseFormReturn<any>;
}

export const TransactionForm = ({ form }: TransactionFormProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Transaction</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="suiteAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suite de l'Affaire (Justice ou Transaction)</FormLabel>
              <FormControl>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
              <FormLabel>Date de la Transaction</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>Montant de l'Amende ou de la Vente</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
              <FormLabel>Numéro de Quittance et Date (Transaction)</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Montant Total des Frais</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
              <FormLabel>Produit Net à Répartir</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
              <FormLabel>Noms des Chefs</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
