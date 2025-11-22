import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users, Briefcase, UserCheck, FileText, Shield, Database, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ConfigurationsSaisissants } from "@/components/admin/ConfigurationsSaisissants";
import { ConfigurationsChefs } from "@/components/admin/ConfigurationsChefs";
import { ConfigurationsIntervenants } from "@/components/admin/ConfigurationsIntervenants";
import { ConfigurationsPieces } from "@/components/admin/ConfigurationsPieces";
import { ParametresGeneraux } from "@/components/admin/ParametresGeneraux";
import { ConfigurationsValidation } from "@/components/admin/ConfigurationsValidation";
import { GestionBDD } from "@/components/admin/GestionBDD";

export default function Administration() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Administration Système</h1>
            <p className="text-muted-foreground">Gérez toutes les configurations de l'application</p>
          </div>
        </div>

        <Tabs defaultValue="saisissants" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto">
            <TabsTrigger value="saisissants" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Saisissants</span>
            </TabsTrigger>
            <TabsTrigger value="chefs" className="gap-2">
              <UserCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Chefs</span>
            </TabsTrigger>
            <TabsTrigger value="intervenants" className="gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Intervenants</span>
            </TabsTrigger>
            <TabsTrigger value="pieces" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Pièces</span>
            </TabsTrigger>
            <TabsTrigger value="parametres" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
            <TabsTrigger value="validation" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Validation</span>
            </TabsTrigger>
            <TabsTrigger value="bdd" className="gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Base de données</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saisissants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Configuration des Saisissants
                </CardTitle>
                <CardDescription>
                  Gérez la liste des agents saisissants (ayants droits)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigurationsSaisissants />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chefs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Configuration des Chefs
                </CardTitle>
                <CardDescription>
                  Gérez la liste des chefs de brigade, de service et de bureau
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigurationsChefs />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intervenants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Configuration des Intervenants
                </CardTitle>
                <CardDescription>
                  Gérez la liste des intervenants externes (experts, commissaires-priseurs, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigurationsIntervenants />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pieces" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Configuration des Pièces
                </CardTitle>
                <CardDescription>
                  Gérez les types de pièces disponibles pour les dossiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigurationsPieces />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parametres" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres Généraux
                </CardTitle>
                <CardDescription>
                  Configurez les paramètres généraux de l'application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ParametresGeneraux />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Règles de Validation
                </CardTitle>
                <CardDescription>
                  Gérez les configurations de validation des affaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfigurationsValidation />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bdd" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Gestion de la Base de Données
                </CardTitle>
                <CardDescription>
                  Sauvegarde, restauration et visualisation des données
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GestionBDD />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
