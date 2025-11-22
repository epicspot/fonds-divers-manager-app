import { supabase } from "@/integrations/supabase/client";
import { AffaireContentieuse } from "@/types/affaire";
import { Database } from "@/integrations/supabase/types";

type AffaireRow = Database['public']['Tables']['affaires_contentieuses']['Row'];
type AffaireInsert = Database['public']['Tables']['affaires_contentieuses']['Insert'];
type AffaireUpdate = Database['public']['Tables']['affaires_contentieuses']['Update'];

// Fonction pour convertir une row de la DB vers le type AffaireContentieuse
const mapRowToAffaire = (row: AffaireRow): AffaireContentieuse => {
  const donnees = (row.donnees as any) || {};
  
  return {
    id: row.id,
    numeroAffaire: row.numero_affaire,
    numeroReference: donnees.numeroReference,
    dateReference: donnees.dateReference,
    dateAffaire: donnees.dateAffaire,
    descriptionAffaire: donnees.descriptionAffaire || '',
    montantAffaire: Number(donnees.montantAffaire || 0),
    
    // Relations
    regionDgd: donnees.regionDgd,
    bureauPoste: donnees.bureauPoste,
    
    // Déclaration
    numeroDeclaration: donnees.numeroDeclaration,
    dateDeclaration: donnees.dateDeclaration,
    
    // Contrevenant
    nomPrenomContrevenant: donnees.nomPrenomContrevenant,
    adresseComplete: donnees.adresseComplete,
    ifu: donnees.ifu,
    
    // Transport
    natureTransport: donnees.natureTransport,
    identificationTransport: donnees.identificationTransport,
    commissionnaireDouane: donnees.commissionnaireDouane,
    procedureDetectionFraude: donnees.procedureDetectionFraude,
    natureMarchandisesFraude: donnees.natureMarchandisesFraude,
    
    // Sucrerie
    origineProvenance: donnees.origineProvenance,
    poidsKg: donnees.poidsKg ? Number(donnees.poidsKg) : undefined,
    
    // Valeurs
    valeurMarchandisesLitigieuses: donnees.valeurMarchandisesLitigieuses ? Number(donnees.valeurMarchandisesLitigieuses) : undefined,
    natureInfraction: donnees.natureInfraction,
    droitsCompromis: donnees.droitsCompromis ? Number(donnees.droitsCompromis) : undefined,
    numeroQuittanceDate: donnees.numeroQuittanceDate,
    nombreInformateurs: donnees.nombreInformateurs,
    
    // Transaction
    suiteAffaire: donnees.suiteAffaire,
    dateTransaction: donnees.dateTransaction,
    montantAmende: donnees.montantAmende ? Number(donnees.montantAmende) : undefined,
    montantVente: donnees.montantVente ? Number(donnees.montantVente) : undefined,
    numeroQuittanceDateTransaction: donnees.numeroQuittanceDateTransaction,
    montantTotalFrais: donnees.montantTotalFrais ? Number(donnees.montantTotalFrais) : undefined,
    produitNetRepartir: donnees.produitNetRepartir ? Number(donnees.produitNetRepartir) : undefined,
    
    // Autres
    natureNombrePieces: donnees.natureNombrePieces,
    suiteReserveeMarchandises: donnees.suiteReserveeMarchandises,
    detailsFrais: donnees.detailsFrais,
    dateRepartition: donnees.dateRepartition,
    numeroBordereauRatification: donnees.numeroBordereauRatification,
    circonstancesParticulieres: donnees.circonstancesParticulieres,
    
    // Statut et métadonnées
    statut: (row.statut as 'brouillon' | 'validee' | 'en_repartition' | 'en_attente_hierarchie') || 'brouillon',
    observations: donnees.observations,
    dateCreation: row.date_saisie || row.created_at || new Date().toISOString(),
    dateValidation: row.date_validation || undefined,
    dateTransmissionHierarchie: donnees.dateTransmissionHierarchie,
    dateApprobationHierarchie: donnees.dateApprobationHierarchie,
    
    // Champs qui nécessitent un traitement spécial pour le personnel
    nomsSaisissant: donnees.nomsSaisissant || [],
    nomsChefs: donnees.nomsChefs || [],
    nomsIntervenants: donnees.nomsIntervenants || []
  };
};

// Fonction pour convertir AffaireContentieuse vers AffaireInsert
const mapAffaireToInsert = (affaire: Partial<AffaireContentieuse>): AffaireInsert => {
  const donnees: any = {
    numeroReference: affaire.numeroReference,
    dateReference: affaire.dateReference,
    dateAffaire: affaire.dateAffaire,
    descriptionAffaire: affaire.descriptionAffaire,
    montantAffaire: affaire.montantAffaire,
    
    regionDgd: affaire.regionDgd,
    bureauPoste: affaire.bureauPoste,
    
    numeroDeclaration: affaire.numeroDeclaration,
    dateDeclaration: affaire.dateDeclaration,
    
    nomPrenomContrevenant: affaire.nomPrenomContrevenant,
    adresseComplete: affaire.adresseComplete,
    ifu: affaire.ifu,
    
    natureTransport: affaire.natureTransport,
    identificationTransport: affaire.identificationTransport,
    commissionnaireDouane: affaire.commissionnaireDouane,
    procedureDetectionFraude: affaire.procedureDetectionFraude,
    natureMarchandisesFraude: affaire.natureMarchandisesFraude,
    
    origineProvenance: affaire.origineProvenance,
    poidsKg: affaire.poidsKg,
    
    valeurMarchandisesLitigieuses: affaire.valeurMarchandisesLitigieuses,
    natureInfraction: affaire.natureInfraction,
    droitsCompromis: affaire.droitsCompromis,
    numeroQuittanceDate: affaire.numeroQuittanceDate,
    nombreInformateurs: affaire.nombreInformateurs,
    
    suiteAffaire: affaire.suiteAffaire,
    dateTransaction: affaire.dateTransaction,
    montantAmende: affaire.montantAmende,
    montantVente: affaire.montantVente,
    numeroQuittanceDateTransaction: affaire.numeroQuittanceDateTransaction,
    montantTotalFrais: affaire.montantTotalFrais,
    produitNetRepartir: affaire.produitNetRepartir,
    
    natureNombrePieces: affaire.natureNombrePieces,
    suiteReserveeMarchandises: affaire.suiteReserveeMarchandises,
    detailsFrais: affaire.detailsFrais,
    dateRepartition: affaire.dateRepartition,
    numeroBordereauRatification: affaire.numeroBordereauRatification,
    circonstancesParticulieres: affaire.circonstancesParticulieres,
    
    observations: affaire.observations,
    dateTransmissionHierarchie: affaire.dateTransmissionHierarchie,
    dateApprobationHierarchie: affaire.dateApprobationHierarchie,
    
    nomsSaisissant: affaire.nomsSaisissant,
    nomsChefs: affaire.nomsChefs,
    nomsIntervenants: affaire.nomsIntervenants
  };

  return {
    numero_affaire: affaire.numeroAffaire!,
    statut: affaire.statut,
    date_saisie: affaire.dateCreation,
    date_validation: affaire.dateValidation || null,
    donnees: donnees
  };
};

// Fonction pour valider une affaire côté serveur
const validerAffaireCoteServeur = async (affaire: Partial<AffaireContentieuse>): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('validate-affaire', {
      body: affaire
    });

    if (error) {
      console.error('Erreur lors de l\'appel à validate-affaire:', error);
      throw new Error('Erreur de validation serveur');
    }

    if (!data.valid) {
      const errorMessages = data.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
      throw new Error(`Validation échouée: ${errorMessages}`);
    }
  } catch (error: any) {
    console.error('Erreur de validation côté serveur:', error);
    throw new Error(error.message || 'Erreur de validation serveur');
  }
};

export const affairesService = {
  // Créer une nouvelle affaire
  async creerAffaire(affaire: Partial<AffaireContentieuse>): Promise<AffaireContentieuse> {
    // Validation côté serveur
    await validerAffaireCoteServeur(affaire);
    
    const { data, error } = await supabase
      .from('affaires_contentieuses')
      .insert(mapAffaireToInsert(affaire))
      .select()
      .single();

    if (error) throw error;
    return mapRowToAffaire(data);
  },

  // Obtenir toutes les affaires
  async obtenirAffaires(): Promise<AffaireContentieuse[]> {
    const { data, error } = await supabase
      .from('affaires_contentieuses')
      .select('*')
      .order('date_saisie', { ascending: false });

    if (error) throw error;
    return data.map(mapRowToAffaire);
  },

  // Obtenir une affaire par ID
  async obtenirAffaire(id: string): Promise<AffaireContentieuse | null> {
    const { data, error } = await supabase
      .from('affaires_contentieuses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return mapRowToAffaire(data);
  },

  // Mettre à jour une affaire
  async mettreAJourAffaire(id: string, affaire: Partial<AffaireContentieuse>): Promise<AffaireContentieuse> {
    // Validation côté serveur
    await validerAffaireCoteServeur(affaire);
    
    const { data, error } = await supabase
      .from('affaires_contentieuses')
      .update(mapAffaireToInsert(affaire) as AffaireUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapRowToAffaire(data);
  },

  // Supprimer une affaire
  async supprimerAffaire(id: string): Promise<void> {
    const { error } = await supabase
      .from('affaires_contentieuses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Valider une affaire
  async validerAffaire(id: string): Promise<void> {
    const { error } = await supabase
      .from('affaires_contentieuses')
      .update({
        statut: 'validee',
        date_validation: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }
};
