
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AffaireContentieuse } from '@/types/affaire';
import { useToast } from '@/hooks/use-toast';
import { 
  genererBordereauAffaire,
  genererFicheSynthese,
  genererRapportTransmission,
  genererRapportHierarchie
} from '@/utils/rapportsUtils';
import { printTemplates } from '@/utils/printTemplates';

export type TypeRapport = 'bordereau' | 'bordereau_officiel' | 'transaction_ct3' | 'edpn' | 'fiche_indicateur' | 'synthese' | 'transmission' | 'hierarchie';

export interface RapportGenere {
  type: TypeRapport;
  contenu: string;
  dateGeneration: string;
  affaireId: string;
}

export interface RapportsGlobaux {
  affaireId: string;
  dateGeneration: string;
  rapports: Record<TypeRapport, string>;
}

export function useRapports() {
  const [rapportsGeneres, setRapportsGeneres] = useState<RapportGenere[]>([]);
  const [rapportsGlobaux, setRapportsGlobaux] = useState<RapportsGlobaux[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const chargerRapports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rapports_generes')
        .select('*')
        .order('date_generation', { ascending: false });

      if (error) throw error;

      const rapportsMap: RapportsGlobaux[] = (data || []).map(item => ({
        affaireId: item.affaire_id,
        dateGeneration: item.date_generation,
        rapports: item.rapports as Record<TypeRapport, string>
      }));

      setRapportsGlobaux(rapportsMap);

      const rapportsIndividuels: RapportGenere[] = [];
      rapportsMap.forEach(rg => {
        Object.entries(rg.rapports).forEach(([type, contenu]) => {
          rapportsIndividuels.push({
            type: type as TypeRapport,
            contenu,
            dateGeneration: rg.dateGeneration,
            affaireId: rg.affaireId
          });
        });
      });
      setRapportsGeneres(rapportsIndividuels);
    } catch (error) {
      console.error('Erreur chargement rapports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerRapports();
  }, []);

  const genererTousLesRapports = async (affaire: AffaireContentieuse): Promise<RapportsGlobaux> => {
    setIsGenerating(true);
    
    try {
      const dateGeneration = new Date().toISOString();
      
      // Générer tous les types de rapports
      const rapports: Record<TypeRapport, string> = {
        bordereau: genererBordereauAffaire(affaire),
        bordereau_officiel: '', // Le modèle officiel utilise directement les données de l'affaire
        transaction_ct3: '', // Le modèle CT3 utilise directement les données de l'affaire
        edpn: '', // Le modèle EDPN utilise directement les données de l'affaire
        fiche_indicateur: '', // La fiche indicateur utilise directement les données de l'affaire
        synthese: genererFicheSynthese(affaire),
        transmission: genererRapportTransmission(affaire),
        hierarchie: genererRapportHierarchie(affaire)
      };

      const rapportsGlobauxItem: RapportsGlobaux = {
        affaireId: affaire.id,
        dateGeneration,
        rapports
      };

      // Sauvegarder dans Supabase
      const { error: saveError } = await supabase
        .from('rapports_generes')
        .upsert({
          affaire_id: affaire.id,
          date_generation: dateGeneration,
          rapports: rapports
        }, { onConflict: 'affaire_id' });

      if (saveError) throw saveError;

      await chargerRapports();
      
      toast({
        title: "Rapports générés",
        description: `Tous les rapports pour l'affaire ${affaire.numeroAffaire} ont été générés avec succès`
      });

      return rapportsGlobauxItem;
    } catch (error) {
      console.error('Erreur génération rapports:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les rapports",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const obtenirRapport = (affaireId: string, type: TypeRapport): string => {
    const rapportsAffaire = rapportsGlobaux.find(r => r.affaireId === affaireId);
    return rapportsAffaire?.rapports[type] || '';
  };

  const imprimerRapport = (type: TypeRapport, affaire: AffaireContentieuse) => {
    const contenu = obtenirRapport(affaire.id, type);
    const template = printTemplates[type];
    const htmlContent = template.generateHTML(contenu, affaire);
    
    const fenetre = window.open('', '_blank');
    if (fenetre) {
      fenetre.document.write(htmlContent);
      fenetre.document.close();
      
      // Auto-focus for better UX
      fenetre.focus();
      
      toast({
        title: "Aperçu d'impression",
        description: "Le document est prêt à être imprimé"
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir la fenêtre d'impression",
        variant: "destructive"
      });
    }
  };

  return {
    rapportsGeneres,
    rapportsGlobaux,
    isGenerating,
    loading,
    genererTousLesRapports,
    obtenirRapport,
    imprimerRapport,
    refetch: chargerRapports
  };
}
