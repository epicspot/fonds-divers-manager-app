
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AffaireContentieuse } from "@/types/affaire";
import { TypeRapport } from "@/hooks/useRapports";

const TYPES_RAPPORTS = [
  { value: 'bordereau', label: 'Bordereau d\'affaire', description: 'Document de synthèse complet' },
  { value: 'bordereau_officiel', label: 'Bordereau officiel DGD', description: 'Formulaire officiel selon modèle DGD' },
  { value: 'transaction_ct3', label: 'Transaction CT3', description: 'Transaction tenant lieu de procès-verbal' },
  { value: 'edpn', label: 'EDPN - État Produit Net', description: 'État dégageant le produit net avec tableau des ayants-droits' },
  { value: 'synthese', label: 'Fiche de synthèse', description: 'Résumé exécutif de l\'affaire' },
  { value: 'transmission', label: 'Rapport de transmission', description: 'Document officiel pour la hiérarchie' },
  { value: 'hierarchie', label: 'Rapport hiérarchique', description: 'Note pour validation supérieure' }
] as const;

interface SelecteurRapportProps {
  affaires: AffaireContentieuse[];
  affaireSelectionnee: string;
  typeRapport: TypeRapport | "";
  onAffaireChange: (value: string) => void;
  onTypeRapportChange: (value: TypeRapport) => void;
}

export const SelecteurRapport = ({
  affaires,
  affaireSelectionnee,
  typeRapport,
  onAffaireChange,
  onTypeRapportChange
}: SelecteurRapportProps) => {
  const affaireSelectionneeObj = affaires.find(a => a.id === affaireSelectionnee);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Affaire</label>
        <Select value={affaireSelectionnee} onValueChange={onAffaireChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une affaire" />
          </SelectTrigger>
          <SelectContent>
            {affaires.map((affaire) => (
              <SelectItem key={affaire.id} value={affaire.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{affaire.numeroAffaire}</span>
                  <Badge variant={affaire.statut === 'validee' ? 'default' : 'secondary'}>
                    {affaire.statut}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Type de rapport</label>
        <Select value={typeRapport} onValueChange={(value) => onTypeRapportChange(value as TypeRapport)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner le type" />
          </SelectTrigger>
          <SelectContent>
            {TYPES_RAPPORTS.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div>
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {affaireSelectionneeObj && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Détails de l'affaire</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Numéro: {affaireSelectionneeObj.numeroAffaire}</div>
            <div>Description: {affaireSelectionneeObj.descriptionAffaire}</div>
            <div>Montant: {affaireSelectionneeObj.montantAffaire.toLocaleString()} FCFA</div>
          </div>
        </div>
      )}
    </div>
  );
};

export { TYPES_RAPPORTS };
