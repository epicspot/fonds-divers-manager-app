
import { AffaireContentieuse } from "@/types/affaire";
import { PrintTemplate } from "../printTemplates";

export const bordereauOfficielTemplate: PrintTemplate = {
  title: "Bordereau Officiel d'Affaire Contentieuse",
  generateHTML: (content: string, affaire?: AffaireContentieuse) => `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bordereau Officiel - ${affaire?.numeroAffaire || ''}</title>
        <style>
          @page { 
            size: A4; 
            margin: 1.5cm; 
          }
          body { 
            font-family: Arial, sans-serif; 
            font-size: 11pt;
            line-height: 1.2;
            color: #000; 
            margin: 0;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          .header-left {
            text-align: center;
            flex: 1;
          }
          .header-center {
            text-align: center;
            flex: 1;
            font-weight: bold;
            font-size: 14pt;
          }
          .header-right {
            flex: 1;
            text-align: right;
            font-size: 9pt;
          }
          .form-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
          }
          .form-table td {
            border: 1px solid #000;
            padding: 3px 5px;
            font-size: 9pt;
            vertical-align: top;
          }
          .form-table .label {
            background-color: #f0f0f0;
            font-weight: bold;
            width: 200px;
          }
          .form-table .value {
            min-height: 18px;
          }
          .section-header {
            background-color: #d0d0d0;
            font-weight: bold;
            text-align: center;
            font-size: 10pt;
            padding: 4px;
          }
          .checkbox-group {
            display: inline-block;
            margin-right: 15px;
          }
          .checkbox {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 1px solid #000;
            margin-right: 5px;
            vertical-align: middle;
          }
          .checkbox.checked::after {
            content: "✓";
            font-size: 10px;
            font-weight: bold;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
          }
          .signature-box {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            border-bottom: 1px solid #000;
            height: 40px;
            margin-bottom: 5px;
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
            CONTENTIEUX
          </div>
          <div class="header-right">
            <div class="checkbox-group">
              <span class="checkbox"></span> exemplaire DCD
            </div><br>
            <div class="checkbox-group">
              <span class="checkbox"></span> exemplaire D.R
            </div><br>
            <div class="checkbox-group">
              <span class="checkbox"></span> Service Office
            </div>
          </div>
        </div>

        <table class="form-table">
          <tr>
            <td class="label">REGION / DGD</td>
            <td class="value">${affaire?.regionDgd?.join(', ') || ''}</td>
            <td class="label">Nature et Nombre des pieces composant le dossier</td>
            <td class="value">${affaire?.natureNombrePieces?.join(', ') || ''}</td>
          </tr>
          <tr>
            <td class="label">BUREAU OU POSTE</td>
            <td class="value">${affaire?.bureauPoste?.join(', ') || ''}</td>
            <td rowspan="2" style="text-align: center; vertical-align: middle;">
              <strong>CTS</strong><br>
              <strong>EDPN</strong>
            </td>
            <td style="text-align: center;">3/2<br>3/2</td>
          </tr>
          <tr>
            <td class="label">Numéro d'affaire et Office</td>
            <td class="value">${affaire?.numeroAffaire || ''}</td>
          </tr>
          <tr>
            <td class="label">Date</td>
            <td class="value">${affaire?.dateAffaire ? new Date(affaire.dateAffaire).toLocaleDateString('fr-FR') : ''}</td>
            <td colspan="2"></td>
          </tr>
        </table>

        <table class="form-table">
          <tr>
            <td class="section-header" colspan="4">DECLARATION</td>
          </tr>
          <tr>
            <td class="label">Numéro de la déclaration</td>
            <td class="value">${affaire?.numeroDeclaration || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Date de la déclaration</td>
            <td class="value">${affaire?.dateDeclaration ? new Date(affaire.dateDeclaration).toLocaleDateString('fr-FR') : ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Nom et prénom du contrevenant</td>
            <td class="value" colspan="3">${affaire?.nomPrenomContrevenant || ''}</td>
          </tr>
          <tr>
            <td class="label">Adresse complète</td>
            <td class="value" colspan="3">${affaire?.adresseComplete || ''}</td>
          </tr>
          <tr>
            <td class="label">IFU</td>
            <td class="value">${affaire?.ifu || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Nature et moyen de transport</td>
            <td class="value">${affaire?.natureTransport?.join(', ') || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Identification du moyen de transport</td>
            <td class="value">${affaire?.identificationTransport || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Commissionnaire en douane</td>
            <td class="value">${affaire?.commissionnaireDouane?.join(', ') || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Procédé de détection de la fraude</td>
            <td class="value">${affaire?.procedureDetectionFraude?.join(', ') || ''}</td>
            <td class="label">Avis du Directeur Régional ou Central</td>
            <td class="value"></td>
          </tr>
          <tr>
            <td class="label">Nature des marchandises de fraude</td>
            <td class="value">${affaire?.natureMarchandisesFraude || ''}</td>
            <td class="label">Nombre</td>
            <td class="value">${affaire?.nombreInformateurs || ''}</td>
          </tr>
        </table>

        <table class="form-table">
          <tr>
            <td class="section-header" colspan="4">SUCRERIE</td>
          </tr>
          <tr>
            <td class="label">Origine ou provenance</td>
            <td class="value">${affaire?.origineProvenance?.join(', ') || ''}</td>
            <td class="label">Suite réservée aux marchandises</td>
            <td class="value">${affaire?.suiteReserveeMarchandises?.join(', ') || ''}</td>
          </tr>
          <tr>
            <td class="label">Poids en Kg</td>
            <td class="value">${affaire?.poidsKg || ''}</td>
            <td colspan="2"></td>
          </tr>
        </table>

        <table class="form-table">
          <tr>
            <td class="label">Valeur des Marchandises litigieuses</td>
            <td class="value">${affaire?.valeurMarchandisesLitigieuses?.toLocaleString() || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Nature de l'infraction</td>
            <td class="value">${affaire?.natureInfraction?.join(', ') || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Droits compromis ou éludés</td>
            <td class="value">${affaire?.droitsCompromis?.toLocaleString() || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Numéro de quittance et date</td>
            <td class="value">${affaire?.numeroQuittanceDate || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Nombre d'informateurs</td>
            <td class="value">${affaire?.nombreInformateurs || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Suite de l'affaire (justice ou transaction)</td>
            <td class="value">${affaire?.suiteAffaire?.toUpperCase() || ''}</td>
            <td class="label">Détail des frais</td>
            <td class="value">${affaire?.detailsFrais?.join(', ') || ''}</td>
          </tr>
          <tr>
            <td class="label">Date de la transaction provisoire</td>
            <td class="value">${affaire?.dateTransaction ? new Date(affaire.dateTransaction).toLocaleDateString('fr-FR') : ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Montant de l'amende ou de la vente</td>
            <td class="value">${(affaire?.montantAmende || affaire?.montantVente || 0).toLocaleString()}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Numéro de quittance et date</td>
            <td class="value">${affaire?.numeroQuittanceDateTransaction || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Montant total des frais</td>
            <td class="value">${affaire?.montantTotalFrais?.toLocaleString() || ''}</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td class="label">Produit net à répartir</td>
            <td class="value">${affaire?.produitNetRepartir?.toLocaleString() || ''}</td>
            <td class="label">Date de ratification ou de jugement</td>
            <td class="value"></td>
          </tr>
          <tr>
            <td class="label">Noms des chefs</td>
            <td class="value" colspan="3">${affaire?.nomsChefs?.join(', ') || ''}</td>
          </tr>
        </table>

        <table class="form-table">
          <tr>
            <td class="label">Noms du saisissant : ${affaire?.nomsSaisissant?.join(', ') || ''}</td>
            <td class="value" style="text-align: center;">Date de répartition</td>
          </tr>
          <tr>
            <td class="label">Noms des intervenants : ${affaire?.nomsIntervenants?.join(', ') || ''}</td>
            <td class="label">N° de bordereau de ratification</td>
          </tr>
          <tr>
            <td colspan="2" class="label" style="text-align: center;">
              Circonstances particulières à l'affaire (oppositions, appels, etc.)
            </td>
          </tr>
          <tr>
            <td colspan="2" class="value" style="min-height: 60px;">
              ${affaire?.circonstancesParticulieres || ''}
            </td>
          </tr>
        </table>

        <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimer</button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Fermer</button>
        </div>
      </body>
    </html>
  `
};
