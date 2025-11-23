import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkUserActiveStatus = async (userId: string): Promise<boolean> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_active')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking user status:', error);
        return true; // En cas d'erreur, on permet l'accès par défaut
      }

      return profile?.is_active ?? true;
    } catch (error) {
      console.error('Error checking user status:', error);
      return true;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Si l'utilisateur vient de se connecter, vérifier son statut
        if (event === 'SIGNED_IN' && session?.user) {
          const isActive = await checkUserActiveStatus(session.user.id);
          
          if (!isActive) {
            // Compte désactivé - déconnecter immédiatement
            await supabase.auth.signOut();
            toast.error('Votre compte a été désactivé. Veuillez contacter un administrateur.');
            setSession(null);
            setUser(null);
            setTimeout(() => {
              navigate('/auth');
            }, 0);
            return;
          }

          // Compte actif - continuer normalement
          setSession(session);
          setUser(session.user);
          setTimeout(() => {
            navigate('/dashboard');
          }, 0);
          return;
        }

        // Pour les autres événements
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect to auth when logged out
        if (event === 'SIGNED_OUT') {
          setTimeout(() => {
            navigate('/auth');
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const isActive = await checkUserActiveStatus(session.user.id);
        
        if (!isActive) {
          // Compte désactivé - déconnecter
          await supabase.auth.signOut();
          toast.error('Votre compte a été désactivé. Veuillez contacter un administrateur.');
          setSession(null);
          setUser(null);
          setLoading(false);
          navigate('/auth');
          return;
        }
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
