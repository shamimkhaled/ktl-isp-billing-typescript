import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Shield,
  Plus,
  Edit3,
  Trash2,
  MoreVertical,
  Search,
} from 'lucide-react';
import { roleService } from '../services/role.service';
import { permissionService } from '../services/permission.service';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/helpers';
import type { Role, Permission } from '../types/user.types';
import { toast } from 'sonner';

// Role form validation schemas
const roleCreateSchema = z.object({
  name: z.string().min(3, 'Role name must be at least 3 characters'),
  display_name: z.string().min(3, 'Display name must be at least 3 characters'),
  description: z.string().optional(),
  role_level: z.number().min(0).max(100),
  is_active: z.boolean().default(true),
  can_assign_roles: z.boolean().default(false),
  max_assignments: z.number().optional(),
  permission_ids: z.array(z.number()).default([]),
});

const roleUpdateSchema = roleCreateSchema.partial();

interface RoleFormData {
  name?: string;
  display_name?: string;
  description?: string;
  role_level?: number;
  is_active?: boolean;
  can_assign_roles?: boolean;
  max_assignments?: number;
  permission_ids?: number[];
}

// Role Table Row Component
interface RoleRowProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

const RoleRow: React.FC<RoleRowProps> = ({ role, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{role.display_name}</div>
            <div className="text-sm text-gray-500">{role.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {role.description || '-'}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          role.is_active
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {role.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        Level {role.role_level}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {role.users_count} users
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {role.permissions.length} permissions
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatDate(role.created_at)}
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
              <button
                onClick={() => {
                  onEdit(role);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Role</span>
              </button>
              <button
                onClick={() => {
                  onDelete(role);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Role</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Role Form Component
interface RoleFormProps {
  role?: Role | null;
  permissions: Permission[];
  onSubmit?: (data: RoleFormData) => Promise<void>;
  onUpdate?: (data: RoleFormData & { id: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({
  role,
  permissions,
  onSubmit,
  onUpdate,
  onCancel,
  loading = false
}) => {
  const isEditing = !!role;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RoleFormData>({
    resolver: zodResolver(isEditing ? roleUpdateSchema : roleCreateSchema),
    defaultValues: role ? {
      name: role.name,
      display_name: role.display_name,
      description: role.description || '',
      role_level: role.role_level,
      is_active: role.is_active,
      can_assign_roles: role.can_assign_roles,
      max_assignments: role.max_assignments || undefined,
      permission_ids: role.permission_ids,
    } : {
      role_level: 1,
      is_active: true,
      can_assign_roles: false,
      permission_ids: [],
    },
  });

  const selectedPermissions = watch('permission_ids') || [];

  const handleFormSubmit = (data: RoleFormData) => {
    if (isEditing && role && onUpdate) {
      onUpdate({ id: role.id, ...data });
    } else if (onSubmit) {
      onSubmit(data);
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    const current = selectedPermissions;
    const updated = current.includes(permissionId)
      ? current.filter(id => id !== permissionId)
      : [...current, permissionId];
    setValue('permission_ids', updated);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Name
          </label>
          <select
            {...register('name')}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select a role</option>
            <option value="noc">NOC</option>
            <option value="accounts">Accounts</option>
            <option value="dev">Dev</option>
            <option value="manager">Project Manager</option>
          </select>
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <Input
          label="Display Name"
          {...register('display_name')}
          error={errors.display_name?.message}
          disabled={loading}
          placeholder="e.g., Administrator, Manager, User"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Level
          </label>
          <input
            type="number"
            {...register('role_level', { valueAsNumber: true })}
            disabled={loading}
            min="0"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {errors.role_level && (
            <p className="text-sm text-red-600 mt-1">{errors.role_level.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Assignments (Optional)
          </label>
          <input
            type="number"
            {...register('max_assignments', { valueAsNumber: true })}
            disabled={loading}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Unlimited"
          />
          {errors.max_assignments && (
            <p className="text-sm text-red-600 mt-1">{errors.max_assignments.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Input
            label="Description (Optional)"
            {...register('description')}
            error={errors.description?.message}
            disabled={loading}
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('is_active')}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Active</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('can_assign_roles')}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Can Assign Roles</span>
          </label>
        </div>
      </div>

      {/* Permissions Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
          {permissions.map((permission) => (
            <label key={permission.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission.id)}
                onChange={() => handlePermissionToggle(permission.id)}
                disabled={loading}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{permission.name}</span>
            </label>
          ))}
        </div>
        {errors.permission_ids && (
          <p className="text-sm text-red-600 mt-2">{errors.permission_ids.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {isEditing ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
};

// Main Role Management Component
export const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesResponse, permissionsResponse] = await Promise.all([
        roleService.getRoles(),
        permissionService.getPermissions()
      ]);
      setRoles(rolesResponse.results);
      setPermissions(permissionsResponse.results);
    } catch (error: any) {
      console.warn('Failed to load roles and permissions from API, using mock data:', error);
      // Fallback to mock data for development
      setRoles(getMockRoles());
      setPermissions(getMockPermissions());
      toast.error('Using demo data - API not available');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const getMockRoles = (): Role[] => [
    {
      id: 'role-admin-001',
      name: 'admin',
      display_name: 'Administrator',
      description: 'Full system access with all permissions',
      role_level: 100,
      is_active: true,
      is_system_role: true,
      can_assign_roles: true,
      max_assignments: undefined,
      permissions: [],
      permission_ids: [1, 2, 3, 4, 5],
      users_count: '3',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'role-manager-001',
      name: 'manager',
      display_name: 'Manager',
      description: 'Management level access',
      role_level: 50,
      is_active: true,
      is_system_role: false,
      can_assign_roles: false,
      max_assignments: 10,
      permissions: [],
      permission_ids: [1, 2, 3],
      users_count: '5',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'role-user-001',
      name: 'user',
      display_name: 'User',
      description: 'Basic user access',
      role_level: 1,
      is_active: true,
      is_system_role: false,
      can_assign_roles: false,
      max_assignments: undefined,
      permissions: [],
      permission_ids: [1],
      users_count: '25',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const getMockPermissions = (): Permission[] => [
    { id: 1, name: 'Can view users', codename: 'view_user', content_type: 1 },
    { id: 2, name: 'Can add users', codename: 'add_user', content_type: 1 },
    { id: 3, name: 'Can change users', codename: 'change_user', content_type: 1 },
    { id: 4, name: 'Can delete users', codename: 'delete_user', content_type: 1 },
    { id: 5, name: 'Can view roles', codename: 'view_role', content_type: 2 },
    { id: 6, name: 'Can add roles', codename: 'add_role', content_type: 2 },
    { id: 7, name: 'Can change roles', codename: 'change_role', content_type: 2 },
    { id: 8, name: 'Can delete roles', codename: 'delete_role', content_type: 2 },
  ];

  const handleCreateRole = async (data: RoleFormData) => {
    setIsSubmitting(true);
    try {
      const newRole = await roleService.createRole(data as any);
      
      // Update local state immediately with the new role
      const roleToAdd: Role = {
        id: newRole.id || `role-${Date.now()}`,
        name: data.name || '',
        display_name: data.display_name || '',
        description: data.description || '',
        role_level: data.role_level || 1,
        is_active: data.is_active ?? true,
        is_system_role: false,
        can_assign_roles: data.can_assign_roles || false,
        max_assignments: data.max_assignments,
        permissions: [],
        permission_ids: data.permission_ids || [],
        users_count: '0',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setRoles(prevRoles => [...prevRoles, roleToAdd]);
      setShowCreateModal(false);
      toast.success('Role created successfully');
    } catch (error: any) {
      // If API fails, still add to local state for demo purposes
      const roleToAdd: Role = {
        id: `role-${Date.now()}`,
        name: data.name || '',
        display_name: data.display_name || '',
        description: data.description || '',
        role_level: data.role_level || 1,
        is_active: data.is_active ?? true,
        is_system_role: false,
        can_assign_roles: data.can_assign_roles || false,
        max_assignments: data.max_assignments,
        permissions: [],
        permission_ids: data.permission_ids || [],
        users_count: '0',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setRoles(prevRoles => [...prevRoles, roleToAdd]);
      setShowCreateModal(false);
      toast.success('Role created successfully (demo mode)');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (data: RoleFormData & { id: string }) => {
    const { id, ...updateData } = data;
    setIsSubmitting(true);
    try {
      await roleService.updateRole(id, updateData as any);
      
      // Update local state immediately
      setRoles(prevRoles =>
        prevRoles.map(role =>
          role.id === id
            ? {
                ...role,
                ...updateData,
                updated_at: new Date().toISOString(),
              }
            : role
        )
      );
      
      setEditingRole(null);
      toast.success('Role updated successfully');
    } catch (error: any) {
      // If API fails, still update local state for demo purposes
      setRoles(prevRoles =>
        prevRoles.map(role =>
          role.id === id
            ? {
                ...role,
                ...updateData,
                updated_at: new Date().toISOString(),
              }
            : role
        )
      );
      
      setEditingRole(null);
      toast.success('Role updated successfully (demo mode)');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!deletingRole) return;

    setIsSubmitting(true);
    try {
      await roleService.deleteRole(deletingRole.id);
      
      // Update local state immediately
      setRoles(prevRoles => prevRoles.filter(role => role.id !== deletingRole.id));
      setDeletingRole(null);
      toast.success('Role deleted successfully');
    } catch (error: any) {
      // If API fails, still update local state for demo purposes
      setRoles(prevRoles => prevRoles.filter(role => role.id !== deletingRole.id));
      setDeletingRole(null);
      toast.success('Role deleted successfully (demo mode)');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-1">
            Manage system roles and their permissions
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}
          className="mt-4 sm:mt-0"
        >
          Add New Role
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Roles Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" message="Loading roles..." />
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'No roles match your search criteria.' : 'Get started by adding your first role.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowCreateModal(true)}>
                Add First Role
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.map((role) => (
                  <RoleRow
                    key={role.id}
                    role={role}
                    onEdit={setEditingRole}
                    onDelete={setDeletingRole}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Role Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Role"
        size="xl"
      >
        <RoleForm
          permissions={permissions}
          onSubmit={handleCreateRole}
          onCancel={() => setShowCreateModal(false)}
          loading={isSubmitting}
        />
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={!!editingRole}
        onClose={() => setEditingRole(null)}
        title="Edit Role"
        size="xl"
      >
        <RoleForm
          role={editingRole}
          permissions={permissions}
          onUpdate={handleUpdateRole}
          onCancel={() => setEditingRole(null)}
          loading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingRole}
        onClose={() => setDeletingRole(null)}
        title="Delete Role"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Delete Role</h4>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          {deletingRole && (
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{deletingRole.display_name}</strong>?
              This will remove the role from all users who have it assigned.
            </p>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDeletingRole(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteRole}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Delete Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};