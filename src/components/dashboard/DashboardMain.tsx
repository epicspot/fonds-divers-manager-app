
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableOfContents, Database, Users, Building, List, Settings } from "lucide-react";
import { UnifiedStats } from "./UnifiedStats";

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
    id: "repartition",
    title: "Répartition",
    subtitle: "Module de répartition automatique",
    description: "Calculez automatiquement les parts selon les règles métier de la douane.",
    icon: TableOfContents,
    color: "bg-yellow-50 border-yellow-200"
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
  },
  {
    id: "parametres",
    title: "Paramètres",
    subtitle: "Configuration de l'application",
    description: "Configurez tous les paramètres et préférences du système.",
    icon: Settings,
    color: "bg-indigo-50 border-indigo-200"
  }
];

interface DashboardMainProps {
  onSectionChange?: (sectionId: string) => void;
}

export function DashboardMain({ onSectionChange }: DashboardMainProps) {
  const handleCardClick = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  return (
    <div className="p-4 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Bienvenue sur le Système de Gestion des Contentieux Douaniers
          </h1>
          <p className="text-gray-600 text-sm">
            Vue d'ensemble de tous les modules et statistiques du système.
          </p>
        </div>

        <div className="mb-6 flex-shrink-0">
          <UnifiedStats />
        </div>

        <div className="flex-1 overflow-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Modules Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
            {dashboardCards.map((card) => (
              <Card key={card.id} className={`${card.color} hover:shadow-lg transition-shadow h-fit cursor-pointer`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-3">
                    <card.icon className="h-6 w-6 text-gray-700" />
                    <div>
                      <CardTitle className="text-base text-gray-900">{card.title}</CardTitle>
                      <CardDescription className="text-xs text-gray-600 font-medium">
                        {card.subtitle}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 mb-3 text-xs leading-relaxed">
                    {card.description}
                  </p>
                  <Button 
                    onClick={() => handleCardClick(card.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-8"
                  >
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
