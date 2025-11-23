import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, UserPlus } from 'lucide-react';
import type { AppRole } from '@/hooks/useUserRole';

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

export const CreateUserModal = ({ open, onOpenChange, onUserCreated }: CreateUserModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomComplet, setNomComplet] = useState('');
  const [role, setRole] = useState<AppRole>('utilisateur');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !nomComplet) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      // Créer l'utilisateur avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nom_complet: nomComplet,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Utilisateur non créé');

      // Assigner le rôle sélectionné
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: role,
        });

      if (roleError) throw roleError;

      toast.success(`Utilisateur créé avec succès avec le rôle ${role}`);
      
      // Réinitialiser le formulaire
      setEmail('');
      setPassword('');
      setNomComplet('');
      setRole('utilisateur');
      
      // Fermer le modal et rafraîchir la liste
      onOpenChange(false);
      onUserCreated();
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      toast.error(error.message || 'Impossible de créer l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Créer un nouveau compte utilisateur
          </DialogTitle>
          <DialogDescription>
            Créez un compte et assignez un rôle (admin, superviseur ou utilisateur)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nom_complet">Nom complet</Label>
              <Input
                id="nom_complet"
                value={nomComplet}
                onChange={(e) => setNomComplet(e.target.value)}
                placeholder="Ex: Jean Dupont"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@domaine.com"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rôle</Label>
              <Select value={role} onValueChange={(value) => setRole(value as AppRole)} disabled={loading}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utilisateur">Utilisateur</SelectItem>
                  <SelectItem value="superviseur">Superviseur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer l\'utilisateur'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
