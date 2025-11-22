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
  }
};
