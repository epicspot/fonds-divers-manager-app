import { supabase } from '@/integrations/supabase/client';

import type { Json } from '@/integrations/supabase/types';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: Json;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Créer une notification
 */
export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  data: Json = {}
): Promise<{ data: Notification | null; error: any }> => {
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
      })
      .select()
      .single();

    if (error) throw error;

    return { data: notification, error: null };
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    return { data: null, error };
  }
};

/**
 * Récupérer les notifications d'un utilisateur
 */
export const getNotifications = async (
  userId: string,
  limit: number = 50
): Promise<{ data: Notification[]; error: any }> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return { data: [], error };
  }
};

/**
 * Marquer une notification comme lue
 */
export const markAsRead = async (notificationId: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
    return { error };
  }
};

/**
 * Marquer toutes les notifications comme lues
 */
export const markAllAsRead = async (userId: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications:', error);
    return { error };
  }
};

/**
 * Supprimer une notification
 */
export const deleteNotification = async (notificationId: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    return { error };
  }
};

/**
 * Supprimer toutes les notifications lues
 */
export const deleteReadNotifications = async (userId: string): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('is_read', true);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications lues:', error);
    return { error };
  }
};

/**
 * Compter les notifications non lues
 */
export const getUnreadCount = async (userId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Erreur lors du comptage des notifications non lues:', error);
    return 0;
  }
};
