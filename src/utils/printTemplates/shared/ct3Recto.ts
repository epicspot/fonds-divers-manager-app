
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
`;
