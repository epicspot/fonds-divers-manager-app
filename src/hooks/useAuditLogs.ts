import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { auditLogsService, AuditLog } from '@/services/auditLogsService';

interface UseAuditLogsOptions {
  type_entite?: string;
  action?: string;
  utilisateur_id?: string;
  autoLoad?: boolean;
}

export function useAuditLogs(options: UseAuditLogsOptions = {}) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const { toast } = useToast();

  const loadLogs = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      const { logs: data, count } = await auditLogsService.getLogs({
        ...options,
        limit: pageSize,
        offset: (pageNum - 1) * pageSize
      });
      
      setLogs(data);
      setTotal(count);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des modifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoLoad !== false) {
      loadLogs();
    }
  }, [options.type_entite, options.action, options.utilisateur_id]);

  const nextPage = () => {
    if (page * pageSize < total) {
      loadLogs(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      loadLogs(page - 1);
    }
  };

  const refetch = () => {
    loadLogs(page);
  };

  return {
    logs,
    loading,
    total,
    page,
    pageSize,
    nextPage,
    prevPage,
    refetch,
    hasNextPage: page * pageSize < total,
    hasPrevPage: page > 1
  };
}
