import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ConfigurationModele } from "@/services/modelesRapportsService";
import { Upload, Save } from "lucide-react";
import { toast } from "sonner";

interface ConfigurationModeleProps {
  configuration: ConfigurationModele;
  onChange: (config: ConfigurationModele) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const ConfigurationModeleComponent = ({
  configuration,
  onChange,
  onSave,
  isSaving = false,
}: ConfigurationModeleProps) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    configuration.enTete?.logo || null
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Le fichier est trop volumineux (max 1 Mo)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        onChange({
          ...configuration,
          enTete: {
            ...configuration.enTete,
            logo: base64,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="entete" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entete">En-tête</TabsTrigger>
          <TabsTrigger value="mise-en-page">Mise en page</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>

        <TabsContent value="entete" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de l'en-tête</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'en-tête de vos rapports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("logo")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Télécharger le logo
                  </Button>
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Aperçu du logo"
                      className="h-12 w-auto object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titre">Titre</Label>
                <Input
                  id="titre"
                  value={configuration.enTete?.titre || ""}
                  onChange={(e) =>
                    onChange({
                      ...configuration,
                      enTete: {
                        ...configuration.enTete,
                        titre: e.target.value,
                      },
                    })
                  }
                  placeholder="Titre du rapport"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sousTitre">Sous-titre</Label>
                <Input
                  id="sousTitre"
                  value={configuration.enTete?.sousTitre || ""}
                  onChange={(e) =>
                    onChange({
                      ...configuration,
                      enTete: {
                        ...configuration.enTete,
                        sousTitre: e.target.value,
                      },
                    })
                  }
                  placeholder="Sous-titre du rapport"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="couleurFond">Couleur de fond</Label>
                  <Input
                    id="couleurFond"
                    type="color"
                    value={configuration.enTete?.couleurFond || "#ffffff"}
                    onChange={(e) =>
                      onChange({
                        ...configuration,
                        enTete: {
                          ...configuration.enTete,
                          couleurFond: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="couleurTexte">Couleur du texte</Label>
                  <Input
                    id="couleurTexte"
                    type="color"
                    value={configuration.enTete?.couleurTexte || "#000000"}
                    onChange={(e) =>
                      onChange({
                        ...configuration,
                        enTete: {
                          ...configuration.enTete,
                          couleurTexte: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mise-en-page" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mise en page</CardTitle>
              <CardDescription>
                Configurez les marges, polices et couleurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Marges (mm)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Haut"
                    value={configuration.miseEnPage?.marges?.haut || 20}
                    onChange={(e) =>
                      onChange({
                        ...configuration,
                        miseEnPage: {
                          ...configuration.miseEnPage,
                          marges: {
                            ...configuration.miseEnPage?.marges,
                            haut: parseInt(e.target.value) || 20,
                          },
                        },
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Bas"
                    value={configuration.miseEnPage?.marges?.bas || 20}
                    onChange={(e) =>
                      onChange({
                        ...configuration,
                        miseEnPage: {
                          ...configuration.miseEnPage,
                          marges: {
                            ...configuration.miseEnPage?.marges,
                            bas: parseInt(e.target.value) || 20,
                          },
                        },
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Gauche"
                    value={configuration.miseEnPage?.marges?.gauche || 20}
                    onChange={(e) =>
                      onChange({
                        ...configuration,
                        miseEnPage: {
                          ...configuration.miseEnPage,
                          marges: {
                            ...configuration.miseEnPage?.marges,
                            gauche: parseInt(e.target.value) || 20,
                          },
                        },
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Droite"
                    value={configuration.miseEnPage?.marges?.droite || 20}
                    onChange={(e) =>
                      onChange({
                        ...configuration,
                        miseEnPage: {
                          ...configuration.miseEnPage,
                          marges: {
                            ...configuration.miseEnPage?.marges,
                            droite: parseInt(e.target.value) || 20,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="police">Police</Label>
                <Input
                  id="police"
                  value={configuration.miseEnPage?.police || "Arial"}
                  onChange={(e) =>
                    onChange({
                      ...configuration,
                      miseEnPage: {
                        ...configuration.miseEnPage,
                        police: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taillePolice">Taille de police (px)</Label>
                <Input
                  id="taillePolice"
                  type="number"
                  value={configuration.miseEnPage?.taillePolice || 12}
                  onChange={(e) =>
                    onChange({
                      ...configuration,
                      miseEnPage: {
                        ...configuration.miseEnPage,
                        taillePolice: parseInt(e.target.value) || 12,
                      },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="couleurPrincipale">Couleur principale</Label>
                  <Input
                    id="couleurPrincipale"
                    type="color"
                    value={configuration.miseEnPage?.couleurPrincipale || "#007bff"}
                    onChange={(e) =>
                      onChange({
                        ...configuration,
                        miseEnPage: {
                          ...configuration.miseEnPage,
                          couleurPrincipale: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="couleurSecondaire">Couleur secondaire</Label>
                  <Input
                    id="couleurSecondaire"
                    type="color"
                    value={configuration.miseEnPage?.couleurSecondaire || "#6c757d"}
                    onChange={(e) =>
                      onChange({
                        ...configuration,
                        miseEnPage: {
                          ...configuration.miseEnPage,
                          couleurSecondaire: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sections du rapport</CardTitle>
              <CardDescription>
                Sélectionnez les sections à afficher
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="afficherLogo">Afficher le logo</Label>
                <Switch
                  id="afficherLogo"
                  checked={configuration.sections?.afficherLogo ?? true}
                  onCheckedChange={(checked) =>
                    onChange({
                      ...configuration,
                      sections: {
                        ...configuration.sections,
                        afficherLogo: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="afficherEntete">Afficher l'en-tête</Label>
                <Switch
                  id="afficherEntete"
                  checked={configuration.sections?.afficherEntete ?? true}
                  onCheckedChange={(checked) =>
                    onChange({
                      ...configuration,
                      sections: {
                        ...configuration.sections,
                        afficherEntete: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="afficherSignature">Afficher la signature</Label>
                <Switch
                  id="afficherSignature"
                  checked={configuration.sections?.afficherSignature ?? true}
                  onCheckedChange={(checked) =>
                    onChange({
                      ...configuration,
                      sections: {
                        ...configuration.sections,
                        afficherSignature: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="afficherCachet">Afficher le cachet</Label>
                <Switch
                  id="afficherCachet"
                  checked={configuration.sections?.afficherCachet ?? true}
                  onCheckedChange={(checked) =>
                    onChange({
                      ...configuration,
                      sections: {
                        ...configuration.sections,
                        afficherCachet: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={onSave} disabled={isSaving} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? "Enregistrement..." : "Enregistrer le modèle"}
      </Button>
    </div>
  );
};
