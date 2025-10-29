
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useUsers } from '../../hooks/useUsers';
import { roleService } from '../../services/role.service';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';
// import { capitalizeFirst } from '../../utils/helpers';
import type { User, UserCreate, UserUpdate, Role } from '../../types/user.types';

import { toast } from 'sonner';

// User form validation schemas
const userCreateSchema = z.object({
  login_id: z.string()
    .min(3, 'Login ID must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_@-]+$/, 'Login ID can only contain letters, numbers, @, _, and - characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string(),
  user_type: z.enum(['super_admin', 'admin', 'billing_manager', 'noc_manager', 'support_staff', 'reseller_admin', 'sub_reseller_admin', 'field_staff', 'accountant', 'customer_service', 'technical_support']),
  employee_id: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  salary: z.string().optional(),
  date_of_joining: z.string().optional(),
  date_of_birth: z.string().optional(),
  contact_person_name: z.string().optional(),
  contact_person_phone: z.string().optional(),
  address: z.string().min(3, 'Address is required'),
  district: z.string().optional(),
  thana: z.string().optional(),
  postal_code: z.string().optional(),
  remarks: z.string().optional(),
  timezone: z.string().optional(),
  is_active: z.boolean().default(true),
}).refine((data) => data.password === data.password_confirm, {
  path: ['password_confirm'],
  message: 'Passwords must match',
});

const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  mobile: z.string().optional(),
  user_type: z.enum(['super_admin', 'admin', 'billing_manager', 'noc_manager', 'support_staff', 'reseller_admin', 'sub_reseller_admin', 'field_staff', 'accountant', 'customer_service', 'technical_support']).optional(),
  employee_id: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  salary: z.string().optional(),
  date_of_joining: z.string().optional(),
  date_of_birth: z.string().optional(),
  contact_person_name: z.string().optional(),
  contact_person_phone: z.string().optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  thana: z.string().optional(),
  postal_code: z.string().optional(),
  remarks: z.string().optional(),
  profile_photo: z.string().optional(),
  timezone: z.string().optional(),
});

// User Table Row Component
interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewProfile: (user: User) => void;
  isMenuOpen: boolean;
  onToggleMenu: (userId: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete, onViewProfile, isMenuOpen, onToggleMenu }) => {

  // Friendly label mapping for role types (used inline below)

  const getUserTypeColor = (userType: User['user_type']) => {
    switch (userType) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'billing_manager':
        return 'bg-amber-100 text-amber-800';
      case 'noc_manager':
        return 'bg-blue-100 text-blue-800';
      case 'support_staff':
        return 'bg-teal-100 text-teal-800';
      case 'reseller_admin':
        return 'bg-indigo-100 text-indigo-800';
      case 'sub_reseller_admin':
        return 'bg-sky-100 text-sky-800';
      case 'field_staff':
        return 'bg-green-100 text-green-800';
      case 'accountant':
        return 'bg-yellow-100 text-yellow-800';
      case 'customer_service':
        return 'bg-pink-100 text-pink-800';
      case 'technical_support':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeIcon = (userType: User['user_type']) => {
    switch (userType) {
      case 'super_admin':
      case 'admin':
      case 'reseller_admin':
      case 'sub_reseller_admin':
        return <Shield className="w-4 h-4" />;
      case 'billing_manager':
      case 'noc_manager':
      case 'support_staff':
      case 'field_staff':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Name */}
  <td className="px-3 py-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
          </div>
        </div>
      </td>

      {/* Role */}
  <td className="px-3 py-2 hidden md:table-cell">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getUserTypeColor(user.user_type)}`}>
          {getUserTypeIcon(user.user_type)}
          <span>{/* Friendly label for role */}
            {(() => {
              const map: Record<User['user_type'], string> = {
                super_admin: 'Super Administrator',
                admin: 'Administrator',
                billing_manager: 'Billing Manager',
                noc_manager: 'NOC Manager',
                support_staff: 'Support Staff',
                reseller_admin: 'Reseller Administrator',
                sub_reseller_admin: 'Sub-Reseller Administrator',
                field_staff: 'Field Staff',
                accountant: 'Accountant',
                customer_service: 'Customer Service',
                technical_support: 'Technical Support',
              };
              return map[user.user_type];
            })()}
          </span>
        </div>
      </td>

      {/* Username */}
  <td className="px-3 py-2 text-sm text-gray-900 hidden lg:table-cell truncate">
        {user.login_id}
      </td>

      {/* Status */}
  <td className="px-3 py-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>

      {/* Mobile */}
  <td className="px-3 py-2 text-sm text-gray-900 hidden xl:table-cell truncate">
        {user.mobile || '-'}
      </td>

      {/* Email */}
  <td className="px-3 py-2 text-sm text-gray-900 hidden lg:table-cell truncate max-w-xs" title={user.email}>
        {user.email}
      </td>

      {/* Dept */}
  <td className="px-3 py-2 text-sm text-gray-900 hidden xl:table-cell truncate">
        {user.department || '-'}
      </td>

      {/* Address */}
  <td className="px-3 py-2 text-sm text-gray-900 hidden 2xl:table-cell truncate max-w-xs" title={user.address || ''}>
        {user.address || '-'}
      </td>

      {/* Actions */}
  <td className="px-3 py-2">
        <div className="relative">
          <button
            onClick={() => onToggleMenu(user.id)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
              <button
                onClick={() => {
                  onEdit(user);
                  onToggleMenu(user.id);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit User</span>
              </button>
              <button
                onClick={() => {
                  onDelete(user);
                  onToggleMenu(user.id);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete User</span>
              </button>
              <button
                onClick={() => {
                  onViewProfile(user);
                  onToggleMenu(user.id);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>View Profile</span>
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
  roles?: Role[];
  onSubmit?: (data: UserCreate) => Promise<void>;
  onUpdate?: (data: UserUpdate & { id: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, roles = [], onSubmit, onUpdate, onCancel, loading = false }) => {
  const isEditing = !!user;

  const schema = isEditing ? userUpdateSchema : userCreateSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: user ? {
      name: user.name,
      mobile: user.mobile || '',
      user_type: user.user_type,
      employee_id: user.employee_id || '',
      department: user.department || '',
      designation: user.designation || '',
      salary: user.salary || '',
      date_of_joining: user.date_of_joining || '',
      date_of_birth: user.date_of_birth || '',
      address: user.address || '',
      contact_person_name: user.contact_person_name || '',
      contact_person_phone: user.contact_person_phone || '',
      district: user.district || '',
      thana: user.thana || '',
      postal_code: user.postal_code || '',
      remarks: user.remarks || '',
      profile_photo: user.profile_photo || '',
      timezone: user.timezone,
    } : {
      user_type: 'field_staff',
      timezone: 'Asia/Dhaka',
      name: '',
      email: '',
      login_id: '',
      password: '',
      password_confirm: '',
      mobile: '',
      employee_id: '',
      department: '',
      designation: '',
      salary: '',
      date_of_joining: '',
      date_of_birth: '',
      contact_person_name: '',
      contact_person_phone: '',
      address: '',
      district: '',
      thana: '',
      postal_code: '',
      remarks: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        mobile: user.mobile || '',
        user_type: user.user_type,
        employee_id: user.employee_id || '',
        designation: user.designation || '',
        department: user.department || '',
        salary: user.salary || '',
        date_of_joining: user.date_of_joining || '',
        date_of_birth: user.date_of_birth || '',
        address: user.address || '',
        contact_person_name: user.contact_person_name || '',
        contact_person_phone: user.contact_person_phone || '',
        district: user.district || '',
        thana: user.thana || '',
        postal_code: user.postal_code || '',
        remarks: user.remarks || '',
        profile_photo: user.profile_photo || '',
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
        'mobile', 'employee_id', 'designation', 'department', 'salary', 'date_of_joining', 'date_of_birth',
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
      // Check if role exists in roles list before creating user
      const selectedUserType = (data as any).user_type;
      const roleExists = roles.find(r => r.name === selectedUserType);
      
      if (!roleExists) {
        setError('user_type', {
          type: 'manual',
          message: 'This role is not configured in Role Management. Please create it first.'
        });
        return;
      }
      
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
            <Input
              label="Retype Password"
              type="password"
              {...register('password_confirm')}
              error={(errors as any).password_confirm?.message}
              disabled={loading}
            />
          </>
        )}
        
        {/* Role dropdown - shown in both create and edit modes */}
        <div className={!isEditing ? '' : 'md:col-span-2'}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            {...register('user_type')}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled>Select a role</option>
            {roles
              .filter(role => role.is_active) // Only show active roles
              .sort((a, b) => a.role_level - b.role_level) // Sort by role level
              .map(role => (
                <option key={role.id} value={role.name}>
                  {role.display_name}
                  {role.max_assignments && ` (${role.max_assignments} max users)`}
                </option>
              ))}
            {roles.length === 0 && (
              <option value="" disabled>No roles available - Create roles first</option>
            )}
          </select>
          {(errors as any).user_type && (
            <p className="text-sm text-red-600 mt-1">{(errors as any).user_type.message}</p>
          )}
          {roles.filter(r => r.is_active).length === 0 && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span>
                  No active roles found. Please go to <strong>Role Management</strong> to create roles before adding users.
                </span>
              </p>
            </div>
          )}
        </div>

        {!isEditing && (
          <>
            <div>
              {/* Empty div for grid spacing when in create mode */}
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
          label="Mobile (Optional)"
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
          label="Department (Optional)"
          {...register('department')}
          error={(errors as any).department?.message}
          disabled={loading}
        />
        <Input
          label="Designation (Optional)"
          {...register('designation')}
          error={errors.designation?.message}
          disabled={loading}
        />
        <Input
          label="Salary (Optional)"
          {...register('salary')}
          error={(errors as any).salary?.message}
          disabled={loading}
        />
        <Input
          label="Date of Birth (Optional)"
          type="date"
          {...register('date_of_birth')}
          error={(errors as any).date_of_birth?.message}
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
          label="Address"
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
          label="Zip / Post Code (Optional)"
          {...register('postal_code')}
          error={(errors as any).postal_code?.message}
          disabled={loading}
        />
        {/* Language Preference field removed as requested */}
        <Input
          label="Timezone"
          {...register('timezone')}
          error={(errors as any).timezone?.message}
          disabled={loading}
          placeholder="Asia/Dhaka"
        />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hints / Remarks (Optional)
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

// Main Users Component
export const Users: React.FC = () => {
  const navigate = useNavigate();
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
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleLimitError, setRoleLimitError] = useState<{ role: string; limit: number } | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Load roles on mount
  useEffect(() => {
    const loadRoles = async () => {
      try {
        // First check localStorage for roles (demo mode)
        const savedRoles = localStorage.getItem('demo_roles');
        if (savedRoles) {
          setRoles(JSON.parse(savedRoles));
          return;
        }
        
        // Try to load from API if no localStorage data
        const response = await roleService.getRoles();
        setRoles(response.results);
      } catch (err) {
        console.warn('Failed to load roles:', err);
        // Check localStorage one more time in case API failed
        const savedRoles = localStorage.getItem('demo_roles');
        if (savedRoles) {
          setRoles(JSON.parse(savedRoles));
        } else {
          // Use empty array as fallback
          setRoles([]);
        }
      }
    };
    loadRoles();
  }, []);

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         user.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                         user.login_id.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    const matchesFilter = filterType === 'all' || user.user_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateUser = async (data: UserCreate) => {
    // Check role limit before creating user
    const selectedRole = roles.find(r => r.name === data.user_type);
    if (selectedRole && selectedRole.max_assignments !== undefined && selectedRole.max_assignments !== null) {
      const currentCount = users.filter(u => u.user_type === data.user_type).length;
      if (currentCount >= selectedRole.max_assignments) {
        setRoleLimitError({
          role: selectedRole.display_name,
          limit: selectedRole.max_assignments,
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(data);
      if (result.success) {
        setShowCreateModal(false);
        toast.success('User created successfully');
      } else {
        toast.error(result.error || 'Failed to create user');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: UserUpdate & { id: string }) => {
    const { id, ...updateData } = data;
    
    // Check if role is being changed and validate role limits
    if (updateData.user_type) {
      const user = users.find(u => u.id === id);
      const oldUserType = user?.user_type;
      const newUserType = updateData.user_type;
      
      // Only check if the role is actually changing
      if (oldUserType !== newUserType) {
        const selectedRole = roles.find(r => r.name === newUserType);
        
        // Check if role exists in Role Management
        if (!selectedRole) {
          toast.error('This role is not configured in Role Management. Please create it first.');
          return;
        }
        
        // Check role limits
        if (selectedRole.max_assignments !== undefined && selectedRole.max_assignments !== null) {
          // Count users with the new role (excluding the current user)
          const currentCount = users.filter(u => u.user_type === newUserType && u.id !== id).length;
          
          if (currentCount >= selectedRole.max_assignments) {
            setRoleLimitError({
              role: selectedRole.display_name,
              limit: selectedRole.max_assignments,
            });
            return;
          }
        }
      }
    }
    
    setIsSubmitting(true);
    try {
      const result = await updateUser({ id, ...updateData });
      if (result.success) {
        setEditingUser(null);
        toast.success('User updated successfully');
      } else {
        toast.error(result.error || 'Failed to update user');
      }
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
    <div className="space-y-6 pt-8">
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
                {roles
                  .filter(role => role.is_active)
                  .sort((a, b) => a.role_level - b.role_level)
                  .map(role => (
                    <option key={role.id} value={role.name}>
                      {role.display_name}
                    </option>
                  ))}
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
          <div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Role</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Username</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Mobile</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Dept</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden 2xl:table-cell">Address</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onEdit={setEditingUser}
                    onDelete={setDeletingUser}
                    onViewProfile={setViewingUser}
                    isMenuOpen={openMenuId === user.id}
                    onToggleMenu={(userId) => setOpenMenuId(openMenuId === userId ? null : userId)}
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
          roles={roles}
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
          roles={roles}
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

      {/* Role Limit Exceeded Modal */}
      <Modal
        isOpen={!!roleLimitError}
        onClose={() => setRoleLimitError(null)}
        title="Maximum User Limit Reached"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Maximum User for {roleLimitError?.role} Exceeded</h4>
              <p className="text-sm text-gray-600">Role assignment limit reached.</p>
            </div>
          </div>
          
          {roleLimitError && (
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                You have reached the maximum number of users ({roleLimitError.limit}) allowed for the <strong>{roleLimitError.role}</strong> role.
              </p>
              <p>
                To create a user with the <strong>{roleLimitError.role}</strong> role, please increase the number assigned for this role from <strong>Role Management</strong>.
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setRoleLimitError(null)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setRoleLimitError(null);
                navigate('/users/roles');
              }}
            >
              Go to Role Management
            </Button>
          </div>
        </div>
      </Modal>

      {/* View User Profile Modal */}
      <Modal
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        title="User Profile"
        size="lg"
      >
        {viewingUser && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {viewingUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{viewingUser.name}</h3>
                <p className="text-gray-600">{viewingUser.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    viewingUser.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {viewingUser.status}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {(() => {
                      // Try to get role display name from roles array first
                      const role = roles.find(r => r.name === viewingUser.user_type);
                      if (role) {
                        return role.display_name;
                      }
                      
                      // Fallback to mapping if role not found in roles array
                      const roleMap: Record<User['user_type'], string> = {
                        super_admin: 'Super Administrator',
                        admin: 'Administrator',
                        billing_manager: 'Billing Manager',
                        noc_manager: 'NOC Manager',
                        support_staff: 'Support Staff',
                        reseller_admin: 'Reseller Administrator',
                        sub_reseller_admin: 'Sub-Reseller Administrator',
                        field_staff: 'Field Staff',
                        accountant: 'Accountant',
                        customer_service: 'Customer Service',
                        technical_support: 'Technical Support',
                      };
                      return roleMap[viewingUser.user_type] || viewingUser.user_type;
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Contact Information
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Mobile</label>
                    <p className="text-sm text-gray-900 mt-0.5">{viewingUser.mobile || 'N/A'}</p>
                  </div>
                  
                  {viewingUser.contact_person_name && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Contact Person</label>
                      <p className="text-sm text-gray-900 mt-0.5">{viewingUser.contact_person_name}</p>
                    </div>
                  )}
                  
                  {viewingUser.contact_person_phone && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Contact Person Phone</label>
                      <p className="text-sm text-gray-900 mt-0.5">{viewingUser.contact_person_phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Employment Information
                </h4>
                
                <div className="space-y-3">
                  {viewingUser.employee_id && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Employee ID</label>
                      <p className="text-sm text-gray-900 mt-0.5">{viewingUser.employee_id}</p>
                    </div>
                  )}
                  
                  {viewingUser.designation && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Designation</label>
                      <p className="text-sm text-gray-900 mt-0.5">{viewingUser.designation}</p>
                    </div>
                  )}
                  
                  {viewingUser.department && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Department</label>
                      <p className="text-sm text-gray-900 mt-0.5">{viewingUser.department}</p>
                    </div>
                  )}

                  {viewingUser.salary && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Salary</label>
                      <p className="text-sm text-gray-900 mt-0.5">৳ {viewingUser.salary.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              {viewingUser.address && (
                <div className="space-y-4 md:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Address Information
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Address</label>
                      <p className="text-sm text-gray-900 mt-0.5">{viewingUser.address}</p>
                    </div>
                    
                    {viewingUser.postal_code && (
                      <div>
                        <label className="text-xs font-medium text-gray-500">Postal Code</label>
                        <p className="text-sm text-gray-900 mt-0.5">{viewingUser.postal_code}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Role Permissions */}
              {(() => {
                const userRole = roles.find(r => r.name === viewingUser.user_type);
                
                // Only show section if user has a role
                if (!userRole) return null;
                
                const rolePermissions = userRole.permissions || [];
                
                return (
                  <div className="space-y-4 md:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Role Permissions</span>
                      <span className="text-xs font-normal text-gray-500">
                        ({rolePermissions.length} permission{rolePermissions.length !== 1 ? 's' : ''})
                      </span>
                    </h4>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {rolePermissions.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {rolePermissions.map((permission) => (
                              <div 
                                key={permission.id}
                                className="flex items-center space-x-2 text-xs bg-white px-3 py-2 rounded-md border border-gray-200"
                              >
                                <svg 
                                  className="w-3 h-3 text-green-600 flex-shrink-0" 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path 
                                    fillRule="evenodd" 
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                    clipRule="evenodd" 
                                  />
                                </svg>
                                <span className="text-gray-700 truncate" title={permission.name}>
                                  {permission.name}
                                </span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                              These permissions are inherited from the <strong className="text-gray-700">{userRole.display_name}</strong> role.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            No permissions assigned to the <strong>{userRole.display_name}</strong> role.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Additional Information */}
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Additional Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {viewingUser.date_joined && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Date Joined</label>
                      <p className="text-sm text-gray-900 mt-0.5">
                        {new Date(viewingUser.date_joined).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  {viewingUser.last_login && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Last Login</label>
                      <p className="text-sm text-gray-900 mt-0.5">
                        {new Date(viewingUser.last_login).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {viewingUser.remarks && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Remarks</label>
                    <p className="text-sm text-gray-900 mt-0.5">{viewingUser.remarks}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setViewingUser(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setEditingUser(viewingUser);
                  setViewingUser(null);
                }}
              >
                Edit User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};