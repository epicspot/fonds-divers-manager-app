import { ConfigurationModele } from "@/services/modelesRapportsService";

/**
 * Applique la configuration du modèle à un contenu HTML
 */
export const applyTemplateConfiguration = (
  baseHTML: string,
  config?: ConfigurationModele
): string => {
  if (!config) return baseHTML;

  // Créer les styles personnalisés
  let customStyles = "<style>";

  // Styles de l'en-tête
  if (config.enTete) {
    if (config.enTete.couleurFond) {
      customStyles += `
        .header, .page-header {
          background-color: ${config.enTete.couleurFond} !important;
        }
      `;
    }
    if (config.enTete.couleurTexte) {
      customStyles += `
        .header, .page-header, .header *, .page-header * {
          color: ${config.enTete.couleurTexte} !important;
        }
      `;
    }
  }

  // Styles de mise en page
  if (config.miseEnPage) {
    const marges = config.miseEnPage.marges;
    if (marges) {
      customStyles += `
        @page {
          margin: ${marges.haut || 20}mm ${marges.droite || 20}mm ${
        marges.bas || 20
      }mm ${marges.gauche || 20}mm;
        }
      `;
    }

    if (config.miseEnPage.police) {
      customStyles += `
        body, * {
          font-family: ${config.miseEnPage.police}, sans-serif !important;
        }
      `;
    }

    if (config.miseEnPage.taillePolice) {
      customStyles += `
        body {
          font-size: ${config.miseEnPage.taillePolice}px !important;
        }
      `;
    }

    if (config.miseEnPage.couleurPrincipale) {
      customStyles += `
        .primary-color, .section-title, h1, h2, h3 {
          color: ${config.miseEnPage.couleurPrincipale} !important;
        }
        .border-primary {
          border-color: ${config.miseEnPage.couleurPrincipale} !important;
        }
      `;
    }

    if (config.miseEnPage.couleurSecondaire) {
      customStyles += `
        .secondary-color {
          color: ${config.miseEnPage.couleurSecondaire} !important;
        }
      `;
    }
  }

  customStyles += "</style>";

  // Insérer les styles dans le HTML (juste après la balise <head>)
  let modifiedHTML = baseHTML.replace(
    /<head>/i,
    `<head>${customStyles}`
  );

  // Ajouter le logo si configuré
  if (config.enTete?.logo && config.sections?.afficherLogo !== false) {
    const logoHTML = `
      <div class="custom-logo" style="text-align: center; margin-bottom: 20px;">
        <img src="${config.enTete.logo}" alt="Logo" style="max-height: 80px; max-width: 200px;">
      </div>
    `;
    modifiedHTML = modifiedHTML.replace(
      /<body[^>]*>/i,
      `$&${logoHTML}`
    );
  }

  // Ajouter le titre et sous-titre si configurés
  if (config.enTete?.titre && config.sections?.afficherEntete !== false) {
    const headerHTML = `
      <div class="custom-header" style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; padding: 10px 0; color: ${
          config.enTete.couleurTexte || "#000"
        };">
          ${config.enTete.titre}
        </h1>
        ${
          config.enTete.sousTitre
            ? `<p style="margin: 5px 0; color: ${
                config.enTete.couleurTexte || "#666"
              };">${config.enTete.sousTitre}</p>`
            : ""
        }
      </div>
    `;
    modifiedHTML = modifiedHTML.replace(
      /<body[^>]*>/i,
      `$&${headerHTML}`
    );
  }

  // Masquer les sections si configuré
  if (config.sections) {
    if (!config.sections.afficherSignature) {
      customStyles += `
        .signature-section { display: none !important; }
      `;
    }
    if (!config.sections.afficherCachet) {
      customStyles += `
        .cachet-section { display: none !important; }
      `;
    }
  }

  return modifiedHTML;
};
