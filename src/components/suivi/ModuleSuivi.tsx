
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Bell, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { SuiviHierarchique, NotificationSuivi } from "@/types/suivi";
import { obtenirSuivis, genererNotificationsRetard, mettreAJourSuiviAffaire } from "@/utils/suiviUtils";
import { obtenirAffaires } from "@/utils/affaireUtils";
import { TableauSuivi } from "./TableauSuivi";
import { NotificationsSuivi } from "./NotificationsSuivi";
import { StatistiquesSuivi } from "./StatistiquesSuivi";

export const ModuleSuivi = () => {
  const [suivis, setSuivis] = useState<SuiviHierarchique[]>([]);
  const [notifications, setNotifications] = useState<NotificationSuivi[]>([]);

  const chargerDonnees = () => {
    const suivisData = obtenirSuivis();
    const affaires = obtenirAffaires();
    
    // Mettre à jour les suivis avec les dernières données des affaires
    affaires.forEach(affaire => {
      if (affaire.statut === 'en_attente_hierarchie' || affaire.statut === 'en_repartition') {
        mettreAJourSuiviAffaire(affaire);
      }
    });

    setSuivis(obtenirSuivis());
    setNotifications(genererNotificationsRetard());
  };

  useEffect(() => {
    chargerDonnees();
    
    // Rafraîchir les données périodiquement
    const interval = setInterval(chargerDonnees, 60000); // Chaque minute
    
    return () => clearInterval(interval);
  }, []);

  const suivisEnCours = suivis.filter(s => s.statutActuel === 'en_attente_hierarchie');
  const notificationsNonLues = notifications.filter(n => !n.lu);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Suivi Hiérarchique</h1>
          <p className="text-gray-600">Suivi des transmissions et validations</p>
        </div>
        <Button onClick={chargerDonnees} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Indicateurs rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold">{suivisEnCours.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Notifications</p>
                <p className="text-2xl font-bold">{notificationsNonLues.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Validées</p>
                <p className="text-2xl font-bold">
                  {suivis.filter(s => s.statutActuel === 'en_repartition').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">En retard</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => n.type === 'retard').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="tableau" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tableau">Tableau de Suivi</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {notificationsNonLues.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {notificationsNonLues.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="tableau">
          <TableauSuivi suivis={suivis} onRefresh={chargerDonnees} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsSuivi 
            notifications={notifications} 
            onRefresh={chargerDonnees}
          />
        </TabsContent>

        <TabsContent value="statistiques">
          <StatistiquesSuivi suivis={suivis} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
