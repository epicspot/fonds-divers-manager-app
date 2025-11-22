
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Building, Database, Users, TableOfContents, List, Home, BarChart3, Settings, ClipboardCheck, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

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
      <SidebarFooter className="p-4 border-t">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full justify-start text-sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
