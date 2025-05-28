
import { AffaireContentieuse } from "@/types/affaire";
import { PrintTemplate } from "../printTemplates";

export const syntheseTemplate: PrintTemplate = {
  title: "Fiche de Synthèse",
  generateHTML: (content: string, affaire?: AffaireContentieuse) => `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fiche de Synthèse - ${affaire?.numeroAffaire || ''}</title>
        <style>
          @page { 
            size: A4; 
            margin: 1.5cm; 
          }
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.5; 
            color: #333; 
            margin: 0;
            font-size: 11pt;
          }
          .header { 
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            color: white;
            padding: 20px;
            text-align: center; 
            margin-bottom: 25px;
            border-radius: 8px;
          }
          .header h1 { 
            margin: 0; 
            font-size: 20pt; 
            font-weight: bold;
          }
          .header .info { 
            margin-top: 10px; 
            font-size: 12pt;
            opacity: 0.9;
          }
          .content { 
            white-space: pre-wrap; 
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
            font-family: 'Georgia', serif;
            font-size: 11pt;
            line-height: 1.7;
          }
          .status-badge {
            display: inline-block;
            padding: 5px 15px;
            background: #10b981;
            color: white;
            border-radius: 20px;
            font-size: 10pt;
            font-weight: bold;
            margin: 10px 0;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Fiche de Synthèse Exécutive</h1>
          <div class="info">
            Affaire N° ${affaire?.numeroAffaire || ''} | ${new Date().toLocaleDateString('fr-FR')}
            <div class="status-badge">Confidentiel</div>
          </div>
        </div>
        <div class="content">${content.replace(/\n/g, '<br>')}</div>
        <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimer</button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Fermer</button>
        </div>
      </body>
    </html>
  `
};
