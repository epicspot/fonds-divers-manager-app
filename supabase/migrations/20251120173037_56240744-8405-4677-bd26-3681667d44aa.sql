-- Supprimer la contrainte CHECK existante sur le statut
ALTER TABLE public.affaires_contentieuses 
DROP CONSTRAINT IF EXISTS affaires_contentieuses_statut_check;

-- Ajouter une nouvelle contrainte CHECK avec tous les statuts nécessaires
ALTER TABLE public.affaires_contentieuses 
ADD CONSTRAINT affaires_contentieuses_statut_check 
CHECK (statut IN ('brouillon', 'validee', 'en_attente_hierarchie', 'en_repartition', 'cloturee'));