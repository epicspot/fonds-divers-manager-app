
import { AffaireContentieuse } from "@/types/affaire";
import { PrintTemplate } from "../printTemplates";

export const ct8Template: PrintTemplate = {
  title: "CT8 - Bordereau d'Affaire Contentieuse",
  generateHTML: (content: string, affaire?: AffaireContentieuse) => `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CT8 - ${affaire?.numeroAffaire || ''}</title>
        <style>
          @page { 
            size: A4 portrait; 
            margin: 0.5cm; 
          }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 7pt;
            line-height: 1.0;
            color: #000; 
            margin: 0;
            padding: 0;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            border-bottom: 2px solid #000;
            padding-bottom: 3px;
            height: 40px;
          }
          .header-left {
            text-align: center;
            flex: 1;
            font-size: 7pt;
            line-height: 1.1;
          }
          .header-center {
            text-align: center;
            flex: 1;
            font-weight: bold;
            font-size: 10pt;
          }
          .header-right {
            flex: 1;
            text-align: right;
            font-size: 6pt;
            line-height: 1.0;
          }
          .form-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 3px;
          }
          .form-table td {
            border: 1px solid #000;
            padding: 1px 2px;
            font-size: 6pt;
            vertical-align: top;
            height: 12px;
            overflow: hidden;
          }
          .form-table .label {
            background-color: #f0f0f0;
            font-weight: bold;
            width: 100px;
            font-size: 6pt;
          }
          .form-table .value {
            font-size: 6pt;
          }
          .section-header {
            background-color: #d0d0d0;
            font-weight: bold;
            text-align: center;
            font-size: 7pt;
            padding: 1px;
            height: 14px;
          }
          .checkbox-group {
            display: inline-block;
            margin-right: 5px;
            font-size: 6pt;
          }
          .checkbox {
            display: inline-block;
            width: 8px;
            height: 8px;
            border: 1px solid #000;
            margin-right: 2px;
            vertical-align: middle;
          }
          .checkbox.checked::after {
            content: "✓";
            font-size: 6px;
            font-weight: bold;
          }
          .compact-row {
            height: 12px;
          }
          .mini-text {
            font-size: 5pt;
          }
          .large-field {
            height: 20px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <strong>BURKINA FASO</strong><br>
            <strong>DIRECTION GENERALE</strong><br>
            <strong>DES DOUANES</strong>
          </div>
          <div class="header-center">
            CT8 - CONTENTIEUX
          </div>
          <div class="header-right">
            <div class="checkbox-group">
              <span class="checkbox"></span> DCD
            </div>
            <div class="checkbox-group">
              <span class="checkbox"></span> D.R
            </div><br>
            <div class="checkbox-group">
              <span class="checkbox"></span> Office
            </div>
          </div>
        </div>

        <table class="form-table">
          <tr class="compact-row">
            <td class="label">REGION/DGD</td>
            <td class="value">${affaire?.regionDgd?.join(', ') || ''}</td>
            <td class="label">Nature/Nb pièces</td>
            <td class="value">${affaire?.natureNombrePieces?.join(', ') || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">BUREAU/POSTE</td>
            <td class="value">${affaire?.bureauPoste?.join(', ') || ''}</td>
            <td class="label mini-text">CTS/EDPN</td>
            <td class="value mini-text">3/2</td>
          </tr>
          <tr class="compact-row">
            <td class="label">N° affaire</td>
            <td class="value">${affaire?.numeroAffaire || ''}</td>
            <td class="label">Date</td>
            <td class="value">${affaire?.dateAffaire ? new Date(affaire.dateAffaire).toLocaleDateString('fr-FR') : ''}</td>
          </tr>
        </table>

        <table class="form-table">
          <tr>
            <td class="section-header" colspan="4">DECLARATION</td>
          </tr>
          <tr class="compact-row">
            <td class="label">N° déclaration</td>
            <td class="value">${affaire?.numeroDeclaration || ''}</td>
            <td class="label">Date déclaration</td>
            <td class="value">${affaire?.dateDeclaration ? new Date(affaire.dateDeclaration).toLocaleDateString('fr-FR') : ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Contrevenant</td>
            <td class="value" colspan="3">${affaire?.nomPrenomContrevenant || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Adresse</td>
            <td class="value" colspan="2">${affaire?.adresseComplete || ''}</td>
            <td class="value">IFU: ${affaire?.ifu || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Transport</td>
            <td class="value">${affaire?.natureTransport?.join(', ') || ''}</td>
            <td class="label">ID Transport</td>
            <td class="value">${affaire?.identificationTransport || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Commissionnaire</td>
            <td class="value">${affaire?.commissionnaireDouane?.join(', ') || ''}</td>
            <td class="label">Détection</td>
            <td class="value">${affaire?.procedureDetectionFraude?.join(', ') || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Marchandises</td>
            <td class="value">${affaire?.natureMarchandisesFraude || ''}</td>
            <td class="label">Origine</td>
            <td class="value">${affaire?.origineProvenance?.join(', ') || ''}</td>
          </tr>
        </table>

        <table class="form-table">
          <tr class="compact-row">
            <td class="label">Val. marchandises</td>
            <td class="value">${affaire?.valeurMarchandisesLitigieuses?.toLocaleString() || ''}</td>
            <td class="label">Poids (Kg)</td>
            <td class="value">${affaire?.poidsKg || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Nature infraction</td>
            <td class="value">${affaire?.natureInfraction?.join(', ') || ''}</td>
            <td class="label">Droits compromis</td>
            <td class="value">${affaire?.droitsCompromis?.toLocaleString() || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">N° quittance</td>
            <td class="value">${affaire?.numeroQuittanceDate || ''}</td>
            <td class="label">Nb informateurs</td>
            <td class="value">${affaire?.nombreInformateurs || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Suite affaire</td>
            <td class="value">${affaire?.suiteAffaire?.toUpperCase() || ''}</td>
            <td class="label">Date transaction</td>
            <td class="value">${affaire?.dateTransaction ? new Date(affaire.dateTransaction).toLocaleDateString('fr-FR') : ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Montant amende/vente</td>
            <td class="value">${(affaire?.montantAmende || affaire?.montantVente || 0).toLocaleString()}</td>
            <td class="label">N° quittance trans.</td>
            <td class="value">${affaire?.numeroQuittanceDateTransaction || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Total frais</td>
            <td class="value">${affaire?.montantTotalFrais?.toLocaleString() || ''}</td>
            <td class="label">Produit net</td>
            <td class="value">${affaire?.produitNetRepartir?.toLocaleString() || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Saisissants</td>
            <td class="value" colspan="3">${affaire?.nomsSaisissant?.join(', ') || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Intervenants</td>
            <td class="value" colspan="3">${affaire?.nomsIntervenants?.join(', ') || ''}</td>
          </tr>
          <tr class="compact-row">
            <td class="label">Chefs</td>
            <td class="value" colspan="3">${affaire?.nomsChefs?.join(', ') || ''}</td>
          </tr>
          <tr>
            <td class="label">Circonstances</td>
            <td class="value large-field" colspan="3">${affaire?.circonstancesParticulieres || ''}</td>
          </tr>
        </table>

        <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 6px 12px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 10px;">Imprimer</button>
          <button onclick="window.close()" style="padding: 6px 12px; background: #6c757d; color: white; border: none; border-radius: 3px; cursor: pointer; margin-left: 6px; font-size: 10px;">Fermer</button>
        </div>
      </body>
    </html>
  `
};
