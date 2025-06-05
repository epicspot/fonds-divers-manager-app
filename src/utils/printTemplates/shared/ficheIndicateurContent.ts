
import { AffaireContentieuse } from "@/types/affaire";

export const generateFicheIndicateurContent = (affaire?: AffaireContentieuse) => {
  if (!affaire) {
    return '<div class="error">Aucune affaire sélectionnée</div>';
  }

  const dateAujourdhui = new Date().toLocaleDateString('fr-FR');
  const montantAffaire = affaire.montantAffaire || 0;
  const pourcentageIndicateur = 5; // Pourcentage standard pour indicateur
  const montantIndicateur = (montantAffaire * pourcentageIndicateur) / 100;

  return `
    <div class="page">
      <div class="header">
        <h1>Fiche pour l'Attribution d'une Part à un Indicateur</h1>
        <div class="header-info">
          <div class="header-left">
            <strong>DIRECTION GENERALE DES DOUANES</strong><br>
            <strong>REPUBLIQUE DU BENIN</strong>
          </div>
          <div class="header-right">
            <strong>Date:</strong> ${dateAujourdhui}<br>
            <strong>N° Affaire:</strong> ${affaire.numeroAffaire}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">I. Informations sur l'Indicateur</div>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Nom et Prénoms:</span>
            <span class="info-value">${affaire.nomsIntervenants?.[0] || ''}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Fonction:</span>
            <span class="info-value">Indicateur</span>
          </div>
          <div class="info-row">
            <span class="info-label">Matricule:</span>
            <span class="info-value"></span>
          </div>
          <div class="info-row">
            <span class="info-label">Service:</span>
            <span class="info-value">${affaire.bureauPoste?.[0] || ''}</span>
          </div>
          <div class="info-row full-width">
            <span class="info-label">Adresse complète:</span>
            <span class="info-value"></span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">II. Informations sur la Saisie</div>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Date de l'affaire:</span>
            <span class="info-value">${new Date(affaire.dateAffaire).toLocaleDateString('fr-FR')}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Lieu de la saisie:</span>
            <span class="info-value">${affaire.bureauPoste?.[0] || ''}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Numéro de référence:</span>
            <span class="info-value">${affaire.numeroReference}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Nature des marchandises:</span>
            <span class="info-value">${affaire.natureMarchandisesFraude || ''}</span>
          </div>
          <div class="info-row full-width">
            <span class="info-label">Description de l'affaire:</span>
            <span class="info-value">${affaire.descriptionAffaire}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Valeur des marchandises:</span>
            <span class="info-value">${montantAffaire.toLocaleString()} FCFA</span>
          </div>
          <div class="info-row">
            <span class="info-label">Contrevenant:</span>
            <span class="info-value">${affaire.nomPrenomContrevenant || ''}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">III. Calcul de la Part de l'Indicateur</div>
        <table class="tableau">
          <thead>
            <tr>
              <th>Désignation</th>
              <th>Montant (FCFA)</th>
              <th>Pourcentage (%)</th>
              <th>Part Indicateur (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Valeur totale de l'affaire</td>
              <td class="numeric">${montantAffaire.toLocaleString()}</td>
              <td class="center">${pourcentageIndicateur}%</td>
              <td class="numeric">${montantIndicateur.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div class="montant-box">
          MONTANT À ATTRIBUER À L'INDICATEUR: ${montantIndicateur.toLocaleString()} FCFA
        </div>
      </div>

      <div class="section">
        <div class="section-title">IV. Modalités de Paiement</div>
        <div class="info-grid">
          <div class="info-row">
            <span class="info-label">Mode de paiement:</span>
            <span class="info-value">Espèces / Chèque / Virement</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date de paiement prévue:</span>
            <span class="info-value"></span>
          </div>
          <div class="info-row">
            <span class="info-label">Référence du paiement:</span>
            <span class="info-value"></span>
          </div>
          <div class="info-row">
            <span class="info-label">Responsable du paiement:</span>
            <span class="info-value">${affaire.nomsChefs?.[0] || ''}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">V. Observations</div>
        <div class="observations">
          <div class="observations-content">
            ${affaire.observations || 'Aucune observation particulière.'}
          </div>
        </div>
      </div>

      <div class="date-lieu">
        Fait à ____________, le ${dateAujourdhui}
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-title">Le Chef de Service</div>
          <br><br><br>
          <div>Nom et Signature</div>
        </div>
        <div class="signature-box">
          <div class="signature-title">L'Indicateur</div>
          <br><br><br>
          <div>Nom et Signature</div>
        </div>
        <div class="signature-box">
          <div class="signature-title">Le Directeur Régional</div>
          <br><br><br>
          <div>Nom et Signature</div>
        </div>
      </div>
    </div>
  `;
};
