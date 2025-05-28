
import { AffaireContentieuse } from "@/types/affaire";
import { PrintTemplate } from "../printTemplates";

export const transmissionTemplate: PrintTemplate = {
  title: "Rapport de Transmission",
  generateHTML: (content: string, affaire?: AffaireContentieuse) => `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rapport de Transmission - ${affaire?.numeroAffaire || ''}</title>
        <style>
          @page { 
            size: A4; 
            margin: 2.5cm; 
            @top-right { 
              content: "Transmission Officielle"; 
              font-size: 10pt; 
              color: #666;
            }
          }
          body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.6; 
            color: #000; 
            margin: 0;
            font-size: 12pt;
          }
          .letterhead { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 3px double #333;
            padding-bottom: 20px;
          }
          .letterhead h1 { 
            margin: 0; 
            font-size: 16pt; 
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .letterhead .subtitle { 
            margin: 5px 0; 
            font-size: 14pt;
            font-style: italic;
          }
          .letterhead .reference { 
            margin-top: 15px; 
            font-size: 11pt;
            font-weight: bold;
          }
          .content { 
            white-space: pre-wrap; 
            text-align: justify;
            text-indent: 1.5em;
            font-size: 12pt;
            line-height: 1.8;
          }
          .signature-area {
            margin-top: 50px;
            text-align: right;
            page-break-inside: avoid;
          }
          .signature-line {
            border-bottom: 1px solid #000;
            width: 200px;
            margin: 30px 0 10px auto;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="letterhead">
          <h1>République du Bénin</h1>
          <div class="subtitle">Ministère de l'Économie et des Finances</div>
          <div class="subtitle">Direction Générale des Douanes</div>
          <div class="reference">
            Réf: DGD/${affaire?.numeroAffaire || 'XXX'}/${new Date().getFullYear()}
          </div>
        </div>
        <div class="content">${content.replace(/\n/g, '<br>')}</div>
        <div class="signature-area">
          <div>Le Directeur Général</div>
          <div class="signature-line"></div>
          <div style="font-size: 10pt; margin-top: 5px;">Signature et cachet</div>
        </div>
        <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimer</button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Fermer</button>
        </div>
      </body>
    </html>
  `
};
