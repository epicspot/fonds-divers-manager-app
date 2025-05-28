
import { AffaireContentieuse } from "@/types/affaire";
import { bordereauOfficielTemplate } from "./printTemplates/bordereauOfficielTemplate";
import { bordereauTemplate } from "./printTemplates/bordereauTemplate";
import { syntheseTemplate } from "./printTemplates/syntheseTemplate";
import { transmissionTemplate } from "./printTemplates/transmissionTemplate";
import { hierarchieTemplate } from "./printTemplates/hierarchieTemplate";

export interface PrintTemplate {
  title: string;
  generateHTML: (content: string, affaire?: AffaireContentieuse) => string;
}

export const printTemplates = {
  bordereau: bordereauTemplate,
  bordereau_officiel: bordereauOfficielTemplate,
  synthese: syntheseTemplate,
  transmission: transmissionTemplate,
  hierarchie: hierarchieTemplate
};
