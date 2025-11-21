import { TableauSuiviHierarchique } from "@/components/suivi/TableauSuiviHierarchique";
import { useAffairesSupabase } from "@/hooks/useAffairesSupabase";

export const SuiviHierarchique = () => {
  const { affaires, chargerAffaires, isLoading } = useAffairesSupabase();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-lg text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <TableauSuiviHierarchique 
        affaires={affaires}
        onRefresh={chargerAffaires}
      />
    </div>
  );
};
