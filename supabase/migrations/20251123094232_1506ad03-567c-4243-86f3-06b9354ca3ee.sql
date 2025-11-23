-- Créer la table des notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leurs propres notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent mettre à jour leurs propres notifications
CREATE POLICY "Users can update own notifications"
ON public.notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Politique: Le système peut créer des notifications
CREATE POLICY "System can create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Politique: Les utilisateurs peuvent supprimer leurs propres notifications
CREATE POLICY "Users can delete own notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Activer le realtime pour les notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Fonction pour créer une notification de changement de rôle
CREATE OR REPLACE FUNCTION public.notify_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_role_label TEXT;
  new_role_label TEXT;
BEGIN
  -- Récupérer les labels des rôles
  old_role_label := CASE OLD.role
    WHEN 'admin' THEN 'Administrateur'
    WHEN 'superviseur' THEN 'Superviseur'
    WHEN 'utilisateur' THEN 'Utilisateur'
    ELSE OLD.role::text
  END;
  
  new_role_label := CASE NEW.role
    WHEN 'admin' THEN 'Administrateur'
    WHEN 'superviseur' THEN 'Superviseur'
    WHEN 'utilisateur' THEN 'Utilisateur'
    ELSE NEW.role::text
  END;
  
  -- Créer la notification
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    data
  ) VALUES (
    NEW.user_id,
    'role_change',
    'Changement de rôle',
    'Votre rôle a été modifié de ' || old_role_label || ' à ' || new_role_label,
    jsonb_build_object(
      'old_role', OLD.role,
      'new_role', NEW.role,
      'timestamp', now()
    )
  );
  
  RETURN NEW;
END;
$$;

-- Trigger pour notifier les changements de rôle
CREATE TRIGGER on_role_change
AFTER UPDATE ON public.user_roles
FOR EACH ROW
WHEN (OLD.role IS DISTINCT FROM NEW.role)
EXECUTE FUNCTION public.notify_role_change();