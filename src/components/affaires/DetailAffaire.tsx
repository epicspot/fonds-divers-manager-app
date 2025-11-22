
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AffaireContentieuse } from "@/types/affaire";
import { GenerateurRapports } from "./GenerateurRapports";

interface DetailAffaireProps {
  affaire: AffaireContentieuse | null;
  isOpen: boolean;
  onClose: () => void;
  onEditAffaire?: () => void;
}

export const DetailAffaire = ({ affaire, isOpen, onClose, onEditAffaire }: DetailAffaireProps) => {
  if (!affaire) return null;

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "brouillon":
        return <Badge variant="secondary">Brouillon</Badge>;
      case "validee":
        return <Badge variant="default">Validée</Badge>;
      case "en_repartition":
        return <Badge variant="outline">En Répartition</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Détails de l'Affaire {affaire.numeroAffaire}
            {getStatutBadge(affaire.statut)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de Base</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Date:</span>
                <p className="text-gray-600">{affaire.dateAffaire}</p>
              </div>
              <div>
                <span className="font-medium">Montant:</span>
                <p className="text-gray-600">{affaire.montantAffaire?.toLocaleString()} FCFA</p>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Description:</span>
                <p className="text-gray-600">{affaire.descriptionAffaire}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contrevenant */}
          {affaire.nomPrenomContrevenant && (
            <Card>
              <CardHeader>
                <CardTitle>Contrevenant</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Nom et Prénom:</span>
                  <p className="text-gray-600">{affaire.nomPrenomContrevenant}</p>
                </div>
                {affaire.ifu && (
                  <div>
                    <span className="font-medium">IFU:</span>
                    <p className="text-gray-600">{affaire.ifu}</p>
                  </div>
                )}
                {affaire.adresseComplete && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Adresse:</span>
                    <p className="text-gray-600">{affaire.adresseComplete}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Transaction */}
          {affaire.suiteAffaire && (
            <Card>
              <CardHeader>
                <CardTitle>Transaction</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Suite de l'affaire:</span>
                  <p className="text-gray-600">{affaire.suiteAffaire}</p>
                </div>
                {affaire.montantAmende && (
                  <div>
                    <span className="font-medium">Montant amende:</span>
                    <p className="text-gray-600">{affaire.montantAmende.toLocaleString()} FCFA</p>
                  </div>
                )}
                {affaire.produitNetRepartir && (
                  <div>
                    <span className="font-medium">Produit net à répartir:</span>
                    <p className="text-gray-600">{affaire.produitNetRepartir.toLocaleString()} FCFA</p>
                  </div>
                )}
                {affaire.dateTransaction && (
                  <div>
                    <span className="font-medium">Date transaction:</span>
                    <p className="text-gray-600">{affaire.dateTransaction}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Observations */}
          {affaire.observations && (
            <Card>
              <CardHeader>
                <CardTitle>Observations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{affaire.observations}</p>
              </CardContent>
            </Card>
          )}

          {/* Génération de rapports */}
          <GenerateurRapports affaire={affaire} onEditAffaire={onEditAffaire} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
