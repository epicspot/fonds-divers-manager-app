
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReferenceList } from '@/hooks/useReferences';

interface ReferenceModalProps {
  trigger: React.ReactNode;
  reference?: ReferenceList;
  onSubmit: (data: Omit<ReferenceList, 'id'>) => Promise<void>;
  isEdit?: boolean;
}

export function ReferenceModal({ trigger, reference, onSubmit, isEdit = false }: ReferenceModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: reference?.nom || '',
    type: reference?.type || '',
    nombre_elements: reference?.nombre_elements || 0,
    date_modification: reference?.date_modification || new Date().toISOString().split('T')[0],
    statut: reference?.statut || 'actif' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setOpen(false);
      if (!isEdit) {
        setFormData({
          nom: '',
          type: '',
          nombre_elements: 0,
          date_modification: new Date().toISOString().split('T')[0],
          statut: 'actif',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier la Liste' : 'Nouvelle Liste'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de la liste</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="infraction">Infraction</SelectItem>
                <SelectItem value="marchandise">Marchandise</SelectItem>
                <SelectItem value="procedure">Procédure</SelectItem>
                <SelectItem value="commissionnaire">Commissionnaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre_elements">Nombre d'éléments</Label>
            <Input
              id="nombre_elements"
              type="number"
              value={formData.nombre_elements}
              onChange={(e) => setFormData({ ...formData, nombre_elements: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statut">Statut</Label>
            <Select value={formData.statut} onValueChange={(value: any) => setFormData({ ...formData, statut: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {isEdit ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
