'use client'

import { useState, useTransition } from 'react'
import { crawlCompanyNews } from '@/lib/actions/company-actions'
import { cn } from '@/lib/utils'

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium',
        'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors duration-200'
      )}
    >
      {pending ? '분석 중...' : '뉴스 분석 시작'}
    </button>
  )
}

export function CompanyRegistration() {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState({
    success: false,
    message: '',
    data: null,
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
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="company-name" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            기업명
          </label>
          <input
            id="company-name"
            name="companyName"
            type="text"
            required
            placeholder="예: 삼성전자, 현대자동차"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label 
            htmlFor="industry" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            업종 (선택사항)
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            placeholder="예: IT, 자동차, 화학"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <SubmitButton pending={isPending} />
      </form>

      {state.message && (
        <div className={cn(
          'mt-4 p-3 rounded-lg',
          state.success 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        )}>
          {state.message}
        </div>
      )}

      {state.success && state.data && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">분석 요청 완료</h3>
          <p className="text-sm text-blue-700">
            작업 ID: {state.data.taskId}
          </p>
          <p className="text-sm text-blue-700">
            결과는 <a href="/analytics" className="underline">분석 결과 페이지</a>에서 확인하실 수 있습니다.
          </p>
        </div>
      )}
    </div>
  )
} 