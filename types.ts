export interface CategoryWithSizes {
  category_id: number
  name: string
  name_en: string | null
  icon: string | null
  default_weight_kg: number | null
  default_volume_m3: number | null
  is_active: boolean
  display_order: number | null
}

export interface ItemCandidate {
  id: string
  name: string
  category_id: number | null
  category_name: string | null
  size: "S" | "M" | "L" | null
  weight_kg: number | null
  dimensions: any | null
  quantity: number
  is_fragile: boolean
  requires_disassembly: boolean
  requires_packaging: boolean
  source: string
  confidence: number | null
  image_url: string | null
  notes: string | null
  metadata: any | null
}

export interface BookingEvidence {
  evidenceId: number
  bookingId: number
  uploadedByUserId: number
  uploaderName?: string
  uploaderRole?: string
  evidenceType: string
  fileType: string
  fileUrl: string
  fileName: string
  mimeType?: string
  fileSizeBytes?: number
  description?: string
  uploadedAt: string
}

export type DisputeStatus = 
  | "PENDING" 
  | "UNDER_REVIEW" 
  | "RESOLVED" 
  | "REJECTED" 
  | "ESCALATED"

export type DisputeType = 
  | "PRICING_DISPUTE" 
  | "DAMAGE_CLAIM" 
  | "SERVICE_QUALITY" 
  | "DELIVERY_ISSUE" 
  | "PAYMENT_ISSUE" 
  | "OTHER"

export interface Dispute {
  disputeId: number
  bookingId: number
  status: DisputeStatus
  disputeType: string
  title: string
  description: string
  requestedResolution?: string
  filedByUserName: string
  filedByUserRole: string
  createdAt: string
  updatedAt: string
  messageCount: number
  evidenceCount: number
  resolutionNotes?: string
  resolvedByUserName?: string
  resolvedAt?: string
}

export interface DisputeMessage {
  messageId: number
  disputeId: number
  senderUserId: number
  senderName: string
  senderRole: string
  messageText: string
  createdAt: string
}

export interface CounterOffer {
  counterOfferId: number
  quotationId: number
  originalPrice: number
  offeredPrice: number
  priceDifference: number
  percentageChange: number
  reason?: string
  message?: string
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "SUPERSEDED"
  offeredByUserName: string
  createdAt: string
  expiresAt: string
  isExpired: boolean
  hoursUntilExpiration?: number
  canRespond: boolean
  respondedAt?: string
  respondedByUserName?: string
  responseMessage?: string
}

export type BookingStatus =
  | "PENDING"
  | "QUOTED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CONFIRMED_BY_CUSTOMER"
  | "REVIEWED"
  | "CANCELLED"

export type ExceptionPriority = "URGENT" | "HIGH" | "MEDIUM" | "LOW"
export type ExceptionStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED"

export interface ExceptionWithDetails {
  exception_id: number
  title: string
  type: string
  description: string
  status: ExceptionStatus
  priority: ExceptionPriority
  resolution_notes?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  resolved_by_name?: string
  assigned_to_name?: string
  metadata?: any
  incident_id?: number
  booking_info?: {
    booking_id: number
    customer_name: string
    transport_name?: string
    pickup_location: string
    delivery_location: string
  }
}

export interface AdminDashboardStats {
  total_users: number
  total_customers: number
  total_transports: number
  active_users: number
  inactive_users: number
  verified_users: number
  new_users_today: number
  new_users_this_week: number
  new_users_this_month: number
  user_growth_rate: number
  pending_transport_verifications: number
  top_transports: Array<{
    transport_id: number
    company_name: string
    average_rating: number
    completed_bookings: number
  }>
}

export interface User {
  user_id: number
  email: string
  full_name: string
  role: "CUSTOMER" | "TRANSPORT" | "MANAGER"
  avatar_url?: string | null
  phone?: string | null
}

export interface Transport {
  transport_id: number
  company_name: string
  verification_status: "PENDING" | "APPROVED" | "REJECTED"
  business_license_number?: string
  tax_code?: string
  phone?: string
  address?: string
  district?: string
  city?: string
  national_id_type?: string
  national_id_number?: string
  bank_account_number?: string
  bank_code?: string
  bank_account_holder?: string
  verified_at?: string
}

export interface ScanSessionWithCustomer {
  session_id: number
  customer_name: string
  customer_email: string
  customer_avatar: string | null
  image_count: number
  average_confidence: number | null
  items?: any[]
  created_at: string
  status: string
  forced_quote_price?: number | null
  image_urls: string[]
  estimated_price?: number | null
}

export interface Notification {
  notification_id: number
  user_id: number
  type: string
  title: string
  message: string
  booking_id: number | null
  quotation_id: number | null
  review_id: number | null
  data: any
  is_read: boolean
  read_at: string | null
  action_url: string | null
  created_at: string
  expires_at: string | null
}
