
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { UseFormReturn } from "react-hook-form";

interface SaisissantIntervenantsFormProps {
  form: UseFormReturn<any>;
}

const saisissantOptions = [
  { label: "Agent des Douanes", value: "agent_douanes" },
  { label: "Brigade Mobile", value: "brigade_mobile" },
  { label: "Service de Renseignement", value: "service_renseignement" },
  { label: "Police Auxiliaire", value: "police_auxiliaire" },
  { label: "Autre", value: "autre" },
];

const intervenantsOptions = [
  { label: "Commissaire Priseur", value: "commissaire_priseur" },
  { label: "Expert Évaluateur", value: "expert_evaluateur" },
  { label: "Transporteur", value: "transporteur" },
  { label: "Gardien", value: "gardien" },
  { label: "Autre", value: "autre" },
];

const naturePiecesOptions = [
  { label: "Procès-verbal de saisie", value: "pv_saisie" },
  { label: "Factures", value: "factures" },
  { label: "Documents de transport", value: "documents_transport" },
  { label: "Permis d'importation", value: "permis_importation" },
  { label: "Certificats", value: "certificats" },
  { label: "Photos", value: "photos" },
  { label: "Autres documents", value: "autres_documents" },
];

const suiteReserveeOptions = [
  { label: "Vente aux enchères", value: "vente_encheres" },
  { label: "Destruction", value: "destruction" },
  { label: "Restitution", value: "restitution" },
  { label: "Conservation", value: "conservation" },
  { label: "Autre", value: "autre" },
];

export const SaisissantIntervenantsForm = ({ form }: SaisissantIntervenantsFormProps) => {
  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Saisissant et Intervenants</h3>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="nomsSaisissant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Noms du Saisissant</FormLabel>
              <FormControl>
                <MultiSelect
                  options={saisissantOptions}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Sélectionner les saisissants..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nomsIntervenants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Noms des Intervenants</FormLabel>
              <FormControl>
                <MultiSelect
                  options={intervenantsOptions}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Sélectionner les intervenants..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="natureNombrePieces"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nature et Nombre des Pièces</FormLabel>
              <FormControl>
                <MultiSelect
                  options={naturePiecesOptions}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Sélectionner les pièces..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="suiteReserveeMarchandises"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suite Réservée aux Marchandises</FormLabel>
              <FormControl>
                <MultiSelect
                  options={suiteReserveeOptions}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Sélectionner les suites..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateRepartition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de Répartition</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numeroBordereauRatification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>N° de Bordereau de Ratification</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="circonstancesParticulieres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Circonstances Particulières à l'Affaire</FormLabel>
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
