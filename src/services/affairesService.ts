
import { supabase } from "@/integrations/supabase/client";
import { AffaireContentieuse } from "@/types/affaire";
import { Database } from "@/integrations/supabase/types";

type AffaireRow = Database['public']['Tables']['affaires_contentieuses']['Row'];
type AffaireInsert = Database['public']['Tables']['affaires_contentieuses']['Insert'];
type AffaireUpdate = Database['public']['Tables']['affaires_contentieuses']['Update'];

// Fonction pour convertir une row de la DB vers le type AffaireContentieuse
const mapRowToAffaire = (row: AffaireRow): AffaireContentieuse => {
  return {
    id: row.id,
    numeroAffaire: row.numero_affaire,
    numeroReference: row.numero_reference,
    dateReference: row.date_reference,
    dateAffaire: row.date_affaire,
    descriptionAffaire: row.description_affaire || '',
    montantAffaire: Number(row.montant_affaire),
    
    // Relations
    regionDgd: row.region_id ? [row.region_id] : undefined,
    bureauPoste: row.bureau_id ? [row.bureau_id] : undefined,
    
    // Déclaration
    numeroDeclaration: row.numero_declaration || undefined,
    dateDeclaration: row.date_declaration || undefined,
    
    // Contrevenant
    nomPrenomContrevenant: row.nom_prenom_contrevenant || undefined,
    adresseComplete: row.adresse_complete || undefined,
    ifu: row.ifu || undefined,
    
    // Transport
    natureTransport: row.nature_transport || undefined,
    identificationTransport: row.identification_transport || undefined,
    commissionnaireDouane: row.commissionnaire_douane || undefined,
    procedureDetectionFraude: row.procedure_detection_fraude || undefined,
    natureMarchandisesFraude: row.nature_marchandises_fraude || undefined,
    
    // Sucrerie
    origineProvenance: row.origine_provenance || undefined,
    poidsKg: row.poids_kg ? Number(row.poids_kg) : undefined,
    
    // Valeurs
    valeurMarchandisesLitigieuses: row.valeur_marchandises_litigieuses ? Number(row.valeur_marchandises_litigieuses) : undefined,
    natureInfraction: row.nature_infraction || undefined,
    droitsCompromis: row.droits_compromis ? Number(row.droits_compromis) : undefined,
    numeroQuittanceDate: row.numero_quittance_date || undefined,
    nombreInformateurs: row.nombre_informateurs || undefined,
    
    // Transaction
    suiteAffaire: row.suite_affaire || undefined,
    dateTransaction: row.date_transaction || undefined,
    montantAmende: row.montant_amende ? Number(row.montant_amende) : undefined,
    montantVente: row.montant_vente ? Number(row.montant_vente) : undefined,
    numeroQuittanceDateTransaction: row.numero_quittance_date_transaction || undefined,
    montantTotalFrais: row.montant_total_frais ? Number(row.montant_total_frais) : undefined,
    produitNetRepartir: row.produit_net_repartir ? Number(row.produit_net_repartir) : undefined,
    
    // Autres
    natureNombrePieces: row.nature_nombre_pieces || undefined,
    suiteReserveeMarchandises: row.suite_reservee_marchandises || undefined,
    detailsFrais: row.details_frais || undefined,
    dateRepartition: row.date_repartition || undefined,
    numeroBordereauRatification: row.numero_bordereau_ratification || undefined,
    circonstancesParticulieres: row.circonstances_particulieres || undefined,
    
    // Statut et métadonnées
    statut: (row.statut as 'brouillon' | 'validee' | 'en_repartition' | 'en_attente_hierarchie') || 'brouillon',
    observations: row.observations || undefined,
    dateCreation: row.date_creation || row.created_at || new Date().toISOString(),
    dateValidation: row.date_validation || undefined,
    dateTransmissionHierarchie: row.date_transmission_hierarchie || undefined,
    dateApprobationHierarchie: row.date_approbation_hierarchie || undefined,
    
    // Champs qui nécessitent un traitement spécial pour le personnel
    nomsSaisissant: [],
    nomsChefs: [],
    nomsIntervenants: []
  };
};

// Fonction pour convertir AffaireContentieuse vers AffaireInsert
const mapAffaireToInsert = (affaire: Partial<AffaireContentieuse>): AffaireInsert => {
  return {
    numero_affaire: affaire.numeroAffaire!,
    numero_reference: affaire.numeroReference!,
    date_reference: affaire.dateReference!,
    date_affaire: affaire.dateAffaire!,
    description_affaire: affaire.descriptionAffaire,
    montant_affaire: affaire.montantAffaire!,
    
    region_id: affaire.regionDgd?.[0] || null,
    bureau_id: affaire.bureauPoste?.[0] || null,
    
    numero_declaration: affaire.numeroDeclaration,
    date_declaration: affaire.dateDeclaration,
    
    nom_prenom_contrevenant: affaire.nomPrenomContrevenant,
    adresse_complete: affaire.adresseComplete,
    ifu: affaire.ifu,
    
    nature_transport: affaire.natureTransport,
    identification_transport: affaire.identificationTransport,
    commissionnaire_douane: affaire.commissionnaireDouane,
    procedure_detection_fraude: affaire.procedureDetectionFraude,
    nature_marchandises_fraude: affaire.natureMarchandisesFraude,
    
    origine_provenance: affaire.origineProvenance,
    poids_kg: affaire.poidsKg,
    
    valeur_marchandises_litigieuses: affaire.valeurMarchandisesLitigieuses,
    nature_infraction: affaire.natureInfraction,
    droits_compromis: affaire.droitsCompromis,
    numero_quittance_date: affaire.numeroQuittanceDate,
    nombre_informateurs: affaire.nombreInformateurs,
    
    suite_affaire: affaire.suiteAffaire,
    date_transaction: affaire.dateTransaction,
    montant_amende: affaire.montantAmende,
    montant_vente: affaire.montantVente,
    numero_quittance_date_transaction: affaire.numeroQuittanceDateTransaction,
    montant_total_frais: affaire.montantTotalFrais,
    produit_net_repartir: affaire.produitNetRepartir,
    
    nature_nombre_pieces: affaire.natureNombrePieces,
    suite_reservee_marchandises: affaire.suiteReserveeMarchandises,
    details_frais: affaire.detailsFrais,
    date_repartition: affaire.dateRepartition,
    numero_bordereau_ratification: affaire.numeroBordereauRatification,
    circonstances_particulieres: affaire.circonstancesParticulieres,
    
    statut: affaire.statut,
    observations: affaire.observations,
    date_validation: affaire.dateValidation,
    date_transmission_hierarchie: affaire.dateTransmissionHierarchie,
    date_approbation_hierarchie: affaire.dateApprobationHierarchie
  };
};

export const affairesService = {
  // Créer une nouvelle affaire
  async creerAffaire(affaire: Partial<AffaireContentieuse>): Promise<AffaireContentieuse> {
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
      .order('date_creation', { ascending: false });

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
  },

  // Ajouter du personnel à une affaire
  async ajouterPersonnelAffaire(affaireId: string, personnelId: string, role: 'saisissant' | 'chef' | 'intervenant'): Promise<void> {
    const { error } = await supabase
      .from('affaire_personnel')
      .insert({
        affaire_id: affaireId,
        personnel_id: personnelId,
        role_affaire: role
      });

    if (error) throw error;
  },

  // Obtenir le personnel d'une affaire
  async obtenirPersonnelAffaire(affaireId: string) {
    const { data, error } = await supabase
      .from('affaire_personnel')
      .select(`
        *,
        personnel:personnel_id (
          id,
          nom_complet,
          fonction,
          role
        )
      `)
      .eq('affaire_id', affaireId);

    if (error) throw error;
    return data;
  }
};
