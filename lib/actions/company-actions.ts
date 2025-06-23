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

  try {
    // FastAPI 백엔드에 요청 (미구현 상태이므로 mock response)
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
    
    // 백엔드가 없는 상태에서 Mock response 반환
    if (error instanceof Error && error.message.includes('fetch')) {
      return {
        success: true,
        message: `${companyName}의 뉴스 분석이 시작되었습니다. (개발 모드)`,
        data: {
          taskId: `mock-task-${Date.now()}`,
          companyName,
          industry,
        },
      }
    }

    return {
      success: false,
      message: '뉴스 크롤링 요청 중 오류가 발생했습니다.',
      data: null,
    }
  }
} 