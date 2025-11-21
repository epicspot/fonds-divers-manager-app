
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Building, Database, Users, TableOfContents, List, Home, BarChart3, Settings, ClipboardCheck } from "lucide-react";

const menuItems = [
  {
    id: "main",
    title: "Accueil",
    icon: Home,
    description: "Page d'accueil du tableau de bord"
  },
  {
    id: "dashboard",
    title: "Statistiques",
    icon: BarChart3,
    description: "Statistiques et analyses"
  },
  {
    id: "dossiers",
    title: "Dossiers",
    icon: Database,
    description: "Gérez tous vos dossiers de contentieux"
  },
  {
    id: "suivi",
    title: "Suivi Hiérarchique",
    icon: ClipboardCheck,
    description: "Suivi des affaires et traçabilité"
  },
  {
    id: "repartition",
    title: "Répartition",
    icon: TableOfContents,
    description: "Module de répartition automatique"
  },
  {
    id: "personnel",
    title: "Personnel",
    icon: Users,
    description: "Gestion du personnel"
  },
  {
    id: "regions",
    title: "Régions & Bureaux",
    icon: Building,
    description: "Organisation territoriale"
  },
  {
    id: "references",
    title: "Références",
    icon: List,
    description: "Listes de référence"
  },
  {
    id: "parametres",
    title: "Paramètres",
    icon: Settings,
    description: "Configuration de l'application"
  },
];

interface AppSidebarProps {
  onSectionChange: (sectionId: string) => void;
  activeSection: string;
}

export function AppSidebar({ onSectionChange, activeSection }: AppSidebarProps) {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4 border-b">
        <div className="font-bold text-lg text-gray-900">DOUANE</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
