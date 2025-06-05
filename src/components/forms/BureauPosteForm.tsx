
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { RegionBureauFormField } from "./RegionBureauFormField";

interface BureauPosteFormProps {
  form: UseFormReturn<any>;
}

export const BureauPosteForm = ({ form }: BureauPosteFormProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Informations Bureau/Poste</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <RegionBureauFormField form={form} />
        </div>
      </CardContent>
    </Card>
  );
};
