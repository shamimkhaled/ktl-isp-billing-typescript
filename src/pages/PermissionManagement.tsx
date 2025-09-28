import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Key,
  Plus,
  Edit3,
  Trash2,
  MoreVertical,
  Search,
  Folder,
} from 'lucide-react';
import { permissionService } from '../services/permission.service';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/helpers';
import type {
  CustomPermission,
  PermissionCategory
} from '../types/user.types';
import { toast } from 'sonner';

// Permission form validation schemas
const permissionCreateSchema = z.object({
  codename: z.string().min(3, 'Codename must be at least 3 characters'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  category: z.string().optional(),
});

const permissionUpdateSchema = permissionCreateSchema.partial();

// Category form validation schemas
const categoryCreateSchema = z.object({
  name: z.string().min(3, 'Category name must be at least 3 characters'),
  display_name: z.string().min(3, 'Display name must be at least 3 characters'),
  description: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().min(0).default(0),
});

const categoryUpdateSchema = categoryCreateSchema.partial();

interface PermissionFormData {
  codename?: string;
  name?: string;
  description?: string;
  category?: string;
}

interface CategoryFormData {
  name?: string;
  display_name?: string;
  description?: string;
  icon?: string;
  order?: number;
}

// Permission Table Row Component
interface PermissionRowProps {
  permission: CustomPermission;
  onEdit: (permission: CustomPermission) => void;
  onDelete: (permission: CustomPermission) => void;
}

const PermissionRow: React.FC<PermissionRowProps> = ({ permission, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{permission.name}</div>
            <div className="text-sm text-gray-500">{permission.codename}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {permission.description || '-'}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          permission.is_active
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {permission.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {permission.category_name || '-'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {permission.is_system_permission ? 'System' : 'Custom'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatDate(permission.created_at)}
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
                  onEdit(permission);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Permission</span>
              </button>
              {!permission.is_system_permission && (
                <button
                  onClick={() => {
                    onDelete(permission);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Permission</span>
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Category Table Row Component
interface CategoryRowProps {
  category: PermissionCategory;
  onEdit: (category: PermissionCategory) => void;
  onDelete: (category: PermissionCategory) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{category.display_name}</div>
            <div className="text-sm text-gray-500">{category.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {category.description || '-'}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {category.permissions_count} permissions
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {category.order}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatDate(category.created_at)}
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
                  onEdit(category);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Category</span>
              </button>
              <button
                onClick={() => {
                  onDelete(category);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Category</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Permission Form Component
interface PermissionFormProps {
  permission?: CustomPermission | null;
  categories: PermissionCategory[];
  onSubmit?: (data: PermissionFormData) => Promise<void>;
  onUpdate?: (data: PermissionFormData & { id: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const PermissionForm: React.FC<PermissionFormProps> = ({
  permission,
  categories,
  onSubmit,
  onUpdate,
  onCancel,
  loading = false
}) => {
  const isEditing = !!permission;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PermissionFormData>({
    resolver: zodResolver(isEditing ? permissionUpdateSchema : permissionCreateSchema),
    defaultValues: permission ? {
      codename: permission.codename,
      name: permission.name,
      description: permission.description || '',
      category: permission.category || '',
    } : {},
  });

  const handleFormSubmit = (data: PermissionFormData) => {
    if (isEditing && permission && onUpdate) {
      onUpdate({ id: permission.id, ...data });
    } else if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Codename"
          {...register('codename')}
          error={errors.codename?.message}
          disabled={loading || isEditing}
          placeholder="e.g., view_user, edit_post"
        />

        <Input
          label="Display Name"
          {...register('name')}
          error={errors.name?.message}
          disabled={loading}
          placeholder="e.g., View User, Edit Post"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category (Optional)
          </label>
          <select
            {...register('category')}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">No Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.display_name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
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
          {isEditing ? 'Update Permission' : 'Create Permission'}
        </Button>
      </div>
    </form>
  );
};

// Category Form Component
interface CategoryFormProps {
  category?: PermissionCategory | null;
  onSubmit?: (data: CategoryFormData) => Promise<void>;
  onUpdate?: (data: CategoryFormData & { id: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onUpdate,
  onCancel,
  loading = false
}) => {
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(isEditing ? categoryUpdateSchema : categoryCreateSchema),
    defaultValues: category ? {
      name: category.name,
      display_name: category.display_name,
      description: category.description || '',
      icon: category.icon || '',
      order: category.order,
    } : {
      order: 0,
    },
  });

  const handleFormSubmit = (data: CategoryFormData) => {
    if (isEditing && category && onUpdate) {
      onUpdate({ id: category.id, ...data });
    } else if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Category Name"
          {...register('name')}
          error={errors.name?.message}
          disabled={loading || isEditing}
          placeholder="e.g., user_management, content_management"
        />

        <Input
          label="Display Name"
          {...register('display_name')}
          error={errors.display_name?.message}
          disabled={loading}
          placeholder="e.g., User Management, Content Management"
        />

        <Input
          label="Icon (Optional)"
          {...register('icon')}
          error={errors.icon?.message}
          disabled={loading}
          placeholder="e.g., users, settings"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order
          </label>
          <input
            type="number"
            {...register('order', { valueAsNumber: true })}
            disabled={loading}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {errors.order && (
            <p className="text-sm text-red-600 mt-1">{errors.order.message}</p>
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
          {isEditing ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

// Main Permission Management Component
export const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<CustomPermission[]>([]);
  const [categories, setCategories] = useState<PermissionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'permissions' | 'categories'>('permissions');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState<CustomPermission | null>(null);
  const [editingCategory, setEditingCategory] = useState<PermissionCategory | null>(null);
  const [deletingPermission, setDeletingPermission] = useState<CustomPermission | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<PermissionCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [permissionsResponse, categoriesResponse] = await Promise.all([
        permissionService.getCustomPermissions(),
        permissionService.getPermissionCategories()
      ]);
      setPermissions(permissionsResponse.results);
      setCategories(categoriesResponse.results);
    } catch (error: any) {
      console.warn('Failed to load permissions and categories from API, using mock data:', error);
      // Fallback to mock data for development
      setPermissions(getMockPermissions());
      setCategories(getMockCategories());
      toast.error('Using demo data - API not available');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const getMockPermissions = (): CustomPermission[] => [
    {
      id: 'perm-view-users-001',
      codename: 'view_users',
      name: 'View Users',
      description: 'Can view user list and details',
      category: 'cat-user-mgmt-001',
      category_name: 'User Management',
      is_active: true,
      is_system_permission: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'perm-add-users-001',
      codename: 'add_users',
      name: 'Add Users',
      description: 'Can create new user accounts',
      category: 'cat-user-mgmt-001',
      category_name: 'User Management',
      is_active: true,
      is_system_permission: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'perm-edit-users-001',
      codename: 'edit_users',
      name: 'Edit Users',
      description: 'Can modify user information',
      category: 'cat-user-mgmt-001',
      category_name: 'User Management',
      is_active: true,
      is_system_permission: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const getMockCategories = (): PermissionCategory[] => [
    {
      id: 'cat-user-mgmt-001',
      name: 'user_management',
      display_name: 'User Management',
      description: 'Permissions related to user account management',
      icon: 'users',
      order: 1,
      permissions_count: '3',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'cat-system-001',
      name: 'system_admin',
      display_name: 'System Administration',
      description: 'Administrative permissions for system management',
      icon: 'settings',
      order: 2,
      permissions_count: '0',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const handleCreatePermission = async (data: PermissionFormData) => {
    setIsSubmitting(true);
    try {
      await permissionService.createCustomPermission(data as any);
      setShowCreateModal(false);
      await loadData();
      toast.success('Permission created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create permission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePermission = async (data: PermissionFormData & { id: string }) => {
    const { id, ...updateData } = data;
    setIsSubmitting(true);
    try {
      await permissionService.updateCustomPermission(id, updateData as any);
      setEditingPermission(null);
      await loadData();
      toast.success('Permission updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update permission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePermission = async () => {
    if (!deletingPermission) return;

    setIsSubmitting(true);
    try {
      await permissionService.deleteCustomPermission(deletingPermission.id);
      setDeletingPermission(null);
      await loadData();
      toast.success('Permission deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete permission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCategory = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      await permissionService.createPermissionCategory(data as any);
      setShowCreateModal(false);
      await loadData();
      toast.success('Category created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (data: CategoryFormData & { id: string }) => {
    const { id, ...updateData } = data;
    setIsSubmitting(true);
    try {
      await permissionService.updatePermissionCategory(id, updateData as any);
      setEditingCategory(null);
      await loadData();
      toast.success('Category updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    setIsSubmitting(true);
    try {
      await permissionService.deletePermissionCategory(deletingCategory.id);
      setDeletingCategory(null);
      await loadData();
      toast.success('Category deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.codename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCategories = categories.filter(category =>
    category.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permission Management</h1>
          <p className="text-gray-600 mt-1">
            Manage system permissions and categories
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}
          className="mt-4 sm:mt-0"
        >
          Add New {activeTab === 'permissions' ? 'Permission' : 'Category'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'permissions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Permissions ({permissions.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Categories ({categories.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Content */}
      {activeTab === 'permissions' ? (
        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" message="Loading permissions..." />
            </div>
          ) : filteredPermissions.length === 0 ? (
            <div className="text-center py-12">
              <Key className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No permissions found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No permissions match your search criteria.' : 'Get started by adding your first permission.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateModal(true)}>
                  Add First Permission
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
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
                  {filteredPermissions.map((permission) => (
                    <PermissionRow
                      key={permission.id}
                      permission={permission}
                      onEdit={setEditingPermission}
                      onDelete={setDeletingPermission}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ) : (
        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" message="Loading categories..." />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No categories match your search criteria.' : 'Get started by adding your first category.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateModal(true)}>
                  Add First Category
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
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
                  {filteredCategories.map((category) => (
                    <CategoryRow
                      key={category.id}
                      category={category}
                      onEdit={setEditingCategory}
                      onDelete={setDeletingCategory}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={`Create New ${activeTab === 'permissions' ? 'Permission' : 'Category'}`}
        size="lg"
      >
        {activeTab === 'permissions' ? (
          <PermissionForm
            categories={categories}
            onSubmit={handleCreatePermission}
            onCancel={() => setShowCreateModal(false)}
            loading={isSubmitting}
          />
        ) : (
          <CategoryForm
            onSubmit={handleCreateCategory}
            onCancel={() => setShowCreateModal(false)}
            loading={isSubmitting}
          />
        )}
      </Modal>

      {/* Edit Permission Modal */}
      <Modal
        isOpen={!!editingPermission}
        onClose={() => setEditingPermission(null)}
        title="Edit Permission"
        size="lg"
      >
        <PermissionForm
          permission={editingPermission}
          categories={categories}
          onUpdate={handleUpdatePermission}
          onCancel={() => setEditingPermission(null)}
          loading={isSubmitting}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
        size="lg"
      >
        <CategoryForm
          category={editingCategory}
          onUpdate={handleUpdateCategory}
          onCancel={() => setEditingCategory(null)}
          loading={isSubmitting}
        />
      </Modal>

      {/* Delete Permission Modal */}
      <Modal
        isOpen={!!deletingPermission}
        onClose={() => setDeletingPermission(null)}
        title="Delete Permission"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Delete Permission</h4>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          {deletingPermission && (
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{deletingPermission.name}</strong>?
              This will remove the permission from all roles that have it assigned.
            </p>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDeletingPermission(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeletePermission}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Delete Permission
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Delete Category</h4>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          {deletingCategory && (
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{deletingCategory.display_name}</strong>?
              This will remove the category but permissions will remain uncategorized.
            </p>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDeletingCategory(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCategory}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};