
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Users, FileText, AlertCircle, DollarSign } from "lucide-react";

const statsData = [
  { name: 'Jan', dossiers: 45, montant: 2500000 },
  { name: 'Fév', dossiers: 52, montant: 3200000 },
  { name: 'Mar', dossiers: 38, montant: 2800000 },
  { name: 'Avr', dossiers: 65, montant: 4100000 },
  { name: 'Mai', dossiers: 48, montant: 3600000 },
  { name: 'Jun', dossiers: 71, montant: 4800000 },
];

const repartitionData = [
  { name: 'Trésor Public', value: 40, color: '#3B82F6' },
  { name: 'FSP', value: 5, color: '#10B981' },
  { name: 'Mutuelle', value: 10, color: '#F59E0B' },
  { name: 'Poursuivants', value: 25, color: '#EF4444' },
  { name: 'Fonds Divers', value: 20, color: '#8B5CF6' },
];

export function DashboardStatsSection() {
  return (
    <div className="p-4 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
          <p className="text-gray-600">Vue d'ensemble des activités et statistiques</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Dossiers</p>
                  <p className="text-2xl font-bold">319</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+12% ce mois</span>
                  </div>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Montant Total</p>
                  <p className="text-2xl font-bold">21.0M</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+8% ce mois</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Personnel Actif</p>
                  <p className="text-2xl font-bold">107</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600">-2% ce mois</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold">23</p>
                  <div className="flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-600">Nécessite attention</span>
                  </div>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-auto">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Évolution Mensuelle</CardTitle>
              <CardDescription>Nombre de dossiers et montants par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'montant' ? `${Number(value).toLocaleString()} FCFA` : value,
                      name === 'montant' ? 'Montant' : 'Dossiers'
                    ]}
                  />
                  <Bar dataKey="dossiers" fill="#3B82F6" name="dossiers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Répartition des Montants</CardTitle>
              <CardDescription>Distribution selon les règles de répartition</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={repartitionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {repartitionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activités Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">Nouveau dossier AFF-2024-156</p>
                      <p className="text-sm text-gray-600">Créé par Jean Kouadio - Région Abidjan</p>
                    </div>
                  </div>
                  <Badge variant="outline">Il y a 2h</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">Répartition calculée AFF-2024-154</p>
                      <p className="text-sm text-gray-600">Montant: 2,500,000 FCFA</p>
                    </div>
                  </div>
                  <Badge variant="outline">Il y a 4h</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="font-medium">Nouveau personnel ajouté</p>
                      <p className="text-sm text-gray-600">Marie Diabaté - Chef de Brigade Bouaké</p>
                    </div>
                  </div>
                  <Badge variant="outline">Hier</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
