
import { UseFormReturn } from "react-hook-form";
import { InformationsBaseForm } from "../forms/InformationsBaseForm";
import { BureauPosteForm } from "../forms/BureauPosteForm";
import { DeclarationForm } from "../forms/DeclarationForm";
import { ContrevenantForm } from "../forms/ContrevenantForm";
import { TransportMarchandisesForm } from "../forms/TransportMarchandisesForm";
import { SucrerieForm } from "../forms/SucrerieForm";
import { ValeursDroitsForm } from "../forms/ValeursDroitsForm";
import { TransactionForm } from "../forms/TransactionForm";
import { SaisissantIntervenantsForm } from "../forms/SaisissantIntervenantsForm";

interface FormSectionsProps {
  form: UseFormReturn<any>;
}

export const FormSections = ({ form }: FormSectionsProps) => {
  return (
    <div className="space-y-2">
      <InformationsBaseForm form={form} />
      <BureauPosteForm form={form} />
      <DeclarationForm form={form} />
      <ContrevenantForm form={form} />
      <TransportMarchandisesForm form={form} />
      <SucrerieForm form={form} />
      <ValeursDroitsForm form={form} />
      <TransactionForm form={form} />
      <SaisissantIntervenantsForm form={form} />
    </div>
  );
};
