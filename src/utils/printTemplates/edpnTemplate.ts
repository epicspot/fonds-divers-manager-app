
import { AffaireContentieuse } from "@/types/affaire";
import { PrintTemplate } from "../printTemplates";
import { edpnStyles } from "./shared/edpnStyles";
import { generateEdpnContent } from "./shared/edpnContent";

export const edpnTemplate: PrintTemplate = {
  title: "EDPN - État Dégageant le Produit Net",
  generateHTML: (content: string, affaire?: AffaireContentieuse) => `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EDPN - ${affaire?.numeroAffaire || ''}</title>
        <style>
          ${edpnStyles}
        </style>
      </head>
      <body>
        ${generateEdpnContent(affaire)}

        <div class="no-print" style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
          <button onclick="window.print()" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Imprimer</button>
          <button onclick="window.close()" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 8px; font-size: 11px;">Fermer</button>
        </div>
      </body>
    </html>
  `
};
