import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  CheckCircle, 
  Send, 
  AlertCircle, 
  Edit, 
  Play,
  FileText
} from "lucide-react";
import { ActionSuivi } from "@/types/suivi";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface HistoriqueActionsProps {
  actions: ActionSuivi[];
}

export const HistoriqueActions = ({ actions }: HistoriqueActionsProps) => {
  const getTypeIcon = (type: ActionSuivi['type']) => {
    switch (type) {
      case 'creation':
        return <FileText className="h-4 w-4" />;
      case 'validation':
        return <CheckCircle className="h-4 w-4" />;
      case 'transmission':
        return <Send className="h-4 w-4" />;
      case 'rejet':
        return <AlertCircle className="h-4 w-4" />;
      case 'modification':
        return <Edit className="h-4 w-4" />;
      case 'approbation':
        return <Play className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: ActionSuivi['type']) => {
    switch (type) {
      case 'creation':
        return 'Création';
      case 'validation':
        return 'Validation';
      case 'transmission':
        return 'Transmission';
      case 'rejet':
        return 'Rejet';
      case 'modification':
        return 'Modification';
      case 'approbation':
        return 'Approbation';
      default:
        return type;
    }
  };

  const getTypeVariant = (type: ActionSuivi['type']) => {
    switch (type) {
      case 'creation':
        return 'secondary';
      case 'validation':
        return 'default';
      case 'transmission':
        return 'outline';
      case 'rejet':
        return 'destructive';
      case 'approbation':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (actions.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Aucune action enregistrée pour le moment
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Historique des Actions</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {actions.map((action, index) => (
            <div
              key={action.id}
              className="flex gap-4 pb-4 border-b last:border-0"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                  {getTypeIcon(action.type)}
                </div>
                {index < actions.length - 1 && (
                  <div className="w-0.5 h-full bg-border mt-2" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={getTypeVariant(action.type)}>
                    {getTypeLabel(action.type)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(action.dateAction), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">{action.utilisateur}</p>
                  {action.commentaire && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.commentaire}
                    </p>
                  )}
                </div>
                {action.delaiPrevu && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Délai: {action.delaiPrevu} jours</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
