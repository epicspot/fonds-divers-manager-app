import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ParametresRepartition } from "@/types/repartition";
import { toast } from "sonner";

const formSchema = z.object({
  montantAffaire: z.coerce.number().min(0, "Le montant doit être positif"),
  montantAmende: z.coerce.number().min(0, "Le montant doit être positif").optional(),
  montantVente: z.coerce.number().min(0, "Le montant doit être positif").optional(),
  fraisDivers: z.coerce.number().min(0, "Le montant doit être positif").optional(),
  nombreSaisissants: z.coerce.number().int().min(0, "Le nombre doit être positif"),
  nombreChefs: z.coerce.number().int().min(0, "Le nombre doit être positif"),
  nombreInformateurs: z.coerce.number().int().min(0, "Le nombre doit être positif"),
  saisissants: z.string().optional(),
  chefs: z.string().optional(),
  informateurs: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FormulaireManuelParametresProps {
  onParametresValides: (parametres: ParametresRepartition) => void;
}

export const FormulaireManuelParametres = ({ onParametresValides }: FormulaireManuelParametresProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      montantAffaire: 0,
      montantAmende: 0,
      montantVente: 0,
      fraisDivers: 0,
      nombreSaisissants: 0,
      nombreChefs: 0,
      nombreInformateurs: 0,
      saisissants: "",
      chefs: "",
      informateurs: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const parametres: ParametresRepartition = {
      montantAffaire: values.montantAffaire,
      montantAmende: values.montantAmende || 0,
      montantVente: values.montantVente || 0,
      fraisDivers: values.fraisDivers || 0,
      nombreSaisissants: values.nombreSaisissants,
      nombreChefs: values.nombreChefs,
      nombreInformateurs: values.nombreInformateurs,
      saisissants: values.saisissants 
        ? values.saisissants.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : [],
      chefs: values.chefs 
        ? values.chefs.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : [],
      informateurs: values.informateurs 
        ? values.informateurs.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : [],
    };

    onParametresValides(parametres);
    toast.success("Paramètres saisis avec succès");
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Montants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="montantAffaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant de l'affaire *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
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
                    <FormLabel>Montant amende</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="montantVente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant vente</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fraisDivers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frais divers</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nombres de bénéficiaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="nombreSaisissants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de saisissants</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nombreChefs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de chefs</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nombreInformateurs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre d'informateurs</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Noms des bénéficiaires (optionnel)</h3>
            <p className="text-sm text-muted-foreground">Séparez les noms par des virgules</p>
            
            <FormField
              control={form.control}
              name="saisissants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Noms des saisissants</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Nom1, Nom2, Nom3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chefs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Noms des chefs</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Nom1, Nom2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="informateurs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Noms des informateurs</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Nom1, Nom2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Valider les paramètres
          </Button>
        </form>
      </Form>
    </Card>
  );
};
