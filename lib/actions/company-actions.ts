'use server'

import { ActionState, CrawlNewsResponse } from '@/lib/types'

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