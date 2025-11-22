import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface Step {
  number: number;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

export const StepIndicator = ({ steps, currentStep, completedSteps, onStepClick }: StepIndicatorProps) => {
  const isStepAccessible = (stepNumber: number) => {
    return stepNumber <= currentStep || completedSteps.includes(stepNumber);
  };

  const handleStepClick = (stepNumber: number) => {
    if (isStepAccessible(stepNumber) && onStepClick) {
      onStepClick(stepNumber);
    }
  };

  // Calculer le pourcentage de progression
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full py-4 space-y-4">
      {/* Barre de progression en pourcentage */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progression</span>
          <span className="font-medium text-primary">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const accessible = isStepAccessible(step.number);
          const clickable = accessible && step.number !== currentStep;
          
          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleStepClick(step.number)}
                  disabled={!accessible}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    completedSteps.includes(step.number)
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep === step.number
                      ? "border-primary text-primary bg-primary/10"
                      : "border-muted-foreground/30 text-muted-foreground",
                    clickable && "cursor-pointer hover:scale-110 hover:shadow-md",
                    !accessible && "cursor-not-allowed opacity-50"
                  )}
                >
                  {completedSteps.includes(step.number) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{step.number}</span>
                  )}
                </button>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      currentStep === step.number
                        ? "text-primary"
                        : completedSteps.includes(step.number)
                        ? "text-foreground"
                        : "text-muted-foreground",
                      clickable && "group-hover:text-primary"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-all",
                    completedSteps.includes(step.number)
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
