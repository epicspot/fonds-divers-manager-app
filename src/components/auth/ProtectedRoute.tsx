import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!loading && user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_active')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error checking user status:', error);
            setChecking(false);
            return;
          }

          if (profile && !profile.is_active) {
            // Compte désactivé - déconnecter
            await signOut();
            toast.error('Votre compte a été désactivé. Veuillez contacter un administrateur.');
            navigate('/auth');
            return;
          }

          setChecking(false);
        } catch (error) {
          console.error('Error checking user status:', error);
          setChecking(false);
        }
      } else if (!loading && !user) {
        navigate('/auth');
        setChecking(false);
      } else if (!loading) {
        setChecking(false);
      }
    };

    checkUserStatus();
  }, [user, loading, navigate, signOut]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
