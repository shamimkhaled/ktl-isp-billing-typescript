


// Location Types
export interface District {
  id: string;
  name: string;
  name_bn?: string;
  code: string;
  is_active: boolean;
  thanas_count: string;
}

export interface Thana {
  id: string;
  name: string;
  name_bn?: string;
  code: string;
  district: string;
  district_name: string;
  district_code: string;
  is_active: boolean;
}

// Role Types
export interface Role {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  role_level: number;
  is_active: boolean;
  is_system_role: boolean;
  can_assign_roles: boolean;
  max_assignments?: number;
  permissions: Permission[];
  permission_ids: number[];
  users_count: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  role: string;
  role_name: string;
  is_active: boolean;
  assigned_by: string;
  assigned_by_name: string;
  assigned_at: string;
  expires_at?: string;
  assignment_reason?: string;
  created_at: string;
}

export interface Permission {
  id: number;
  name: string;
  codename: string;
  content_type: number;
}

export interface CustomPermission {
  id: string;
  codename: string;
  name: string;
  description?: string;
  category?: string;
  category_name?: string;
  is_active: boolean;
  is_system_permission: boolean;
  created_at: string;
  updated_at: string;
}

export interface PermissionCategory {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  icon?: string;
  order: number;
  permissions_count: string;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: number;
  name: string;
  permissions: Permission[];
  permission_ids: number[];
}

// Organization Types
export interface BillingSettings {
  id: string;
  created_at: string;
  updated_at: string;
  max_manual_grace_days: number;
  disable_expiry: boolean;
  default_grace_days: number;
  jump_billing: boolean;
  default_grace_hours: number;
  max_inactive_days: number;
  delete_permanent_disable_secret_from_mikrotik: number;
  organization: string;
}

export interface SyncSettings {
  id: string;
  sync_area_to_mikrotik: boolean;
  sync_address_to_mikrotik: boolean;
  sync_customer_mobile_to_mikrotik: boolean;
  last_sync_status_display?: string;
  sync_frequency_display?: string;
}

export interface Organization {
  id: string;
  billing_settings: BillingSettings;
  sync_settings: SyncSettings;
  created_at: string;
  updated_at: string;
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
  revenue_sharing_enabled: boolean;
  default_reseller_share: string;
  default_sub_reseller_share: string;
  default_ktl_share_with_sub: string;
  default_reseller_share_with_sub: string;
  api_version: string;
  auto_approval_enabled: boolean;
  customer_id_prefix?: string;
  tax_rate?: string;
  vat_rate?: string;
  email_notifications_enabled?: boolean;
  sms_notifications_enabled?: boolean;
  push_notifications_enabled?: boolean;
  is_active?: boolean;
}

// User Interface
export interface User {
  id: string;
  login_id: string;
  email: string;
  name: string;
  mobile: string;
  user_type: 'super_admin' | 'admin' | 'billing_manager' | 'noc_manager' | 'support_staff' | 'reseller_admin' | 'sub_reseller_admin' | 'field_staff' | 'accountant' | 'customer_service' | 'technical_support';
  employee_id?: string;
  designation?: string;
  designation_info?: Designation;
  department?: string;
  department_info?: Department;
  salary?: string;
  date_of_joining?: string;
  date_of_birth?: string;
  address?: string;
  contact_person_name?: string;
  contact_person_phone?: string;
  district?: string;
  district_info?: District;
  thana?: string;
  thana_info?: Thana;
  postal_code?: string;
  remarks?: string;
  is_active: boolean;
  is_staff: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  profile_photo?: string;
  language_preference: 'en' | 'bn';
  timezone: string;
  role?: Role; // Single role object from API
  roles: UserRole[]; // Legacy array of role assignments
  permissions: string;
  last_login?: string;
  date_joined: string;
  access_token?: string;
  refresh_token?: string;
  created_at: string;
  updated_at: string;
}



export interface UserCreate {
  login_id: string;
  email: string;
  password: string;
  password_confirm: string;
  mobile: string;
  user_type: User['user_type'];
  employee_id?: string;
  name: string;
  designation?: string;
  department?: string;
  salary?: string;
  date_of_joining?: string;
  date_of_birth?: string;
  address?: string;
  contact_person_name?: string;
  contact_person_phone?: string;
  district?: string;
  thana?: string;
  postal_code?: string;
  remarks?: string;
  roles?: number[];
}

export interface UserUpdate {
  name?: string;
  mobile?: string;
  employee_id?: string;
  designation?: string;
  department?: string;
  salary?: string;
  date_of_joining?: string;
  date_of_birth?: string;
  address?: string;
  contact_person_name?: string;
  contact_person_phone?: string;
  district?: string;
  thana?: string;
  postal_code?: string;
  remarks?: string;
  profile_photo?: string;
  language_preference?: 'en' | 'bn';
  timezone?: string;
}

// Alias for backward compatibility
export type CreateUserData = UserCreate;
export type UpdateUserData = UserUpdate & { id: string };

export interface UserListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: User[];
}

export interface RoleListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Role[];
}

export interface UserRoleListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: UserRole[];
}

export interface PermissionListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Permission[];
}

export interface CustomPermissionListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: CustomPermission[];
}

export interface PermissionCategoryListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: PermissionCategory[];
}

export interface GroupListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Group[];
}

export interface DistrictListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: District[];
}

export interface ThanaListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Thana[];
}

// Department Types
export interface Department {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DepartmentListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Department[];
}

// Designation Types
export interface Designation {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DesignationListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Designation[];
}
