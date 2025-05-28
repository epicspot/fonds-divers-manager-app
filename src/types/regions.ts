
export interface Region {
  id: string;
  nom: string;
  created_at?: string;
  updated_at?: string;
}

export interface Bureau {
  id: string;
  nom: string;
  region_id: string;
  adresse: string;
  created_at?: string;
  updated_at?: string;
}
