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
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/helpers';
import type { UserUpdate } from '../types/user.types';
import { toast } from 'sonner';

// Profile update validation schema
const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().min(1, 'Mobile number is required'),
  employee_id: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
  contact_person_name: z.string().optional(),
  contact_person_phone: z.string().optional(),
  postal_code: z.string().optional(),
  remarks: z.string().optional(),
  language_preference: z.enum(['en', 'bn']),
  timezone: z.string(),
}).partial();

interface ProfileFormData extends Partial<UserUpdate> {}

export const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user ? {
      name: user.name,
      mobile: user.mobile,
      employee_id: user.employee_id || '',
      designation: user.designation || '',
      department: user.department || '',
      address: user.address || '',
      contact_person_name: user.contact_person_name || '',
      contact_person_phone: user.contact_person_phone || '',
      postal_code: user.postal_code || '',
      remarks: user.remarks || '',
      language_preference: user.language_preference,
      timezone: user.timezone,
    } : {},
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        mobile: user.mobile,
        employee_id: user.employee_id || '',
        designation: user.designation || '',
        department: user.department || '',
        address: user.address || '',
        contact_person_name: user.contact_person_name || '',
        contact_person_phone: user.contact_person_phone || '',
        postal_code: user.postal_code || '',
        remarks: user.remarks || '',
        language_preference: user.language_preference,
        timezone: user.timezone,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and preferences
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            icon={<Edit3 className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h3>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {user.user_type.replace('_', ' ').toUpperCase()}
              </div>
              {user.employee_id && (
                <p className="text-sm text-gray-500 mt-2">Employee ID: {user.employee_id}</p>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Joined {formatDate(user.date_joined)}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{user.timezone}</span>
              </div>
              {user.last_login && (
                <div className="flex items-center space-x-3 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Last login {formatDate(user.last_login)}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(true)}
                className="w-full"
                icon={<CreditCard className="w-4 h-4" />}
              >
                Change Password
              </Button>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language Preference
                  </label>
                  <select
                    {...register('language_preference')}
                    disabled={!isEditing || isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <option value="en">English</option>
                    <option value="bn">Bengali</option>
                  </select>
                  {errors.language_preference && (
                    <p className="text-sm text-red-600 mt-1">{errors.language_preference.message}</p>
                  )}
                </div>

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
                  label="Contact Person Name"
                  {...register('contact_person_name')}
                  error={errors.contact_person_name?.message}
                  disabled={!isEditing || isSubmitting}
                />

                <Input
                  label="Contact Person Phone"
                  {...register('contact_person_phone')}
                  error={errors.contact_person_phone?.message}
                  disabled={!isEditing || isSubmitting}
                />

                <Input
                  label="Postal Code"
                  {...register('postal_code')}
                  error={errors.postal_code?.message}
                  disabled={!isEditing || isSubmitting}
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <textarea
                    {...register('remarks')}
                    disabled={!isEditing || isSubmitting}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="Additional notes..."
                  />
                  {errors.remarks && (
                    <p className="text-sm text-red-600 mt-1">{errors.remarks.message}</p>
                  )}
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>

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