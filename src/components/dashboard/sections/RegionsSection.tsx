
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RegionsSection() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Régions & Bureaux</h1>
          <p className="text-gray-600">Gérez les régions et bureaux douaniers du territoire</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organisation Territoriale</CardTitle>
            <CardDescription>
              Module de gestion des régions et bureaux en cours de développement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-600">
                Cette section sera bientôt disponible pour gérer l'organisation territoriale.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
