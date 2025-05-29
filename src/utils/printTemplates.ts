
import { AffaireContentieuse } from "@/types/affaire";
import { bordereauTemplate } from "./printTemplates/bordereauTemplate";
import { ct8Template } from "./printTemplates/ct8Template";
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
  synthese: syntheseTemplate,
  transmission: transmissionTemplate,
  hierarchie: hierarchieTemplate
};
