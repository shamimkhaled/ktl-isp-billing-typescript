import { useState, useEffect } from 'react';
import { organizationService } from '../services/organization.service';
import type { Organization } from '../types/user.types';

export const useOrganization = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await organizationService.getOrganizations();
      if (response.results && response.results.length > 0) {
        setOrganization(response.results[0]);
      } else {
        // Fallback for development - create mock organization
        setOrganization(getMockOrganization());
      }
    } catch (error: any) {
      console.warn('Failed to load organization from API, using mock data:', error);
      // Fallback for development - use mock data
      setOrganization(getMockOrganization());
      setError('Using demo organization data - API not available');
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
    logo_img: 'https://via.placeholder.com/64x64/3B82F6/FFFFFF?text=KTL',
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

  return {
    organization,
    loading,
    error,
    refetch: loadOrganization,
  };
};