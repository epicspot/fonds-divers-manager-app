
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { SuiviHierarchique } from "@/types/suivi";

interface StatistiquesSuiviProps {
  suivis: SuiviHierarchique[];
}

export const StatistiquesSuivi = ({ suivis }: StatistiquesSuiviProps) => {
  // Données pour le graphique des délais
  const delaisData = [
    { nom: '0-3 jours', count: suivis.filter(s => (s.delaiTransmission || 0) <= 3).length },
    { nom: '4-7 jours', count: suivis.filter(s => (s.delaiTransmission || 0) > 3 && (s.delaiTransmission || 0) <= 7).length },
    { nom: '8-14 jours', count: suivis.filter(s => (s.delaiTransmission || 0) > 7 && (s.delaiTransmission || 0) <= 14).length },
    { nom: '15+ jours', count: suivis.filter(s => (s.delaiTransmission || 0) > 14).length },
  ];

  // Données pour le graphique des statuts
  const statutsData = [
    { nom: 'En attente', count: suivis.filter(s => s.statutActuel === 'en_attente_hierarchie').length, color: '#f59e0b' },
    { nom: 'Approuvée', count: suivis.filter(s => s.statutActuel === 'en_repartition').length, color: '#10b981' },
  ];

  const COLORS = ['#f59e0b', '#10b981'];

  // Calculs statistiques
  const delaiMoyen = suivis.length > 0 
    ? Math.round(suivis.reduce((acc, s) => acc + (s.delaiTransmission || 0), 0) / suivis.length)
    : 0;
  
  const tauxValidation = suivis.length > 0
    ? Math.round((suivis.filter(s => s.statutActuel === 'en_repartition').length / suivis.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{suivis.length}</p>
            <p className="text-sm text-gray-600">Total transmissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{delaiMoyen}</p>
            <p className="text-sm text-gray-600">Délai moyen (jours)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{tauxValidation}%</p>
            <p className="text-sm text-gray-600">Taux validation</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {suivis.filter(s => (s.delaiTransmission || 0) > 14).length}
            </p>
            <p className="text-sm text-gray-600">En retard</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Délais</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={delaisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nom" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des Statuts</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statutsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nom, count }) => `${nom}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statutsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
