import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Building,
  CreditCard,
  Globe,
  Save,
  Edit3,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import type { UserUpdate } from '../../types/user.types';
import type { Permission } from '../../types/user.types';
import { toast } from 'sonner';
import { permissionService } from '../../services/permission.service';

// Profile update validation schema
const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().min(1, 'Mobile number is required'),
  employee_id: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
  postal_code: z.string().optional(),
  timezone: z.string(),
}).partial();

interface ProfileFormData extends Partial<UserUpdate> {}

export const MainProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user ? {
      name: user.name || '',
      mobile: user.mobile || '',
      employee_id: user.employee_id || '',
      designation: user.designation || '',
      department: user.department || '',
      address: user.address || '',
      postal_code: user.postal_code || '',
      timezone: user.timezone || 'Asia/Dhaka',
    } : {},
  });

  // Fetch all permissions for Super Admin
  useEffect(() => {
    const fetchPermissions = async () => {
      if (user?.is_superuser) {
        try {
          const response = await permissionService.getPermissions();
          setPermissions(response.data.results);
        } catch (error) {
          console.error('Failed to fetch permissions:', error);
        }
      }
    };
    fetchPermissions();
  }, [user]);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        mobile: user.mobile || '',
        employee_id: user.employee_id || '',
        designation: user.designation || '',
        department: user.department || '',
        address: user.address || '',
        postal_code: user.postal_code || '',
        timezone: user.timezone || 'Asia/Dhaka',
      });
    }
  }, [user, reset]);

  const handleProfileUpdate = async (data: ProfileFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Filter out empty strings for optional fields
      const updateData: Partial<UserUpdate> = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          (updateData as any)[key] = value;
        }
      });

      await updateProfile(updateData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">
                  {(user.name || user.login_id)?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name || user.login_id || 'User'}</h3>
              <p className="text-gray-600 mb-2">{user.email || 'No email'}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {user.role?.display_name || user.user_type?.replace('_', ' ')?.toUpperCase() || 'USER'}
              </div>
              {user.employee_id && (
                <p className="text-sm text-gray-500 mt-2">Employee ID: {user.employee_id}</p>
              )}
              
              {/* Status Badge */}
              <div className="mt-4">
                {user.is_active ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Login ID: {user.login_id}</span>
              </div>
              {user.created_at && (
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Joined {formatDate(user.created_at)}</span>
                </div>
              )}
              <div className="flex items-center space-x-3 text-sm">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{user.timezone || 'Asia/Dhaka'}</span>
              </div>
              {user.last_login && (
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Last login {formatDate(user.last_login)}</span>
                </div>
              )}
              
              {/* Verification Status */}
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email Verified</span>
                  <span className={`font-medium ${user.is_email_verified ? 'text-green-600' : 'text-red-600'}`}>
                    {user.is_email_verified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phone Verified</span>
                  <span className={`font-medium ${user.is_phone_verified ? 'text-green-600' : 'text-red-600'}`}>
                    {user.is_phone_verified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t space-y-3">
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(true)}
                className="w-full"
                icon={<CreditCard className="w-4 h-4" />}
              >
                Change Password
              </Button>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full"
                  icon={<Edit3 className="w-4 h-4" />}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              {isEditing && (
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCancelEdit}
                    icon={<X className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit(handleProfileUpdate)}
                    loading={isSubmitting}
                    icon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  {...register('name')}
                  error={errors.name?.message}
                  disabled={!isEditing || isSubmitting}
                  icon={<User className="w-4 h-4" />}
                />

                <Input
                  label="Mobile Number"
                  {...register('mobile')}
                  error={errors.mobile?.message}
                  disabled={!isEditing || isSubmitting}
                  icon={<Phone className="w-4 h-4" />}
                />

                <Input
                  label="Employee ID"
                  {...register('employee_id')}
                  error={errors.employee_id?.message}
                  disabled={!isEditing || isSubmitting}
                />

                <Input
                  label="Designation"
                  {...register('designation')}
                  error={errors.designation?.message}
                  disabled={!isEditing || isSubmitting}
                />

                <Input
                  label="Department"
                  {...register('department')}
                  error={errors.department?.message}
                  disabled={!isEditing || isSubmitting}
                  icon={<Building className="w-4 h-4" />}
                />

                <Input
                  label="Timezone"
                  {...register('timezone')}
                  error={errors.timezone?.message}
                  disabled={!isEditing || isSubmitting}
                  placeholder="Asia/Dhaka"
                />

                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    {...register('address')}
                    error={errors.address?.message}
                    disabled={!isEditing || isSubmitting}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </div>

                <Input
                  label="Postal Code"
                  {...register('postal_code')}
                  error={errors.postal_code?.message}
                  disabled={!isEditing || isSubmitting}
                />
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Role Information Section */}
      {user.role && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Role & Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Role Name</label>
              <p className="text-gray-900 font-medium">{user.role.display_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Role Level</label>
              <p className="text-gray-900 font-medium">{user.role.role_level}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Can Assign Roles</label>
              <p className={`font-medium ${user.role.can_assign_roles ? 'text-green-600' : 'text-red-600'}`}>
                {user.role.can_assign_roles ? 'Yes' : 'No'}
              </p>
            </div>
            {user.role.description && (
              <div className="md:col-span-2 lg:col-span-3">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900">{user.role.description}</p>
              </div>
            )}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium text-gray-500 block mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {user.role.is_system_role && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    System Role
                  </span>
                )}
                {user.role.is_active ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>
                {user.is_superuser ? 'All System Permissions' : 'Role Permissions'}
              </span>
              <span className="text-xs font-normal text-gray-500">
                ({user.is_superuser ? permissions.length : (user.role.permissions?.length || 0)} permission{(user.is_superuser ? permissions.length : (user.role.permissions?.length || 0)) !== 1 ? 's' : ''})
              </span>
            </h4>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {(() => {
                const displayPermissions = user.is_superuser ? permissions : (user.role.permissions || []);
                
                if (displayPermissions.length > 0) {
                  return (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {displayPermissions.map((permission) => (
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
                          {user.is_superuser 
                            ? 'As a Super Administrator, you have access to all system permissions.'
                            : `These permissions are inherited from the ${user.role.display_name} role.`
                          }
                        </p>
                      </div>
                    </>
                  );
                }
                
                return (
                  <div className="text-center py-4">
                    <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      No permissions assigned to the <strong>{user.role.display_name}</strong> role.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </Card>
      )}

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Password change functionality will be implemented here.
          </p>
          <div className="flex justify-end">
            <Button onClick={() => setShowPasswordModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
