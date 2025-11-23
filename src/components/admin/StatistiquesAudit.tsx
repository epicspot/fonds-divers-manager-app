import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAuditStatistics } from '@/hooks/useAuditStatistics';
import { Activity, TrendingUp, Users, FileText, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const COLORS = {
  CREATE: 'hsl(var(--chart-1))',
  UPDATE: 'hsl(var(--chart-2))',
  DELETE: 'hsl(var(--chart-3))',
  ACTIVATE: 'hsl(var(--chart-4))',
};

const ACTION_LABELS = {
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
  ACTIVATE: 'Activation',
};

export const StatistiquesAudit = () => {
  const [period, setPeriod] = useState<number>(30);
  const { statistics, loading, refetch } = useAuditStatistics(period);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'd MMM', { locale: fr });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec filtres */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Statistiques d'Audit</h2>
            <p className="text-sm text-muted-foreground">
              Analyse des modifications système
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period.toString()} onValueChange={(v) => setPeriod(Number(v))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">90 derniers jours</SelectItem>
              <SelectItem value="365">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={refetch}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modifications</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
            <p className="text-xs text-muted-foreground">
              Derniers {period} jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.byUser.length}</div>
            <p className="text-xs text-muted-foreground">
              Ont effectué des modifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Types d'Entités</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.byType.length}</div>
            <p className="text-xs text-muted-foreground">
              Types d'entités modifiées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Quotidienne</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.byPeriod.length > 0
                ? Math.round(statistics.total / statistics.byPeriod.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Modifications par jour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique par action */}
        <Card>
          <CardHeader>
            <CardTitle>Modifications par Action</CardTitle>
            <CardDescription>
              Répartition des types de modifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statistics.byAction.map(item => ({
                    name: ACTION_LABELS[item.action as keyof typeof ACTION_LABELS] || item.action,
                    value: item.count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statistics.byAction.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.action as keyof typeof COLORS] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique par type d'entité */}
        <Card>
          <CardHeader>
            <CardTitle>Modifications par Type d'Entité</CardTitle>
            <CardDescription>
              Entités les plus modifiées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statistics.byType.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="type" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Graphique temporel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des Modifications</CardTitle>
            <CardDescription>
              Nombre de modifications par jour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statistics.byPeriod}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => format(new Date(label), 'dd MMMM yyyy', { locale: fr })}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Modifications"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs les Plus Actifs</CardTitle>
            <CardDescription>
              Top 10 des contributeurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statistics.byUser} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="utilisateur_email" 
                  type="category" 
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Actions par utilisateur */}
        <Card>
          <CardHeader>
            <CardTitle>Top Actions par Utilisateur</CardTitle>
            <CardDescription>
              Combinaisons utilisateur/action les plus fréquentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statistics.byUserAndAction.slice(0, 8).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.utilisateur_email}</p>
                    <p className="text-xs text-muted-foreground">
                      {ACTION_LABELS[item.action as keyof typeof ACTION_LABELS] || item.action}
                    </p>
                  </div>
                  <div className="text-sm font-bold">{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
