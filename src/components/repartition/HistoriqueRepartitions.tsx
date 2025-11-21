import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Printer, Trash2, Eye, FileText } from "lucide-react";
import { useHistoriqueRepartitions, HistoriqueRepartition } from "@/hooks/useHistoriqueRepartitions";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ResultatRepartition } from "@/types/repartition";

export const HistoriqueRepartitions = () => {
  const { historique, loading, supprimerRepartition } = useHistoriqueRepartitions();
  const [repartitionASupprimer, setRepartitionASupprimer] = useState<string | null>(null);
  const [repartitionSelectionnee, setRepartitionSelectionnee] = useState<HistoriqueRepartition | null>(null);

  const imprimerBordereau = (repartition: HistoriqueRepartition) => {
    const resultat: ResultatRepartition = {
      montantTotal: Number(repartition.montant_total),
      montantNet: Number(repartition.montant_net),
      partFsp: Number(repartition.part_fsp),
      partTresor: Number(repartition.part_tresor),
      partMutuelle: Number(repartition.part_mutuelle),
      partFondsSolidarite: Number(repartition.part_fonds_solidarite),
      partFondsFormation: Number(repartition.part_fonds_formation),
      partFondsEquipement: Number(repartition.part_fonds_equipement),
      partPrimeRendement: Number(repartition.part_prime_rendement),
      ayantsDroits: repartition.ayants_droits,
      verificationsOk: repartition.verifications_ok,
      erreurs: repartition.erreurs
    };

    const affaire = repartition.numero_affaire ? { numero_affaire: repartition.numero_affaire } : undefined;

    const { printTemplates } = require('@/utils/printTemplates');
    const template = printTemplates.bordereau_repartition;
    
    const html = template.generateHTML('', affaire, resultat);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      toast.success("Bordereau prêt à imprimer");
    } else {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
    }
  };

  const confirmerSuppression = () => {
    if (repartitionASupprimer) {
      supprimerRepartition(repartitionASupprimer);
      setRepartitionASupprimer(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Chargement de l'historique...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des Répartitions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historique.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucune répartition dans l'historique</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historique.map((repartition) => (
                <div
                  key={repartition.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {repartition.numero_affaire && (
                        <Badge variant="outline" className="font-mono">
                          {repartition.numero_affaire}
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {new Date(repartition.date_repartition).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {!repartition.verifications_ok && (
                        <Badge variant="destructive" className="text-xs">
                          Avec avertissements
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total: </span>
                        <span className="font-semibold">{Number(repartition.montant_total).toLocaleString()} FCFA</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Net: </span>
                        <span className="font-semibold text-green-600">{Number(repartition.montant_net).toLocaleString()} FCFA</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Bénéficiaires: </span>
                        <span className="font-semibold">{repartition.ayants_droits.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Par: </span>
                        <span className="font-semibold">{repartition.utilisateur || 'Système'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRepartitionSelectionnee(repartition)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Détails
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => imprimerBordereau(repartition)}
                      className="flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" />
                      Imprimer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRepartitionASupprimer(repartition.id)}
                      className="flex items-center gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!repartitionASupprimer} onOpenChange={() => setRepartitionASupprimer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette répartition de l'historique ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmerSuppression} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!repartitionSelectionnee} onOpenChange={() => setRepartitionSelectionnee(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Détails de la Répartition
            </DialogTitle>
          </DialogHeader>
          {repartitionSelectionnee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                <div>
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <p className="font-medium">
                    {new Date(repartitionSelectionnee.date_repartition).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {repartitionSelectionnee.numero_affaire && (
                  <div>
                    <Label className="text-sm text-muted-foreground">N° Affaire</Label>
                    <p className="font-medium font-mono">{repartitionSelectionnee.numero_affaire}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm text-muted-foreground">Utilisateur</Label>
                  <p className="font-medium">{repartitionSelectionnee.utilisateur || 'Système'}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Statut</Label>
                  <Badge variant={repartitionSelectionnee.verifications_ok ? "default" : "destructive"}>
                    {repartitionSelectionnee.verifications_ok ? "Validé" : "Avec avertissements"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Montant Total</Label>
                  <p className="text-lg font-bold">{Number(repartitionSelectionnee.montant_total).toLocaleString()} FCFA</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Montant Net</Label>
                  <p className="text-lg font-bold">{Number(repartitionSelectionnee.montant_net).toLocaleString()} FCFA</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Part Trésor</Label>
                  <p className="text-lg font-bold">{Number(repartitionSelectionnee.part_tresor).toLocaleString()} FCFA</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Part FSP</Label>
                  <p className="text-lg font-bold">{Number(repartitionSelectionnee.part_fsp).toLocaleString()} FCFA</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold mb-3 block">Bénéficiaires ({repartitionSelectionnee.ayants_droits.length})</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {repartitionSelectionnee.ayants_droits.map((ayant: any) => (
                    <div key={ayant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{ayant.type.toUpperCase()}</Badge>
                        <span className="font-medium">{ayant.nom}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{ayant.montantCalcule.toLocaleString()} FCFA</p>
                        <p className="text-sm text-muted-foreground">{ayant.pourcentage.toFixed(2)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!repartitionSelectionnee.verifications_ok && repartitionSelectionnee.erreurs.length > 0 && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <Label className="text-sm font-semibold text-destructive mb-2 block">Avertissements:</Label>
                  <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                    {repartitionSelectionnee.erreurs.map((erreur: string, index: number) => (
                      <li key={index}>{erreur}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => repartitionSelectionnee && imprimerBordereau(repartitionSelectionnee)}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Imprimer ce bordereau
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRepartitionSelectionnee(null)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
