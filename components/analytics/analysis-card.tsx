'use client'

import { Analysis } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Clock, Building2, TrendingUp, TrendingDown, Minus, Mail } from 'lucide-react'
import { GenerateEmailButton } from '@/components/email/generate-email-button'

interface AnalysisCardProps {
  analysis: Analysis
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const getTimingIcon = (timing: string) => {
    switch (timing) {
      case 'good':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'bad':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-yellow-600" />
    }
  }

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'bad':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
  }

  const getTimingText = (timing: string) => {
    switch (timing) {
      case 'good':
        return '좋음'
      case 'bad':
        return '나쁨'
      default:
        return '보통'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료'
      case 'processing':
        return '처리중'
      case 'failed':
        return '실패'
      default:
        return '대기중'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">{analysis.companyName}</h3>
          </div>
          <span className={cn(
            'text-xs px-2 py-1 rounded-full',
            analysis.status === 'completed' 
              ? 'bg-green-100 text-green-800'
              : analysis.status === 'processing'
              ? 'bg-blue-100 text-blue-800'
              : analysis.status === 'failed'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          )}>
            {getStatusText(analysis.status)}
          </span>
        </div>

        {analysis.industry && (
          <p className="text-sm text-gray-600 mb-3">{analysis.industry}</p>
        )}

        {analysis.status === 'completed' && (
          <>
            <div className={cn(
              'inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border mb-4',
              getTimingColor(analysis.timing)
            )}>
              {getTimingIcon(analysis.timing)}
              <span>컨택 타이밍: {getTimingText(analysis.timing)}</span>
            </div>

            {analysis.summary && (
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {analysis.summary}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>뉴스 {analysis.newsCount}건 분석</span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(analysis.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>

            {analysis.timing === 'good' && (
              <GenerateEmailButton 
                companyName={analysis.companyName}
                analysisId={analysis.id}
                className="w-full"
              />
            )}
          </>
        )}

        {analysis.status === 'processing' && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">뉴스 분석 중...</span>
          </div>
        )}

        {analysis.status === 'failed' && (
          <div className="text-sm text-red-600">
            분석 중 오류가 발생했습니다. 다시 시도해주세요.
          </div>
        )}
      </div>
    </div>
  )
} 