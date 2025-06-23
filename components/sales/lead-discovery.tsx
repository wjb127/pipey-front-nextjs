'use client'

import { useState, useTransition } from 'react'
import { crawlCompanyNews } from '@/lib/actions/company-actions'
import { ActionState } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Building, Target, Search, Sparkles } from 'lucide-react'

function DiscoveryButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium',
        'hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200 shadow-lg hover:shadow-xl'
      )}
    >
      <div className="flex items-center justify-center space-x-2">
        {pending ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            <span>AI 분석 중...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            <span>세일즈 인텔리전스 생성</span>
          </>
        )}
      </div>
    </button>
  )
}

export function LeadDiscovery() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<ActionState>({
    success: false,
    message: '',
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    startTransition(async () => {
      const result = await crawlCompanyNews(state, formData)
      setState(result)
    })
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <Search className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">타겟 기업 추가</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="company-name" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <Building className="inline h-4 w-4 mr-1" />
            기업명 / 브랜드명
          </label>
          <input
            id="company-name"
            name="companyName"
            type="text"
            required
            placeholder="예: 삼성전자, 카카오, 배달의민족"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">
            💡 정확한 기업명을 입력할수록 더 정밀한 분석이 가능합니다
          </p>
        </div>

        <div>
          <label 
            htmlFor="industry" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <Target className="inline h-4 w-4 mr-1" />
            업종 / 비즈니스 분야 (선택)
          </label>
          <select
            id="industry"
            name="industry"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="">업종 선택 (선택사항)</option>
            <option value="IT/소프트웨어">IT/소프트웨어</option>
            <option value="전자/반도체">전자/반도체</option>
            <option value="자동차">자동차</option>
            <option value="화학/바이오">화학/바이오</option>
            <option value="금융/핀테크">금융/핀테크</option>
            <option value="커머스/리테일">커머스/리테일</option>
            <option value="미디어/콘텐츠">미디어/콘텐츠</option>
            <option value="제조업">제조업</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">AI가 분석할 내용</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 최근 뉴스 & 언론 보도 모니터링</li>
                <li>• 비즈니스 동향 & 성장 신호 감지</li>
                <li>• 최적 컨택 타이밍 판단</li>
                <li>• 개인화 세일즈 메시지 생성</li>
              </ul>
            </div>
          </div>
        </div>

        <DiscoveryButton pending={isPending} />
      </form>

      {state.message && (
        <div className={cn(
          'mt-6 p-4 rounded-lg border',
          state.success 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        )}>
          <div className="flex items-start space-x-2">
            {state.success ? (
              <Target className="h-5 w-5 mt-0.5" />
            ) : (
              <div className="h-5 w-5 rounded-full bg-current mt-0.5" />
            )}
            <div>
              <p className="font-medium">{state.message}</p>
              {state.success && state.data && (
                <div className="mt-2 text-sm">
                  <p>분석 작업 ID: <code className="bg-green-100 px-2 py-1 rounded">{state.data.taskId}</code></p>
                  <p className="mt-1">
                    결과는 <a href="/analytics" className="underline hover:no-underline">세일즈 인텔리전스 페이지</a>에서 확인하세요
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 