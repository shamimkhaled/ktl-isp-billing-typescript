
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  UserCheck,
  MoreVertical,
  Filter,
  Download,
  Shield,
  User as UserIcon,
  Mail,
  Phone,
} from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';
import { formatDate, capitalizeFirst } from '../utils/helpers';
import type { User, UserCreate, UserUpdate } from '../types/user.types';

import { toast } from 'sonner';

// User form validation schemas
const userCreateSchema = z.object({
  login_id: z.string()
    .min(3, 'Login ID must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Login ID can only contain letters, numbers, and underscores'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
  user_type: z.enum(['super_admin', 'admin', 'billing_manager', 'noc_manager', 'support_staff', 'reseller_admin', 'sub_reseller_admin', 'field_staff']),
  employee_id: z.string().optional(),
  designation: z.string().optional(),
  is_active: z.boolean().default(true),
});

const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  mobile: z.string().min(1, 'Mobile number is required').optional(),
  employee_id: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  salary: z.string().optional(),
  date_of_joining: z.string().optional(),
  address: z.string().optional(),
  contact_person_name: z.string().optional(),
  contact_person_phone: z.string().optional(),
  district: z.string().optional(),
  thana: z.string().optional(),
  postal_code: z.string().optional(),
  remarks: z.string().optional(),
  profile_photo: z.string().optional(),
  language_preference: z.enum(['en', 'bn']).optional(),
  timezone: z.string().optional(),
});

// User Table Row Component
interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'manager': return <UserCheck className="w-4 h-4" />;
      case 'user': return <UserIcon className="w-4 h-4" />;
      default: return <UserIcon className="w-4 h-4" />;
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.login_id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{user.email}</span>
        </div>
        {user.mobile && (
          <div className="flex items-center space-x-2 text-gray-500 mt-1">
            <Phone className="w-4 h-4" />
            <span className="text-xs">{user.mobile}</span>
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getUserTypeColor(user.user_type)}`}>
          {getUserTypeIcon(user.user_type)}
          <span>{capitalizeFirst(user.user_type)}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{user.employee_id || '-'}</div>
        {user.designation && (
          <div className="text-xs text-gray-500">{user.designation}</div>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.is_active
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatDate(user.created_at)}
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
                  onEdit(user);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit User</span>
              </button>
              <button
                onClick={() => {
                  onDelete(user);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete User</span>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// User Form Component
interface UserFormProps {
  user?: User | null;
  onSubmit?: (data: UserCreate) => Promise<void>;
  onUpdate?: (data: UserUpdate & { id: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onUpdate, onCancel, loading = false }) => {
  const isEditing = !!user;

  const schema = isEditing ? userUpdateSchema : userCreateSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: user ? {
      name: user.name,
      mobile: user.mobile || '',
      employee_id: user.employee_id || '',
      designation: user.designation || '',
      department: user.department || '',
      salary: user.salary || '',
      date_of_joining: user.date_of_joining || '',
      address: user.address || '',
      contact_person_name: user.contact_person_name || '',
      contact_person_phone: user.contact_person_phone || '',
      district: user.district || '',
      thana: user.thana || '',
      postal_code: user.postal_code || '',
      remarks: user.remarks || '',
      profile_photo: user.profile_photo || '',
      language_preference: user.language_preference,
      timezone: user.timezone,
    } : {
      user_type: 'field_staff',
      language_preference: 'en',
      timezone: 'Asia/Dhaka',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        mobile: user.mobile || '',
        employee_id: user.employee_id || '',
        designation: user.designation || '',
        department: user.department || '',
        salary: user.salary || '',
        date_of_joining: user.date_of_joining || '',
        address: user.address || '',
        contact_person_name: user.contact_person_name || '',
        contact_person_phone: user.contact_person_phone || '',
        district: user.district || '',
        thana: user.thana || '',
        postal_code: user.postal_code || '',
        remarks: user.remarks || '',
        profile_photo: user.profile_photo || '',
        language_preference: user.language_preference,
        timezone: user.timezone,
      });
    }
  }, [user, reset]);

  const handleFormSubmit = (data: z.infer<typeof schema>) => {
    if (isEditing && user && onUpdate) {
      // For updates, send data but convert empty strings to undefined for optional fields
      const processedData = { ...data };

      // List of optional fields that should be undefined if empty
      const optionalFields = [
        'employee_id', 'designation', 'department', 'date_of_joining',
        'address', 'contact_person_name', 'contact_person_phone',
        'district', 'thana', 'postal_code', 'remarks', 'profile_photo'
      ];

      optionalFields.forEach(field => {
        if ((processedData as any)[field] === '') {
          (processedData as any)[field] = undefined;
        }
      });

      // Handle salary - keep as string (API expects string format decimal)
      if ((processedData as any).salary === '') {
        (processedData as any).salary = undefined;
      }

      const updateData = processedData as UserUpdate;
      const finalData = {
        id: user.id,
        ...updateData,
      };
      onUpdate(finalData);
    } else if (onSubmit) {
      onSubmit(data as UserCreate);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isEditing && (
          <>
            <Input
              label="Login ID"
              {...register('login_id')}
              error={(errors as any).login_id?.message}
              disabled={loading}
              icon={<UserIcon className="w-4 h-4" />}
            />
            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={(errors as any).email?.message}
              disabled={loading}
              icon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={(errors as any).password?.message}
              disabled={loading}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Type
              </label>
              <select
                {...register('user_type')}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="field_staff">Field Staff</option>
                <option value="support_staff">Support Staff</option>
                <option value="noc_manager">NOC Manager</option>
                <option value="billing_manager">Billing Manager</option>
                <option value="reseller_admin">Reseller Admin</option>
                <option value="sub_reseller_admin">Sub Reseller Admin</option>
                <option value="admin">Administrator</option>
                <option value="super_admin">Super Administrator</option>
              </select>
              {(errors as any).user_type && (
                <p className="text-sm text-red-600 mt-1">{(errors as any).user_type.message}</p>
              )}
            </div>
          </>
        )}

        <Input
          label="Full Name"
          {...register('name')}
          error={errors.name?.message}
          disabled={loading}
        />
        <Input
          label="Mobile Number (Optional)"
          {...register('mobile')}
          error={errors.mobile?.message}
          disabled={loading}
          icon={<Phone className="w-4 h-4" />}
        />
        <Input
          label="Employee ID (Optional)"
          {...register('employee_id')}
          error={errors.employee_id?.message}
          disabled={loading}
        />
        <Input
          label="Designation (Optional)"
          {...register('designation')}
          error={errors.designation?.message}
          disabled={loading}
        />
        {/* Additional fields for editing */}
        {isEditing && (
          <>
            <Input
              label="Department (Optional)"
              {...register('department')}
              error={(errors as any).department?.message}
              disabled={loading}
            />
            <Input
              label="Salary (Optional)"
              {...register('salary')}
              error={(errors as any).salary?.message}
              disabled={loading}
            />
            <Input
              label="Date of Joining (Optional)"
              type="date"
              {...register('date_of_joining')}
              error={(errors as any).date_of_joining?.message}
              disabled={loading}
            />
            <Input
              label="Address (Optional)"
              {...register('address')}
              error={(errors as any).address?.message}
              disabled={loading}
            />
            <Input
              label="Contact Person Name (Optional)"
              {...register('contact_person_name')}
              error={(errors as any).contact_person_name?.message}
              disabled={loading}
            />
            <Input
              label="Contact Person Phone (Optional)"
              {...register('contact_person_phone')}
              error={(errors as any).contact_person_phone?.message}
              disabled={loading}
            />
            <Input
              label="District (Optional)"
              {...register('district')}
              error={(errors as any).district?.message}
              disabled={loading}
            />
            <Input
              label="Thana (Optional)"
              {...register('thana')}
              error={(errors as any).thana?.message}
              disabled={loading}
            />
            <Input
              label="Postal Code (Optional)"
              {...register('postal_code')}
              error={(errors as any).postal_code?.message}
              disabled={loading}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language Preference
              </label>
              <select
                {...register('language_preference')}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="en">English</option>
                <option value="bn">Bengali</option>
              </select>
              {(errors as any).language_preference && (
                <p className="text-sm text-red-600 mt-1">{(errors as any).language_preference.message}</p>
              )}
            </div>
            <Input
              label="Timezone"
              {...register('timezone')}
              error={(errors as any).timezone?.message}
              disabled={loading}
              placeholder="Asia/Dhaka"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                {...register('remarks')}
                disabled={loading}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Additional notes..."
              />
              {(errors as any).remarks && (
                <p className="text-sm text-red-600 mt-1">{(errors as any).remarks.message}</p>
              )}
            </div>
          </>
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
          {isEditing ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

// Main User Management Component
export const UserManagement: React.FC = () => {
  const {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    clearError,
  } = useUsers();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         user.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         user.login_id.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesFilter = filterType === 'all' || user.user_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateUser = async (data: UserCreate) => {
    setIsSubmitting(true);
    try {
      await createUser(data);
      setShowCreateModal(false);
      toast.success('User created successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: UserUpdate & { id: string }) => {
    const { id, ...updateData } = data;
    setIsSubmitting(true);
    try {
      await updateUser({ id, ...updateData });
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    
    setIsSubmitting(true);
    try {
      const result = await deleteUser(deletingUser.id);
      if (result.success) {
        setDeletingUser(null);
        toast.success('User deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete user');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage system users, roles, and permissions
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={<Plus className="w-4 h-4" />}
          className="mt-4 sm:mt-0"
        >
          Add New User
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="admin">Administrators</option>
                <option value="manager">Managers</option>
                <option value="user">Users</option>
              </select>
            </div>
            <Button
              variant="outline"
              icon={<Download className="w-4 h-4" />}
            >
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" message="Loading users..." />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== 'all'
                ? 'No users match your current search or filter criteria.'
                : 'Get started by adding your first user.'}
            </p>
            {!searchTerm && filterType === 'all' && (
              <Button onClick={() => setShowCreateModal(true)}>
                Add First User
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onEdit={setEditingUser}
                    onDelete={setDeletingUser}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.is_active).length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Administrators</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.user_type === 'admin').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New User"
        size="lg"
      >
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateModal(false)}
          loading={isSubmitting}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
        size="lg"
      >
        <UserForm
          user={editingUser}
          onSubmit={handleCreateUser}
          onUpdate={handleUpdateUser}
          onCancel={() => setEditingUser(null)}
          loading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Delete User Account</h4>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
          </div>
          
          {deletingUser && (
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <strong>{deletingUser.name}</strong>? 
              This will permanently remove their account and all associated data.
            </p>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDeletingUser(null)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteUser}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};