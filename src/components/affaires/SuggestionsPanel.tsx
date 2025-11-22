import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, X, Check, TrendingUp, Settings } from "lucide-react";
import { Suggestion } from "@/services/suggestionsService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
  loading: boolean;
  similarCasesCount: number;
  learningActive?: boolean;
  onApplySuggestion: (field: string, value: any) => void;
  onDismissSuggestion: (field: string) => void;
  onDismissAll: () => void;
}

export const SuggestionsPanel = ({
  suggestions,
  loading,
  similarCasesCount,
  learningActive = true,
  onApplySuggestion,
  onDismissSuggestion,
  onDismissAll,
}: SuggestionsPanelProps) => {
  if (loading) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-primary animate-pulse" />
            Analyse en cours...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  const getConfidenceBadge = (confidence: string) => {
    const variants = {
      high: { variant: 'default' as const, label: 'Haute confiance', color: 'bg-success text-success-foreground' },
      medium: { variant: 'secondary' as const, label: 'Confiance moyenne', color: 'bg-warning text-warning-foreground' },
      low: { variant: 'outline' as const, label: 'Faible confiance', color: 'bg-muted' },
    };
    return variants[confidence as keyof typeof variants] || variants.low;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'bureau_default':
        return <Settings className="h-3 w-3" />;
      case 'ml_improved':
        return <Lightbulb className="h-3 w-3 text-primary" />;
      case 'similar_cases':
      case 'frequent_value':
        return <TrendingUp className="h-3 w-3" />;
      default:
        return <Lightbulb className="h-3 w-3" />;
    }
  };

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-primary" />
              Suggestions intelligentes
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {similarCasesCount > 0 && (
                <span>Basé sur {similarCasesCount} affaire(s) similaire(s)</span>
              )}
              {learningActive && (
                <Badge variant="outline" className="ml-2 text-xs gap-1">
                  <Lightbulb className="h-3 w-3" />
                  Apprentissage actif
                </Badge>
              )}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismissAll}
            className="h-7 text-xs"
          >
            Tout ignorer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((suggestion) => {
          const confidenceBadge = getConfidenceBadge(suggestion.confidence);
          
          return (
            <div
              key={suggestion.field}
              className="flex items-start gap-2 p-3 bg-background rounded-lg border"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{suggestion.label}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant={confidenceBadge.variant} className={`text-xs ${confidenceBadge.color}`}>
                          {getSourceIcon(suggestion.source)}
                          {suggestion.source === 'ml_improved' && (
                            <span className="ml-1 text-[10px]">IA</span>
                          )}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{confidenceBadge.label}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {formatValue(suggestion.value)}
                </p>
              </div>
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => onApplySuggestion(suggestion.field, suggestion.value)}
                      >
                        <Check className="h-3 w-3 text-success" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Appliquer</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => onDismissSuggestion(suggestion.field)}
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Ignorer</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
