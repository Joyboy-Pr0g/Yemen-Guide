export interface LoginData { email: string; password: string; turnstile_token?: string }
export interface RegisterData { name: string; email: string; password: string; password_confirmation: string; role: 'trader' | 'visitor'; turnstile_token?: string }

export type Role = 'admin' | 'trader' | 'visitor'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  is_blocked: boolean
  will_delete_at?: string | null
  has_google?: boolean
  email_verified_at?: string | null
  created_at: string
}

export interface CityWithProjects {
  id: number
  name: string
  projects_count: number
}

export interface City {
  id: number
  name: string
  neighborhoods?: Neighborhood[]
}

export interface Neighborhood {
  id: number
  city_id: number
  name: string
}

export interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
  sub_categories?: SubCategory[]
}

export interface SubCategory {
  id: number
  category_id: number
  name: string
  slug: string
  category?: Category
}

export interface ProjectFeaturedImage {
  id: number
  image: string
  sort_order: number
}

export interface AuditProject {
  id: number
  name: string
  slug: string
  image: string | null
  featured_images: ProjectFeaturedImage[]
}

export interface ProjectFormData {
  name: string
  description: string
  address_details: string
  latitude: number | null
  longitude: number | null
  image: string
  logo: string | null
  phone_number: string
  whatsapp_number: string | null
  category_id: number
  sub_category_id: number
  city_id: number
  neighborhood_id: number
}

export interface ProjectRating {
  id: number
  user: {
    id: number
  }
  rating: number
  created_at: string
}
export interface ProjectReport {
  id: number
  user_id: number
  project_id?: number
  report_type: string
  report: string
  status?: ReportStatus
  user?: User
  project?: Project
  created_at: string
  updated_at?: string
}

export type ReportStatus = 'pending' | 'reviewed' | 'dismissed'

export type ReportType = 'sensitive_content' | 'inappropriate_image' | 'wrong_content' | 'different_entity'

export interface ReportFilters {
  status?: string
  report_type?: string
}
export interface Project {
  id: number
  name: string
  slug: string
  description: string
  address_details: string
  latitude: number | null
  longitude: number | null
  image: string
  logo: string | null
  phone_number: string
  whatsapp_number: string | null
  status: 'public' | 'draft'
  admin_approval_status?: AdminApprovalStatus
  admin_rejection_reason?: string | null
  admin_message?: string | null
  is_verified: boolean
  is_featured: boolean
  featured_until: string | null
  views_count: number
  average_rating: number
  is_favorite: boolean
  ratings: ProjectRating[]
  user_rating: number | null
  city?: City
  neighborhood?: Neighborhood
  sub_category?: SubCategory
  trader?: User
  featured_images?: ProjectFeaturedImage[]
  reports?: ProjectReport[]
  created_at: string
}

export interface ProjectFilters {
  status?: string
  admin_approval_status?: string
  featured?: string
  city_id?: string
  neighborhood_id?: string
  sub_category_id?: string
  category_id?: string
  trader_id?: string
  verified?: string
}

export interface Ad {
  id: number
  title: string
  image: string
  link_url: string | null
  position: 'home_page' | 'under_search' | 'sidebar' | 'footer'
  grid_cols: number
  end_date: string
  is_active: boolean
}

export interface VerificationApplication {
  id: number
  status: 'pending' | 'approved' | 'rejected' | 're_approve_requested'
  reason_for_verification: string
  admin_notes: string | null
  identity_file: string
  ownership_file: string
  user?: User
  project?: Project
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  site_name: string
  site_description: string
  meta_keywords: string
  logo: string
  contact_email: string | null
  facebook_url: string | null
  instagram_url: string | null
  whatsapp_support: string | null
}

export interface PaginatedMeta {
  current_page: number
  last_page: number
  hasMorePages: boolean
  total: number
  personalized?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginatedMeta
}

export interface TraderStats {
  total_projects: number
  public_projects: number
  draft_projects: number
  total_views: number
  total_ratings: number
}

export interface AdminStats {
  total_visitors: number
  total_traders: number
  active_listings: number
  total_views: number
}

export type ProjectStatus = 'public' | 'draft'
export type AdminApprovalStatus ='approved' | 'rejected' | 'pending'
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 're_approve_requested'
export type VerificationAction = 'approve' | 'reject' | 're_approve_requested'
export type AdPosition = 'home_page' | 'under_search' | 'sidebar' | 'footer'
