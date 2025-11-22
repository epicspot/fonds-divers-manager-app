import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Printer, Download, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { validateAffaireForRapport } from "@/utils/validation/rapportValidation";
import { ValidationAlertDialog } from "./ValidationAlertDialog";

interface GenerateurRapportsProps {
  affaire: AffaireContentieuse;
}

const RAPPORTS_DISPONIBLES = [
  { value: 'bordereau_officiel', label: 'CT8 - Bordereau Officiel', template: 'bordereau_officiel' },
  { value: 'transaction_ct3', label: 'CT3 - Transaction', template: 'transaction_ct3' },
  { value: 'edpn', label: 'EDPN - État Produit Net', template: 'edpn' },
  { value: 'fiche_indicateur', label: 'Fiche Indicateur', template: 'fiche_indicateur' },
  { value: 'synthese', label: 'Fiche de Synthèse', template: 'synthese' },
  { value: 'transmission', label: 'Rapport Transmission', template: 'transmission' },
  { value: 'hierarchie', label: 'Rapport Hiérarchique', template: 'hierarchie' },
  { value: 'bordereau', label: 'Bordereau de répartition', template: 'bordereau' }
];

export const GenerateurRapports = ({ affaire }: GenerateurRapportsProps) => {
  const [typeRapport, setTypeRapport] = useState<string>("");
  const [apercuOuvert, setApercuOuvert] = useState(false);
  const [htmlApercu, setHtmlApercu] = useState("");
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [currentValidation, setCurrentValidation] = useState<{
    typeRapport: string;
    errors: any[];
    warnings: any[];
    action: 'apercu' | 'impression' | 'telechargement';
  } | null>(null);

  const genererHTML = (template: string) => {
    try {
      const { printTemplates } = require('@/utils/printTemplates');
      const templateObj = printTemplates[template];
      if (!templateObj) {
        throw new Error("Template introuvable");
      }
      return templateObj.generateHTML('', affaire);
    } catch (error) {
      console.error('Erreur génération HTML:', error);
      throw error;
    }
  };

  const validerEtExecuter = (action: 'apercu' | 'impression' | 'telechargement') => {
    if (!typeRapport) {
      toast.error("Veuillez sélectionner un type de rapport");
      return;
    }

    // Valider les données avant génération
    const validation = validateAffaireForRapport(affaire, typeRapport);
    
    if (!validation.isValid) {
      // Afficher les erreurs bloquantes
      setCurrentValidation({
        typeRapport,
        errors: validation.errors,
        warnings: validation.warnings,
        action,
      });
      setValidationDialogOpen(true);
      
      toast.error(`${validation.errors.length} erreur(s) trouvée(s). Veuillez corriger les données manquantes.`);
      return;
    }
    
    if (validation.warnings.length > 0) {
      // Afficher les avertissements mais permettre de continuer
      setCurrentValidation({
        typeRapport,
        errors: [],
        warnings: validation.warnings,
        action,
      });
      setValidationDialogOpen(true);
      return;
    }
    
    // Pas d'erreurs ni d'avertissements, exécuter directement
    executerAction(action);
  };

  const executerAction = (action: 'apercu' | 'impression' | 'telechargement') => {
    switch (action) {
      case 'apercu':
        ouvrirApercu();
        break;
      case 'impression':
        imprimerRapport();
        break;
      case 'telechargement':
        telechargerRapport();
        break;
    }
  };

  const handleContinueAnyway = () => {
    if (currentValidation) {
      executerAction(currentValidation.action);
      setValidationDialogOpen(false);
      setCurrentValidation(null);
    }
  };

  const ouvrirApercu = () => {
    try {
      const rapport = RAPPORTS_DISPONIBLES.find(r => r.value === typeRapport);
      if (!rapport) return;

      const html = genererHTML(rapport.template);
      setHtmlApercu(html);
      setApercuOuvert(true);
    } catch (error) {
      toast.error("Erreur lors de la génération de l'aperçu");
    }
  };

  const imprimerRapport = () => {
    try {
      const rapport = RAPPORTS_DISPONIBLES.find(r => r.value === typeRapport);
      if (!rapport) return;

      const html = genererHTML(rapport.template);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        toast.success("Rapport prêt à imprimer");
      } else {
        toast.error("Impossible d'ouvrir la fenêtre d'impression");
      }
    } catch (error) {
      toast.error("Erreur lors de l'impression");
    }
  };

  const telechargerRapport = () => {
    try {
      const rapport = RAPPORTS_DISPONIBLES.find(r => r.value === typeRapport);
      if (!rapport) return;

      const html = genererHTML(rapport.template);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${rapport.value}_${affaire.numeroAffaire}_${new Date().toISOString().split('T')[0]}.html`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success("Rapport téléchargé");
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const getValidationStatus = () => {
    if (!typeRapport) return null;
    return validateAffaireForRapport(affaire, typeRapport);
  };

  const validationStatus = getValidationStatus();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Génération de Rapports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type de rapport</label>
            <Select value={typeRapport} onValueChange={setTypeRapport}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rapport" />
              </SelectTrigger>
              <SelectContent>
                {RAPPORTS_DISPONIBLES.map((rapport) => {
                  const validation = validateAffaireForRapport(affaire, rapport.value);
                  const hasErrors = !validation.isValid;
                  const hasWarnings = validation.warnings.length > 0;
                  
                  return (
                    <SelectItem key={rapport.value} value={rapport.value}>
                      <div className="flex items-center gap-2">
                        {hasErrors ? (
                          <AlertCircle className="h-3 w-3 text-destructive" />
                        ) : hasWarnings ? (
                          <AlertCircle className="h-3 w-3 text-warning" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3 text-success" />
                        )}
                        {rapport.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {validationStatus && (
            <div className={`p-3 rounded-lg border ${
              !validationStatus.isValid 
                ? 'bg-destructive/10 border-destructive/20' 
                : validationStatus.warnings.length > 0
                ? 'bg-warning/10 border-warning/20'
                : 'bg-success/10 border-success/20'
            }`}>
              <div className="flex items-center gap-2 text-sm">
                {!validationStatus.isValid ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-destructive">
                      {validationStatus.errors.length} erreur(s) - Données manquantes
                    </span>
                  </>
                ) : validationStatus.warnings.length > 0 ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <span className="font-medium text-warning">
                      {validationStatus.warnings.length} avertissement(s)
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="font-medium text-success">
                      Toutes les données sont complètes
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={() => validerEtExecuter('apercu')} variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button onClick={() => validerEtExecuter('impression')} variant="outline" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button onClick={() => validerEtExecuter('telechargement')} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={apercuOuvert} onOpenChange={setApercuOuvert}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Aperçu - {RAPPORTS_DISPONIBLES.find(r => r.value === typeRapport)?.label}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto border rounded-lg bg-white">
            <iframe
              srcDoc={htmlApercu}
              className="w-full h-full min-h-[600px]"
              title="Aperçu rapport"
            />
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setApercuOuvert(false)}>
              Fermer
            </Button>
            <Button variant="outline" onClick={imprimerRapport}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button onClick={telechargerRapport}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ValidationAlertDialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
        errors={currentValidation?.errors || []}
        warnings={currentValidation?.warnings || []}
        typeRapport={currentValidation?.typeRapport || ''}
        onContinueAnyway={handleContinueAnyway}
      />
    </>
  );
};
