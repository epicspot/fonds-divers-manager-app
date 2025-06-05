import { useState } from 'react';
import { AffaireContentieuse } from '@/types/affaire';
import { useToast } from '@/hooks/use-toast';
import { 
  genererBordereauAffaire,
  genererFicheSynthese,
  genererRapportTransmission,
  genererRapportHierarchie
} from '@/utils/rapportsUtils';
import { printTemplates } from '@/utils/printTemplates';

export type TypeRapport = 'bordereau' | 'bordereau_officiel' | 'transaction_ct3' | 'synthese' | 'transmission' | 'hierarchie';

export interface RapportGenere {
  type: TypeRapport;
  contenu: string;
  dateGeneration: string;
  affaireId: string;
}

export function useRapports() {
  const [rapportsGeneres, setRapportsGeneres] = useState<RapportGenere[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const genererRapport = async (affaire: AffaireContentieuse, type: TypeRapport): Promise<string> => {
    setIsGenerating(true);
    
    try {
      let contenu = '';
      
      switch (type) {
        case 'bordereau':
          contenu = genererBordereauAffaire(affaire);
          break;
        case 'bordereau_officiel':
          contenu = ''; // Le modèle officiel utilise directement les données de l'affaire
          break;
        case 'transaction_ct3':
          contenu = ''; // Le modèle CT3 utilise directement les données de l'affaire
          break;
        case 'synthese':
          contenu = genererFicheSynthese(affaire);
          break;
        case 'transmission':
          contenu = genererRapportTransmission(affaire);
          break;
        case 'hierarchie':
          contenu = genererRapportHierarchie(affaire);
          break;
        default:
          throw new Error(`Type de rapport non supporté: ${type}`);
      }

      const rapport: RapportGenere = {
        type,
        contenu,
        dateGeneration: new Date().toISOString(),
        affaireId: affaire.id
      };

      setRapportsGeneres(prev => [...prev, rapport]);
      
      toast({
        title: "Rapport généré",
        description: `Le rapport ${type} a été généré avec succès`
      });

      return contenu;
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const imprimerRapport = (contenu: string, type: TypeRapport, affaire?: AffaireContentieuse) => {
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
    isGenerating,
    genererRapport,
    imprimerRapport
  };
}
