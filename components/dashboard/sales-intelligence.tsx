'use client'

import { useQuery } from '@tanstack/react-query'
import { getRecentAnalyses } from '@/lib/api/analytics'
import { TrendingUp, AlertCircle, Target, Zap, Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SalesIntelligence() {
  const { data: analyses, isLoading, error } = useQuery({
    queryKey: ['sales-intelligence'],
    queryFn: getRecentAnalyses,
    refetchInterval: 30000, // 30초마다 새로고침
  })

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>세일즈 인텔리전스를 불러오는 중 오류가 발생했습니다.</span>
        </div>
      </div>
    )
  }

  // 우선순위별로 정렬 (good > average > bad)
  const prioritizedLeads = analyses?.sort((a, b) => {
    const priorityOrder = { good: 0, average: 1, bad: 2 }
    return priorityOrder[a.timing as keyof typeof priorityOrder] - priorityOrder[b.timing as keyof typeof priorityOrder]
  }).slice(0, 4) || []

  const hotLeads = prioritizedLeads.filter(lead => lead.timing === 'good' && lead.status === 'completed')
  const inProgress = prioritizedLeads.filter(lead => lead.status === 'processing')

  if (prioritizedLeads.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
        <div className="text-gray-500">
          <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <h3 className="font-medium text-gray-900 mb-2">세일즈 인텔리전스 대기중</h3>
          <p className="text-sm">타겟 기업을 추가하면 AI 분석 결과를 확인할 수 있습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">세일즈 인텔리전스</h3>
          </div>
          <a 
            href="/analytics" 
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>전체 보기</span>
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Hot Leads 섹션 */}
        {hotLeads.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h4 className="font-medium text-green-700">🔥 지금 컨택하세요!</h4>
            </div>
            <div className="space-y-2">
              {hotLeads.map((lead) => (
                <div key={lead.id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-green-900">{lead.companyName}</h5>
                      <p className="text-xs text-green-700">{lead.industry}</p>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        최적 타이밍
                      </div>
                    </div>
                  </div>
                  {lead.summary && (
                    <p className="text-sm text-green-800 mt-2 line-clamp-2">
                      💡 {lead.summary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 분석 진행중 섹션 */}
        {inProgress.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h4 className="font-medium text-blue-700">📊 분석 진행중</h4>
            </div>
            <div className="space-y-2">
              {inProgress.map((lead) => (
                <div key={lead.id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <h5 className="font-medium text-blue-900">{lead.companyName}</h5>
                      <p className="text-xs text-blue-700">{lead.industry}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-xs">AI 분석중</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 기타 리드 섹션 */}
        {prioritizedLeads.filter(lead => lead.status === 'completed' && lead.timing !== 'good').length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <h4 className="font-medium text-gray-700">📋 기타 리드</h4>
            </div>
            <div className="space-y-2">
              {prioritizedLeads
                .filter(lead => lead.status === 'completed' && lead.timing !== 'good')
                .map((lead) => (
                  <div key={lead.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">{lead.companyName}</h5>
                        <p className="text-xs text-gray-600">{lead.industry}</p>
                      </div>
                      <div className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        lead.timing === 'average' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      )}>
                        {lead.timing === 'average' ? '보통' : '대기'}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        {hotLeads.length > 0 && (
          <div className="pt-3 border-t">
            <a 
              href="/analytics"
              className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              모든 리드 관리하기
            </a>
          </div>
        )}
      </div>
    </div>
  )
} 