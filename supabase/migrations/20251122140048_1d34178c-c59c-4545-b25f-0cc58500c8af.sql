-- Table pour tracker les événements de suggestions
CREATE TABLE IF NOT EXISTS public.suggestions_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bureau_nom TEXT NOT NULL,
  region TEXT,
  field_name TEXT NOT NULL,
  suggested_value JSONB NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('accepted', 'rejected', 'ignored')),
  confidence TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'low')),
  source TEXT NOT NULL CHECK (source IN ('bureau_default', 'similar_cases', 'frequent_value', 'ml_improved')),
  context_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.suggestions_events ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Tout le monde peut créer des événements de suggestions"
  ON public.suggestions_events
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Tout le monde peut lire les événements de suggestions"
  ON public.suggestions_events
  FOR SELECT
  USING (true);

CREATE POLICY "Tout le monde peut supprimer les événements de suggestions"
  ON public.suggestions_events
  FOR DELETE
  USING (true);

-- Index pour les analyses fréquentes
CREATE INDEX idx_suggestions_events_bureau ON public.suggestions_events(bureau_nom);
CREATE INDEX idx_suggestions_events_field ON public.suggestions_events(field_name);
CREATE INDEX idx_suggestions_events_action ON public.suggestions_events(action);
CREATE INDEX idx_suggestions_events_created_at ON public.suggestions_events(created_at DESC);

-- Table pour stocker les insights générés par l'IA
CREATE TABLE IF NOT EXISTS public.suggestions_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bureau_nom TEXT,
  field_name TEXT NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('pattern', 'preference', 'recommendation')),
  insight_data JSONB NOT NULL,
  confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  based_on_events_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(bureau_nom, field_name, insight_type)
);

-- Enable RLS
ALTER TABLE public.suggestions_insights ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Tout le monde peut lire les insights"
  ON public.suggestions_insights
  FOR SELECT
  USING (true);

CREATE POLICY "Tout le monde peut créer des insights"
  ON public.suggestions_insights
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les insights"
  ON public.suggestions_insights
  FOR UPDATE
  USING (true);

-- Trigger pour updated_at
CREATE TRIGGER update_suggestions_insights_updated_at
  BEFORE UPDATE ON public.suggestions_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour les requêtes fréquentes
CREATE INDEX idx_suggestions_insights_bureau ON public.suggestions_insights(bureau_nom);
CREATE INDEX idx_suggestions_insights_field ON public.suggestions_insights(field_name);
CREATE INDEX idx_suggestions_insights_confidence ON public.suggestions_insights(confidence_score DESC);

COMMENT ON TABLE public.suggestions_events IS 'Événements de tracking des suggestions acceptées/rejetées';
COMMENT ON TABLE public.suggestions_insights IS 'Insights générés par l''IA pour améliorer les suggestions';
