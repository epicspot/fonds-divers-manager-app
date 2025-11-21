-- Corriger la fonction pour ajouter le search_path
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
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;