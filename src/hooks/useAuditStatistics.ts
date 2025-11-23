import { useState, useEffect } from 'react';
import { auditLogsService } from '@/services/auditLogsService';
import { toast } from 'sonner';

export interface AuditStatistics {
  total: number;
  byAction: Array<{ action: string; count: number }>;
  byType: Array<{ type: string; count: number }>;
  byUser: Array<{ utilisateur_email: string; count: number }>;
  byPeriod: Array<{ date: string; count: number }>;
  byUserAndAction: Array<{ utilisateur_email: string; action: string; count: number }>;
}

export function useAuditStatistics(periodDays: number = 30) {
  const [statistics, setStatistics] = useState<AuditStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatistics = async () => {
    try {
      setLoading(true);

      const [detailedStats, userStats, periodStats] = await Promise.all([
        auditLogsService.getDetailedStats(),
        auditLogsService.getStatsByUser(),
        auditLogsService.getStatsByPeriod(periodDays)
      ]);

      setStatistics({
        total: detailedStats.byAction.reduce((sum, item) => sum + item.count, 0),
        byAction: detailedStats.byAction,
        byType: detailedStats.byType,
        byUser: userStats.slice(0, 10), // Top 10 users
        byPeriod: periodStats,
        byUserAndAction: detailedStats.byUserAndAction
      });
    } catch (error) {
      console.error('Error loading audit statistics:', error);
      toast.error('Impossible de charger les statistiques d\'audit');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, [periodDays]);

  return {
    statistics,
    loading,
    refetch: loadStatistics
  };
}
