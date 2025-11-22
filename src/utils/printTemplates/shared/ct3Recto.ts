
import { AffaireContentieuse } from "@/types/affaire";

export const generateCt3Recto = (affaire?: AffaireContentieuse) => `
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
      </div>
      <div class="info-line" style="margin-top: 10px;">
        <span>L'an ${new Date().getFullYear()}</span>
        <span style="margin-left: 20px;">et le ${affaire?.dateAffaire ? new Date(affaire.dateAffaire).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : ''}</span>
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

    <div class="paragraph" style="font-size: 9pt; font-style: italic; margin: 8px 0;">
      (1) Qualifier très succinctement l'infraction et indiquer les numéros des articles des lois et règlements réprimant les marchandises saisies
    </div>

    <div class="paragraph" style="font-size: 9pt; font-style: italic; margin: 8px 0;">
      (2) Les offres doivent être chiffrées dans l'ordre croissant
    </div>

    <div class="paragraph" style="font-size: 9pt; font-style: italic; margin: 8px 0;">
      (3) En cas de confiscation de marchandises et des moyens de transport
    </div>

    <div class="paragraph" style="margin-top: 20px;">
      Il a été convenu ce qui suit :
    </div>

    <div class="paragraph" style="margin-left: 30px;">
      <strong>${affaire?.nomPrenomContrevenant || ''}</strong> reconnaît avoir commis l'infraction relatée ci-dessus et offre 
      pour terminer administrativement cette affaire la somme de <strong>${affaire?.montantAmende?.toLocaleString() || ''} FCFA</strong> 
      ${affaire?.numeroQuittanceDateTransaction ? `suivant quittance ${affaire.numeroQuittanceDateTransaction}` : ''}.
    </div>

    <div class="paragraph" style="margin-top: 25px;">
      <div style="display: flex; gap: 15px; align-items: center;">
        <div><span class="checkbox"></span> Confiscation des marchandises</div>
        <div><span class="checkbox"></span> Main levée accordée</div>
        <div><span class="checkbox"></span> Abandon des moyens de transport</div>
      </div>
    </div>
  </div>
`;
