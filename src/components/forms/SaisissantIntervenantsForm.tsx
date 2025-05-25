
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";

interface SaisissantIntervenantsFormProps {
  form: UseFormReturn<any>;
}

const saisissantOptions = [
  { label: "Agent Amadou Diallo", value: "amadou_diallo" },
  { label: "Agent Fatou Sow", value: "fatou_sow" },
  { label: "Agent Moussa Traoré", value: "moussa_traore" },
  { label: "Agent Aissatou Ba", value: "aissatou_ba" },
  { label: "Agent Omar Ndiaye", value: "omar_ndiaye" },
  { label: "Agent Mariama Cissé", value: "mariama_cisse" },
  { label: "Agent Ibrahima Fall", value: "ibrahima_fall" },
  { label: "Agent Khady Sarr", value: "khady_sarr" },
];

const intervenantsOptions = [
  { label: "Commissaire Priseur Alioune Diouf", value: "alioune_diouf" },
  { label: "Expert Évaluateur Bineta Thiam", value: "bineta_thiam" },
  { label: "Transporteur Mamadou Sy", value: "mamadou_sy" },
  { label: "Gardien Ousmane Kane", value: "ousmane_kane" },
  { label: "Notaire Awa Gueye", value: "awa_gueye" },
  { label: "Huissier Cheikh Diop", value: "cheikh_diop" },
];

const naturePiecesOptions = [
  { label: "Procès-verbal de saisie original", value: "pv_saisie_original" },
  { label: "Procès-verbal de constat d'infraction", value: "pv_constat_infraction" },
  { label: "Factures commerciales (3 exemplaires)", value: "factures_commerciales" },
  { label: "Connaissement maritime", value: "connaissement_maritime" },
  { label: "Lettre de transport aérien (LTA)", value: "lettre_transport_aerien" },
  { label: "Déclaration en douane DU1", value: "declaration_du1" },
  { label: "Permis d'importation DGCE", value: "permis_importation_dgce" },
  { label: "Certificat d'origine", value: "certificat_origine" },
  { label: "Certificat phytosanitaire", value: "certificat_phytosanitaire" },
  { label: "Certificat de conformité ICQC", value: "certificat_conformite_icqc" },
  { label: "Photos des marchandises saisies", value: "photos_marchandises" },
  { label: "Échantillons prélevés", value: "echantillons_preleves" },
  { label: "Rapport d'expertise", value: "rapport_expertise" },
  { label: "Bordereau de transmission", value: "bordereau_transmission" },
];

const suiteReserveeOptions = [
  { label: "Vente aux enchères publiques", value: "vente_encheres_publiques" },
  { label: "Destruction par incinération", value: "destruction_incineration" },
  { label: "Destruction par enfouissement", value: "destruction_enfouissement" },
  { label: "Restitution au propriétaire", value: "restitution_proprietaire" },
  { label: "Conservation en magasin", value: "conservation_magasin" },
  { label: "Donation à œuvre caritative", value: "donation_caritative" },
  { label: "Utilisation service public", value: "utilisation_service_public" },
  { label: "Remise aux forces de sécurité", value: "remise_forces_securite" },
];

export const SaisissantIntervenantsForm = ({ form }: SaisissantIntervenantsFormProps) => {
  const [saisissantOptions, setSaisissantOptions] = useState<{ label: string; value: string }[]>([]);
  const [intervenantsOptions, setIntervenantsOptions] = useState<{ label: string; value: string }[]>([]);
  const [naturePiecesOptions, setNaturePiecesOptions] = useState<{ label: string; value: string }[]>([]);
  const [chefsOptions, setChefsOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    // Charger les saisissants configurés
    const savedSaisissants = localStorage.getItem("saisissants_config");
    if (savedSaisissants) {
      setSaisissantOptions(JSON.parse(savedSaisissants));
    } else {
      // Valeurs par défaut
      setSaisissantOptions([
        { label: "Agent Amadou Diallo", value: "amadou_diallo" },
        { label: "Agent Fatou Sow", value: "fatou_sow" },
        { label: "Agent Moussa Traoré", value: "moussa_traore" },
      ]);
    }

    // Charger les intervenants configurés
    const savedIntervenants = localStorage.getItem("intervenants_config");
    if (savedIntervenants) {
      setIntervenantsOptions(JSON.parse(savedIntervenants));
    } else {
      // Valeurs par défaut
      setIntervenantsOptions([
        { label: "Commissaire Priseur Alioune Diouf", value: "alioune_diouf" },
        { label: "Expert Évaluateur Bineta Thiam", value: "bineta_thiam" },
        { label: "Transporteur Mamadou Sy", value: "mamadou_sy" },
      ]);
    }

    // Charger les pièces configurées
    const savedPieces = localStorage.getItem("pieces_config");
    if (savedPieces) {
      setNaturePiecesOptions(JSON.parse(savedPieces));
    } else {
      // Valeurs par défaut
      setNaturePiecesOptions([
        { label: "Procès-verbal de saisie original", value: "pv_saisie_original" },
        { label: "Procès-verbal de constat d'infraction", value: "pv_constat_infraction" },
        { label: "Factures commerciales (3 exemplaires)", value: "factures_commerciales" },
      ]);
    }

    // Charger les chefs configurés
    const savedChefs = localStorage.getItem("chefs_config");
    if (savedChefs) {
      setChefsOptions(JSON.parse(savedChefs));
    } else {
      // Valeurs par défaut
      setChefsOptions([
        { label: "Chef de Brigade Mamadou Niang", value: "mamadou_niang" },
        { label: "Chef de Service Aminata Diop", value: "aminata_diop" },
        { label: "Chef de Bureau Seydou Camara", value: "seydou_camara" },
      ]);
    }
  }, []);

  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Saisissant et Intervenants</h3>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="nomsSaisissant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Noms du Saisissant (Ayants Droits)</FormLabel>
              <FormControl>
                <MultiSelect
                  options={saisissantOptions}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Sélectionner les agents saisissants..."
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
          name="nomsChefs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Noms des Chefs</FormLabel>
              <FormControl>
                <MultiSelect
                  options={chefsOptions}
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder="Sélectionner les chefs..."
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
                  placeholder="Sélectionner les pièces du dossier..."
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
