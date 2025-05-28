
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/ui/timeline";
import { Clock, User, MessageCircle, Calendar } from "lucide-react";
import { SuiviHierarchique } from "@/types/suivi";

interface DetailSuiviProps {
  suivi: SuiviHierarchique | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const DetailSuivi = ({ suivi, isOpen, onClose, onRefresh }: DetailSuiviProps) => {
  if (!suivi) return null;

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'transmission': return <Clock className="h-4 w-4" />;
      case 'validation': return <User className="h-4 w-4" />;
      case 'rejet': return <MessageCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'transmission': return 'blue';
      case 'validation': return 'green';
      case 'rejet': return 'red';
      case 'approbation': return 'green';
      default: return 'gray';
    }
  };

  const timelineItems = suivi.actions.map(action => ({
    id: action.id,
    title: action.type.charAt(0).toUpperCase() + action.type.slice(1),
    description: action.commentaire || `Action effectuée par ${action.utilisateur}`,
    timestamp: new Date(action.dateAction).toLocaleString(),
    icon: getActionIcon(action.type),
    color: getActionColor(action.type) as 'blue' | 'green' | 'red' | 'gray',
    status: action.statut
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Détail du Suivi - Affaire {suivi.numeroAffaire}
            <Badge>{suivi.statutActuel}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Statut actuel:</span>
                <p className="text-gray-600">{suivi.statutActuel}</p>
              </div>
              <div>
                <span className="font-medium">Date transmission:</span>
                <p className="text-gray-600">
                  {suivi.dateTransmission 
                    ? new Date(suivi.dateTransmission).toLocaleDateString()
                    : 'Non transmise'
                  }
                </p>
              </div>
              <div>
                <span className="font-medium">Date validation:</span>
                <p className="text-gray-600">
                  {suivi.dateValidation 
                    ? new Date(suivi.dateValidation).toLocaleDateString()
                    : 'En attente'
                  }
                </p>
              </div>
              <div>
                <span className="font-medium">Délai actuel:</span>
                <p className="text-gray-600">
                  {suivi.delaiTransmission ? `${suivi.delaiTransmission} jour(s)` : '0 jour'}
                </p>
              </div>
              {suivi.responsableActuel && (
                <div>
                  <span className="font-medium">Responsable actuel:</span>
                  <p className="text-gray-600">{suivi.responsableActuel}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historique des actions */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline items={timelineItems} />
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {suivi.actions.length}
                </p>
                <p className="text-sm text-gray-600">Actions totales</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {suivi.actions.filter(a => a.statut === 'termine').length}
                </p>
                <p className="text-sm text-gray-600">Actions terminées</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {suivi.actions.filter(a => a.statut === 'en_cours').length}
                </p>
                <p className="text-sm text-gray-600">Actions en cours</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
