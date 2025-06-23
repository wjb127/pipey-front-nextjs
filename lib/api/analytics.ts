import { Analysis, AnalyzeNewsResponse } from '@/lib/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

// Mock 데이터 생성 함수
const generateMockAnalyses = (): Analysis[] => [
  {
    id: 'analysis-1',
    companyId: 'company-1',
    companyName: '삼성전자',
    industry: '전자/반도체',
    status: 'completed',
    timing: 'good',
    summary: '🔥 삼성전자의 최신 AI 반도체 기술 발표와 글로벌 파트너십 확대 소식으로 현재 세일즈 컨택에 최적의 타이밍입니다. 특히 B2B 솔루션 분야에서 새로운 기회가 확대되고 있습니다.',
    newsCount: 23,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'analysis-2',
    companyId: 'company-2',
    companyName: '현대자동차',
    industry: '자동차/모빌리티',
    status: 'completed',
    timing: 'good',
    summary: '현대자동차의 전기차 신모델 출시와 해외 시장 확장 전략 발표로 긍정적인 시장 반응을 보이고 있습니다. 친환경 기술 관련 B2B 협력 기회가 증가하고 있습니다.',
    newsCount: 18,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4시간 전
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전
  },
  {
    id: 'analysis-3',
    companyId: 'company-3',
    companyName: 'LG화학',
    industry: '화학/에너지',
    status: 'processing',
    timing: 'average',
    summary: '',
    newsCount: 0,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30분 전
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'analysis-4',
    companyId: 'company-4',
    companyName: '네이버',
    industry: 'IT/플랫폼',
    status: 'completed',
    timing: 'average',
    summary: '네이버의 글로벌 확장과 AI 기술 투자 소식이 있지만, 최근 규제 이슈로 인해 보통 수준의 컨택 타이밍입니다. 기술 파트너십 관련 접근이 효과적일 것 같습니다.',
    newsCount: 12,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6시간 전
  },
  {
    id: 'analysis-5',
    companyId: 'company-5',
    companyName: 'SK하이닉스',
    industry: '반도체',
    status: 'completed',
    timing: 'bad',
    summary: '최근 메모리 반도체 시장 침체와 관련된 부정적인 뉴스가 많아 현재는 컨택을 피하는 것이 좋겠습니다. 시장 회복 신호가 나타날 때까지 대기 권장합니다.',
    newsCount: 15,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8시간 전
  },
]

export async function getRecentAnalyses(): Promise<Analysis[]> {
  // 개발 환경에서는 mock 데이터를 바로 반환
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_BASE_URL) {
    // API 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 800))
    return generateMockAnalyses()
  }

  // 프로덕션 환경에서 실제 API 호출
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
    // 실패시 mock 데이터 반환
    return generateMockAnalyses()
  }
}

export async function getAnalysisById(id: string): Promise<Analysis | null> {
  // 개발 환경에서는 mock 데이터에서 검색
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_BASE_URL) {
    await new Promise(resolve => setTimeout(resolve, 500))
    const mockAnalyses = generateMockAnalyses()
    return mockAnalyses.find(analysis => analysis.id === id) || null
  }

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
  // 개발 환경에서는 mock 응답 반환
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_BASE_URL) {
    await new Promise(resolve => setTimeout(resolve, 2000)) // 2초 지연 시뮬레이션
    
    return {
      success: true,
      analysisId: `analysis-${Date.now()}`,
      message: 'AI 뉴스 분석이 시작되었습니다. 2-3분 후 결과를 확인할 수 있습니다.',
      estimatedTime: 180 // 3분
    }
  }

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