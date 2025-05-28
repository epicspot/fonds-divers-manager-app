
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Personnel } from '@/hooks/usePersonnel';

interface PersonnelModalProps {
  trigger: React.ReactNode;
  personnel?: Personnel;
  onSubmit: (data: Omit<Personnel, 'id'>) => Promise<void>;
  isEdit?: boolean;
}

export function PersonnelModal({ trigger, personnel, onSubmit, isEdit = false }: PersonnelModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom_complet: personnel?.nom_complet || '',
    fonction: personnel?.fonction || '',
    role: personnel?.role || 'saisissant' as const,
    region: personnel?.region || '',
    statut: personnel?.statut || 'actif' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setOpen(false);
      if (!isEdit) {
        setFormData({
          nom_complet: '',
          fonction: '',
          role: 'saisissant',
          region: '',
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
            {isEdit ? 'Modifier le Personnel' : 'Ajouter Personnel'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom_complet">Nom complet</Label>
            <Input
              id="nom_complet"
              value={formData.nom_complet}
              onChange={(e) => setFormData({ ...formData, nom_complet: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fonction">Fonction</Label>
            <Input
              id="fonction"
              value={formData.fonction}
              onChange={(e) => setFormData({ ...formData, fonction: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saisissant">Saisissant</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="informateur">Informateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Région</Label>
            <Input
              id="region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              required
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
