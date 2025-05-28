
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
  transport: 'bg-blue-100 text-blue-800',
  infraction: 'bg-red-100 text-red-800',
  marchandise: 'bg-green-100 text-green-800',
  procedure: 'bg-yellow-100 text-yellow-800',
  commissionnaire: 'bg-purple-100 text-purple-800',
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
    <div className="p-4 bg-gray-50 h-full">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Listes de Référence</h1>
            <p className="text-gray-600 text-sm">Gérez les listes de référence utilisées dans l'application</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle Liste
          </Button>
        </div>

        <div className="mb-4 flex-shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="all">Tous les types</option>
            <option value="transport">Transport</option>
            <option value="infraction">Infraction</option>
            <option value="marchandise">Marchandise</option>
            <option value="procedure">Procédure</option>
            <option value="commissionnaire">Commissionnaire</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-auto">
          {filteredReferences.map((reference) => (
            <Card key={reference.id} className="h-fit">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <List className="h-5 w-5 text-gray-600" />
                  <div className="flex gap-2">
                    <Badge className={typeColors[reference.type as keyof typeof typeColors]}>
                      {getTypeLabel(reference.type)}
                    </Badge>
                    <Badge variant={reference.statut === 'actif' ? 'default' : 'secondary'}>
                      {reference.statut}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-base">{reference.nom}</CardTitle>
                <CardDescription className="text-sm">
                  {reference.nombreElements} éléments
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Modifié le: {new Date(reference.dateModification).toLocaleDateString('fr-FR')}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
              <List className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aucune liste de référence trouvée</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
