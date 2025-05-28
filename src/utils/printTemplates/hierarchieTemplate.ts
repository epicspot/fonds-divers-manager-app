
import { AffaireContentieuse } from "@/types/affaire";
import { PrintTemplate } from "../printTemplates";

export const hierarchieTemplate: PrintTemplate = {
  title: "Rapport Hiérarchique",
  generateHTML: (content: string, affaire?: AffaireContentieuse) => `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rapport Hiérarchique - ${affaire?.numeroAffaire || ''}</title>
        <style>
          @page { 
            size: A4; 
            margin: 2cm; 
            @top-left { 
              content: "CONFIDENTIEL"; 
              font-size: 10pt; 
              color: #dc2626; 
              font-weight: bold;
            }
          }
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.5; 
            color: #000; 
            margin: 0;
            font-size: 11pt;
          }
          .header { 
            border: 2px solid #dc2626;
            padding: 15px;
            text-align: center; 
            margin-bottom: 30px;
            background: #fef2f2;
          }
          .header h1 { 
            margin: 0; 
            font-size: 18pt; 
            font-weight: bold;
            color: #dc2626;
            text-transform: uppercase;
          }
          .header .classification { 
            margin: 10px 0; 
            font-size: 12pt;
            font-weight: bold;
            color: #dc2626;
          }
          .header .details { 
            margin-top: 10px; 
            font-size: 11pt;
            color: #000;
          }
          .content { 
            white-space: pre-wrap; 
            background: white;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            line-height: 1.6;
          }
          .security-notice {
            background: #fef2f2;
            border: 1px solid #fecaca;
            padding: 10px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 9pt;
            color: #991b1b;
            text-align: center;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rapport Hiérarchique</h1>
          <div class="classification">DOCUMENT CONFIDENTIEL</div>
          <div class="details">
            Affaire N° ${affaire?.numeroAffaire || ''} | Date: ${new Date().toLocaleDateString('fr-FR')}
          </div>
        </div>
        <div class="security-notice">
          ⚠️ Document sensible - Diffusion restreinte - Usage interne uniquement
        </div>
        <div class="content">${content.replace(/\n/g, '<br>')}</div>
        <div class="security-notice">
          Ce document contient des informations confidentielles. Toute reproduction ou divulgation non autorisée est interdite.
        </div>
        <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimer</button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Fermer</button>
        </div>
      </body>
    </html>
  `
};
