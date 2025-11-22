-- Créer une table pour les configurations système
CREATE TABLE IF NOT EXISTS public.configurations_systeme (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cle text NOT NULL UNIQUE,
  valeur jsonb NOT NULL DEFAULT '{}',
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.configurations_systeme ENABLE ROW LEVEL SECURITY;

-- Policies pour configurations_systeme
CREATE POLICY "Tout le monde peut lire les configurations système"
ON public.configurations_systeme FOR SELECT
USING (true);

CREATE POLICY "Tout le monde peut créer des configurations système"
ON public.configurations_systeme FOR INSERT
WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les configurations système"
ON public.configurations_systeme FOR UPDATE
USING (true);

CREATE POLICY "Tout le monde peut supprimer les configurations système"
ON public.configurations_systeme FOR DELETE
USING (true);

-- Créer une table pour les règles de validation
CREATE TABLE IF NOT EXISTS public.configurations_validation (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom text NOT NULL,
  description text,
  regles jsonb NOT NULL DEFAULT '[]',
  est_actif boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.configurations_validation ENABLE ROW LEVEL SECURITY;

-- Policies pour configurations_validation
CREATE POLICY "Tout le monde peut lire les configurations de validation"
ON public.configurations_validation FOR SELECT
USING (true);

CREATE POLICY "Tout le monde peut créer des configurations de validation"
ON public.configurations_validation FOR INSERT
WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les configurations de validation"
ON public.configurations_validation FOR UPDATE
USING (true);

CREATE POLICY "Tout le monde peut supprimer les configurations de validation"
ON public.configurations_validation FOR DELETE
USING (true);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_configurations_systeme_updated_at
BEFORE UPDATE ON public.configurations_systeme
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_configurations_validation_updated_at
BEFORE UPDATE ON public.configurations_validation
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer des configurations par défaut
INSERT INTO public.configurations_systeme (cle, valeur, description) VALUES
  ('parametres_generaux', '{"delaiValidation": 7, "montantMinimal": 100000, "nombreMaxInformateurs": 10}', 'Paramètres généraux du système'),
  ('saisissants_config', '[]', 'Liste des saisissants'),
  ('chefs_config', '[]', 'Liste des chefs'),
  ('intervenants_config', '[]', 'Liste des intervenants'),
  ('pieces_config', '[]', 'Liste des pièces')
ON CONFLICT (cle) DO NOTHING;

-- Insérer une configuration de validation par défaut
INSERT INTO public.configurations_validation (nom, description, regles, est_actif) VALUES
  ('Défaut', 'Configuration de validation par défaut', '[]', true)
ON CONFLICT DO NOTHING;