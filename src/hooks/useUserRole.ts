import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getUserRole } from '@/lib/userRolesApi';

export type AppRole = 'admin' | 'superviseur' | 'utilisateur';

interface UserRole {
  role: AppRole;
  user_id: string;
}

export const useUserRole = () => {
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }

        const userRole = await getUserRole(user.id);
        setRole(userRole);
      } catch (err) {
        console.error('Erreur:', err);
        setRole('utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const isAdmin = role === 'admin';
  const isSuperviseur = role === 'superviseur' || isAdmin;
  const isUtilisateur = role === 'utilisateur';

  return {
    role,
    loading,
    isAdmin,
    isSuperviseur,
    isUtilisateur,
  };
};
