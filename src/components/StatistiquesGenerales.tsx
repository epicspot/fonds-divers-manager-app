
import { useState, useEffect } from "react";
import { obtenirDossiers } from "@/utils/fondsUtils";

interface StatistiquesGeneralesProps {
  type: "total" | "montant" | "ayants";
  refreshTrigger: number;
}

export const StatistiquesGenerales = ({ type, refreshTrigger }: StatistiquesGeneralesProps) => {
  const [valeur, setValeur] = useState("0");

  useEffect(() => {
    const dossiers = obtenirDossiers();
    
    switch (type) {
      case "total":
        setValeur(dossiers.length.toString());
        break;
      case "montant":
        const montantTotal = dossiers.reduce((sum, d) => sum + d.montantNet, 0);
        setValeur(`${montantTotal.toLocaleString()} FCFA`);
        break;
      case "ayants":
        const totalAyants = dossiers.reduce((sum, d) => sum + d.ayantsDroits.length, 0);
        setValeur(totalAyants.toString());
        break;
    }
  }, [type, refreshTrigger]);

  return (
    <div className="text-2xl font-bold">
      {valeur}
    </div>
  );
};
