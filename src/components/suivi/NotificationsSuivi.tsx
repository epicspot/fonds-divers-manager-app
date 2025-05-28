
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";
import { NotificationSuivi } from "@/types/suivi";
import { cn } from "@/lib/utils";

interface NotificationsSuiviProps {
  notifications: NotificationSuivi[];
  onRefresh: () => void;
}

export const NotificationsSuivi = ({ notifications, onRefresh }: NotificationsSuiviProps) => {
  const getPrioriteIcon = (priorite: string) => {
    switch (priorite) {
      case 'urgente':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'haute':
        return <Bell className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPrioriteBadge = (priorite: string) => {
    switch (priorite) {
      case 'urgente':
        return <Badge variant="destructive">Urgente</Badge>;
      case 'haute':
        return <Badge variant="outline">Haute</Badge>;
      case 'normale':
        return <Badge variant="secondary">Normale</Badge>;
      default:
        return <Badge variant="secondary">Basse</Badge>;
    }
  };

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-300" />
          <p>Aucune notification en attente</p>
          <p className="text-sm">Toutes les transmissions sont dans les délais</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id} className={cn(
          "border-l-4",
          notification.priorite === 'urgente' && "border-l-red-500",
          notification.priorite === 'haute' && "border-l-orange-500",
          notification.priorite === 'normale' && "border-l-blue-500",
          notification.priorite === 'basse' && "border-l-gray-500"
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getPrioriteIcon(notification.priorite)}
                <CardTitle className="text-base">
                  {notification.type === 'retard' ? 'Retard de transmission' : 
                   notification.type === 'echeance' ? 'Échéance proche' : 
                   'Validation requise'}
                </CardTitle>
              </div>
              {getPrioriteBadge(notification.priorite)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-2">{notification.message}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {new Date(notification.dateCreation).toLocaleString()}
              </span>
              {!notification.lu && (
                <Badge variant="outline" className="text-xs">
                  Non lu
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
