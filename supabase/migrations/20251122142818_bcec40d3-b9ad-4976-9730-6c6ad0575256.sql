-- Create table for custom report templates
CREATE TABLE IF NOT EXISTS public.modeles_rapports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  type_rapport TEXT NOT NULL,
  configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
  est_defaut BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.modeles_rapports ENABLE ROW LEVEL SECURITY;

-- Create policies for modeles_rapports
CREATE POLICY "Allow read access to all users"
  ON public.modeles_rapports
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON public.modeles_rapports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON public.modeles_rapports
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete for authenticated users"
  ON public.modeles_rapports
  FOR DELETE
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_modeles_rapports_updated_at
  BEFORE UPDATE ON public.modeles_rapports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_modeles_rapports_type ON public.modeles_rapports(type_rapport);
CREATE INDEX idx_modeles_rapports_defaut ON public.modeles_rapports(est_defaut);