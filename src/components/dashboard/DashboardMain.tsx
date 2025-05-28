
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableOfContents, Database, Users, Building, List } from "lucide-react";

const dashboardCards = [
  {
    id: "dashboard",
    title: "Tableau de bord",
    subtitle: "Statistiques et analyses",
    description: "Visualisez les statistiques et l'évolution des dossiers de contentieux.",
    icon: TableOfContents,
    color: "bg-blue-50 border-blue-200"
  },
  {
    id: "dossiers",
    title: "Dossiers",
    subtitle: "Gérez tous vos dossiers de contentieux",
    description: "Accédez à la liste complète des dossiers et créez de nouveaux dossiers.",
    icon: Database,
    color: "bg-green-50 border-green-200"
  },
  {
    id: "personnel",
    title: "Personnel",
    subtitle: "Gestion du personnel",
    description: "Gérez les agents et le personnel impliqué dans les dossiers.",
    icon: Users,
    color: "bg-purple-50 border-purple-200"
  },
  {
    id: "regions",
    title: "Régions & Bureaux",
    subtitle: "Organisation territoriale",
    description: "Gérez les régions et bureaux douaniers du territoire.",
    icon: Building,
    color: "bg-orange-50 border-orange-200"
  },
  {
    id: "references",
    title: "Références",
    subtitle: "Listes de référence",
    description: "Gérez les listes de référence utilisées dans l'application.",
    icon: List,
    color: "bg-gray-50 border-gray-200"
  }
];

export function DashboardMain() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue sur le Système de Gestion des Contentieux Douaniers
          </h1>
          <p className="text-gray-600">
            Choisissez une section ci-dessous pour commencer à gérer vos dossiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <Card key={card.id} className={`${card.color} hover:shadow-lg transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <card.icon className="h-8 w-8 text-gray-700" />
                  <div>
                    <CardTitle className="text-lg text-gray-900">{card.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 font-medium">
                      {card.subtitle}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {card.description}
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Accéder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
