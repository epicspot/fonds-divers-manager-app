
import { useState } from 'react';
import { AffaireContentieuse } from '@/types/affaire';
import { useToast } from '@/hooks/use-toast';
import { 
  genererBordereauAffaire,
  genererFicheSynthese,
  genererRapportTransmission,
  genererRapportHierarchie
} from '@/utils/rapportsUtils';

export type TypeRapport = 'bordereau' | 'synthese' | 'transmission' | 'hierarchie';

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

  const imprimerRapport = (contenu: string, titre: string) => {
    const fenetre = window.open('', '_blank');
    if (fenetre) {
      fenetre.document.write(`
        <html>
          <head>
            <title>${titre}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { white-space: pre-wrap; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${titre}</h1>
              <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
            <div class="content">${contenu.replace(/\n/g, '<br>')}</div>
            <div class="no-print" style="margin-top: 30px; text-align: center;">
              <button onclick="window.print()">Imprimer</button>
              <button onclick="window.close()">Fermer</button>
            </div>
          </body>
        </html>
      `);
      fenetre.document.close();
    }
  };

  return {
    rapportsGeneres,
    isGenerating,
    genererRapport,
    imprimerRapport
  };
}
