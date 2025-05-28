
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormActions } from "./FormActions";
import { ObservationsField } from "./ObservationsField";
import { useAffaireEditForm } from "./useAffaireEditForm";
import { useAffaireUpdate } from "./useAffaireUpdate";
import { AffaireContentieuse } from "@/types/affaire";
import { InformationsBaseForm } from "../forms/InformationsBaseForm";
import { BureauPosteForm } from "../forms/BureauPosteForm";
import { DeclarationForm } from "../forms/DeclarationForm";
import { ContrevenantForm } from "../forms/ContrevenantForm";
import { TransportMarchandisesForm } from "../forms/TransportMarchandisesForm";
import { SucrerieForm } from "../forms/SucrerieForm";
import { ValeursDroitsForm } from "../forms/ValeursDroitsForm";
import { TransactionForm } from "../forms/TransactionForm";
import { SaisissantIntervenantsForm } from "../forms/SaisissantIntervenantsForm";

interface ModifierAffaireProps {
  affaire: AffaireContentieuse | null;
  isOpen: boolean;
  onClose: () => void;
  onAffaireModifiee: () => void;
}

export const ModifierAffaire = ({ 
  affaire, 
  isOpen, 
  onClose, 
  onAffaireModifiee 
}: ModifierAffaireProps) => {
  const { form, resetForm } = useAffaireEditForm(affaire);
  const { onUpdate, isUpdating } = useAffaireUpdate({
    onAffaireModifiee,
    onClose,
    resetForm
  });

  const handleSubmit = (values: any) => {
    if (affaire) {
      onUpdate(affaire.id, values);
    }
  };

  if (!affaire) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[95vh] overflow-hidden flex flex-col p-3">
        <DialogHeader className="pb-1 flex-shrink-0">
          <DialogTitle className="text-sm font-medium">Modifier l'Affaire {affaire.numeroAffaire}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full flex flex-col">
              <Tabs defaultValue="generale" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-5 h-8">
                  <TabsTrigger value="generale" className="text-xs">Générale</TabsTrigger>
                  <TabsTrigger value="declaration" className="text-xs">Déclaration</TabsTrigger>
                  <TabsTrigger value="marchandises" className="text-xs">Marchandises</TabsTrigger>
                  <TabsTrigger value="valeurs" className="text-xs">Valeurs</TabsTrigger>
                  <TabsTrigger value="finalisation" className="text-xs">Finalisation</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 overflow-y-auto mt-2">
                  <TabsContent value="generale" className="space-y-2 m-0">
                    <InformationsBaseForm form={form} />
                    <BureauPosteForm form={form} />
                    <ContrevenantForm form={form} />
                  </TabsContent>

                  <TabsContent value="declaration" className="space-y-2 m-0">
                    <DeclarationForm form={form} />
                    <TransportMarchandisesForm form={form} />
                  </TabsContent>

                  <TabsContent value="marchandises" className="space-y-2 m-0">
                    <SucrerieForm form={form} />
                  </TabsContent>

                  <TabsContent value="valeurs" className="space-y-2 m-0">
                    <ValeursDroitsForm form={form} />
                    <TransactionForm form={form} />
                  </TabsContent>

                  <TabsContent value="finalisation" className="space-y-2 m-0">
                    <SaisissantIntervenantsForm form={form} />
                    <ObservationsField form={form} />
                  </TabsContent>
                </div>
              </Tabs>
              
              <div className="pt-2 border-t flex-shrink-0">
                <FormActions 
                  onCancel={onClose} 
                  isSubmitting={isUpdating}
                  submitText="Mettre à jour"
                />
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
