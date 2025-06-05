
import { AffaireContentieuse } from "@/types/affaire";
import { PrintTemplate } from "../printTemplates";
import { ct3Styles } from "./shared/ct3Styles";
import { generateCt3Recto } from "./shared/ct3Recto";
import { generateCt3Verso } from "./shared/ct3Verso";

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
          ${ct3Styles}
        </style>
      </head>
      <body>
        <!-- RECTO -->
        ${generateCt3Recto(affaire)}

        <!-- VERSO -->
        ${generateCt3Verso(affaire)}

        <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Imprimer</button>
          <button onclick="window.close()" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 8px; font-size: 11px;">Fermer</button>
        </div>
      </body>
    </html>
  `
};
