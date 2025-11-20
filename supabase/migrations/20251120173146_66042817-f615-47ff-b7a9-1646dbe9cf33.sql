-- Créer la table actions_suivi pour l'historique des actions
CREATE TABLE IF NOT EXISTS public.actions_suivi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affaire_id UUID NOT NULL REFERENCES public.affaires_contentieuses(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('transmission', 'validation', 'rejet', 'modification', 'approbation', 'creation')),
  statut_avant TEXT,
  statut_apres TEXT,
  utilisateur TEXT NOT NULL,
  commentaire TEXT,
  date_action TIMESTAMPTZ NOT NULL DEFAULT now(),
  delai_prevu INTEGER,
  date_echeance TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_actions_suivi_affaire_id ON public.actions_suivi(affaire_id);
CREATE INDEX IF NOT EXISTS idx_actions_suivi_date ON public.actions_suivi(date_action DESC);

-- Activer RLS
ALTER TABLE public.actions_suivi ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Tout le monde peut lire les actions de suivi"
ON public.actions_suivi FOR SELECT USING (true);

CREATE POLICY "Tout le monde peut créer des actions de suivi"
ON public.actions_suivi FOR INSERT WITH CHECK (true);

CREATE POLICY "Tout le monde peut modifier les actions de suivi"
ON public.actions_suivi FOR UPDATE USING (true);

CREATE POLICY "Tout le monde peut supprimer les actions de suivi"
ON public.actions_suivi FOR DELETE USING (true);

-- Fonction pour enregistrer automatiquement les changements de statut
CREATE OR REPLACE FUNCTION public.enregistrer_changement_statut()
RETURNS TRIGGER AS $$
BEGIN
  -- Enregistrer seulement si le statut a changé
  IF (TG_OP = 'UPDATE' AND OLD.statut IS DISTINCT FROM NEW.statut) THEN
    INSERT INTO public.actions_suivi (
      affaire_id,
      type,
      statut_avant,
      statut_apres,
      utilisateur,
      commentaire
    ) VALUES (
      NEW.id,
      CASE 
        WHEN NEW.statut = 'validee' THEN 'validation'
        WHEN NEW.statut = 'en_attente_hierarchie' THEN 'transmission'
        WHEN NEW.statut = 'en_repartition' THEN 'approbation'
        ELSE 'modification'
      END,
      OLD.statut,
      NEW.statut,
      'Système',
      'Changement de statut automatique'
    );
  END IF;
  
  -- Enregistrer la création d'une nouvelle affaire
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.actions_suivi (
      affaire_id,
      type,
      statut_avant,
      statut_apres,
      utilisateur,
      commentaire
    ) VALUES (
      NEW.id,
      'creation',
      NULL,
      NEW.statut,
      'Système',
      'Création de l''affaire'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour enregistrer les changements de statut
CREATE TRIGGER trigger_enregistrer_changement_statut
  AFTER INSERT OR UPDATE ON public.affaires_contentieuses
  FOR EACH ROW
  EXECUTE FUNCTION public.enregistrer_changement_statut();