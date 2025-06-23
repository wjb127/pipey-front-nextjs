'use client'

import { useQuery } from '@tanstack/react-query'
import { getRecentAnalyses } from '@/lib/api/analytics'
import { Building2, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CompanyList() {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['company-list'],
    queryFn: getRecentAnalyses,
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const companies = analyses || []

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">등록된 기업</h3>
      </div>
      
      <div className="divide-y">
        {companies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>등록된 기업이 없습니다</p>
          </div>
        ) : (
          companies.map((analysis) => (
            <div key={analysis.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{analysis.companyName}</h4>
                    <p className="text-sm text-gray-500">{analysis.industry || '업종 미지정'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
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
                    {analysis.status === 'completed' ? '완료' :
                     analysis.status === 'processing' ? '진행중' :
                     analysis.status === 'failed' ? '실패' : '대기중'}
                  </span>
                  
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {analysis.status === 'completed' && (
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                  <span>뉴스 {analysis.newsCount}건</span>
                  <span className={cn(
                    'px-2 py-1 rounded text-xs',
                    analysis.timing === 'good' ? 'bg-green-50 text-green-700' :
                    analysis.timing === 'average' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  )}>
                    타이밍: {analysis.timing === 'good' ? '좋음' :
                             analysis.timing === 'average' ? '보통' : '나쁨'}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
} 