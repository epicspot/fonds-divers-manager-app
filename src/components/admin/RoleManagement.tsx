import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Shield, UserCog, Users, Loader2 } from 'lucide-react';
import type { AppRole } from '@/hooks/useUserRole';
import { getAllUserRoles, updateUserRole } from '@/lib/userRolesApi';

interface UserWithRole {
  user_id: string;
  email: string;
  role: AppRole;
  created_at: string;
}

export const RoleManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get all user roles
      const rolesData = await getAllUserRoles();

      // Get profiles for user information
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, nom_complet, created_at');

      // Combine data
      const usersWithRoles = (rolesData || []).map((roleData: any) => {
        const profile = profilesData?.find(p => p.user_id === roleData.user_id);
        return {
          user_id: roleData.user_id,
          email: profile?.nom_complet || roleData.user_id.substring(0, 8),
          role: roleData.role as AppRole,
          created_at: profile?.created_at || new Date().toISOString(),
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success('Rôle mis à jour avec succès');
      fetchUsers();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'superviseur':
        return 'default';
      case 'utilisateur':
        return 'secondary';
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'superviseur':
        return <UserCog className="h-4 w-4" />;
      case 'utilisateur':
        return <Users className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Rôles</CardTitle>
          <CardDescription>
            Gérez les rôles et permissions des utilisateurs de l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.user_id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getRoleIcon(user.role)}
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.user_id, value as AppRole)}
                  >
                    <SelectTrigger className="w-[180px]">
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
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissions par Rôle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-destructive" />
                <h4 className="font-semibold">Administrateur</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                Accès complet : gestion des utilisateurs, configuration système, toutes les sections
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <h4 className="font-semibold">Superviseur</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                Accès étendu : validation, suivi hiérarchique, statistiques avancées
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <h4 className="font-semibold">Utilisateur</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                Accès standard : consultation, saisie de dossiers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
