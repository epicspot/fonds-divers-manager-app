
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PersonnelSection() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Personnel</h1>
          <p className="text-gray-600">Gérez les agents et le personnel impliqué dans les dossiers</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personnel</CardTitle>
            <CardDescription>
              Module de gestion du personnel en cours de développement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-600">
                Cette section sera bientôt disponible pour gérer le personnel de la douane.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
