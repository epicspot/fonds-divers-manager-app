
import { AffaireContentieuse } from "@/types/affaire";
import { repartirMontants } from "@/utils/repartitionUtils";

export const generateEdpnContent = (affaire?: AffaireContentieuse) => {
  if (!affaire) return '';

  // Calcul de la répartition pour obtenir les ayants-droits
  const parametresRepartition = {
    montantAffaire: affaire.montantAffaire || 0,
    montantAmende: affaire.montantAmende || 0,
    montantVente: affaire.montantVente || 0,
    fraisDivers: affaire.montantTotalFrais || 0,
    nombreSaisissants: affaire.nomsSaisissant?.length || 1,
    nombreChefs: affaire.nomsChefs?.length || 1,
    nombreInformateurs: affaire.nombreInformateurs || 0,
    saisissants: affaire.nomsSaisissant || [],
    chefs: affaire.nomsChefs || [],
    informateurs: []
  };

  const resultatRepartition = repartirMontants(parametresRepartition);
  const dateAffaire = affaire.dateAffaire ? new Date(affaire.dateAffaire).toLocaleDateString('fr-FR') : '';
  const dateTransaction = affaire.dateTransaction ? new Date(affaire.dateTransaction).toLocaleDateString('fr-FR') : '';
  const montantBrut = affaire.montantAffaire || 0;
  const montantAmende = affaire.montantAmende || 0;
  const montantVente = affaire.montantVente || 0;
  const montantTotal = resultatRepartition.montantTotal;
  const partFsp = resultatRepartition.partFsp;
  const fraisDivers = affaire.montantTotalFrais || 0;
  const produitNet = resultatRepartition.montantNet;

  return `
    <div class="page">
      <div class="header">
        <div class="header-logo">
          <strong>BURKINA FASO</strong><br>
          <span style="font-size: 11px;">Unité - Progrès - Justice</span>
        </div>
        <h1>ÉTAT DÉGAGEANT LE PRODUIT NET</h1>
        <div class="header-ministry">
          MINISTÈRE DE L'ÉCONOMIE ET DES FINANCES<br>
          <span style="font-size: 11px;">Direction Générale des Douanes</span>
        </div>
      </div>

      <div class="reference-section">
        <div class="reference-box">
          <div><strong>N° Affaire:</strong> ${affaire.numeroAffaire || ''}</div>
          <div><strong>Date de l'affaire:</strong> ${dateAffaire}</div>
          <div><strong>Bureau:</strong> ${affaire.bureauPoste?.join(', ') || ''}</div>
        </div>
        <div class="reference-box">
          <div><strong>N° Référence:</strong> ${affaire.numeroReference || ''}</div>
          <div><strong>Date transaction:</strong> ${dateTransaction}</div>
          <div><strong>Région:</strong> ${affaire.regionDgd?.join(', ') || ''}</div>
        </div>
      </div>

      <div class="info-section">
        <h2 class="section-title">I. INFORMATIONS SUR L'AFFAIRE</h2>
        <div class="info-row">
          <span class="info-label">Contrevenant:</span>
          <span class="info-value">${affaire.nomPrenomContrevenant || ''}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Adresse:</span>
          <span class="info-value">${affaire.adresseComplete || ''}</span>
        </div>
        <div class="info-row">
          <span class="info-label">IFU:</span>
          <span class="info-value">${affaire.ifu || ''}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Nature de l'infraction:</span>
          <span class="info-value">${affaire.descriptionAffaire || ''}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Marchandises concernées:</span>
          <span class="info-value">${affaire.natureMarchandisesFraude || ''}</span>
        </div>
      </div>

      <div class="calcul-section">
        <h2 class="section-title">II. CALCUL DU PRODUIT NET</h2>
        <table class="calcul-table">
          <tr>
            <td class="calcul-label">Droits et Taxes compromis</td>
            <td class="calcul-montant">${montantBrut.toLocaleString()}</td>
            <td class="calcul-unit">FCFA</td>
          </tr>
          <tr>
            <td class="calcul-label">Montant de l'amende transactionnelle</td>
            <td class="calcul-montant">${montantAmende.toLocaleString()}</td>
            <td class="calcul-unit">FCFA</td>
          </tr>
          <tr>
            <td class="calcul-label">Produit de la vente</td>
            <td class="calcul-montant">${montantVente.toLocaleString()}</td>
            <td class="calcul-unit">FCFA</td>
          </tr>
          <tr class="total-row">
            <td class="calcul-label"><strong>MONTANT BRUT TOTAL</strong></td>
            <td class="calcul-montant"><strong>${montantTotal.toLocaleString()}</strong></td>
            <td class="calcul-unit"><strong>FCFA</strong></td>
          </tr>
          <tr class="deduction-row">
            <td class="calcul-label">À déduire: Part FSP (5%)</td>
            <td class="calcul-montant">- ${partFsp.toLocaleString()}</td>
            <td class="calcul-unit">FCFA</td>
          </tr>
          <tr class="deduction-row">
            <td class="calcul-label">À déduire: Frais divers</td>
            <td class="calcul-montant">- ${fraisDivers.toLocaleString()}</td>
            <td class="calcul-unit">FCFA</td>
          </tr>
          <tr class="net-row">
            <td class="calcul-label"><strong>PRODUIT NET À RÉPARTIR</strong></td>
            <td class="calcul-montant"><strong>${produitNet.toLocaleString()}</strong></td>
            <td class="calcul-unit"><strong>FCFA</strong></td>
          </tr>
        </table>
      </div>

      <div class="tableau-section">
        <h2 class="section-title">III. RÉPARTITION DÉTAILLÉE DU PRODUIT NET</h2>
        
        <div class="groupe-ayants">
          <h3>A. PRÉLÈVEMENTS OBLIGATOIRES</h3>
          <table class="tableau">
            <thead>
              <tr>
                <th style="width: 50%">DÉSIGNATION</th>
                <th style="width: 20%">POURCENTAGE</th>
                <th style="width: 30%">MONTANT (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              ${resultatRepartition.ayantsDroits
                .filter(a => a.type === 'fsp')
                .map(ayant => `
                  <tr>
                    <td>${ayant.nom}</td>
                    <td class="numeric">${ayant.pourcentage.toFixed(2)}%</td>
                    <td class="numeric">${ayant.montantCalcule.toLocaleString()}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>

        <div class="groupe-ayants">
          <h3>B. ADMINISTRATION</h3>
          <table class="tableau">
            <thead>
              <tr>
                <th style="width: 50%">DÉSIGNATION</th>
                <th style="width: 20%">POURCENTAGE</th>
                <th style="width: 30%">MONTANT (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              ${resultatRepartition.ayantsDroits
                .filter(a => a.type === 'tresor')
                .map(ayant => `
                  <tr>
                    <td>${ayant.nom}</td>
                    <td class="numeric">${ayant.pourcentage.toFixed(2)}%</td>
                    <td class="numeric">${ayant.montantCalcule.toLocaleString()}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>

        <div class="groupe-ayants">
          <h3>C. FONDS ET MUTUELLES</h3>
          <table class="tableau">
            <thead>
              <tr>
                <th style="width: 50%">DÉSIGNATION</th>
                <th style="width: 20%">POURCENTAGE</th>
                <th style="width: 30%">MONTANT (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              ${resultatRepartition.ayantsDroits
                .filter(a => ['mutuelle', 'fonds_solidarite', 'fonds_formation', 'fonds_equipement', 'prime_rendement'].includes(a.type))
                .map(ayant => `
                  <tr>
                    <td>${ayant.nom}</td>
                    <td class="numeric">${ayant.pourcentage.toFixed(2)}%</td>
                    <td class="numeric">${ayant.montantCalcule.toLocaleString()}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>

        <div class="groupe-ayants">
          <h3>D. POURSUIVANTS</h3>
          <table class="tableau">
            <thead>
              <tr>
                <th style="width: 50%">NOM ET PRÉNOMS</th>
                <th style="width: 20%">POURCENTAGE</th>
                <th style="width: 30%">MONTANT (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              ${resultatRepartition.ayantsDroits
                .filter(a => ['saisissant', 'chef', 'informateur'].includes(a.type))
                .map(ayant => `
                  <tr>
                    <td>${ayant.nom}</td>
                    <td class="numeric">${ayant.pourcentage.toFixed(2)}%</td>
                    <td class="numeric">${ayant.montantCalcule.toLocaleString()}</td>
                  </tr>
                `).join('')}
              <tr class="subtotal-row">
                <td><strong>Sous-total Poursuivants</strong></td>
                <td class="numeric"><strong>${resultatRepartition.ayantsDroits
                  .filter(a => ['saisissant', 'chef', 'informateur'].includes(a.type))
                  .reduce((sum, a) => sum + a.pourcentage, 0).toFixed(2)}%</strong></td>
                <td class="numeric"><strong>${resultatRepartition.ayantsDroits
                  .filter(a => ['saisissant', 'chef', 'informateur'].includes(a.type))
                  .reduce((sum, a) => sum + a.montantCalcule, 0).toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="total-general">
          <table class="tableau">
            <tr class="total-row">
              <td style="width: 50%"><strong>TOTAL GÉNÉRAL</strong></td>
              <td style="width: 20%" class="numeric"><strong>100.00%</strong></td>
              <td style="width: 30%" class="numeric"><strong>${resultatRepartition.ayantsDroits.reduce((sum, a) => sum + a.montantCalcule, 0).toLocaleString()} FCFA</strong></td>
            </tr>
          </table>
        </div>
      </div>

      <div class="verification-section">
        <h2 class="section-title">IV. VÉRIFICATIONS</h2>
        <div class="verification-item ${resultatRepartition.verificationsOk ? 'ok' : 'erreur'}">
          <strong>État de vérification:</strong> ${resultatRepartition.verificationsOk ? '✓ Calculs vérifiés et conformes' : '✗ Erreurs détectées'}
        </div>
        ${!resultatRepartition.verificationsOk && resultatRepartition.erreurs.length > 0 ? `
          <div class="erreurs-list">
            ${resultatRepartition.erreurs.map(err => `<div>• ${err}</div>`).join('')}
          </div>
        ` : ''}
      </div>

      <div class="observations-section">
        <h2 class="section-title">V. OBSERVATIONS</h2>
        <div class="observations-content">
          ${affaire.observations || 'Néant'}
        </div>
        ${affaire.circonstancesParticulieres ? `
          <div class="observations-content" style="margin-top: 10px;">
            <strong>Circonstances particulières:</strong><br>
            ${affaire.circonstancesParticulieres}
          </div>
        ` : ''}
      </div>

      <div class="footer-info">
        <div>Fait à ${affaire.bureauPoste?.[0] || ''}, le ${new Date().toLocaleDateString('fr-FR')}</div>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-title">Le Chef de Bureau</div>
          <div class="signature-line"></div>
          <div class="signature-name">${affaire.nomsChefs?.[0] || ''}</div>
        </div>
        <div class="signature-box">
          <div class="signature-title">Le Receveur des Douanes</div>
          <div class="signature-line"></div>
          <div class="signature-name"></div>
        </div>
        <div class="signature-box">
          <div class="signature-title">Le Directeur Régional</div>
          <div class="signature-line"></div>
          <div class="signature-name"></div>
        </div>
      </div>
    </div>
  `;
};
