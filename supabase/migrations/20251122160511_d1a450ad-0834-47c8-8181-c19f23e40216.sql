-- Créer une table pour l'audit log
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  utilisateur_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  utilisateur_email text NOT NULL,
  action text NOT NULL,
  type_entite text NOT NULL,
  entite_id text,
  entite_nom text,
  anciennes_valeurs jsonb,
  nouvelles_valeurs jsonb,
  details text,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies pour audit_logs
CREATE POLICY "Administrateurs peuvent lire les logs"
ON public.audit_logs FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Tout le monde peut créer des logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- Index pour améliorer les performances des requêtes
CREATE INDEX idx_audit_logs_utilisateur_id ON public.audit_logs(utilisateur_id);
CREATE INDEX idx_audit_logs_type_entite ON public.audit_logs(type_entite);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);

-- Fonction pour nettoyer les anciens logs (garder 6 mois)
CREATE OR REPLACE FUNCTION public.clean_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.audit_logs
  WHERE created_at < NOW() - INTERVAL '6 months';
END;
$$;