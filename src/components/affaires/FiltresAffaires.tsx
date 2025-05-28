
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface FiltresAffairesProps {
  recherche: string;
  setRecherche: (value: string) => void;
  filtreStatut: string;
  setFiltreStatut: (value: string) => void;
}

export const FiltresAffaires = ({ 
  recherche, 
  setRecherche, 
  filtreStatut, 
  setFiltreStatut 
}: FiltresAffairesProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher par numéro, description ou contrevenant..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="tous">Tous les statuts</option>
          <option value="brouillon">Brouillon</option>
          <option value="validee">Validée</option>
          <option value="en_repartition">En Répartition</option>
        </select>
      </div>
    </div>
  );
};
