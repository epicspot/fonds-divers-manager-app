
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PersonnelSection() {
  return (
    <div className="p-4 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900">Gestion du Personnel</h1>
          <p className="text-gray-600 text-sm">Gérez les agents et le personnel impliqué dans les dossiers</p>
        </div>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Personnel</CardTitle>
            <CardDescription className="text-sm">
              Module de gestion du personnel en cours de développement
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 text-center">
              Cette section sera bientôt disponible pour gérer le personnel de la douane.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
