
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface FiltresAffairesProps {
  recherche: string;
  setRecherche: (value: string) => void;
  filtreStatut: string;
  setFiltreStatut: (value: string) => void;
}

export const FiltresAffaires = ({ recherche, setRecherche, filtreStatut, setFiltreStatut }: FiltresAffairesProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher par numéro, description ou contrevenant..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filtreStatut} onValueChange={setFiltreStatut}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tous">Tous les statuts</SelectItem>
          <SelectItem value="brouillon">Brouillon</SelectItem>
          <SelectItem value="validee">Validée</SelectItem>
          <SelectItem value="en_attente_hierarchie">En Attente Hiérarchie</SelectItem>
          <SelectItem value="en_repartition">En Répartition</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
