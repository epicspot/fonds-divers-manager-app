
import { AffaireContentieuse } from "@/types/affaire";

export interface PrintTemplate {
  title: string;
  generateHTML: (content: string, affaire?: AffaireContentieuse) => string;
}

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

export const printTemplates = {
  bordereau: bordereauTemplate,
  synthese: syntheseTemplate,
  transmission: transmissionTemplate,
  hierarchie: hierarchieTemplate
};
