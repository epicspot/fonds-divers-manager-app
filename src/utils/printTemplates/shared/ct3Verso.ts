
import { AffaireContentieuse } from "@/types/affaire";

// Fonction pour déterminer le statut d'approbation
const getApprobationStatus = (affaire?: AffaireContentieuse) => {
  const isApprouvee = affaire?.statut === 'cloturee' || affaire?.dateApprobationHierarchie !== undefined;
  const isRejetee = affaire?.statut === 'brouillon' && affaire?.dateTransmissionHierarchie !== undefined;
  
  return { isApprouvee, isRejetee };
};

export const generateCt3Verso = (affaire?: AffaireContentieuse) => `
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
        Fait en double à <strong>${affaire?.bureauPoste?.join(', ') || ''}</strong>, les jour, mois et an que dessus et ont signé après lecture.
      </div>

      <div class="signature-section" style="margin-top: 60px;">
        <div class="signature-box">
          <div class="signature-title">Le Contrevenant</div>
          <div style="font-size: 9pt; margin-top: 40px;">Lu et approuvé</div>
          <div style="font-size: 9pt;">Signature:</div>
        </div>
        <div class="signature-box">
          <div class="signature-title">Le Chef de Bureau</div>
          <div style="font-size: 9pt; margin-top: 40px;">Nom: ${affaire?.nomsChefs?.join(', ') || ''}</div>
          <div style="font-size: 9pt;">Signature et cachet:</div>
        </div>
      </div>

      <div style="margin-top: 50px; border-top: 1px solid #000; padding-top: 15px;">
        <div style="text-align: center; font-weight: bold; margin-bottom: 30px;">
          APPROBATION DE L'AUTORITÉ SUPÉRIEURE
        </div>
        ${(() => {
          const approbation = getApprobationStatus(affaire);
          return `
            <div style="display: flex; gap: 30px; justify-content: center; margin-bottom: 20px;">
              <div><span class="checkbox ${approbation.isApprouvee ? 'checked' : ''}"></span> Transaction approuvée</div>
              <div><span class="checkbox ${approbation.isRejetee ? 'checked' : ''}"></span> Transaction rejetée</div>
            </div>
          `;
        })()}
        <div class="signature-box" style="margin: 30px auto; width: 300px;">
          <div style="font-weight: bold;">Le Directeur du Contentieux</div>
          <div style="font-size: 9pt; margin-top: 50px;">Date et signature:</div>
        </div>
      </div>
    </div>
  </div>
`;
