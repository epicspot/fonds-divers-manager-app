import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface RecapitulatifAffaireProps {
  formValues: any;
  onEdit: (step: number) => void;
}

export const RecapitulatifAffaire = ({ formValues, onEdit }: RecapitulatifAffaireProps) => {
  const formatDate = (date: string | Date) => {
    if (!date) return "Non renseigné";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const formatCurrency = (value: number) => {
    if (!value) return "0 FCFA";
    return `${value.toLocaleString("fr-FR")} FCFA`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-2" />
        <h3 className="text-xl font-semibold">Récapitulatif de l'affaire</h3>
        <p className="text-muted-foreground text-sm">
          Vérifiez toutes les informations avant de créer l'affaire
        </p>
      </div>

      {/* Informations générales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">Informations générales</CardTitle>
            <CardDescription>Données de base de l'affaire</CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(1)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Numéro d'affaire</p>
              <p className="text-sm font-semibold">{formValues.numeroAffaire || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type d'affaire</p>
              <p className="text-sm font-semibold">{formValues.typeAffaire || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Région</p>
              <p className="text-sm font-semibold">{formValues.region || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bureau</p>
              <p className="text-sm font-semibold">{formValues.bureauNom || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Poste</p>
              <p className="text-sm font-semibold">{formValues.poste || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de PV</p>
              <p className="text-sm font-semibold">{formatDate(formValues.datePV)}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Contrevenant</p>
            <div className="bg-muted/50 p-3 rounded-md space-y-1">
              <p className="text-sm"><span className="font-medium">Nom:</span> {formValues.nomContrevenant || "Non renseigné"}</p>
              <p className="text-sm"><span className="font-medium">Adresse:</span> {formValues.adresseContrevenant || "Non renseigné"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Déclaration et Transport */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">Déclaration et Transport</CardTitle>
            <CardDescription>Informations sur le transport et les marchandises</CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(2)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Numéro de déclaration</p>
              <p className="text-sm font-semibold">{formValues.numeroDeclaration || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de déclaration</p>
              <p className="text-sm font-semibold">{formatDate(formValues.dateDeclaration)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Moyen de transport</p>
              <p className="text-sm font-semibold">{formValues.moyenTransport || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Immatriculation</p>
              <p className="text-sm font-semibold">{formValues.immatriculation || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nature marchandise</p>
              <p className="text-sm font-semibold">{formValues.natureMarchandise || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Poids</p>
              <p className="text-sm font-semibold">{formValues.poids ? `${formValues.poids} kg` : "Non renseigné"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valeurs et Droits */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">Valeurs et Droits</CardTitle>
            <CardDescription>Montants et droits dus</CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(3)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Valeur marchandise</p>
              <p className="text-sm font-semibold">{formatCurrency(formValues.valeurMarchandise)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Droits dus</p>
              <p className="text-sm font-semibold">{formatCurrency(formValues.droitsDus)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pénalités</p>
              <p className="text-sm font-semibold">{formatCurrency(formValues.penalites)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amende</p>
              <p className="text-sm font-semibold">{formatCurrency(formValues.amende)}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="bg-primary/10 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Total à payer</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(
                  (formValues.droitsDus || 0) +
                  (formValues.penalites || 0) +
                  (formValues.amende || 0)
                )}
              </p>
            </div>
          </div>

          {formValues.transactionAcceptee && (
            <div className="mt-4">
              <Badge variant="default" className="mb-2">Transaction acceptée</Badge>
              <div className="bg-muted/50 p-3 rounded-md space-y-1">
                <p className="text-sm"><span className="font-medium">Montant transaction:</span> {formatCurrency(formValues.montantTransaction)}</p>
                <p className="text-sm"><span className="font-medium">Date transaction:</span> {formatDate(formValues.dateTransaction)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Intervenants et Observations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">Intervenants et Observations</CardTitle>
            <CardDescription>Personnes impliquées et remarques</CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(4)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saisissant</p>
              <p className="text-sm font-semibold">{formValues.saisissant || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Chef de service</p>
              <p className="text-sm font-semibold">{formValues.chefService || "Non renseigné"}</p>
            </div>
          </div>

          {formValues.observations && (
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">Observations</p>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{formValues.observations}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
