// ==========================================
// Pipey Sales Intelligence Platform
// TypeScript Type Definitions
// ==========================================

// Base Types
export type UUID = string;
export type ISODateTime = string;

// ==========================================
// Database Table Types
// ==========================================

// Users Table
export interface PipeyUser {
  id: UUID;
  email: string;
  name?: string;
  company_name?: string;
  industry?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

// Companies Table
export interface PipeyCompany {
  id: UUID;
  user_id: UUID;
  name: string;
  industry?: string;
  website?: string;
  description?: string;
  employee_count?: number;
  location?: string;
  status: 'active' | 'inactive' | 'archived';
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

// Analyses Table
export interface PipeyAnalysis {
  id: UUID;
  user_id: UUID;
  company_id: UUID;
  status: 'processing' | 'completed' | 'failed' | 'pending';
  priority_score: number;
  analysis_type: 'sales_intelligence' | 'market_research' | 'competitive_analysis';
  started_at: ISODateTime;
  completed_at?: ISODateTime;
  created_at: ISODateTime;
}

// Sales Intelligence Table
export interface PipeySalesIntelligence {
  id: UUID;
  analysis_id: UUID;
  company_id: UUID;
  priority_score: number;
  contact_timing: 'immediate' | 'this_week' | 'this_month' | 'next_quarter';
  key_insights: Record<string, any>;
  recommended_approach?: string;
  decision_makers: Record<string, any>;
  recent_news_summary?: string;
  contact_recommendations?: string;
  created_at: ISODateTime;
}

// Emails Table
export interface PipeyEmail {
  id: UUID;
  sales_intelligence_id: UUID;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  content: string;
  personalization_data: Record<string, any>;
  status: 'draft' | 'sent' | 'delivered' | 'opened' | 'replied';
  sent_at?: ISODateTime;
  created_at: ISODateTime;
}

// News Items Table
export interface PipeyNewsItem {
  id: UUID;
  company_id: UUID;
  title: string;
  content?: string;
  url?: string;
  published_at?: ISODateTime;
  source?: string;
  relevance_score?: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  created_at: ISODateTime;
}

// Contact Attempts Table
export interface PipeyContactAttempt {
  id: UUID;
  email_id: UUID;
  company_id: UUID;
  contact_method: 'email' | 'phone' | 'linkedin' | 'meeting';
  status: 'attempted' | 'successful' | 'failed' | 'follow_up_needed';
  response_received: boolean;
  notes?: string;
  attempted_at: ISODateTime;
}

// ==========================================
// Enhanced Types with Relations
// ==========================================

// Company with Analysis Info
export interface CompanyWithAnalysis extends PipeyCompany {
  analyses?: PipeyAnalysis[];
  latest_analysis?: PipeyAnalysis;
  sales_intelligence?: PipeySalesIntelligence[];
}

// Sales Intelligence with Company Info
export interface SalesIntelligenceWithCompany extends PipeySalesIntelligence {
  company: PipeyCompany;
  analysis: PipeyAnalysis;
  emails?: PipeyEmail[];
}

// Email with Sales Intelligence Info
export interface EmailWithContext extends PipeyEmail {
  sales_intelligence: PipeySalesIntelligence;
  company: PipeyCompany;
}

// ==========================================
// API Response Types
// ==========================================

// Dashboard Stats
export interface DashboardStats {
  total_companies: number;
  active_analyses: number;
  hot_leads: number;
  emails_sent: number;
  response_rate: number;
}

// Company Registration Request
export interface CompanyRegistrationRequest {
  name: string;
  industry: string;
}

// Analysis Status Response
export interface AnalysisStatusResponse {
  id: UUID;
  company_name: string;
  status: PipeyAnalysis['status'];
  priority_score: number;
  created_at: ISODateTime;
  estimated_completion?: ISODateTime;
}

// Email Generation Request
export interface EmailGenerationRequest {
  sales_intelligence_id: UUID;
  recipient_email: string;
  recipient_name?: string;
  tone?: 'professional' | 'friendly' | 'formal';
  length?: 'short' | 'medium' | 'long';
}

// Email Generation Response
export interface EmailGenerationResponse {
  subject: string;
  content: string;
  personalization_points: string[];
  confidence_score: number;
}

// ==========================================
// Filter and Sort Types
// ==========================================

// Analysis Filter Options
export interface AnalysisFilters {
  status?: PipeyAnalysis['status'][];
  priority_min?: number;
  priority_max?: number;
  industry?: string[];
  date_from?: ISODateTime;
  date_to?: ISODateTime;
}

// Sort Options
export type SortField = 
  | 'priority_score' 
  | 'created_at' 
  | 'company_name' 
  | 'status';

export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

// ==========================================
// Form Types
// ==========================================

// Company Registration Form
export interface CompanyRegistrationForm {
  company_name: string;
  industry: string;
}

// Action State for Forms (React 19)
export interface ActionState<T = any> {
  data?: T;
  error?: string;
  loading: boolean;
}

// ==========================================
// Legacy Types (for backwards compatibility)
// ==========================================

// Original types (keeping for existing components)
export interface Company {
  id: string;
  name: string;
  industry: string;
  status: 'hot' | 'processing' | 'waiting';
  priority: number;
  analysis?: {
    news_relevance: number;
    timing_score: number;
    decision_makers: string[];
    recommended_approach: string;
  };
}

export interface AnalyzeNewsResponse {
  companies: Array<{
    id: string;
    name: string;
    industry: string;
    status: 'hot' | 'processing' | 'waiting';
    priority: number;
    lastAnalysis?: string;
    analysis?: {
      news_relevance: number;
      timing_score: number;
      decision_makers: string[];
      recommended_approach: string;
    };
  }>;
  summary: {
    total: number;
    hot_leads: number;
    processing: number;
    waiting: number;
  };
}

export interface SalesIntelligence {
  id: string;
  company_name: string;
  contact_timing: string;
  priority_score: number;
  key_insights: string[];
  decision_makers: Array<{
    name: string;
    role: string;
    contact_info?: string;
  }>;
  recent_news: string;
  recommended_approach: string;
  contact_recommendations: string[];
}

// ==========================================
// Utility Types
// ==========================================

// Database insert types (without auto-generated fields)
export type InsertPipeyCompany = Omit<PipeyCompany, 'id' | 'created_at' | 'updated_at'>;
export type InsertPipeyAnalysis = Omit<PipeyAnalysis, 'id' | 'created_at'>;
export type InsertPipeyEmail = Omit<PipeyEmail, 'id' | 'created_at'>;

// Update types (partial with required id)
export type UpdatePipeyCompany = Partial<PipeyCompany> & { id: UUID };
export type UpdatePipeyAnalysis = Partial<PipeyAnalysis> & { id: UUID };
export type UpdatePipeyEmail = Partial<PipeyEmail> & { id: UUID }; 