import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, UserCog, AlertCircle, Check, X, Loader2, UserPlus, UserCheck, UserX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PERMISSIONS_MATRIX, SECTION_DESCRIPTIONS, type AdminSection } from '@/types/permissions';
import type { AppRole } from '@/hooks/useUserRole';
import { getAllUserRoles, updateUserRole, toggleUserActiveStatus } from '@/lib/userRolesApi';
import { CreateUserModal } from './CreateUserModal';

interface UserWithRole {
  user_id: string;
  email: string;
  role: AppRole;
  nom_complet?: string;
  is_active?: boolean;
}

export const RoleManagement = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<AppRole>('utilisateur');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Récupérer tous les rôles
      const rolesData = await getAllUserRoles();
      
      // Récupérer tous les profils avec leurs informations
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, nom_complet, is_active');

      if (profilesError) throw profilesError;

      // Combiner les données
      const usersWithRoles: UserWithRole[] = (rolesData || []).map((roleData: any) => {
        const profile = profiles?.find(p => p.user_id === roleData.user_id);
        
        return {
          user_id: roleData.user_id,
          email: profile?.nom_complet || roleData.user_id.substring(0, 8),
          nom_complet: profile?.nom_complet,
          role: roleData.role as AppRole,
          is_active: profile?.is_active ?? true,
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Impossible de charger la liste des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success('Rôle mis à jour avec succès');
      loadUsers();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      toast.error('Impossible de mettre à jour le rôle');
    }
  };

  const handleToggleActiveStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserActiveStatus(userId, !currentStatus);
      toast.success(
        !currentStatus 
          ? 'Compte utilisateur activé avec succès' 
          : 'Compte utilisateur désactivé avec succès'
      );
      loadUsers();
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
      toast.error('Impossible de modifier le statut du compte');
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'superviseur':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'superviseur':
        return 'Superviseur';
      default:
        return 'Utilisateur';
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
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Seuls les administrateurs peuvent modifier les rôles des utilisateurs.
          Les modifications prennent effet immédiatement.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Utilisateurs et Rôles
              </CardTitle>
              <CardDescription>
                Gérez les rôles et permissions des utilisateurs de l'application
              </CardDescription>
            </div>
            <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Créer un utilisateur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle actuel</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id} className={!user.is_active ? 'opacity-60' : ''}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.nom_complet || user.email}
                        {!user.is_active && (
                          <Badge variant="outline" className="text-xs">
                            Désactivé
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? 'default' : 'secondary'}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={user.role}
                          onValueChange={(value) => handleRoleChange(user.user_id, value as AppRole)}
                          disabled={!user.is_active}
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
                        <Button
                          variant={user.is_active ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => handleToggleActiveStatus(user.user_id, user.is_active ?? true)}
                          className="gap-2"
                        >
                          {user.is_active ? (
                            <>
                              <UserX className="h-4 w-4" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4" />
                              Activer
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Matrice des Permissions
          </CardTitle>
          <CardDescription>
            Visualisez les permissions par rôle pour chaque section d'administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utilisateur">Utilisateur</SelectItem>
                <SelectItem value="superviseur">Superviseur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead className="text-center">Voir</TableHead>
                  <TableHead className="text-center">Créer</TableHead>
                  <TableHead className="text-center">Modifier</TableHead>
                  <TableHead className="text-center">Supprimer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(Object.keys(SECTION_DESCRIPTIONS) as AdminSection[]).map((section) => {
                  const permissions = PERMISSIONS_MATRIX[selectedRole][section];
                  return (
                    <TableRow key={section}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{SECTION_DESCRIPTIONS[section].title}</div>
                          <div className="text-xs text-muted-foreground">
                            {SECTION_DESCRIPTIONS[section].description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {permissions.includes('view') ? (
                          <Check className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {permissions.includes('create') ? (
                          <Check className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {permissions.includes('edit') ? (
                          <Check className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {permissions.includes('delete') ? (
                          <Check className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CreateUserModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onUserCreated={loadUsers}
      />
    </div>
  );
};
