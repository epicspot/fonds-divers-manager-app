
import { AffaireContentieuse } from "@/types/affaire";
import { bordereauTemplate } from "./printTemplates/bordereauTemplate";
import { ct8Template } from "./printTemplates/ct8Template";
import { ct3Template } from "./printTemplates/ct3Template";
import { edpnTemplate } from "./printTemplates/edpnTemplate";
import { ficheIndicateurTemplate } from "./printTemplates/ficheIndicateurTemplate";
import { syntheseTemplate } from "./printTemplates/syntheseTemplate";
import { transmissionTemplate } from "./printTemplates/transmissionTemplate";
import { hierarchieTemplate } from "./printTemplates/hierarchieTemplate";

export interface PrintTemplate {
  title: string;
  generateHTML: (content: string, affaire?: AffaireContentieuse) => string;
}

export const printTemplates = {
  bordereau: bordereauTemplate,
  bordereau_officiel: ct8Template,
  transaction_ct3: ct3Template,
  edpn: edpnTemplate,
  fiche_indicateur: ficheIndicateurTemplate,
  synthese: syntheseTemplate,
  transmission: transmissionTemplate,
  hierarchie: hierarchieTemplate
};
