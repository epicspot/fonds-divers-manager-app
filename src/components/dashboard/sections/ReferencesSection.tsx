
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { List, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReferenceList {
  id: string;
  nom: string;
  type: string;
  nombreElements: number;
  dateModification: string;
  statut: 'actif' | 'inactif';
}

const referencesData: ReferenceList[] = [
  { id: '1', nom: 'Types de Transport', type: 'transport', nombreElements: 8, dateModification: '2024-01-15', statut: 'actif' },
  { id: '2', nom: 'Natures d\'Infraction', type: 'infraction', nombreElements: 15, dateModification: '2024-01-10', statut: 'actif' },
  { id: '3', nom: 'Marchandises', type: 'marchandise', nombreElements: 45, dateModification: '2024-01-08', statut: 'actif' },
  { id: '4', nom: 'Procédures de Détection', type: 'procedure', nombreElements: 12, dateModification: '2024-01-05', statut: 'actif' },
  { id: '5', nom: 'Commissionnaires en Douane', type: 'commissionnaire', nombreElements: 28, dateModification: '2024-01-03', statut: 'inactif' },
];

const typeColors = {
  transport: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
  infraction: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
  marchandise: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
  procedure: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
  commissionnaire: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
};

export function ReferencesSection() {
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredReferences = referencesData.filter(ref => 
    selectedType === "all" || ref.type === selectedType
  );

  const getTypeLabel = (type: string) => {
    const labels = {
      transport: 'Transport',
      infraction: 'Infraction',
      marchandise: 'Marchandise',
      procedure: 'Procédure',
      commissionnaire: 'Commissionnaire',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 h-full">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Listes de Référence
            </h1>
            <p className="text-gray-600 text-sm">Gérez les listes de référence utilisées dans l'application</p>
          </div>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg">
            <Plus className="h-4 w-4" />
            Nouvelle Liste
          </Button>
        </div>

        <div className="mb-6 flex-shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border-2 border-indigo-200 rounded-md bg-white/80 backdrop-blur focus:border-indigo-500 outline-none"
          >
            <option value="all">Tous les types</option>
            <option value="transport">Transport</option>
            <option value="infraction">Infraction</option>
            <option value="marchandise">Marchandise</option>
            <option value="procedure">Procédure</option>
            <option value="commissionnaire">Commissionnaire</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-auto">
          {filteredReferences.map((reference) => (
            <Card key={reference.id} className="h-fit shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
                    <List className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={typeColors[reference.type as keyof typeof typeColors]}>
                      {getTypeLabel(reference.type)}
                    </Badge>
                    <Badge 
                      variant={reference.statut === 'actif' ? 'default' : 'secondary'}
                      className={reference.statut === 'actif' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                      }
                    >
                      {reference.statut}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg text-gray-800">{reference.nom}</CardTitle>
                <CardDescription className="text-gray-600">
                  <span className="font-medium text-indigo-600">{reference.nombreElements} éléments</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    Modifié le: {new Date(reference.dateModification).toLocaleDateString('fr-FR')}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-green-300 text-green-600 hover:bg-green-50 hover:border-green-500"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReferences.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full inline-block mb-4">
                <List className="h-12 w-12 text-white" />
              </div>
              <p className="text-gray-600 text-lg">Aucune liste de référence trouvée</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
