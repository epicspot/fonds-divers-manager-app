
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Search, Filter } from "lucide-react";
import { SuiviHierarchique } from "@/types/suivi";
import { DetailSuivi } from "./DetailSuivi";

interface TableauSuiviProps {
  suivis: SuiviHierarchique[];
  onRefresh: () => void;
}

export const TableauSuivi = ({ suivis, onRefresh }: TableauSuiviProps) => {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [suiviSelectionne, setSuiviSelectionne] = useState<SuiviHierarchique | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const suivisFiltres = suivis.filter(suivi => {
    const correspondRecherche = suivi.numeroAffaire.toLowerCase().includes(recherche.toLowerCase());
    const correspondStatut = filtreStatut === "tous" || suivi.statutActuel === filtreStatut;
    return correspondRecherche && correspondStatut;
  });

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_attente_hierarchie":
        return <Badge variant="outline">En Attente</Badge>;
      case "en_repartition":
        return <Badge variant="default">Approuvée</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const getPrioriteBadge = (delai?: number) => {
    if (!delai) return null;
    if (delai > 14) return <Badge variant="destructive">Urgent</Badge>;
    if (delai > 7) return <Badge variant="outline">Retard</Badge>;
    return null;
  };

  const handleVoirDetail = (suivi: SuiviHierarchique) => {
    setSuiviSelectionne(suivi);
    setShowDetail(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Suivi des Transmissions</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par numéro..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filtreStatut} onValueChange={setFiltreStatut}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente_hierarchie">En Attente</SelectItem>
                  <SelectItem value="en_repartition">Approuvée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro Affaire</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date Transmission</TableHead>
                <TableHead>Délai (jours)</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suivisFiltres.map((suivi) => (
                <TableRow key={suivi.affaireId}>
                  <TableCell className="font-medium">
                    {suivi.numeroAffaire}
                  </TableCell>
                  <TableCell>
                    {getStatutBadge(suivi.statutActuel)}
                  </TableCell>
                  <TableCell>
                    {suivi.dateTransmission 
                      ? new Date(suivi.dateTransmission).toLocaleDateString()
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{suivi.delaiTransmission || 0}</span>
                      {getPrioriteBadge(suivi.delaiTransmission)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {suivi.responsableActuel || 'Non assigné'}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {suivi.actions.length} action(s)
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVoirDetail(suivi)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {suivisFiltres.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {suivis.length === 0 
                ? "Aucune transmission en cours"
                : "Aucune transmission ne correspond aux critères"
              }
            </div>
          )}
        </CardContent>
      </Card>

      <DetailSuivi
        suivi={suiviSelectionne}
        isOpen={showDetail}
        onClose={() => {
          setShowDetail(false);
          setSuiviSelectionne(null);
        }}
        onRefresh={onRefresh}
      />
    </>
  );
};
