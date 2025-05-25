
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface BureauPosteFormProps {
  form: UseFormReturn<any>;
}

export const BureauPosteForm = ({ form }: BureauPosteFormProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Bureau/Poste</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="regionDgd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Région/DGD</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Bureau du Poste</FormLabel>
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
