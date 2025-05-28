
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PersonnelMember {
  id: string;
  nom: string;
  fonction: string;
  role: 'saisissant' | 'chef' | 'informateur';
  region: string;
  statut: 'actif' | 'inactif';
}

const personnelData: PersonnelMember[] = [
  { id: '1', nom: 'Jean Kouadio', fonction: 'Agent Principal', role: 'saisissant', region: 'Abidjan', statut: 'actif' },
  { id: '2', nom: 'Marie Diabaté', fonction: 'Chef de Brigade', role: 'chef', region: 'Bouaké', statut: 'actif' },
  { id: '3', nom: 'Amadou Traoré', fonction: 'Inspecteur', role: 'informateur', region: 'San Pedro', statut: 'actif' },
  { id: '4', nom: 'Aya Koné', fonction: 'Agent', role: 'saisissant', region: 'Yamoussoukro', statut: 'inactif' },
];

export function PersonnelSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const filteredPersonnel = personnelData.filter(person => 
    person.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedRole === "all" || person.role === selectedRole)
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'saisissant': return 'bg-blue-100 text-blue-800';
      case 'chef': return 'bg-green-100 text-green-800';
      case 'informateur': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gestion du Personnel</h1>
            <p className="text-gray-600 text-sm">Gérez les agents et le personnel impliqué dans les dossiers</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter Personnel
          </Button>
        </div>

        <div className="flex gap-4 mb-4 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="all">Tous les rôles</option>
            <option value="saisissant">Saisissant</option>
            <option value="chef">Chef</option>
            <option value="informateur">Informateur</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 overflow-auto">
          {filteredPersonnel.map((person) => (
            <Card key={person.id} className="h-fit">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Users className="h-5 w-5 text-gray-600" />
                  <Badge className={getRoleBadgeColor(person.role)}>
                    {person.role}
                  </Badge>
                </div>
                <CardTitle className="text-base">{person.nom}</CardTitle>
                <CardDescription className="text-sm">{person.fonction}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Région:</span> {person.region}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant={person.statut === 'actif' ? 'default' : 'secondary'}>
                      {person.statut}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPersonnel.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aucun personnel trouvé</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
