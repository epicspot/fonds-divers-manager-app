
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useGlobalState } from '@/hooks/useGlobalState';

interface PersonnelSelectorProps {
  selectedPersonnelIds?: string[];
  onPersonnelChange: (personnelIds: string[]) => void;
  role?: 'saisissant' | 'chef' | 'intervenant';
  label?: string;
  multiple?: boolean;
  required?: boolean;
}

export function PersonnelSelector({
  selectedPersonnelIds = [],
  onPersonnelChange,
  role,
  label = "Personnel",
  multiple = false,
  required = false
}: PersonnelSelectorProps) {
  const { personnel } = useGlobalState();

  const filteredPersonnel = role 
    ? personnel.personnel.filter(p => p.role === role)
    : personnel.personnel;

  const handlePersonnelSelect = (personnelId: string) => {
    if (multiple) {
      const isSelected = selectedPersonnelIds.includes(personnelId);
      const newSelection = isSelected
        ? selectedPersonnelIds.filter(id => id !== personnelId)
        : [...selectedPersonnelIds, personnelId];
      onPersonnelChange(newSelection);
    } else {
      onPersonnelChange([personnelId]);
    }
  };

  const getPersonnelName = (id: string) => {
    const person = personnel.personnel.find(p => p.id === id);
    return person ? person.nom_complet : 'Personnel introuvable';
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      <Select onValueChange={handlePersonnelSelect}>
        <SelectTrigger>
          <SelectValue placeholder={`Sélectionner ${multiple ? 'du' : 'le'} ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {filteredPersonnel.map((person) => (
            <SelectItem key={person.id} value={person.id}>
              <div className="flex items-center space-x-2">
                <span>{person.nom_complet}</span>
                <Badge variant="secondary" className="text-xs">
                  {person.role}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {multiple && selectedPersonnelIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedPersonnelIds.map((id) => (
            <Badge key={id} variant="outline" className="flex items-center gap-1">
              {getPersonnelName(id)}
              <button
                onClick={() => handlePersonnelSelect(id)}
                className="ml-1 text-xs hover:text-red-600"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
