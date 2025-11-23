import { supabase } from "@/integrations/supabase/client";

export interface AuditLog {
  id: string;
  utilisateur_id: string | null;
  utilisateur_email: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ACTIVATE';
  type_entite: string;
  entite_id?: string;
  entite_nom?: string;
  anciennes_valeurs?: any;
  nouvelles_valeurs?: any;
  details?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface CreateAuditLogParams {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ACTIVATE';
  type_entite: string;
  entite_id?: string;
  entite_nom?: string;
  anciennes_valeurs?: any;
  nouvelles_valeurs?: any;
  details?: string;
}

export const auditLogsService = {
  // Créer un log d'audit
  async createLog(params: CreateAuditLogParams): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No user found for audit log');
        return;
      }

      const { error } = await supabase
        .from('audit_logs')
        .insert({
          utilisateur_id: user.id,
          utilisateur_email: user.email || 'unknown',
          action: params.action,
          type_entite: params.type_entite,
          entite_id: params.entite_id,
          entite_nom: params.entite_nom,
          anciennes_valeurs: params.anciennes_valeurs,
          nouvelles_valeurs: params.nouvelles_valeurs,
          details: params.details,
          ip_address: null, // Could be populated from request headers
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error creating audit log:', error);
      }
    } catch (error) {
      console.error('Error in createLog:', error);
    }
  },

  // Récupérer les logs avec filtres
  async getLogs(filters?: {
    type_entite?: string;
    action?: string;
    utilisateur_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLog[], count: number }> {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters?.type_entite) {
        query = query.eq('type_entite', filters.type_entite);
      }

      if (filters?.action) {
        query = query.eq('action', filters.action);
      }

      if (filters?.utilisateur_id) {
        query = query.eq('utilisateur_id', filters.utilisateur_id);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        logs: (data || []) as AuditLog[],
        count: count || 0
      };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },

  // Récupérer les logs pour une entité spécifique
  async getLogsForEntity(type_entite: string, entite_id: string): Promise<AuditLog[]> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('type_entite', type_entite)
        .eq('entite_id', entite_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as AuditLog[];
    } catch (error) {
      console.error('Error fetching entity logs:', error);
      throw error;
    }
  },

  // Nettoyer les anciens logs (appel à la fonction serveur)
  async cleanOldLogs(): Promise<void> {
    try {
      const { error } = await supabase.rpc('clean_old_audit_logs');
      if (error) throw error;
    } catch (error) {
      console.error('Error cleaning old logs:', error);
      throw error;
    }
  },

  // Obtenir des statistiques sur les logs
  async getStatistics(): Promise<{
    total: number;
    parAction: Record<string, number>;
    parType: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('action, type_entite');

      if (error) throw error;

      const logs = data || [];
      
      const parAction: Record<string, number> = {};
      const parType: Record<string, number> = {};

      logs.forEach(log => {
        parAction[log.action] = (parAction[log.action] || 0) + 1;
        parType[log.type_entite] = (parType[log.type_entite] || 0) + 1;
      });

      return {
        total: logs.length,
        parAction,
        parType
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Statistiques par utilisateur
  async getStatsByUser(): Promise<Array<{ utilisateur_email: string; count: number }>> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('utilisateur_email');

      if (error) throw error;

      const logs = data || [];
      const userStats: Record<string, number> = {};

      logs.forEach(log => {
        userStats[log.utilisateur_email] = (userStats[log.utilisateur_email] || 0) + 1;
      });

      return Object.entries(userStats)
        .map(([email, count]) => ({ utilisateur_email: email, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw error;
    }
  },

  // Statistiques par période (derniers 30 jours)
  async getStatsByPeriod(days: number = 30): Promise<Array<{ date: string; count: number }>> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('audit_logs')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      const logs = data || [];
      const dateStats: Record<string, number> = {};

      logs.forEach(log => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        dateStats[date] = (dateStats[date] || 0) + 1;
      });

      return Object.entries(dateStats)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      console.error('Error fetching period statistics:', error);
      throw error;
    }
  },

  // Statistiques par action et type d'entité
  async getDetailedStats(): Promise<{
    byAction: Array<{ action: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
    byUserAndAction: Array<{ utilisateur_email: string; action: string; count: number }>;
  }> {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('action, type_entite, utilisateur_email');

      if (error) throw error;

      const logs = data || [];
      
      const actionStats: Record<string, number> = {};
      const typeStats: Record<string, number> = {};
      const userActionStats: Record<string, number> = {};

      logs.forEach(log => {
        actionStats[log.action] = (actionStats[log.action] || 0) + 1;
        typeStats[log.type_entite] = (typeStats[log.type_entite] || 0) + 1;
        const key = `${log.utilisateur_email}|${log.action}`;
        userActionStats[key] = (userActionStats[key] || 0) + 1;
      });

      return {
        byAction: Object.entries(actionStats)
          .map(([action, count]) => ({ action, count }))
          .sort((a, b) => b.count - a.count),
        byType: Object.entries(typeStats)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count),
        byUserAndAction: Object.entries(userActionStats)
          .map(([key, count]) => {
            const [utilisateur_email, action] = key.split('|');
            return { utilisateur_email, action, count };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 10) // Top 10
      };
    } catch (error) {
      console.error('Error fetching detailed statistics:', error);
      throw error;
    }
  }
};
