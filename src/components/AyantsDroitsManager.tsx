
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export interface AyantDroitForm {
  nom: string;
  montant: number;
}

interface AyantsDroitsManagerProps {
  ayantsDroits: AyantDroitForm[];
  onAyantsDroitsChange: (ayants: AyantDroitForm[]) => void;
  montantNet: number;
}

export const AyantsDroitsManager = ({ 
  ayantsDroits, 
  onAyantsDroitsChange, 
  montantNet 
}: AyantsDroitsManagerProps) => {
  const [nomAyant, setNomAyant] = useState("");
  const [montantAyant, setMontantAyant] = useState("");

  const ajouterAyantDroit = () => {
    if (!nomAyant.trim() || !montantAyant || Number(montantAyant) <= 0) {
      toast.error("Veuillez saisir un nom et un montant valide pour l'ayant droit");
      return;
    }

    const nouveauAyant: AyantDroitForm = {
      nom: nomAyant.trim(),
      montant: Number(montantAyant),
    };

    onAyantsDroitsChange([...ayantsDroits, nouveauAyant]);
    setNomAyant("");
    setMontantAyant("");
    toast.success("Ayant droit ajouté");
  };

  const supprimerAyantDroit = (index: number) => {
    const nouveauxAyants = ayantsDroits.filter((_, i) => i !== index);
    onAyantsDroitsChange(nouveauxAyants);
    toast.success("Ayant droit supprimé");
  };

  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">Ayants Droits</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          placeholder="Nom de l'ayant droit"
          value={nomAyant}
          onChange={(e) => setNomAyant(e.target.value)}
        />
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
              <span className="font-medium">{ayant.nom}</span>
              <span className="text-gray-600">{ayant.montant.toLocaleString()} FCFA</span>
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
          <div className="text-sm text-gray-600 mt-2">
            Total attribué: {ayantsDroits.reduce((sum, ayant) => sum + ayant.montant, 0).toLocaleString()} FCFA
            {montantNet > 0 && (
              <span className="ml-2">
                / Disponible: {montantNet.toLocaleString()} FCFA
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
