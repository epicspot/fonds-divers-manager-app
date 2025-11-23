-- Ajouter une colonne is_active à la table profiles pour gérer le statut des utilisateurs
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Créer un index pour améliorer les performances des requêtes sur le statut
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.profiles.is_active IS 'Indique si le compte utilisateur est actif. Les comptes désactivés ne peuvent pas se connecter.';
