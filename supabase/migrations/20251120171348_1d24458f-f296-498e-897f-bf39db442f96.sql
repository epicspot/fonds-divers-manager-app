-- Créer la table reference_lists
CREATE TABLE IF NOT EXISTS public.reference_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.reference_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut lire les listes de référence"
ON public.reference_lists FOR SELECT USING (true);

CREATE POLICY "Tout le monde peut créer des listes de référence"
ON public.reference_lists FOR INSERT WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les listes de référence"
ON public.reference_lists FOR UPDATE USING (true);

CREATE POLICY "Tout le monde peut supprimer les listes de référence"
ON public.reference_lists FOR DELETE USING (true);

CREATE TRIGGER update_reference_lists_updated_at
  BEFORE UPDATE ON public.reference_lists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();