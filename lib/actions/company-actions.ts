'use server'

import { ActionState, CrawlNewsResponse, ClientCompany, DiscoveryJob } from '@/lib/types'
import { createDiscoveryJob } from '@/lib/api/analytics'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function crawlCompanyNews(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const companyName = formData.get('companyName') as string
  const industry = formData.get('industry') as string

  if (!companyName?.trim()) {
    return {
      success: false,
      message: '기업명을 입력해주세요.',
      data: null,
    }
  }

  // 개발 환경에서는 mock 응답을 바로 반환
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_API_BASE_URL) {
    // 개발 모드에서 시뮬레이션 지연
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      success: true,
      message: `🚀 ${companyName}의 AI 뉴스 분석이 시작되었습니다! 2-3분 후 세일즈 인텔리전스 결과를 확인하세요.`,
      data: {
        taskId: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        companyName,
        industry,
      },
    }
  }

  // 프로덕션 환경에서만 실제 API 호출
  try {
    const response = await fetch(`${API_BASE_URL}/api/crawl-news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_name: companyName.trim(),
        industry: industry?.trim() || null,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: CrawlNewsResponse = await response.json()

    return {
      success: true,
      message: `${companyName}의 뉴스 크롤링이 시작되었습니다.`,
      data: {
        taskId: data.taskId,
        companyName,
        industry,
      },
    }
  } catch (error) {
    console.error('크롤링 요청 실패:', error)
    
    // 실패 시 mock 응답 반환
    return {
      success: true,
      message: `${companyName}의 뉴스 분석이 시작되었습니다. (Fallback 모드)`,
      data: {
        taskId: `fallback-task-${Date.now()}`,
        companyName,
        industry,
      },
    }
  }
}

// 고객사 등록 액션
export async function registerClientCompany(formData: FormData): Promise<ActionState> {
  try {
    const companyName = formData.get('companyName') as string
    const industry = formData.get('industry') as string
    const description = formData.get('description') as string
    const targetMarket = formData.get('targetMarket') as string
    const mainProduct = formData.get('mainProduct') as string
    const valueProposition = formData.get('valueProposition') as string
    const icpCompanySize = formData.get('icpCompanySize') as string
    const icpIndustries = formData.get('icpIndustries') as string
    const icpPainPoints = formData.get('icpPainPoints') as string

    // 기본 검증
    if (!companyName || !industry || !description) {
      return {
        success: false,
        message: '필수 항목을 모두 입력해주세요.',
        errors: {
          companyName: !companyName ? ['회사명을 입력해주세요.'] : [],
          industry: !industry ? ['업종을 선택해주세요.'] : [],
          description: !description ? ['회사 설명을 입력해주세요.'] : []
        }
      }
    }

    // TODO: 실제 API 호출로 대체
    const clientCompany: ClientCompany = {
      id: `client-${Date.now()}`,
      user_id: 'user-001',
      company_name: companyName,
      industry: industry,
      company_size: 'small', // 기본값
      description: description,
      target_market: targetMarket || '',
      products_services: {
        main_product: mainProduct || '',
        key_features: [],
        pricing_model: ''
      },
      value_proposition: valueProposition || '',
      ideal_customer_profile: {
        company_size: icpCompanySize || '',
        industry: icpIndustries ? icpIndustries.split(',').map(s => s.trim()) : [],
        pain_points: icpPainPoints ? icpPainPoints.split(',').map(s => s.trim()) : []
      },
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // 시뮬레이션: API 지연
    await new Promise(resolve => setTimeout(resolve, 1500))

    return {
      success: true,
      message: '고객사가 성공적으로 등록되었습니다.',
      data: clientCompany
    }
  } catch (error) {
    console.error('고객사 등록 실패:', error)
    return {
      success: false,
      message: '고객사 등록 중 오류가 발생했습니다.'
    }
  }
}

// 잠재고객 발굴 시작 액션
export async function startProspectDiscovery(clientCompanyId: string): Promise<ActionState> {
  try {
    if (!clientCompanyId) {
      return {
        success: false,
        message: '고객사 ID가 필요합니다.'
      }
    }

    // AI 잠재고객 발굴 작업 시작
    const discoveryJob = await createDiscoveryJob(clientCompanyId)

    return {
      success: true,
      message: 'AI 잠재고객 발굴 작업이 시작되었습니다.',
      data: discoveryJob
    }
  } catch (error) {
    console.error('잠재고객 발굴 시작 실패:', error)
    return {
      success: false,
      message: '잠재고객 발굴 시작 중 오류가 발생했습니다.'
    }
  }
}

// 고객사 정보 업데이트 액션
export async function updateClientCompany(
  clientCompanyId: string,
  formData: FormData
): Promise<ActionState> {
  try {
    // TODO: 실제 API 호출로 대체
    await new Promise(resolve => setTimeout(resolve, 1000))

    return {
      success: true,
      message: '고객사 정보가 성공적으로 업데이트되었습니다.'
    }
  } catch (error) {
    console.error('고객사 업데이트 실패:', error)
    return {
      success: false,
      message: '고객사 정보 업데이트 중 오류가 발생했습니다.'
    }
  }
} 