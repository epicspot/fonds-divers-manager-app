
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReferencesSection() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Listes de Référence</h1>
          <p className="text-gray-600">Gérez les listes de référence utilisées dans l'application</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Références</CardTitle>
            <CardDescription>
              Module de gestion des références en cours de développement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-600">
                Cette section sera bientôt disponible pour gérer les listes de référence.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
