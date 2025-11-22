import { useState } from "react";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Eye, Filter } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const actionLabels = {
  CREATE: { label: 'Création', variant: 'default' as const },
  UPDATE: { label: 'Modification', variant: 'secondary' as const },
  DELETE: { label: 'Suppression', variant: 'destructive' as const },
  ACTIVATE: { label: 'Activation', variant: 'outline' as const }
};

const typeLabels: Record<string, string> = {
  configuration_systeme: 'Configuration Système',
  configuration_validation: 'Règles de Validation'
};

export function HistoriqueAudit() {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  
  const { logs, loading, page, total, pageSize, nextPage, prevPage, hasNextPage, hasPrevPage } = useAuditLogs({
    type_entite: typeFilter !== 'all' ? typeFilter : undefined,
    action: actionFilter !== 'all' ? actionFilter : undefined
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtres:</span>
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Type d'entité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="configuration_systeme">Configuration Système</SelectItem>
            <SelectItem value="configuration_validation">Règles de Validation</SelectItem>
          </SelectContent>
        </Select>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les actions</SelectItem>
            <SelectItem value="CREATE">Création</SelectItem>
            <SelectItem value="UPDATE">Modification</SelectItem>
            <SelectItem value="DELETE">Suppression</SelectItem>
            <SelectItem value="ACTIVATE">Activation</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground ml-auto">
          {total} enregistrement{total > 1 ? 's' : ''}
        </div>
      </div>

      {/* Liste des logs */}
      <div className="space-y-2">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Aucun log trouvé
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => setSelectedLog(log)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={actionLabels[log.action as keyof typeof actionLabels].variant}>
                      {actionLabels[log.action as keyof typeof actionLabels].label}
                    </Badge>
                    <span className="text-sm font-medium">{typeLabels[log.type_entite] || log.type_entite}</span>
                    {log.entite_nom && (
                      <span className="text-sm text-muted-foreground">• {log.entite_nom}</span>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Par <span className="font-medium">{log.utilisateur_email}</span>
                    {' • '}
                    {format(new Date(log.created_at), 'PPpp', { locale: fr })}
                  </div>
                  
                  {log.details && (
                    <p className="text-sm">{log.details}</p>
                  )}
                </div>

                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Page {page} sur {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={!hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={!hasNextPage}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Dialog pour les détails */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de l'audit</DialogTitle>
            <DialogDescription>
              {selectedLog && format(new Date(selectedLog.created_at), 'PPpp', { locale: fr })}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <ScrollArea className="max-h-[600px]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Action</label>
                    <div className="mt-1">
                      <Badge variant={actionLabels[selectedLog.action as keyof typeof actionLabels].variant}>
                        {actionLabels[selectedLog.action as keyof typeof actionLabels].label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Type d'entité</label>
                    <p className="mt-1 text-sm">{typeLabels[selectedLog.type_entite] || selectedLog.type_entite}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Utilisateur</label>
                    <p className="mt-1 text-sm">{selectedLog.utilisateur_email}</p>
                  </div>

                  {selectedLog.entite_nom && (
                    <div>
                      <label className="text-sm font-medium">Nom de l'entité</label>
                      <p className="mt-1 text-sm">{selectedLog.entite_nom}</p>
                    </div>
                  )}
                </div>

                {selectedLog.details && (
                  <div>
                    <label className="text-sm font-medium">Détails</label>
                    <p className="mt-1 text-sm">{selectedLog.details}</p>
                  </div>
                )}

                {selectedLog.anciennes_valeurs && (
                  <div>
                    <label className="text-sm font-medium">Anciennes valeurs</label>
                    <pre className="mt-1 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(selectedLog.anciennes_valeurs, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedLog.nouvelles_valeurs && (
                  <div>
                    <label className="text-sm font-medium">Nouvelles valeurs</label>
                    <pre className="mt-1 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(selectedLog.nouvelles_valeurs, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedLog.user_agent && (
                  <div>
                    <label className="text-sm font-medium">Navigateur</label>
                    <p className="mt-1 text-xs text-muted-foreground">{selectedLog.user_agent}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
