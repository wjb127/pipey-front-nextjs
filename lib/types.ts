// 공통 타입 정의
export interface Company {
  id: string
  name: string
  industry?: string
  createdAt: string
  updatedAt: string
}

export interface NewsArticle {
  id: string
  title: string
  content: string
  url: string
  publishedAt: string
  source: string
  companyId: string
}

export interface Analysis {
  id: string
  companyId: string
  companyName: string
  industry?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  timing: 'good' | 'average' | 'bad'
  summary: string
  newsCount: number
  createdAt: string
  updatedAt: string
  newsArticles?: NewsArticle[]
}

export interface ActionState {
  success: boolean
  message: string
  data?: any
}

export interface CrawlNewsResponse {
  taskId: string
  status: string
  message: string
}

export interface AnalyzeNewsResponse {
  id: string
  summary: string
  timing: 'good' | 'average' | 'bad'
  newsCount: number
  articles: NewsArticle[]
}

export interface GenerateEmailResponse {
  subject: string
  content: string
  timing: string
} 