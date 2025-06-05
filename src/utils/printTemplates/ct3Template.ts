
import { AffaireContentieuse } from "@/types/affaire";
import { PrintTemplate } from "../printTemplates";

export const ct3Template: PrintTemplate = {
  title: "CT3 - Transaction tenant lieu de procès-verbal",
  generateHTML: (content: string, affaire?: AffaireContentieuse) => `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CT3 - ${affaire?.numeroAffaire || ''}</title>
        <style>
          @page { 
            size: A4 portrait; 
            margin: 1cm; 
          }
          body { 
            font-family: 'Times New Roman', serif; 
            font-size: 11pt;
            line-height: 1.3;
            color: #000; 
            margin: 0;
            padding: 0;
          }
          .page {
            min-height: calc(100vh - 2cm);
            page-break-after: always;
          }
          .page:last-child {
            page-break-after: auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
          }
          .header-left {
            text-align: left;
            font-size: 10pt;
            font-weight: bold;
            line-height: 1.2;
          }
          .header-center {
            text-align: center;
            font-weight: bold;
            font-size: 14pt;
            flex: 1;
            margin: 0 20px;
          }
          .header-right {
            text-align: right;
            font-size: 9pt;
            line-height: 1.2;
          }
          .section-title {
            text-align: center;
            font-weight: bold;
            font-size: 12pt;
            margin: 15px 0;
            text-decoration: underline;
          }
          .info-section {
            margin-bottom: 15px;
          }
          .info-line {
            margin-bottom: 8px;
            display: flex;
            align-items: baseline;
          }
          .info-label {
            font-weight: bold;
            min-width: 120px;
            margin-right: 10px;
          }
          .info-value {
            flex: 1;
            border-bottom: 1px dotted #000;
            min-height: 16px;
            padding-bottom: 2px;
          }
          .paragraph {
            text-align: justify;
            margin-bottom: 15px;
            line-height: 1.4;
          }
          .indent {
            margin-left: 30px;
          }
          .signature-section {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            text-align: center;
            width: 200px;
          }
          .signature-title {
            font-weight: bold;
            margin-bottom: 50px;
            text-decoration: underline;
          }
          .amount-box {
            border: 2px solid #000;
            padding: 10px;
            margin: 10px 0;
            text-align: center;
            font-weight: bold;
          }
          .dotted-line {
            border-bottom: 1px dotted #000;
            display: inline-block;
            min-width: 200px;
            margin: 0 5px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
            .page { page-break-after: always; }
            .page:last-child { page-break-after: auto; }
          }
        </style>
      </head>
      <body>
        <!-- RECTO -->
        <div class="page">
          <div class="header">
            <div class="header-left">
              BURKINA FASO<br>
              DIRECTION GENERALE<br>
              DES DOUANES<br><br>
              <em>BUREAU OU POSTE</em><br>
              <strong>${affaire?.bureauPoste?.join(', ') || 'BUREAU DE DAKOLA'}</strong>
            </div>
            <div class="header-center">
              TRANSACTION TENANT LIEU<br>
              DE PROCÈS-VERBAL
            </div>
            <div class="header-right">
              DOUANES<br>
              Série CT 3<br><br>
              1 000 000
            </div>
          </div>

          <div class="info-section">
            <div class="info-line">
              <span class="info-label">Affaire N°</span>
              <span class="info-value">${affaire?.numeroAffaire || ''}</span>
              <span style="margin-left: 20px;">L'an deux mille vingt-cinq</span>
            </div>
            <div class="info-line">
              <span class="info-label">Du</span>
              <span class="info-value">${affaire?.dateAffaire ? new Date(affaire.dateAffaire).toLocaleDateString('fr-FR') : ''}</span>
              <span style="margin-left: 20px;">Et le sept janvier</span>
            </div>
            <div style="margin: 15px 0;">
              Entre les soussignés <span class="dotted-line"></span>
            </div>
          </div>

          <div class="paragraph">
            <strong>M... ${affaire?.nomsChefs?.join(', ') || 'KOUTOU HAMADOU'}</strong> chef de du Bureau de DAKOLA y demeurant, agissant en cette 
            qualité, d'une part, et d'autre part, <strong>${affaire?.nomPrenomContrevenant || 'WANGRAWA MARTIN'}</strong>, demeurant à DAKOLA à la charge 
            duquel MM... ${affaire?.nomsSaisissant?.join(', ') || 'SIA KOULINGA'} agent des douanes a constaté une infraction consistant en une 
            exportation sans déclaration de 1600 sacs de sésame.
          </div>

          <div class="paragraph">
            L'infraction est prévue, qualifiée et réprimée par les articles <strong>57,267,261</strong> du code des 
            Douanes.
          </div>

          <div class="paragraph">
            <em>(1) Qualifier très succinctement l'infraction et indiquer les numéros des articles des lois et règlements réprimant les marchandises saisies ;</em>
          </div>

          <div class="paragraph">
            <em>(2) Les offres doivent être chiffrées dans l'ordre croissant ;</em>
          </div>

          <div class="paragraph">
            <em>(3) En cas de confiscation de marchandises et des moyens de transport ;</em>
          </div>

          <div class="paragraph">
            <em>4°</em> - Le paiement d'une somme de... <span class="dotted-line">applicable à l'amende</span>
          </div>

          <div class="paragraph">
            <em>et 1'abandon de</em> <span class="dotted-line"></span>
          </div>

          <div class="paragraph">
            Il été convenu ce qui suit :<br><br>
            <strong>${affaire?.nomPrenomContrevenant || 'WANGRAWA MARTIN'}</strong> <span class="dotted-line">reconnaît avoir commis</span> l'infraction relatée ci-dessus et offre 
            pour terminer administrativement cette affaire (2) la somme d'un million de francs suivant R 
            <strong>818 DU 07/01/2025</strong>.
          </div>
        </div>

        <!-- VERSO -->
        <div class="page">
          <div style="margin-top: 50px;">
            <div class="paragraph">
              1.- Le paiement de la somme d'un million<br>
              Pour tenir lieu des pénalités encourues
            </div>

            <div class="amount-box">
              1.000.000
            </div>

            <div class="paragraph">
              2. main levée des véhicules suivi de la mise en transit
            </div>

            <div class="amount-box" style="text-align: right; font-size: 14pt;">
              <strong>TOTAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1.000.000</strong>
            </div>

            <div class="paragraph" style="margin-top: 30px;">
              Le Chef de Bureau... accepte provisoirement cette offre qui sera soumise à l'approbation 
              de l'autorité supérieure et s'engage à en obtenir réponse dans le délai imparti.
            </div>

            <div class="paragraph">
              <strong>(1.000.000)</strong> francs dont la délivre quittance : R.818 DU 07/01/2025
            </div>

            <div class="paragraph">
              Il est interdit à toute autorité de présenter l'infraction est approuvée par l'autorité 
              supérieure, l'affaire se trouve ainsi entièrement terminée que, dans le cas contraire, 
              l'arrangement sera nul de plein droit et que lesdites parties entendent dans leurs droits 
              respectifs, tels qu'ils existaient au moment de la signature du présent acte.
            </div>

            <div class="paragraph">
              Toutefois, <strong>${affaire?.nomPrenomContrevenant || 'WANGRAWA MARTIN'}</strong> renonce expressément à se prévaloir devant les 
              tribunaux de défaut de forme que l'on de la procédure qui ont été observée 
              pour constater l'infraction relatée ci-dessus attendu que c'est sur sa demande que cet 
              acte va pris et rédigé.
            </div>

            <div class="paragraph">
              <strong>${affaire?.nomPrenomContrevenant || 'WANGRAWA MARTIN'}</strong>, reconnaît avoir reçu la mainlevée de son véhicule suivant 
              quittance R.818 DU 07/01/2025.
            </div>

            <div class="paragraph" style="margin-top: 30px;">
              Fait en double à ... <strong>Dakola</strong> les jour, mois et an que dessus et ont signé après lecture.
            </div>

            <div class="signature-section" style="margin-top: 50px;">
              <div class="signature-box">
                <div class="signature-title">Le contrevenant</div>
              </div>
              <div class="signature-box">
                <div class="signature-title">Le Chef de Bureau</div>
              </div>
            </div>
          </div>
        </div>

        <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Imprimer</button>
          <button onclick="window.close()" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 8px; font-size: 11px;">Fermer</button>
        </div>
      </body>
    </html>
  `
};
