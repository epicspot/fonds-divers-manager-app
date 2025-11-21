-- Créer la table historique_repartitions
CREATE TABLE public.historique_repartitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affaire_id UUID REFERENCES public.affaires_contentieuses(id) ON DELETE CASCADE,
  numero_affaire TEXT,
  date_repartition TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  montant_total NUMERIC NOT NULL,
  montant_net NUMERIC NOT NULL,
  part_fsp NUMERIC NOT NULL,
  part_tresor NUMERIC NOT NULL,
  part_mutuelle NUMERIC NOT NULL,
  part_fonds_solidarite NUMERIC NOT NULL,
  part_fonds_formation NUMERIC NOT NULL,
  part_fonds_equipement NUMERIC NOT NULL,
  part_prime_rendement NUMERIC NOT NULL,
  ayants_droits JSONB NOT NULL DEFAULT '[]'::jsonb,
  parametres JSONB NOT NULL DEFAULT '{}'::jsonb,
  verifications_ok BOOLEAN NOT NULL DEFAULT true,
  erreurs JSONB DEFAULT '[]'::jsonb,
  utilisateur TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.historique_repartitions ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Tout le monde peut créer un historique de répartition"
ON public.historique_repartitions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Tout le monde peut lire l'historique des répartitions"
ON public.historique_repartitions
FOR SELECT
USING (true);

CREATE POLICY "Tout le monde peut modifier l'historique des répartitions"
ON public.historique_repartitions
FOR UPDATE
USING (true);

CREATE POLICY "Tout le monde peut supprimer l'historique des répartitions"
ON public.historique_repartitions
FOR DELETE
USING (true);

-- Créer un index sur affaire_id pour améliorer les performances
CREATE INDEX idx_historique_repartitions_affaire_id ON public.historique_repartitions(affaire_id);

-- Créer un index sur date_repartition pour le tri
CREATE INDEX idx_historique_repartitions_date ON public.historique_repartitions(date_repartition DESC);

-- Ajouter un trigger pour mettre à jour updated_at
CREATE TRIGGER update_historique_repartitions_updated_at
BEFORE UPDATE ON public.historique_repartitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();