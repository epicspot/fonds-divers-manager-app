
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

export const FormHeader = () => {
  return (
    <DialogTrigger asChild>
      <Button className="mb-6">
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle Affaire Contentieuse
      </Button>
    </DialogTrigger>
  );
};
