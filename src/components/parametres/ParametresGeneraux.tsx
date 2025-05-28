
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface ParametresGenerauxData {
  nomOrganisation: string;
  adresseOrganisation: string;
  emailContact: string;
  telephoneContact: string;
  logoUrl: string;
  deviseParDefaut: string;
  langueParDefaut: string;
  formatDate: string;
  formatNombre: string;
  activerNotifications: boolean;
  activerSauvegardeAuto: boolean;
  intervalleAutoSave: number;
}

export const ParametresGeneraux = () => {
  const [parametres, setParametres] = useState<ParametresGenerauxData>({
    nomOrganisation: "Direction Générale des Douanes",
    adresseOrganisation: "Cotonou, République du Bénin",
    emailContact: "contact@douanes.bj",
    telephoneContact: "+229 21 31 23 45",
    logoUrl: "",
    deviseParDefaut: "XOF",
    langueParDefaut: "fr",
    formatDate: "dd/MM/yyyy",
    formatNombre: "fr-FR",
    activerNotifications: true,
    activerSauvegardeAuto: true,
    intervalleAutoSave: 5
  });

  useEffect(() => {
    const saved = localStorage.getItem("parametres_generaux");
    if (saved) {
      setParametres(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("parametres_generaux", JSON.stringify(parametres));
    toast.success("Paramètres généraux sauvegardés");
  };

  const handleChange = (field: keyof ParametresGenerauxData, value: any) => {
    setParametres(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'Organisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nomOrganisation">Nom de l'organisation</Label>
              <Input
                id="nomOrganisation"
                value={parametres.nomOrganisation}
                onChange={(e) => handleChange("nomOrganisation", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="adresseOrganisation">Adresse</Label>
              <Input
                id="adresseOrganisation"
                value={parametres.adresseOrganisation}
                onChange={(e) => handleChange("adresseOrganisation", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="emailContact">Email de contact</Label>
              <Input
                id="emailContact"
                type="email"
                value={parametres.emailContact}
                onChange={(e) => handleChange("emailContact", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="telephoneContact">Téléphone</Label>
              <Input
                id="telephoneContact"
                value={parametres.telephoneContact}
                onChange={(e) => handleChange("telephoneContact", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formats et Langue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deviseParDefaut">Devise par défaut</Label>
              <Input
                id="deviseParDefaut"
                value={parametres.deviseParDefaut}
                onChange={(e) => handleChange("deviseParDefaut", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="langueParDefaut">Langue par défaut</Label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={parametres.langueParDefaut}
                onChange={(e) => handleChange("langueParDefaut", e.target.value)}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <Label htmlFor="formatDate">Format de date</Label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={parametres.formatDate}
                onChange={(e) => handleChange("formatDate", e.target.value)}
              >
                <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                <option value="yyyy-MM-dd">yyyy-MM-dd</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préférences Système</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notifications activées</Label>
              <p className="text-sm text-gray-500">Recevoir des notifications système</p>
            </div>
            <Switch
              checked={parametres.activerNotifications}
              onCheckedChange={(checked) => handleChange("activerNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Sauvegarde automatique</Label>
              <p className="text-sm text-gray-500">Sauvegarder automatiquement les modifications</p>
            </div>
            <Switch
              checked={parametres.activerSauvegardeAuto}
              onCheckedChange={(checked) => handleChange("activerSauvegardeAuto", checked)}
            />
          </div>

          {parametres.activerSauvegardeAuto && (
            <div>
              <Label htmlFor="intervalleAutoSave">Intervalle de sauvegarde (minutes)</Label>
              <Input
                id="intervalleAutoSave"
                type="number"
                min="1"
                max="60"
                value={parametres.intervalleAutoSave}
                onChange={(e) => handleChange("intervalleAutoSave", parseInt(e.target.value))}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Sauvegarder les paramètres
        </Button>
      </div>
    </div>
  );
};
