
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePersonnel } from "@/hooks/usePersonnel";
import { PersonnelModal } from "@/components/dashboard/modals/PersonnelModal";

export function PersonnelSection() {
  const { personnel, loading, createPersonnel, updatePersonnel, deletePersonnel } = usePersonnel();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const filteredPersonnel = personnel.filter(person => 
    person.nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedRole === "all" || person.role === selectedRole)
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'saisissant': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700';
      case 'chef': return 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700';
      case 'informateur': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce personnel ?")) {
      await deletePersonnel(id);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du personnel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 h-full">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Gestion du Personnel
            </h1>
            <p className="text-gray-600 text-sm">Gérez les agents et le personnel impliqué dans les dossiers</p>
          </div>
          <PersonnelModal
            trigger={
              <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
                <Plus className="h-4 w-4" />
                Ajouter Personnel
              </Button>
            }
            onSubmit={createPersonnel}
          />
        </div>

        <div className="flex gap-4 mb-6 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 border-purple-200 focus:border-purple-500 bg-white/80 backdrop-blur"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border-2 border-purple-200 rounded-md bg-white/80 backdrop-blur focus:border-purple-500 outline-none"
          >
            <option value="all">Tous les rôles</option>
            <option value="saisissant">Saisissant</option>
            <option value="chef">Chef</option>
            <option value="informateur">Informateur</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 overflow-auto">
          {filteredPersonnel.map((person) => (
            <Card key={person.id} className="h-fit shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <Badge className={getRoleBadgeColor(person.role)}>
                    {person.role}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-gray-800">{person.nom_complet}</CardTitle>
                <CardDescription className="text-gray-600">{person.fonction}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Région:</span> {person.region}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={person.statut === 'actif' ? 'default' : 'secondary'}
                      className={person.statut === 'actif' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                      }
                    >
                      {person.statut}
                    </Badge>
                    <div className="flex gap-1">
                      <PersonnelModal
                        trigger={
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-500"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        }
                        personnel={person}
                        onSubmit={(data) => updatePersonnel(person.id, data)}
                        isEdit={true}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500"
                        onClick={() => handleDelete(person.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPersonnel.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full inline-block mb-4">
                <Users className="h-12 w-12 text-white" />
              </div>
              <p className="text-gray-600 text-lg">Aucun personnel trouvé</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
