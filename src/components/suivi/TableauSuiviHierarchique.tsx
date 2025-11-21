import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { AffaireContentieuse } from "@/types/affaire";
import { SuiviHierarchique } from "@/types/suivi";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DetailSuivi } from "./DetailSuivi";
import { useActionsSuivi } from "@/hooks/useActionsSuivi";

interface TableauSuiviHierarchiqueProps {
  affaires: AffaireContentieuse[];
  onRefresh: () => void;
}

export const TableauSuiviHierarchique = ({ affaires, onRefresh }: TableauSuiviHierarchiqueProps) => {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [affaireSelectionnee, setAffaireSelectionnee] = useState<SuiviHierarchique | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { actions } = useActionsSuivi();

  // Convertir les affaires en suivis hiérarchiques
  const suivis: SuiviHierarchique[] = useMemo(() => {
    return affaires.map(affaire => {
      const actionsAffaire = actions.filter(a => a.affaireId === affaire.id);
      
      return {
        affaireId: affaire.id,
        numeroAffaire: affaire.numeroAffaire,
        statutActuel: affaire.statut,
        dateTransmission: affaire.dateTransmissionHierarchie,
        dateValidation: affaire.dateValidation,
        delaiTransmission: affaire.dateTransmissionHierarchie 
          ? differenceInDays(new Date(), new Date(affaire.dateTransmissionHierarchie))
          : undefined,
        actions: actionsAffaire
      };
    });
  }, [affaires, actions]);

  // Filtrer les suivis
  const suivisFiltres = useMemo(() => {
    return suivis.filter(suivi => {
      const matchRecherche = suivi.numeroAffaire.toLowerCase().includes(recherche.toLowerCase());
      const matchStatut = filtreStatut === "tous" || suivi.statutActuel === filtreStatut;
      return matchRecherche && matchStatut;
    });
  }, [suivis, recherche, filtreStatut]);

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "brouillon":
        return <Badge variant="secondary">Brouillon</Badge>;
      case "validee":
        return <Badge variant="default">Validée</Badge>;
      case "en_attente_hierarchie":
        return <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          En Attente Hiérarchie
        </Badge>;
      case "en_repartition":
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Approuvée
        </Badge>;
      case "cloturee":
        return <Badge>Clôturée</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const getPrioriteBadge = (delai?: number) => {
    if (!delai) return null;
    
    if (delai > 7) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Urgent
        </Badge>
      );
    } else if (delai > 3) {
      return (
        <Badge variant="outline" className="text-orange-500 border-orange-500">
          Attention
        </Badge>
      );
    }
    return null;
  };

  const handleVoirDetail = (suivi: SuiviHierarchique) => {
    setAffaireSelectionnee(suivi);
    setDetailOpen(true);
  };

  return (
    <>
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Suivi Hiérarchique</h2>
            <Button onClick={onRefresh} variant="outline" size="sm">
              Actualiser
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par numéro d'affaire..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtreStatut} onValueChange={setFiltreStatut}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="validee">Validée</SelectItem>
                <SelectItem value="en_attente_hierarchie">En Attente Hiérarchie</SelectItem>
                <SelectItem value="en_repartition">Approuvée</SelectItem>
                <SelectItem value="cloturee">Clôturée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Affaire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date Transmission</TableHead>
                  <TableHead>Délai</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suivisFiltres.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Aucune affaire trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  suivisFiltres.map((suivi) => (
                    <TableRow key={suivi.affaireId}>
                      <TableCell className="font-medium">
                        {suivi.numeroAffaire}
                      </TableCell>
                      <TableCell>{getStatutBadge(suivi.statutActuel)}</TableCell>
                      <TableCell>
                        {suivi.dateTransmission
                          ? format(new Date(suivi.dateTransmission), "dd MMM yyyy", { locale: fr })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {suivi.delaiTransmission
                          ? `${suivi.delaiTransmission} jours`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {getPrioriteBadge(suivi.delaiTransmission)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVoirDetail(suivi)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Détails du Suivi - {affaireSelectionnee?.numeroAffaire}
            </DialogTitle>
          </DialogHeader>
          {affaireSelectionnee && (
            <DetailSuivi
              suivi={affaireSelectionnee}
              isOpen={detailOpen}
              onClose={() => setDetailOpen(false)}
              onRefresh={onRefresh}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
