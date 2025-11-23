import { supabase } from '@/integrations/supabase/client';
import type { AppRole } from '@/hooks/useUserRole';

/**
 * Helper functions for user_roles table
 * Using any to bypass TypeScript errors until types are regenerated
 */

export async function getUserRole(userId: string): Promise<AppRole | null> {
  const { data, error } = await (supabase as any)
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .order('role', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user role:', error);
    return 'utilisateur';
  }

  return data?.role || 'utilisateur';
}

export async function getAllUserRoles() {
  const { data, error } = await (supabase as any)
    .from('user_roles')
    .select('user_id, role');

  if (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }

  return data || [];
}

export async function updateUserRole(userId: string, newRole: AppRole) {
  // Delete existing role
  const { error: deleteError } = await (supabase as any)
    .from('user_roles')
    .delete()
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  // Insert new role
  const { error: insertError } = await (supabase as any)
    .from('user_roles')
    .insert({ user_id: userId, role: newRole });

  if (insertError) throw insertError;

  return { success: true };
}

export async function toggleUserActiveStatus(userId: string, isActive: boolean) {
  const { error } = await supabase
    .from('profiles')
    .update({ is_active: isActive })
    .eq('user_id', userId);

  if (error) throw error;

  return { success: true };
}
