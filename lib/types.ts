// ==========================================
// Pipey SaaS Platform Types
// 고객사 정보 기반 AI 잠재고객 발굴 플랫폼
// ==========================================

export interface User {
  id: string
  email: string
  name: string
  role: string
  subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise'
  api_credits: number
  is_active: boolean
  email_verified: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

// 고객사 정보 (사용자의 회사)
export interface ClientCompany {
  id: string
  user_id: string
  company_name: string
  industry: string
  company_size: 'startup' | 'small' | 'medium' | 'large'
  website?: string
  description: string
  target_market: string
  products_services: {
    main_product: string
    key_features: string[]
    pricing_model: string
  }
  value_proposition: string
  ideal_customer_profile: {
    company_size: string
    industry: string[]
    pain_points: string[]
    budget_range?: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

// 잠재고객 발굴 작업
export interface DiscoveryJob {
  id: string
  client_company_id: string
  user_id: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  job_type: 'full_discovery' | 'incremental' | 'refresh'
  search_criteria: {
    industries: string[]
    company_sizes: string[]
    locations: string[]
    employee_range: [number, number]
    technologies?: string[]
    funding_stage?: string[]
    growth_signals?: string[]
  }
  progress: number // 0-100
  current_task?: string
  total_prospects_found: number
  qualified_prospects: number
  error_message?: string
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

// 발굴된 잠재고객
export interface Prospect {
  id: string
  discovery_job_id: string
  client_company_id: string
  user_id: string
  company_name: string
  domain?: string
  industry: string
  company_size: string
  location: string
  employee_count?: number
  annual_revenue?: number
  technologies?: string[]
  recent_funding?: {
    round: string
    amount: string
    date: string
    investors: string[]
  }
  key_personnel?: {
    [role: string]: {
      name: string
      title: string
      linkedin?: string
      email?: string
    }
  }
  qualification_score: number // 0-100
  data_sources?: string[]
  status: 'discovered' | 'qualified' | 'contacted' | 'responded' | 'converted'
  created_at: string
  updated_at: string
}

// AI 생성 세일즈 인텔리전스
export interface SalesIntelligence {
  id: string
  prospect_id: string
  client_company_id: string
  user_id: string
  match_score: number // 0-100
  priority_level: 'low' | 'medium' | 'high' | 'critical'
  contact_timing: 'immediate' | 'this_week' | 'this_month' | 'next_quarter'
  pain_points: string[]
  value_props: string[]
  decision_makers: {
    primary?: {
      name: string
      title: string
      linkedin?: string
      contact_priority: 'high' | 'medium' | 'low'
    }
    secondary?: {
      name: string
      title: string
      linkedin?: string
      contact_priority: 'high' | 'medium' | 'low'
    }
  }
  recommended_approach: string
  conversation_starters: string[]
  objection_handling?: {
    [objection: string]: string
  }
  recent_triggers: string[]
  competitive_landscape?: {
    current_solutions?: string[]
    switching_probability?: number
    decision_timeline?: string
  }
  ai_confidence: number // 0-1
  generated_at: string
  created_at: string
}

// 이메일 생성 및 발송
export interface Email {
  id: string
  intelligence_id: string
  prospect_id: string
  user_id: string
  message_type: 'cold_email' | 'linkedin_message' | 'follow_up'
  subject?: string
  content: string
  tone: 'professional' | 'friendly' | 'consultative'
  personalization_elements: string[]
  confidence_score: number // 0-1
  estimated_response_rate: string
  status: 'draft' | 'sent' | 'opened' | 'replied' | 'bounced'
  sent_at?: string
  opened_at?: string
  replied_at?: string
  recipient_email?: string
  sender_email?: string
  tracking_id?: string
  created_at: string
}

// 뉴스 및 트리거 이벤트
export interface NewsItem {
  id: string
  prospect_id: string
  company_name: string
  title: string
  content?: string
  url?: string
  source: string
  published_at: string
  relevance_score: number // 0-1
  sentiment: 'positive' | 'negative' | 'neutral'
  trigger_type: 'funding' | 'hiring' | 'product_launch' | 'acquisition' | 'executive_change' | 'expansion' | 'partnership'
  keywords?: string[]
  created_at: string
}

// 컨택 시도 이력
export interface ContactAttempt {
  id: string
  prospect_id: string
  user_id: string
  email_id?: string
  attempt_type: 'email' | 'linkedin' | 'phone' | 'meeting'
  status: 'sent' | 'opened' | 'replied' | 'meeting_booked' | 'no_response'
  response_content?: string
  follow_up_needed: boolean
  follow_up_date?: string
  notes?: string
  created_at: string
}

// 대시보드 통계
export interface DashboardStats {
  total_prospects: number
  qualified_prospects: number
  hot_leads: number
  contacted_prospects: number
  responded_prospects: number
  conversion_rate: number
  average_response_rate: number
  active_discovery_jobs: number
}

// API 응답 타입들
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

// 필터 및 정렬 옵션
export interface ProspectFilters {
  match_score_min?: number
  priority_level?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'discovered' | 'qualified' | 'contacted' | 'responded' | 'converted'
  industry?: string
  company_size?: string
  contact_timing?: 'immediate' | 'this_week' | 'this_month' | 'next_quarter'
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// 액션 상태 (폼 처리용)
export interface ActionState {
  success: boolean
  message: string
  data?: any
  errors?: Record<string, string[]>
}

// 뉴스 크롤링 API 응답
export interface CrawlNewsResponse {
  taskId: string
  message: string
  status: 'started' | 'in_progress' | 'completed' | 'failed'
}

// 유틸리티 타입들
export type ProspectWithIntelligence = Prospect & {
  intelligence?: SalesIntelligence
  recent_news?: NewsItem[]
}

export type IntelligenceWithProspect = SalesIntelligence & {
  prospect: Prospect
}

export type DiscoveryJobWithProgress = DiscoveryJob & {
  client_company: ClientCompany
  prospects_preview?: Prospect[]
} 