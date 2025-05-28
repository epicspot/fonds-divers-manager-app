
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, List, Database } from 'lucide-react';
import { useGlobalState } from '@/hooks/useGlobalState';

export function UnifiedStats() {
  const { regions, personnel, references } = useGlobalState();

  const stats = [
    {
      title: "Régions",
      value: regions.regions.length,
      description: "Total des régions",
      icon: Building,
      color: "bg-blue-500"
    },
    {
      title: "Bureaux",
      value: regions.bureaux.length,
      description: "Total des bureaux",
      icon: Building,
      color: "bg-green-500"
    },
    {
      title: "Personnel",
      value: personnel.personnel.length,
      description: "Total du personnel",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      title: "Références",
      value: references.references.length,
      description: "Listes de référence",
      icon: List,
      color: "bg-orange-500"
    }
  ];

  const personnelByRole = personnel.personnel.reduce((acc, person) => {
    acc[person.role] = (acc[person.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const regionStats = regions.regions.map(region => ({
    nom: region.nom,
    bureaux: regions.getBureauxByRegion(region.id).length
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition du Personnel</CardTitle>
            <CardDescription>Par rôle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(personnelByRole).map(([role, count]) => (
                <div key={role} className="flex justify-between items-center">
                  <Badge variant="secondary">{role}</Badge>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bureaux par Région</CardTitle>
            <CardDescription>Distribution territoriale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {regionStats.map((region) => (
                <div key={region.nom} className="flex justify-between items-center">
                  <span className="text-sm">{region.nom}</span>
                  <Badge variant="outline">{region.bureaux} bureau(x)</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
