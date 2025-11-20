-- Créer la table personnel
CREATE TABLE IF NOT EXISTS public.personnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_complet TEXT NOT NULL,
  fonction TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('saisissant', 'chef', 'intervenant')),
  region TEXT,
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activer RLS sur personnel
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour personnel
CREATE POLICY "Tout le monde peut lire le personnel"
ON public.personnel FOR SELECT USING (true);

CREATE POLICY "Tout le monde peut créer du personnel"
ON public.personnel FOR INSERT WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier le personnel"
ON public.personnel FOR UPDATE USING (true);

CREATE POLICY "Tout le monde peut supprimer le personnel"
ON public.personnel FOR DELETE USING (true);

-- Créer la table regions si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut lire les régions"
ON public.regions FOR SELECT USING (true);

CREATE POLICY "Tout le monde peut créer des régions"
ON public.regions FOR INSERT WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les régions"
ON public.regions FOR UPDATE USING (true);

CREATE POLICY "Tout le monde peut supprimer les régions"
ON public.regions FOR DELETE USING (true);

-- Créer la table bureaux si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.bureaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  adresse TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bureaux ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut lire les bureaux"
ON public.bureaux FOR SELECT USING (true);

CREATE POLICY "Tout le monde peut créer des bureaux"
ON public.bureaux FOR INSERT WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les bureaux"
ON public.bureaux FOR UPDATE USING (true);

CREATE POLICY "Tout le monde peut supprimer les bureaux"
ON public.bureaux FOR DELETE USING (true);

-- Créer une table pour les règles de répartition
CREATE TABLE IF NOT EXISTS public.regles_repartition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL UNIQUE,
  pourcentage_base NUMERIC(5,2) NOT NULL,
  pourcentage_max NUMERIC(5,2) NOT NULL,
  conditions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.regles_repartition ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut lire les règles de répartition"
ON public.regles_repartition FOR SELECT USING (true);

CREATE POLICY "Tout le monde peut créer des règles de répartition"
ON public.regles_repartition FOR INSERT WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les règles de répartition"
ON public.regles_repartition FOR UPDATE USING (true);

CREATE POLICY "Tout le monde peut supprimer les règles de répartition"
ON public.regles_repartition FOR DELETE USING (true);

-- Créer la table affaires_contentieuses si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.affaires_contentieuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_affaire TEXT NOT NULL UNIQUE,
  statut TEXT DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'validee', 'cloturee')),
  date_saisie TIMESTAMPTZ DEFAULT now(),
  date_validation TIMESTAMPTZ,
  donnees JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.affaires_contentieuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut lire les affaires"
ON public.affaires_contentieuses FOR SELECT USING (true);

CREATE POLICY "Tout le monde peut créer des affaires"
ON public.affaires_contentieuses FOR INSERT WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les affaires"
ON public.affaires_contentieuses FOR UPDATE USING (true);

CREATE POLICY "Tout le monde peut supprimer les affaires"
ON public.affaires_contentieuses FOR DELETE USING (true);

-- Créer une table pour les rapports générés
CREATE TABLE IF NOT EXISTS public.rapports_generes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affaire_id UUID NOT NULL REFERENCES public.affaires_contentieuses(id) ON DELETE CASCADE,
  date_generation TIMESTAMPTZ NOT NULL DEFAULT now(),
  rapports JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rapports_affaire_id ON public.rapports_generes(affaire_id);

ALTER TABLE public.rapports_generes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut lire les rapports générés"
ON public.rapports_generes FOR SELECT USING (true);

CREATE POLICY "Tout le monde peut créer des rapports"
ON public.rapports_generes FOR INSERT WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les rapports"
ON public.rapports_generes FOR UPDATE USING (true);

CREATE POLICY "Tout le monde peut supprimer les rapports"
ON public.rapports_generes FOR DELETE USING (true);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_personnel_updated_at
  BEFORE UPDATE ON public.personnel
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regions_updated_at
  BEFORE UPDATE ON public.regions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bureaux_updated_at
  BEFORE UPDATE ON public.bureaux
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_regles_repartition_updated_at
  BEFORE UPDATE ON public.regles_repartition
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affaires_updated_at
  BEFORE UPDATE ON public.affaires_contentieuses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rapports_generes_updated_at
  BEFORE UPDATE ON public.rapports_generes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer les règles de répartition par défaut
INSERT INTO public.regles_repartition (type, pourcentage_base, pourcentage_max, conditions)
VALUES 
  ('fsp', 5, 5, '{"montantMin": 0}'::jsonb),
  ('tresor', 40, 40, '{}'::jsonb),
  ('mutuelle', 10, 10, '{}'::jsonb),
  ('poursuivants', 25, 30, '{"nombrePersonnes": 1}'::jsonb),
  ('fonds_solidarite', 8, 10, '{}'::jsonb),
  ('fonds_formation', 7, 10, '{}'::jsonb),
  ('fonds_equipement', 5, 8, '{}'::jsonb),
  ('prime_rendement', 5, 7, '{}'::jsonb)
ON CONFLICT (type) DO NOTHING;