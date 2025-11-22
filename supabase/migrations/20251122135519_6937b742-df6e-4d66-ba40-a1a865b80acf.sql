-- Table pour stocker les valeurs par défaut par bureau
CREATE TABLE IF NOT EXISTS public.configurations_bureau (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bureau_nom TEXT NOT NULL UNIQUE,
  region TEXT,
  valeurs_defaut JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.configurations_bureau ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Tout le monde peut lire les configurations bureau"
  ON public.configurations_bureau
  FOR SELECT
  USING (true);

CREATE POLICY "Tout le monde peut créer des configurations bureau"
  ON public.configurations_bureau
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les configurations bureau"
  ON public.configurations_bureau
  FOR UPDATE
  USING (true);

CREATE POLICY "Tout le monde peut supprimer les configurations bureau"
  ON public.configurations_bureau
  FOR DELETE
  USING (true);

-- Trigger pour updated_at
CREATE TRIGGER update_configurations_bureau_updated_at
  BEFORE UPDATE ON public.configurations_bureau
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour les recherches fréquentes
CREATE INDEX idx_configurations_bureau_nom ON public.configurations_bureau(bureau_nom);

COMMENT ON TABLE public.configurations_bureau IS 'Configurations et valeurs par défaut pour chaque bureau';
COMMENT ON COLUMN public.configurations_bureau.valeurs_defaut IS 'Valeurs par défaut pour les champs des affaires (JSON)';
