
import { AffaireContentieuse } from "@/types/affaire";
import { PrintTemplate } from "../printTemplates";

export const bordereauTemplate: PrintTemplate = {
  title: "Bordereau d'Affaire Contentieuse",
  generateHTML: (content: string, affaire?: AffaireContentieuse) => `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bordereau d'Affaire - ${affaire?.numeroAffaire || ''}</title>
        <style>
          @page { 
            size: A4; 
            margin: 2cm; 
            @bottom-center { 
              content: "Page " counter(page) " / " counter(pages); 
            }
          }
          body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.4; 
            color: #000; 
            margin: 0;
            font-size: 12pt;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .header h1 { 
            margin: 0; 
            font-size: 18pt; 
            font-weight: bold;
            text-transform: uppercase;
          }
          .header .subtitle { 
            margin: 10px 0; 
            font-size: 14pt; 
            font-style: italic;
          }
          .content { 
            white-space: pre-wrap; 
            font-family: 'Courier New', monospace;
            font-size: 11pt;
            line-height: 1.6;
          }
          .section { 
            margin-bottom: 20px; 
            page-break-inside: avoid;
          }
          .footer { 
            position: fixed; 
            bottom: 2cm; 
            left: 2cm; 
            right: 2cm; 
            text-align: center; 
            font-size: 10pt; 
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>République du Bénin</h1>
          <div class="subtitle">Direction Générale des Douanes</div>
          <div class="subtitle">Bordereau d'Affaire Contentieuse</div>
          <div style="font-size: 12pt; margin-top: 10px;">
            Affaire N° ${affaire?.numeroAffaire || ''} - ${new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
        <div class="content">${content.replace(/\n/g, '<br>')}</div>
        <div class="footer">
          Document officiel - Direction Générale des Douanes du Bénin
        </div>
        <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimer</button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Fermer</button>
        </div>
      </body>
    </html>
  `
};
