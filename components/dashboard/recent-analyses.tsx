'use client'

import { useQuery } from '@tanstack/react-query'
import { getRecentAnalyses } from '@/lib/api/analytics'
import { Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RecentAnalyses() {
  const { data: analyses, isLoading, error } = useQuery({
    queryKey: ['recent-analyses'],
    queryFn: getRecentAnalyses,
    refetchInterval: 30000, // 30초마다 새로고침
  })

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>데이터를 불러오는 중 오류가 발생했습니다.</span>
        </div>
      </div>
    )
  }

  if (!analyses || analyses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
        <div className="text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>아직 분석된 기업이 없습니다.</p>
          <p className="text-sm">기업을 등록하여 분석을 시작해보세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">최근 분석 결과</h3>
      </div>
      <div className="divide-y">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{analysis.companyName}</h4>
                <p className="text-sm text-gray-600 mt-1">{analysis.industry}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(analysis.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    analysis.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : analysis.status === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  )}>
                    {analysis.status === 'completed' ? '완료' : 
                     analysis.status === 'processing' ? '처리중' : '대기중'}
                  </span>
                </div>
              </div>
              {analysis.status === 'completed' && (
                <div className="text-right">
                  <div className={cn(
                    'text-sm font-medium',
                    analysis.timing === 'good' ? 'text-green-600' :
                    analysis.timing === 'average' ? 'text-yellow-600' : 'text-red-600'
                  )}>
                    {analysis.timing === 'good' ? '좋음' :
                     analysis.timing === 'average' ? '보통' : '나쁨'}
                  </div>
                  <div className="text-xs text-gray-500">
                    뉴스 {analysis.newsCount}건
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 