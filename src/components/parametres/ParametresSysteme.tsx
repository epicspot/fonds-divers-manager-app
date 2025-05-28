
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download, Upload, Database, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const ParametresSysteme = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const handleExportData = () => {
    const data = {
      affaires: localStorage.getItem('affaires_contentieuses'),
      regles: localStorage.getItem('regles_repartition'),
      parametres: localStorage.getItem('parametres_generaux'),
      configurations: {
        saisissants: localStorage.getItem('saisissants_config'),
        chefs: localStorage.getItem('chefs_config'),
        intervenants: localStorage.getItem('intervenants_config'),
        pieces: localStorage.getItem('pieces_config')
      }
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sauvegarde_complete_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Sauvegarde complète exportée");
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          
          if (importedData.affaires) {
            localStorage.setItem('affaires_contentieuses', importedData.affaires);
          }
          if (importedData.regles) {
            localStorage.setItem('regles_repartition', importedData.regles);
          }
          if (importedData.parametres) {
            localStorage.setItem('parametres_generaux', importedData.parametres);
          }
          if (importedData.configurations) {
            Object.entries(importedData.configurations).forEach(([key, value]) => {
              if (value) {
                localStorage.setItem(`${key}_config`, value as string);
              }
            });
          }
          
          toast.success("Données importées avec succès");
          setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
          toast.error("Erreur lors de l'import des données");
          console.error('Erreur lors de l\'import:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearAllData = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.')) {
      localStorage.clear();
      toast.success("Toutes les données ont été effacées");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    return (total / 1024).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Configuration Système
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Gérez les paramètres système, sauvegardes et maintenance.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sauvegarde et Restauration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleExportData} className="gap-2">
              <Download className="h-4 w-4" />
              Exporter toutes les données
            </Button>
            
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
                id="import-data"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-data')?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Importer des données
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Taille du stockage local: {getStorageSize()} KB</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mode de fonctionnement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Mode maintenance</Label>
              <p className="text-sm text-gray-500">Désactive temporairement l'application</p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Mode debug</Label>
              <p className="text-sm text-gray-500">Affiche des informations de débogage</p>
            </div>
            <Switch
              checked={debugMode}
              onCheckedChange={setDebugMode}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Recharger l'application
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleClearAllData}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Effacer toutes les données
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Version de l'application: 1.0.0</p>
            <p>Dernière mise à jour: {new Date().toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
