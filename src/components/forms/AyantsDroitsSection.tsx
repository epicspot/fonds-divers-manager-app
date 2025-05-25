
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AyantDroitForm {
  nom: string;
  typeAyantDroit: 'syndicat' | 'mutuelle' | 'poursuivant' | 'autre';
  montant: number;
}

interface AyantsDroitsSectionProps {
  ayantsDroits: AyantDroitForm[];
  setAyantsDroits: (ayants: AyantDroitForm[]) => void;
}

export const AyantsDroitsSection = ({ ayantsDroits, setAyantsDroits }: AyantsDroitsSectionProps) => {
  const [nomAyant, setNomAyant] = useState("");
  const [typeAyant, setTypeAyant] = useState<'syndicat' | 'mutuelle' | 'poursuivant' | 'autre'>('syndicat');
  const [montantAyant, setMontantAyant] = useState("");

  const ajouterAyantDroit = () => {
    if (!nomAyant.trim() || !montantAyant || Number(montantAyant) <= 0) {
      toast.error("Veuillez saisir toutes les informations de l'ayant droit");
      return;
    }

    const nouveauAyant: AyantDroitForm = {
      nom: nomAyant.trim(),
      typeAyantDroit: typeAyant,
      montant: Number(montantAyant),
    };

    setAyantsDroits([...ayantsDroits, nouveauAyant]);
    setNomAyant("");
    setMontantAyant("");
    toast.success("Ayant droit ajouté");
  };

  const supprimerAyantDroit = (index: number) => {
    const nouveauxAyants = ayantsDroits.filter((_, i) => i !== index);
    setAyantsDroits(nouveauxAyants);
    toast.success("Ayant droit supprimé");
  };

  return (
    <div className="border-b pb-4">
      <h3 className="text-lg font-semibold mb-4">Ayants Droits</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          placeholder="Nom de l'ayant droit"
          value={nomAyant}
          onChange={(e) => setNomAyant(e.target.value)}
        />
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={typeAyant}
          onChange={(e) => setTypeAyant(e.target.value as any)}
        >
          <option value="syndicat">Syndicat</option>
          <option value="mutuelle">Mutuelle</option>
          <option value="poursuivant">Poursuivant</option>
          <option value="autre">Autre</option>
        </select>
        <Input
          type="number"
          placeholder="Montant (FCFA)"
          value={montantAyant}
          onChange={(e) => setMontantAyant(e.target.value)}
        />
        <Button type="button" onClick={ajouterAyantDroit} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {ayantsDroits.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Liste des Ayants Droits:</h4>
          {ayantsDroits.map((ayant, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex-1">
                <span className="font-medium">{ayant.nom}</span>
                <span className="text-gray-600 ml-2">({ayant.typeAyantDroit})</span>
              </div>
              <span className="text-gray-600 mr-4">{ayant.montant.toLocaleString()} FCFA</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => supprimerAyantDroit(index)}
              >
                Supprimer
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
