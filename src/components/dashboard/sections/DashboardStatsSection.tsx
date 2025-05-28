
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
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 h-full">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Tableau de Bord
          </h1>
          <p className="text-gray-600">Vue d'ensemble des activités et statistiques</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 flex-shrink-0">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Dossiers</p>
                  <p className="text-3xl font-bold">319</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-300" />
                    <span className="text-sm text-green-300">+12% ce mois</span>
                  </div>
                </div>
                <FileText className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Montant Total</p>
                  <p className="text-3xl font-bold">21.0M</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-300" />
                    <span className="text-sm text-green-300">+8% ce mois</span>
                  </div>
                </div>
                <DollarSign className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Personnel Actif</p>
                  <p className="text-3xl font-bold">107</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingDown className="h-4 w-4 text-red-300" />
                    <span className="text-sm text-red-300">-2% ce mois</span>
                  </div>
                </div>
                <Users className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">En Attente</p>
                  <p className="text-3xl font-bold">23</p>
                  <div className="flex items-center gap-1 mt-2">
                    <AlertCircle className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm text-yellow-300">Nécessite attention</span>
                  </div>
                </div>
                <AlertCircle className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-auto">
          <Card className="h-fit shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-xl">Évolution Mensuelle</CardTitle>
              <CardDescription className="text-blue-100">Nombre de dossiers et montants par mois</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'montant' ? `${Number(value).toLocaleString()} FCFA` : value,
                      name === 'montant' ? 'Montant' : 'Dossiers'
                    ]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="dossiers" fill="url(#blueGradient)" name="dossiers" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="h-fit shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="text-xl">Répartition des Montants</CardTitle>
              <CardDescription className="text-green-100">Distribution selon les règles de répartition</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={repartitionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                    className="text-sm font-medium"
                  >
                    {repartitionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex-shrink-0">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-xl">Activités Récentes</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-full">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Nouveau dossier AFF-2024-156</p>
                      <p className="text-sm text-blue-700">Créé par Jean Kouadio - Région Abidjan</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500 hover:bg-blue-600">Il y a 2h</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-full">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Répartition calculée AFF-2024-154</p>
                      <p className="text-sm text-green-700">Montant: 2,500,000 FCFA</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600">Il y a 4h</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-full">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-purple-900">Nouveau personnel ajouté</p>
                      <p className="text-sm text-purple-700">Marie Diabaté - Chef de Brigade Bouaké</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-500 hover:bg-purple-600">Hier</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
