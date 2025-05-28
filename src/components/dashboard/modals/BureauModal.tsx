
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bureau, Region } from '@/hooks/useRegions';

interface BureauModalProps {
  trigger: React.ReactNode;
  bureau?: Bureau;
  regions: Region[];
  onSubmit: (data: Omit<Bureau, 'id'>) => Promise<void>;
  isEdit?: boolean;
}

export function BureauModal({ trigger, bureau, regions, onSubmit, isEdit = false }: BureauModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: bureau?.nom || '',
    region_id: bureau?.region_id || '',
    adresse: bureau?.adresse || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setOpen(false);
      if (!isEdit) {
        setFormData({
          nom: '',
          region_id: '',
          adresse: '',
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
            {isEdit ? 'Modifier le Bureau' : 'Nouveau Bureau'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du bureau</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Entrez le nom du bureau"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region_id">Région</Label>
            <Select value={formData.region_id} onValueChange={(value) => setFormData({ ...formData, region_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une région" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              placeholder="Entrez l'adresse du bureau"
              required
            />
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
