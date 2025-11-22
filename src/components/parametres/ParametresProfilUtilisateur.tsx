import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRegions } from "@/hooks/useRegions";
import { useBureauxData } from "@/hooks/useBureauxData";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";

export const ParametresProfilUtilisateur = () => {
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const { regions } = useRegions();
  const { bureaux, chargerBureauxParRegion } = useBureauxData();
  
  const [nomComplet, setNomComplet] = useState("");
  const [fonction, setFonction] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedBureau, setSelectedBureau] = useState("");
  const [saving, setSaving] = useState(false);

  // Charger les données du profil
  useEffect(() => {
    if (profile) {
      setNomComplet(profile.nom_complet || "");
      setFonction(profile.fonction || "");
      setSelectedRegion(profile.region_id || "none");
      setSelectedBureau(profile.bureau_id || "none");
      
      if (profile.region_id) {
        chargerBureauxParRegion(profile.region_id);
      }
    }
  }, [profile, chargerBureauxParRegion]);

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    setSelectedBureau("none"); // Réinitialiser le bureau
    if (regionId !== "none") {
      chargerBureauxParRegion(regionId);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const result = await updateProfile({
        nom_complet: nomComplet,
        fonction: fonction,
        region_id: selectedRegion === "none" ? null : selectedRegion,
        bureau_id: selectedBureau === "none" ? null : selectedBureau,
      });

      if (result.success) {
        toast.success("Profil mis à jour avec succès");
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <User className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Aucun profil trouvé</p>
              <p className="text-sm text-muted-foreground">
                Veuillez vous connecter pour configurer votre profil
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon Profil</CardTitle>
        <CardDescription>
          Configurez votre région et bureau par défaut. Ces informations seront automatiquement
          utilisées lors de la création d'une nouvelle affaire.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nom-complet">Nom complet</Label>
          <Input
            id="nom-complet"
            value={nomComplet}
            onChange={(e) => setNomComplet(e.target.value)}
            placeholder="Entrez votre nom complet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fonction">Fonction</Label>
          <Input
            id="fonction"
            value={fonction}
            onChange={(e) => setFonction(e.target.value)}
            placeholder="Ex: Agent de contrôle"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Région par défaut</Label>
          <Select value={selectedRegion} onValueChange={handleRegionChange}>
            <SelectTrigger id="region">
              <SelectValue placeholder="Sélectionnez une région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune région</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bureau">Bureau par défaut</Label>
          <Select 
            value={selectedBureau} 
            onValueChange={setSelectedBureau}
            disabled={!selectedRegion || selectedRegion === "none"}
          >
            <SelectTrigger id="bureau">
              <SelectValue placeholder={
                selectedRegion 
                  ? "Sélectionnez un bureau" 
                  : "Sélectionnez d'abord une région"
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun bureau</SelectItem>
              {bureaux.map((bureau) => (
                <SelectItem key={bureau.id} value={bureau.id}>
                  {bureau.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            💡 Astuce : La région et le bureau configurés ici seront automatiquement
            pré-sélectionnés lors de la création d'une nouvelle affaire contentieuse.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
