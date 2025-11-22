import { useState } from "react";
import { Download, Upload, Database, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function GestionBDD() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export de la base de données",
      description: "Utilisez l'interface Lovable Cloud pour exporter vos données"
    });
  };

  const handleImport = () => {
    toast({
      title: "Import de données",
      description: "Utilisez l'interface Lovable Cloud pour importer des données"
    });
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Pour gérer la base de données (export, import, sauvegarde), utilisez l'interface Lovable Cloud accessible via le bouton "Backend" en haut de l'écran.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Exporter les données</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Téléchargez une sauvegarde complète de votre base de données
          </p>
          <Button onClick={handleExport} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Importer des données</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Restaurez une sauvegarde ou importez de nouvelles données
          </p>
          <Button onClick={handleImport} variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Statistiques de la base</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">15</div>
            <div className="text-sm text-muted-foreground">Tables</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground">Enregistrements</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">5</div>
            <div className="text-sm text-muted-foreground">Configurations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
