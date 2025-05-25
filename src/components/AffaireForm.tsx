
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  numeroAffaire: z.string().min(1, "Le numéro d'affaire est requis"),
  descriptionAffaire: z.string().min(1, "La description est requise"),
  montantAffaire: z.number().min(1, "Le montant doit être supérieur à 0"),
  partIndicateur: z.number().min(0, "La part indicateur ne peut pas être négative"),
  observations: z.string().optional(),
});

export type AffaireFormData = z.infer<typeof formSchema>;

interface AffaireFormProps {
  onSubmit: (data: AffaireFormData) => void;
  form: ReturnType<typeof useForm<AffaireFormData>>;
}

export const AffaireForm = ({ onSubmit, form }: AffaireFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="numeroAffaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro d'Affaire</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: AFF-2024-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="montantAffaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant de l'Affaire (FCFA)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Montant en FCFA"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descriptionAffaire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description de l'Affaire</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description détaillée de l'affaire..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="partIndicateur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Part Indicateur (FCFA)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Part indicateur"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observations (Optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observations particulières..."
                  className="min-h-[60px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export { formSchema };
