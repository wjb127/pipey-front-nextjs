import { Analysis, AnalyzeNewsResponse } from '@/lib/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function getRecentAnalyses(): Promise<Analysis[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyses/recent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.analyses || []
  } catch (error) {
    console.error('최근 분석 데이터 조회 실패:', error)
    
    // 백엔드가 없는 상태에서 Mock data 반환
    return [
      {
        id: 'mock-1',
        companyId: 'company-1',
        companyName: '삼성전자',
        industry: 'IT',
        status: 'completed',
        timing: 'good',
        summary: '삼성전자의 새로운 반도체 기술 발표로 긍정적인 뉴스가 많습니다.',
        newsCount: 15,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'mock-2',
        companyId: 'company-2',
        companyName: '현대자동차',
        industry: '자동차',
        status: 'processing',
        timing: 'average',
        summary: '',
        newsCount: 0,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'mock-3',
        companyId: 'company-3',
        companyName: 'LG화학',
        industry: '화학',
        status: 'completed',
        timing: 'bad',
        summary: '최근 환경 이슈로 인해 부정적인 뉴스가 증가했습니다.',
        newsCount: 8,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }
}

export async function getAnalysisById(id: string): Promise<Analysis | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyses/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.analysis
  } catch (error) {
    console.error('분석 데이터 조회 실패:', error)
    return null
  }
}

export async function analyzeCompanyNews(companyId: string): Promise<AnalyzeNewsResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_id: companyId,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('뉴스 분석 요청 실패:', error)
    return null
  }
} 