import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, RefreshCw, Sparkles } from "lucide-react";
import { getLearningStats, triggerAIAnalysis } from "@/services/learningService";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBureauxData } from "@/hooks/useBureauxData";

export const LearningMetrics = () => {
  const { bureaux } = useBureauxData();
  const [selectedBureau, setSelectedBureau] = useState<string>("all");
  const [stats, setStats] = useState<any>({});
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadStats();
  }, [selectedBureau]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const result = await getLearningStats(selectedBureau === "all" ? undefined : selectedBureau);
      setStats(result.stats);
      setTotalEvents(result.totalEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (fieldName: string) => {
    if (!selectedBureau || selectedBureau === "all") {
      toast.error("Veuillez sélectionner un bureau spécifique");
      return;
    }

    setAnalyzing(true);
    try {
      const result = await triggerAIAnalysis(selectedBureau, fieldName);
      
      if (result.success) {
        toast.success("Analyse IA terminée avec succès");
        
        if (result.insights) {
          toast.info(
            `Insights: ${result.insights.patterns.length} patterns, ${result.insights.recommendations.length} recommandations`,
            { duration: 5000 }
          );
        }
      } else {
        toast.error(result.error || "Erreur lors de l'analyse");
      }
    } catch (error) {
      toast.error("Erreur lors de l'analyse IA");
    } finally {
      setAnalyzing(false);
    }
  };

  const getAcceptanceColor = (rate: number) => {
    if (rate >= 70) return "text-success";
    if (rate >= 40) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Métriques d'Apprentissage
            </CardTitle>
            <CardDescription>
              Suivez et améliorez les performances des suggestions avec l'IA
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Propulsé par Lovable AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select value={selectedBureau} onValueChange={setSelectedBureau}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les bureaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les bureaux</SelectItem>
                {bureaux.map((bureau) => (
                  <SelectItem key={bureau.id} value={bureau.nom}>
                    {bureau.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadStats}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Total d'événements</div>
              <div className="text-2xl font-bold">{totalEvents}</div>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>

          {Object.keys(stats).length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune donnée d'apprentissage disponible.<br />
              Les suggestions acceptées et rejetées seront trackées automatiquement.
            </div>
          )}

          {Object.entries(stats).map(([fieldName, fieldStats]: [string, any]) => (
            <Card key={fieldName} className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{fieldName}</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAnalyze(fieldName)}
                    disabled={analyzing || !selectedBureau || fieldStats.total < 10}
                  >
                    <Brain className="h-3 w-3 mr-2" />
                    Analyser avec IA
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Taux d'acceptation</span>
                  <span className={`font-bold ${getAcceptanceColor(fieldStats.acceptanceRate)}`}>
                    {fieldStats.acceptanceRate}%
                  </span>
                </div>
                <Progress value={fieldStats.acceptanceRate} className="h-2" />
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Acceptées</div>
                    <div className="font-medium text-success">{fieldStats.accepted}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Rejetées</div>
                    <div className="font-medium text-destructive">{fieldStats.rejected}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Ignorées</div>
                    <div className="font-medium text-muted-foreground">{fieldStats.ignored}</div>
                  </div>
                </div>

                {fieldStats.total < 10 && (
                  <div className="text-xs text-muted-foreground italic">
                    {10 - fieldStats.total} événements supplémentaires nécessaires pour l'analyse IA
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
