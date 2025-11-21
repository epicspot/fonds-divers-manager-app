import { PrintTemplate } from "../printTemplates";
import { ResultatRepartition } from "@/types/repartition";

export const bordereauRepartitionTemplate: PrintTemplate = {
  title: "Bordereau de Répartition",
  generateHTML: (content: string, affaire?: any, resultat?: ResultatRepartition) => {
    const date = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Groupement par type d'ayant droit
    const groupes = {
      'Prélèvements FSP': ['fsp'],
      'Administration': ['tresor'],
      'Fonds et Mutuelles': ['mutuelle', 'fonds_solidarite', 'fonds_formation', 'fonds_equipement', 'prime_rendement'],
      'Poursuivants': ['saisissant', 'chef', 'informateur', 'poursuivant']
    };

    const generateGroupSection = (nomGroupe: string, types: string[]) => {
      if (!resultat) return '';
      
      const ayantsDuGroupe = resultat.ayantsDroits.filter(a => types.includes(a.type));
      if (ayantsDuGroupe.length === 0) return '';

      const totalGroupe = ayantsDuGroupe.reduce((sum, a) => sum + a.montantCalcule, 0);
      
      return `
        <div class="section-groupe">
          <h3 class="titre-groupe">${nomGroupe}</h3>
          <table class="table-repartition">
            <thead>
              <tr>
                <th>Bénéficiaire</th>
                <th>Pourcentage</th>
                <th>Montant (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              ${ayantsDuGroupe.map((ayant, index) => `
                <tr>
                  <td>${ayant.nom}</td>
                  <td class="text-center">${ayant.pourcentage.toFixed(2)}%</td>
                  <td class="text-right montant">${ayant.montantCalcule.toLocaleString('fr-FR')}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="total-groupe">
                <td colspan="2">Sous-total ${nomGroupe}</td>
                <td class="text-right montant">${totalGroupe.toLocaleString('fr-FR')}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    };

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bordereau de Répartition</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
          }
          
          .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .header h1 {
            font-size: 24pt;
            color: #1e40af;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .header .date {
            font-size: 12pt;
            color: #666;
            font-style: italic;
          }
          
          .info-affaire {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #2563eb;
          }
          
          .info-affaire h2 {
            font-size: 14pt;
            color: #1e40af;
            margin-bottom: 15px;
            border-bottom: 1px solid #93c5fd;
            padding-bottom: 8px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
          }
          
          .info-label {
            font-weight: 600;
            color: #1e40af;
          }
          
          .info-value {
            font-weight: 700;
            color: #1e3a8a;
          }
          
          .montant-principal {
            font-size: 16pt;
            color: #059669;
          }
          
          .section-groupe {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          
          .titre-groupe {
            font-size: 14pt;
            color: #1e40af;
            background: linear-gradient(90deg, #dbeafe 0%, #eff6ff 100%);
            padding: 12px 15px;
            border-radius: 6px 6px 0 0;
            border-left: 4px solid #2563eb;
            margin-bottom: 0;
          }
          
          .table-repartition {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .table-repartition th,
          .table-repartition td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .table-repartition thead {
            background: #f3f4f6;
          }
          
          .table-repartition th {
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            font-size: 9pt;
            letter-spacing: 0.5px;
          }
          
          .table-repartition tbody tr:hover {
            background: #f9fafb;
          }
          
          .table-repartition tfoot {
            background: #f8fafc;
            font-weight: 700;
          }
          
          .total-groupe td {
            border-top: 2px solid #2563eb;
            color: #1e40af;
            font-size: 11pt;
          }
          
          .text-center {
            text-align: center;
          }
          
          .text-right {
            text-align: right;
          }
          
          .montant {
            font-family: 'Courier New', monospace;
            font-weight: 600;
          }
          
          .recapitulatif {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            border-left: 4px solid #059669;
          }
          
          .recapitulatif h2 {
            font-size: 14pt;
            color: #065f46;
            margin-bottom: 15px;
          }
          
          .recapitulatif-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          
          .recapitulatif-item {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          
          .recapitulatif-label {
            font-weight: 600;
            color: #065f46;
          }
          
          .recapitulatif-value {
            font-weight: 700;
            color: #047857;
            font-family: 'Courier New', monospace;
          }
          
          .total-final {
            grid-column: 1 / -1;
            background: linear-gradient(90deg, #059669 0%, #047857 100%);
            color: white;
            font-size: 14pt;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
          }
          
          .total-final .recapitulatif-label,
          .total-final .recapitulatif-value {
            color: white;
          }
          
          .avertissements {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
          }
          
          .avertissements h3 {
            color: #92400e;
            margin-bottom: 10px;
            font-size: 12pt;
          }
          
          .avertissements ul {
            list-style-position: inside;
            color: #78350f;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 9pt;
          }
          
          .signatures {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin-top: 60px;
            page-break-inside: avoid;
          }
          
          .signature-bloc {
            text-align: center;
          }
          
          .signature-ligne {
            border-top: 1px solid #333;
            margin-top: 60px;
            padding-top: 10px;
            font-size: 10pt;
            font-weight: 600;
          }
          
          .no-print {
            margin: 20px 0;
            text-align: center;
          }
          
          .no-print button {
            padding: 12px 24px;
            font-size: 12pt;
            cursor: pointer;
            border: none;
            border-radius: 6px;
            margin: 0 10px;
            transition: all 0.3s;
          }
          
          .btn-print {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
          }
          
          .btn-print:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          }
          
          .btn-close {
            background: #6b7280;
            color: white;
          }
          
          .btn-close:hover {
            background: #4b5563;
          }
          
          @media print {
            .no-print {
              display: none;
            }
            
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bordereau de Répartition</h1>
            <div class="date">Généré le ${date}</div>
          </div>
          
          ${resultat ? `
          <div class="info-affaire">
            <h2>Informations de l'Affaire</h2>
            <div class="info-grid">
              ${affaire?.numero_affaire ? `
              <div class="info-item">
                <span class="info-label">N° Affaire:</span>
                <span class="info-value">${affaire.numero_affaire}</span>
              </div>
              ` : ''}
              <div class="info-item">
                <span class="info-label">Montant Total:</span>
                <span class="info-value montant-principal">${resultat.montantTotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div class="info-item">
                <span class="info-label">Part FSP (5%):</span>
                <span class="info-value">${resultat.partFsp.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div class="info-item">
                <span class="info-label">Montant Net:</span>
                <span class="info-value montant-principal">${resultat.montantNet.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          </div>
          
          <div class="repartition-detail">
            ${Object.entries(groupes).map(([nomGroupe, types]) => 
              generateGroupSection(nomGroupe, types)
            ).join('')}
          </div>
          
          <div class="recapitulatif">
            <h2>Récapitulatif de la Répartition</h2>
            <div class="recapitulatif-grid">
              <div class="recapitulatif-item">
                <span class="recapitulatif-label">Part FSP:</span>
                <span class="recapitulatif-value">${resultat.partFsp.toLocaleString('fr-FR')}</span>
              </div>
              <div class="recapitulatif-item">
                <span class="recapitulatif-label">Part Trésor:</span>
                <span class="recapitulatif-value">${resultat.partTresor.toLocaleString('fr-FR')}</span>
              </div>
              <div class="recapitulatif-item">
                <span class="recapitulatif-label">Part Mutuelle:</span>
                <span class="recapitulatif-value">${resultat.partMutuelle.toLocaleString('fr-FR')}</span>
              </div>
              <div class="recapitulatif-item">
                <span class="recapitulatif-label">Fonds Solidarité:</span>
                <span class="recapitulatif-value">${resultat.partFondsSolidarite.toLocaleString('fr-FR')}</span>
              </div>
              <div class="recapitulatif-item">
                <span class="recapitulatif-label">Fonds Formation:</span>
                <span class="recapitulatif-value">${resultat.partFondsFormation.toLocaleString('fr-FR')}</span>
              </div>
              <div class="recapitulatif-item">
                <span class="recapitulatif-label">Fonds Équipement:</span>
                <span class="recapitulatif-value">${resultat.partFondsEquipement.toLocaleString('fr-FR')}</span>
              </div>
              <div class="recapitulatif-item">
                <span class="recapitulatif-label">Prime Rendement:</span>
                <span class="recapitulatif-value">${resultat.partPrimeRendement.toLocaleString('fr-FR')}</span>
              </div>
              <div class="recapitulatif-item total-final">
                <span class="recapitulatif-label">TOTAL RÉPARTI:</span>
                <span class="recapitulatif-value">${resultat.ayantsDroits.reduce((sum, a) => sum + a.montantCalcule, 0).toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          </div>
          
          ${!resultat.verificationsOk && resultat.erreurs.length > 0 ? `
          <div class="avertissements">
            <h3>⚠️ Avertissements</h3>
            <ul>
              ${resultat.erreurs.map(erreur => `<li>${erreur}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          <div class="signatures">
            <div class="signature-bloc">
              <div class="signature-ligne">Le Chef de Bureau</div>
            </div>
            <div class="signature-bloc">
              <div class="signature-ligne">Le Directeur Régional</div>
            </div>
            <div class="signature-bloc">
              <div class="signature-ligne">Le Contrôleur Financier</div>
            </div>
          </div>
          ` : `
          <div class="info-affaire">
            <p>${content}</p>
          </div>
          `}
          
          <div class="footer">
            <p>Document généré automatiquement - ${date}</p>
            <p>Ce bordereau est conforme aux règles de répartition en vigueur</p>
          </div>
        </div>
        
        <div class="no-print">
          <button class="btn-print" onclick="window.print()">
            🖨️ Imprimer
          </button>
          <button class="btn-close" onclick="window.close()">
            ✖️ Fermer
          </button>
        </div>
      </body>
      </html>
    `;
  }
};
