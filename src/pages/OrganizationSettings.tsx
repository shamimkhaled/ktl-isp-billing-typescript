import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Building,
  Save,
  Settings,
  DollarSign,
  Clock,
  Globe,
  Mail,
  Phone,
} from 'lucide-react';
import { organizationService } from '../services/organization.service';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/helpers';
import type { Organization, BillingSettings, SyncSettings } from '../types/user.types';
import { toast } from 'sonner';

// Organization form validation schemas
const organizationSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  company_code: z.string().min(1, 'Company code is required'),
  business_license: z.string().optional(),
  vat_registration: z.string().optional(),
  address: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  logo_img: z.string().url().optional().or(z.literal('')),
  dark_logo_img: z.string().url().optional().or(z.literal('')),
  lite_logo_img: z.string().url().optional().or(z.literal('')),
  banner_img: z.string().url().optional().or(z.literal('')),
  og_image: z.string().url().optional().or(z.literal('')),
  favicon: z.string().url().optional().or(z.literal('')),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  meta_description: z.string().optional(),
  slug: z.string().optional(),
  organization_type: z.string().min(1, 'Organization type is required'),
  nid_document: z.string().url().optional().or(z.literal('')),
  payment_report: z.string().url().optional().or(z.literal('')),
  invoice_signature: z.string().url().optional().or(z.literal('')),
  card_logo: z.string().url().optional().or(z.literal('')),
  country: z.string().optional(),
  org_timezone: z.string().optional(),
  currency: z.string().optional(),
  customer_id_prefix: z.string().optional(),
  tax_rate: z.string().optional(),
  vat_rate: z.string().optional(),
  email_notifications_enabled: z.boolean().optional(),
  sms_notifications_enabled: z.boolean().optional(),
  push_notifications_enabled: z.boolean().optional(),
  is_active: z.boolean().optional(),
  revenue_sharing_enabled: z.boolean(),
  default_reseller_share: z.string(),
  default_sub_reseller_share: z.string(),
  default_ktl_share_with_sub: z.string(),
  default_reseller_share_with_sub: z.string(),
  api_version: z.string().min(1, 'API version is required'),
  auto_approval_enabled: z.boolean(),
});

const billingSettingsSchema = z.object({
  max_manual_grace_days: z.number().min(0),
  disable_expiry: z.boolean(),
  default_grace_days: z.number().min(0),
  jump_billing: z.boolean(),
  default_grace_hours: z.number().min(0),
  max_inactive_days: z.number().min(0),
  delete_permanent_disable_secret_from_mikrotik: z.number().min(0),
});

const syncSettingsSchema = z.object({
  sync_area_to_mikrotik: z.boolean(),
  sync_address_to_mikrotik: z.boolean(),
  sync_customer_mobile_to_mikrotik: z.boolean(),
});

interface OrganizationFormData {
  company_name: string;
  company_code: string;
  business_license?: string;
  vat_registration?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  logo_img?: string;
  dark_logo_img?: string;
  lite_logo_img?: string;
  banner_img?: string;
  og_image?: string;
  favicon?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  meta_description?: string;
  slug?: string;
  organization_type: string;
  nid_document?: string;
  payment_report?: string;
  invoice_signature?: string;
  card_logo?: string;
  country?: string;
  org_timezone?: string;
  currency?: string;
  customer_id_prefix?: string;
  tax_rate?: string;
  vat_rate?: string;
  email_notifications_enabled?: boolean;
  sms_notifications_enabled?: boolean;
  push_notifications_enabled?: boolean;
  is_active?: boolean;
  revenue_sharing_enabled: boolean;
  default_reseller_share: string;
  default_sub_reseller_share: string;
  default_ktl_share_with_sub: string;
  default_reseller_share_with_sub: string;
  api_version: string;
  auto_approval_enabled: boolean;
}

interface BillingFormData {
  max_manual_grace_days: number;
  disable_expiry: boolean;
  default_grace_days: number;
  jump_billing: boolean;
  default_grace_hours: number;
  max_inactive_days: number;
  delete_permanent_disable_secret_from_mikrotik: number;
}

interface SyncFormData {
  sync_area_to_mikrotik: boolean;
  sync_address_to_mikrotik: boolean;
  sync_customer_mobile_to_mikrotik: boolean;
}

// Organization Form Component
interface OrganizationFormProps {
  organization: Organization;
  onSubmit: (data: OrganizationFormData) => Promise<void>;
  loading?: boolean;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  organization,
  onSubmit,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      company_name: organization.company_name,
      company_code: organization.company_code,
      business_license: organization.business_license || '',
      vat_registration: organization.vat_registration || '',
      address: organization.address || '',
      contact_email: organization.contact_email || '',
      contact_phone: organization.contact_phone || '',
      website: organization.website || '',
      logo_img: organization.logo_img || '',
      dark_logo_img: organization.dark_logo_img || '',
      lite_logo_img: organization.lite_logo_img || '',
      banner_img: organization.banner_img || '',
      og_image: organization.og_image || '',
      favicon: organization.favicon || '',
      seo_title: organization.seo_title || '',
      seo_description: organization.seo_description || '',
      seo_keywords: organization.seo_keywords || '',
      meta_description: organization.meta_description || '',
      slug: organization.slug || '',
      organization_type: organization.organization_type,
      nid_document: organization.nid_document || '',
      payment_report: organization.payment_report || '',
      invoice_signature: organization.invoice_signature || '',
      card_logo: organization.card_logo || '',
      country: organization.country || '',
      org_timezone: organization.org_timezone || '',
      currency: organization.currency || '',
      customer_id_prefix: organization.customer_id_prefix || '',
      tax_rate: organization.tax_rate || '',
      vat_rate: organization.vat_rate || '',
      email_notifications_enabled: organization.email_notifications_enabled || false,
      sms_notifications_enabled: organization.sms_notifications_enabled || false,
      push_notifications_enabled: organization.push_notifications_enabled || false,
      is_active: organization.is_active || false,
      revenue_sharing_enabled: organization.revenue_sharing_enabled,
      default_reseller_share: organization.default_reseller_share,
      default_sub_reseller_share: organization.default_sub_reseller_share,
      default_ktl_share_with_sub: organization.default_ktl_share_with_sub,
      default_reseller_share_with_sub: organization.default_reseller_share_with_sub,
      api_version: organization.api_version,
      auto_approval_enabled: organization.auto_approval_enabled,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Company Name"
          {...register('company_name')}
          error={errors.company_name?.message}
          disabled={loading}
          icon={<Building className="w-4 h-4" />}
        />

        <Input
          label="Company Code"
          {...register('company_code')}
          error={errors.company_code?.message}
          disabled={loading}
        />

        <Input
          label="Business License"
          {...register('business_license')}
          error={errors.business_license?.message}
          disabled={loading}
        />

        <Input
          label="VAT Registration"
          {...register('vat_registration')}
          error={errors.vat_registration?.message}
          disabled={loading}
        />

        <Input
          label="Contact Email"
          type="email"
          {...register('contact_email')}
          error={errors.contact_email?.message}
          disabled={loading}
          icon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Contact Phone"
          {...register('contact_phone')}
          error={errors.contact_phone?.message}
          disabled={loading}
          icon={<Phone className="w-4 h-4" />}
        />

        <Input
          label="Website"
          {...register('website')}
          error={errors.website?.message}
          disabled={loading}
          icon={<Globe className="w-4 h-4" />}
        />

        <Input
          label="Organization Type"
          {...register('organization_type')}
          error={errors.organization_type?.message}
          disabled={loading}
        />

        <Input
          label="Country"
          {...register('country')}
          error={errors.country?.message}
          disabled={loading}
        />

        <Input
          label="Timezone"
          {...register('org_timezone')}
          error={errors.org_timezone?.message}
          disabled={loading}
        />

        <Input
          label="Currency"
          {...register('currency')}
          error={errors.currency?.message}
          disabled={loading}
        />

        <Input
          label="Customer ID Prefix"
          {...register('customer_id_prefix')}
          error={errors.customer_id_prefix?.message}
          disabled={loading}
        />

        <Input
          label="API Version"
          {...register('api_version')}
          error={errors.api_version?.message}
          disabled={loading}
        />

        <Input
          label="Tax Rate (%)"
          {...register('tax_rate')}
          error={errors.tax_rate?.message}
          disabled={loading}
        />

        <Input
          label="VAT Rate (%)"
          {...register('vat_rate')}
          error={errors.vat_rate?.message}
          disabled={loading}
        />

        <Input
          label="SEO Title"
          {...register('seo_title')}
          error={errors.seo_title?.message}
          disabled={loading}
        />

        <Input
          label="SEO Description"
          {...register('seo_description')}
          error={errors.seo_description?.message}
          disabled={loading}
        />

        <Input
          label="SEO Keywords"
          {...register('seo_keywords')}
          error={errors.seo_keywords?.message}
          disabled={loading}
        />

        <Input
          label="Meta Description"
          {...register('meta_description')}
          error={errors.meta_description?.message}
          disabled={loading}
        />

        <Input
          label="Logo Image URL"
          {...register('logo_img')}
          error={errors.logo_img?.message}
          disabled={loading}
          placeholder="https://example.com/logo.png"
        />

        <Input
          label="Dark Logo Image URL"
          {...register('dark_logo_img')}
          error={errors.dark_logo_img?.message}
          disabled={loading}
          placeholder="https://example.com/dark-logo.png"
        />

        <Input
          label="Lite Logo Image URL"
          {...register('lite_logo_img')}
          error={errors.lite_logo_img?.message}
          disabled={loading}
          placeholder="https://example.com/lite-logo.png"
        />

        <Input
          label="Banner Image URL"
          {...register('banner_img')}
          error={errors.banner_img?.message}
          disabled={loading}
          placeholder="https://example.com/banner.png"
        />

        <Input
          label="OG Image URL"
          {...register('og_image')}
          error={errors.og_image?.message}
          disabled={loading}
          placeholder="https://example.com/og-image.png"
        />

        <Input
          label="Favicon URL"
          {...register('favicon')}
          error={errors.favicon?.message}
          disabled={loading}
          placeholder="https://example.com/favicon.ico"
        />

        <Input
          label="NID Document URL"
          {...register('nid_document')}
          error={errors.nid_document?.message}
          disabled={loading}
          placeholder="https://example.com/nid.pdf"
        />

        <Input
          label="Payment Report URL"
          {...register('payment_report')}
          error={errors.payment_report?.message}
          disabled={loading}
          placeholder="https://example.com/payment-report.pdf"
        />

        <Input
          label="Invoice Signature URL"
          {...register('invoice_signature')}
          error={errors.invoice_signature?.message}
          disabled={loading}
          placeholder="https://example.com/signature.png"
        />

        <Input
          label="Card Logo URL"
          {...register('card_logo')}
          error={errors.card_logo?.message}
          disabled={loading}
          placeholder="https://example.com/card-logo.png"
        />

        <div className="md:col-span-2">
          <Input
            label="Address"
            {...register('address')}
            error={errors.address?.message}
            disabled={loading}
          />
        </div>

        <div className="md:col-span-2 flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('email_notifications_enabled')}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Email Notifications Enabled</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('sms_notifications_enabled')}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">SMS Notifications Enabled</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('push_notifications_enabled')}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Push Notifications Enabled</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('is_active')}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Organization Active</span>
          </label>
        </div>

        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('revenue_sharing_enabled')}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Revenue Sharing Enabled</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('auto_approval_enabled')}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Auto Approval Enabled</span>
          </label>
        </div>

        {organization.revenue_sharing_enabled && (
          <>
            <Input
              label="Default Reseller Share (%)"
              {...register('default_reseller_share')}
              error={errors.default_reseller_share?.message}
              disabled={loading}
              icon={<DollarSign className="w-4 h-4" />}
            />

            <Input
              label="Default Sub-Reseller Share (%)"
              {...register('default_sub_reseller_share')}
              error={errors.default_sub_reseller_share?.message}
              disabled={loading}
              icon={<DollarSign className="w-4 h-4" />}
            />

            <Input
              label="Default KTL Share with Sub (%)"
              {...register('default_ktl_share_with_sub')}
              error={errors.default_ktl_share_with_sub?.message}
              disabled={loading}
              icon={<DollarSign className="w-4 h-4" />}
            />

            <Input
              label="Default Reseller Share with Sub (%)"
              {...register('default_reseller_share_with_sub')}
              error={errors.default_reseller_share_with_sub?.message}
              disabled={loading}
              icon={<DollarSign className="w-4 h-4" />}
            />
          </>
        )}
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          icon={<Save className="w-4 h-4" />}
        >
          Save Organization Settings
        </Button>
      </div>
    </form>
  );
};

// Billing Settings Form Component
interface BillingFormProps {
  settings: BillingSettings;
  onSubmit: (data: BillingFormData) => Promise<void>;
  loading?: boolean;
}

const BillingForm: React.FC<BillingFormProps> = ({
  settings,
  onSubmit,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingSettingsSchema),
    defaultValues: {
      max_manual_grace_days: settings.max_manual_grace_days,
      disable_expiry: settings.disable_expiry,
      default_grace_days: settings.default_grace_days,
      jump_billing: settings.jump_billing,
      default_grace_hours: settings.default_grace_hours,
      max_inactive_days: settings.max_inactive_days,
      delete_permanent_disable_secret_from_mikrotik: settings.delete_permanent_disable_secret_from_mikrotik,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Manual Grace Days
          </label>
          <input
            type="number"
            {...register('max_manual_grace_days', { valueAsNumber: true })}
            disabled={loading}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {errors.max_manual_grace_days && (
            <p className="text-sm text-red-600 mt-1">{errors.max_manual_grace_days.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Grace Days
          </label>
          <input
            type="number"
            {...register('default_grace_days', { valueAsNumber: true })}
            disabled={loading}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {errors.default_grace_days && (
            <p className="text-sm text-red-600 mt-1">{errors.default_grace_days.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Grace Hours
          </label>
          <input
            type="number"
            {...register('default_grace_hours', { valueAsNumber: true })}
            disabled={loading}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {errors.default_grace_hours && (
            <p className="text-sm text-red-600 mt-1">{errors.default_grace_hours.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Inactive Days
          </label>
          <input
            type="number"
            {...register('max_inactive_days', { valueAsNumber: true })}
            disabled={loading}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {errors.max_inactive_days && (
            <p className="text-sm text-red-600 mt-1">{errors.max_inactive_days.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delete Permanent Disable Secret from Mikrotik
          </label>
          <input
            type="number"
            {...register('delete_permanent_disable_secret_from_mikrotik', { valueAsNumber: true })}
            disabled={loading}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {errors.delete_permanent_disable_secret_from_mikrotik && (
            <p className="text-sm text-red-600 mt-1">{errors.delete_permanent_disable_secret_from_mikrotik.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('disable_expiry')}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Disable Expiry</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('jump_billing')}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Jump Billing</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          icon={<Save className="w-4 h-4" />}
        >
          Save Billing Settings
        </Button>
      </div>
    </form>
  );
};

// Sync Settings Form Component
interface SyncFormProps {
  settings: SyncSettings;
  onSubmit: (data: SyncFormData) => Promise<void>;
  loading?: boolean;
}

const SyncForm: React.FC<SyncFormProps> = ({
  settings,
  onSubmit,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
  } = useForm<SyncFormData>({
    resolver: zodResolver(syncSettingsSchema),
    defaultValues: {
      sync_area_to_mikrotik: settings.sync_area_to_mikrotik,
      sync_address_to_mikrotik: settings.sync_address_to_mikrotik,
      sync_customer_mobile_to_mikrotik: settings.sync_customer_mobile_to_mikrotik,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('sync_area_to_mikrotik')}
            disabled={loading}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-3 text-sm text-gray-700">Sync Area to Mikrotik</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('sync_address_to_mikrotik')}
            disabled={loading}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-3 text-sm text-gray-700">Sync Address to Mikrotik</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('sync_customer_mobile_to_mikrotik')}
            disabled={loading}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-3 text-sm text-gray-700">Sync Customer Mobile to Mikrotik</span>
        </label>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          icon={<Save className="w-4 h-4" />}
        >
          Save Sync Settings
        </Button>
      </div>
    </form>
  );
};

// Main Organization Settings Component
export const OrganizationSettings: React.FC = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'organization' | 'billing' | 'sync'>('organization');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    try {
      setLoading(true);
      const response = await organizationService.getOrganizations();
      if (response.results && response.results.length > 0) {
        setOrganization(response.results[0]);
      } else {
        // Fallback for development - create mock organization
        setOrganization(getMockOrganization());
      }
    } catch (error: any) {
      console.warn('Failed to load organization settings from API, using mock data:', error);
      // Fallback for development - use mock data
      setOrganization(getMockOrganization());
      toast.error('Using demo organization settings - API not available');
    } finally {
      setLoading(false);
    }
  };

  // Mock organization data for development
  const getMockOrganization = (): Organization => ({
    id: 'demo-org-001',
    company_name: 'KTL ISP Demo Organization',
    company_code: 'KTL001',
    business_license: 'BL123456',
    vat_registration: 'VAT789012',
    address: '123 Demo Street, Demo City',
    contact_email: 'admin@ktl-demo.com',
    contact_phone: '+8801234567890',
    website: 'https://ktl-demo.com',
    logo_img: 'https://ktl-isp-billing-app-qza33.ondigitalocean.app/media/organization_logos/KTL-Logo-for-Shamim-Bhai.png',
    dark_logo_img: 'https://ktl-isp-billing-app-qza33.ondigitalocean.app/media/organization_logos/KTL-Logo-for-Shamim-Bhai_nAKRQ5a.png',
    lite_logo_img: undefined,
    banner_img: undefined,
    og_image: undefined,
    favicon: undefined,
    seo_title: 'KTL ISP Demo Organization',
    seo_description: 'Leading ISP services in Bangladesh',
    seo_keywords: 'ISP, internet, broadband, KTL',
    meta_description: 'Professional ISP management system',
    slug: 'ktl-isp-demo-organization',
    organization_type: 'ISP',
    nid_document: undefined,
    payment_report: undefined,
    invoice_signature: undefined,
    card_logo: undefined,
    country: 'Bangladesh',
    org_timezone: 'Asia/Dhaka',
    currency: 'BDT',
    customer_id_prefix: 'KTL',
    tax_rate: '0.00',
    vat_rate: '0.00',
    email_notifications_enabled: true,
    sms_notifications_enabled: true,
    push_notifications_enabled: true,
    is_active: true,
    revenue_sharing_enabled: true,
    default_reseller_share: '20.00',
    default_sub_reseller_share: '10.00',
    default_ktl_share_with_sub: '5.00',
    default_reseller_share_with_sub: '15.00',
    api_version: 'v1.0',
    auto_approval_enabled: false,
    billing_settings: {
      id: 'billing-demo-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      max_manual_grace_days: 30,
      disable_expiry: false,
      default_grace_days: 7,
      jump_billing: false,
      default_grace_hours: 24,
      max_inactive_days: 90,
      delete_permanent_disable_secret_from_mikrotik: 30,
      organization: 'demo-org-001',
    },
    sync_settings: {
      id: 'sync-demo-001',
      sync_area_to_mikrotik: true,
      sync_address_to_mikrotik: true,
      sync_customer_mobile_to_mikrotik: false,
      last_sync_status_display: 'Pending',
      sync_frequency_display: 'Daily',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const handleUpdateOrganization = async (data: OrganizationFormData) => {
    if (!organization) return;

    setIsSubmitting(true);
    try {
      await organizationService.updateOrganization(organization.id, data);
      await loadOrganization();
      toast.success('Organization settings updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update organization settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBilling = async (data: BillingFormData) => {
    if (!organization) return;

    setIsSubmitting(true);
    try {
      await organizationService.updateOrganization(organization.id, {
        billing_settings: data as any
      });
      await loadOrganization();
      toast.success('Billing settings updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update billing settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSync = async (data: SyncFormData) => {
    if (!organization) return;

    setIsSubmitting(true);
    try {
      await organizationService.updateOrganization(organization.id, {
        sync_settings: data as any
      });
      await loadOrganization();
      toast.success('Sync settings updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update sync settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" message="Loading organization settings..." />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="text-center py-12">
        <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No organization found</h3>
        <p className="text-gray-600">Please contact your administrator.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Organization Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your organization's configuration and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('organization')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'organization'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Organization
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'billing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Billing Settings
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sync'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sync Settings
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'organization' && (
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization Information</h2>
            <p className="text-gray-600">Basic information about your organization</p>
          </div>
          <OrganizationForm
            organization={organization}
            onSubmit={handleUpdateOrganization}
            loading={isSubmitting}
          />
        </Card>
      )}

      {activeTab === 'billing' && (
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Billing Configuration</h2>
            <p className="text-gray-600">Configure billing and payment settings</p>
          </div>
          <BillingForm
            settings={organization.billing_settings}
            onSubmit={handleUpdateBilling}
            loading={isSubmitting}
          />
        </Card>
      )}

      {activeTab === 'sync' && (
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Mikrotik Sync Settings</h2>
            <p className="text-gray-600">Configure data synchronization with Mikrotik</p>
          </div>
          <SyncForm
            settings={organization.sync_settings}
            onSubmit={handleUpdateSync}
            loading={isSubmitting}
          />
        </Card>
      )}

      {/* Organization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Organization Type</p>
              <p className="text-lg font-semibold text-gray-900">{organization.organization_type}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">API Version</p>
              <p className="text-lg font-semibold text-gray-900">{organization.api_version}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(organization.updated_at)}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};