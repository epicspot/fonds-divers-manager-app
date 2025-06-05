
import { AffaireContentieuse } from "@/types/affaire";
import { repartirMontants } from "@/utils/repartitionUtils";

export const generateEdpnContent = (affaire?: AffaireContentieuse) => {
  if (!affaire) return '';

  // Calcul de la répartition pour obtenir les ayants-droits
  const parametresRepartition = {
    montantAffaire: affaire.montantAffaire || 0,
    montantAmende: affaire.montantAmende || 0,
    montantVente: 0, // À adapter selon vos besoins
    fraisDivers: affaire.montantTotalFrais || 0,
    nombreSaisissants: affaire.nomsSaisissant?.length || 1,
    nombreChefs: affaire.nomsChefs?.length || 1,
    nombreInformateurs: 0,
    saisissants: affaire.nomsSaisissant || [],
    chefs: affaire.nomsChefs || [],
    informateurs: []
  };

  const resultatRepartition = repartirMontants(parametresRepartition);
  const dateAffaire = affaire.dateAffaire ? new Date(affaire.dateAffaire).toLocaleDateString('fr-FR') : '';
  const montantTotal = resultatRepartition.montantTotal;
  const produitNet = resultatRepartition.montantNet;

  return `
    <div class="page">
      <div class="header">
        <h1>ETAT DEGAGEANT LE PRODUIT NET</h1>
      </div>

      <div class="header-info">
        <div class="header-left">
          <strong>BURKINA FASO</strong><br>
          DIRECTION GENERALE DES DOUANES<br>
          Bureau: ${affaire.bureauPoste?.join(', ') || 'BUREAU DE DAKOLA'}
        </div>
        <div class="header-right">
          <strong>Affaire N°:</strong> ${affaire.numeroAffaire || ''}<br>
          <strong>Date:</strong> ${dateAffaire}
        </div>
      </div>

      <div class="info-section">
        <div class="info-row">
          <span class="info-label">Contrevenant:</span>
          <span class="info-value">${affaire.nomPrenomContrevenant || ''}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Nature de l'infraction:</span>
          <span class="info-value">${affaire.descriptionAffaire || ''}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Montant de l'affaire:</span>
          <span class="info-value">${montantTotal.toLocaleString()} FCFA</span>
        </div>
        <div class="info-row">
          <span class="info-label">Montant des frais:</span>
          <span class="info-value">${(affaire.montantTotalFrais || 0).toLocaleString()} FCFA</span>
        </div>
      </div>

      <div class="tableau-section">
        <div class="tableau-title">TABLEAU DES AYANTS-DROITS</div>
        <table class="tableau">
          <thead>
            <tr>
              <th style="width: 5%">N°</th>
              <th style="width: 40%">DESIGNATION DES AYANTS-DROITS</th>
              <th style="width: 15%">POURCENTAGE</th>
              <th style="width: 20%">MONTANT (FCFA)</th>
              <th style="width: 20%">OBSERVATIONS</th>
            </tr>
          </thead>
          <tbody>
            ${resultatRepartition.ayantsDroits.map((ayant, index) => `
              <tr>
                <td class="center">${index + 1}</td>
                <td>${ayant.nom}</td>
                <td class="numeric">${ayant.pourcentage.toFixed(2)}%</td>
                <td class="numeric">${ayant.montantCalcule.toLocaleString()}</td>
                <td></td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td class="center" colspan="2"><strong>TOTAL</strong></td>
              <td class="numeric"><strong>100.00%</strong></td>
              <td class="numeric"><strong>${resultatRepartition.ayantsDroits.reduce((sum, a) => sum + a.montantCalcule, 0).toLocaleString()}</strong></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="montant-box">
        <strong>PRODUIT NET À RÉPARTIR: ${produitNet.toLocaleString()} FCFA</strong>
      </div>

      <div class="date-lieu">
        Fait à ${affaire.bureauPoste?.[0] || 'Dakola'}, le ${new Date().toLocaleDateString('fr-FR')}
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-title">Le Chef de Bureau</div>
        </div>
        <div class="signature-box">
          <div class="signature-title">Le Receveur</div>
        </div>
      </div>
    </div>
  `;
};
