
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { genererNumeroRepartition, calculerMontantNet, sauvegarderDossier } from "@/utils/fondsUtils";

interface AyantDroit {
  nom: string;
  montant: number;
}

interface FormulaireDossierProps {
  onDossierAjoute: () => void;
}

export const FormulaireDossier = ({ onDossierAjoute }: FormulaireDossierProps) => {
  const [numeroRepartition] = useState(genererNumeroRepartition());
  const [montantAffaire, setMontantAffaire] = useState("");
  const [partIndicateur, setPartIndicateur] = useState("");
  const [ayantsDroits, setAyantsDroits] = useState<AyantDroit[]>([]);
  const [nomAyant, setNomAyant] = useState("");
  const [montantAyant, setMontantAyant] = useState("");

  const montantNet = calculerMontantNet(
    parseFloat(montantAffaire) || 0,
    parseFloat(partIndicateur) || 0
  );

  const ajouterAyantDroit = () => {
    const nom = nomAyant.trim();
    const montant = parseFloat(montantAyant);

    if (!nom || !montant || montant <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom et un montant valide pour l'ayant droit.",
        variant: "destructive",
      });
      return;
    }

    setAyantsDroits([...ayantsDroits, { nom, montant }]);
    setNomAyant("");
    setMontantAyant("");
    
    toast({
      title: "Succès",
      description: "Ayant droit ajouté avec succès.",
    });
  };

  const supprimerAyantDroit = (index: number) => {
    setAyantsDroits(ayantsDroits.filter((_, i) => i !== index));
  };

  const soumettreFormulaire = () => {
    const montant = parseFloat(montantAffaire);
    const indicateur = parseFloat(partIndicateur);

    if (!montant || montant <= 0 || indicateur < 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer des montants valides.",
        variant: "destructive",
      });
      return;
    }

    const dossier = {
      numeroRepartition,
      montantAffaire: montant,
      partIndicateur: indicateur,
      montantNet: montantNet.montantNet,
      partFsp: montantNet.partFsp,
      ayantsDroits,
      dateCreation: new Date().toISOString(),
    };

    sauvegarderDossier(dossier);
    
    toast({
      title: "Succès",
      description: "Dossier créé avec succès !",
    });

    // Reset du formulaire
    setMontantAffaire("");
    setPartIndicateur("");
    setAyantsDroits([]);
    onDossierAjoute();
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <Label className="text-lg font-semibold text-blue-800">
          N° Répartition : {numeroRepartition}
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="montantAffaire">Montant Affaire (FCFA)</Label>
          <Input
            id="montantAffaire"
            type="number"
            value={montantAffaire}
            onChange={(e) => setMontantAffaire(e.target.value)}
            placeholder="Entrez le montant de l'affaire"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="partIndicateur">Part Indicateur (FCFA)</Label>
          <Input
            id="partIndicateur"
            type="number"
            value={partIndicateur}
            onChange={(e) => setPartIndicateur(e.target.value)}
            placeholder="Entrez la part indicateur"
          />
        </div>
      </div>

      {montantAffaire && (
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <Label className="text-sm text-gray-600">Part FSP</Label>
                <p className="text-lg font-semibold text-green-700">
                  {montantNet.partFsp.toLocaleString()} FCFA
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Montant Net</Label>
                <p className="text-xl font-bold text-green-800">
                  {montantNet.montantNet.toLocaleString()} FCFA
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Taux FSP</Label>
                <p className="text-lg font-semibold text-green-700">
                  {(parseFloat(montantAffaire) || 0) < 500000 ? "5%" : "4.5%"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Ajouter un Ayant Droit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomAyant">Nom de l'Ayant Droit</Label>
              <Input
                id="nomAyant"
                value={nomAyant}
                onChange={(e) => setNomAyant(e.target.value)}
                placeholder="Nom complet"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="montantAyant">Montant Attribué (FCFA)</Label>
              <Input
                id="montantAyant"
                type="number"
                value={montantAyant}
                onChange={(e) => setMontantAyant(e.target.value)}
                placeholder="Montant"
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={ajouterAyantDroit} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {ayantsDroits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ayants Droits ({ayantsDroits.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ayantsDroits.map((ayant, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{ayant.nom}</span>
                    <span className="text-gray-600 ml-4">
                      {ayant.montant.toLocaleString()} FCFA
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => supprimerAyantDroit(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button 
        onClick={soumettreFormulaire} 
        className="w-full" 
        size="lg"
        disabled={!montantAffaire || !partIndicateur}
      >
        Créer le Dossier
      </Button>
    </div>
  );
};
