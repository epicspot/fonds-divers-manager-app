
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { genererNumeroRepartition, calculerMontantNet, sauvegarderDossier, type Dossier } from "@/utils/fondsUtils";
import { toast } from "sonner";
import { AffaireForm, formSchema, type AffaireFormData } from "./AffaireForm";
import { CalculationsDisplay } from "./CalculationsDisplay";
import { AyantsDroitsManager, type AyantDroitForm } from "./AyantsDroitsManager";

interface ModalCreationAffaireProps {
  onAffaireCreee: () => void;
}

export const ModalCreationAffaire = ({ onAffaireCreee }: ModalCreationAffaireProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ayantsDroits, setAyantsDroits] = useState<AyantDroitForm[]>([]);

  const form = useForm<AffaireFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroAffaire: "",
      descriptionAffaire: "",
      montantAffaire: 0,
      partIndicateur: 0,
      observations: "",
    },
  });

  const onSubmit = (values: AffaireFormData) => {
    if (ayantsDroits.length === 0) {
      toast.error("Veuillez ajouter au moins un ayant droit");
      return;
    }

    const totalAyantsDroits = ayantsDroits.reduce((sum, ayant) => sum + ayant.montant, 0);
    const { partFsp, montantNet } = calculerMontantNet(values.montantAffaire, values.partIndicateur);

    if (totalAyantsDroits > montantNet) {
      toast.error("La somme des montants des ayants droits dépasse le montant net disponible");
      return;
    }

    const nouveauDossier: Dossier = {
      numeroRepartition: genererNumeroRepartition(),
      montantAffaire: values.montantAffaire,
      partIndicateur: values.partIndicateur,
      montantNet,
      partFsp,
      ayantsDroits: ayantsDroits.map(ayant => ({
        nom: ayant.nom,
        montant: ayant.montant,
      })),
      dateCreation: new Date().toISOString(),
    };

    sauvegarderDossier(nouveauDossier);
    toast.success("Affaire créée avec succès");

    // Reset du formulaire
    form.reset();
    setAyantsDroits([]);
    setIsOpen(false);
    onAffaireCreee();
  };

  const montantAffaire = form.watch("montantAffaire") || 0;
  const partIndicateur = form.watch("partIndicateur") || 0;
  const { partFsp, montantNet } = calculerMontantNet(montantAffaire, partIndicateur);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Affaire
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Création d'une Nouvelle Affaire</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <AffaireForm onSubmit={onSubmit} form={form} />
          
          <CalculationsDisplay 
            partIndicateur={partIndicateur}
            partFsp={partFsp}
            montantNet={montantNet}
          />

          <AyantsDroitsManager 
            ayantsDroits={ayantsDroits}
            onAyantsDroitsChange={setAyantsDroits}
            montantNet={montantNet}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="button" onClick={form.handleSubmit(onSubmit)}>
              Créer l'Affaire
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
