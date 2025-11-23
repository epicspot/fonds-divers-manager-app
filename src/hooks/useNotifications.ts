import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  getUnreadCount,
  type Notification,
} from '@/services/notificationsService';
import { toast } from 'sonner';

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await getNotifications(userId);
      setNotifications(data);

      const count = await getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Écouter les nouvelles notifications en temps réel
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          // Afficher un toast pour la nouvelle notification
          toast.info(newNotification.title, {
            description: newNotification.message,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updatedNotification.id ? updatedNotification : n))
          );
          
          // Mettre à jour le compteur
          if (updatedNotification.is_read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const deletedNotification = payload.old as Notification;
          setNotifications((prev) => prev.filter((n) => n.id !== deletedNotification.id));
          
          // Mettre à jour le compteur si la notification n'était pas lue
          if (!deletedNotification.is_read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    const { error } = await markAsRead(notificationId);
    if (error) {
      toast.error('Impossible de marquer la notification comme lue');
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    if (!userId) return;
    
    const { error } = await markAllAsRead(userId);
    if (error) {
      toast.error('Impossible de marquer toutes les notifications comme lues');
    } else {
      toast.success('Toutes les notifications ont été marquées comme lues');
    }
  }, [userId]);

  const handleDelete = useCallback(async (notificationId: string) => {
    const { error } = await deleteNotification(notificationId);
    if (error) {
      toast.error('Impossible de supprimer la notification');
    }
  }, []);

  const handleDeleteRead = useCallback(async () => {
    if (!userId) return;
    
    const { error } = await deleteReadNotifications(userId);
    if (error) {
      toast.error('Impossible de supprimer les notifications lues');
    } else {
      toast.success('Notifications lues supprimées');
    }
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDelete,
    deleteReadNotifications: handleDeleteRead,
    refresh: loadNotifications,
  };
};
