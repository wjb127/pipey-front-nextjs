'use client'

import { useQuery } from '@tanstack/react-query'
import { getRecentAnalyses } from '@/lib/api/analytics'
import { Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RecentActivities() {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: getRecentAnalyses,
  })

  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'processing':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getActivityText = (analysis: any) => {
    switch (analysis.status) {
      case 'completed':
        return `${analysis.companyName} 분석이 완료되었습니다`
      case 'processing':
        return `${analysis.companyName} 분석이 진행 중입니다`
      case 'failed':
        return `${analysis.companyName} 분석이 실패했습니다`
      default:
        return `${analysis.companyName} 분석이 대기 중입니다`
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="w-16 h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const recentActivities = analyses?.slice(0, 5) || []

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">최근 활동</h3>
      </div>
      
      <div className="p-4">
        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>최근 활동이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((analysis) => (
              <div key={analysis.id} className="flex items-start space-x-3">
                <div className="mt-1">
                  {getActivityIcon(analysis.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    {getActivityText(analysis)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(analysis.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                {analysis.status === 'completed' && analysis.timing && (
                  <div className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    analysis.timing === 'good' 
                      ? 'bg-green-100 text-green-800'
                      : analysis.timing === 'average'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  )}>
                    {analysis.timing === 'good' ? '좋음' :
                     analysis.timing === 'average' ? '보통' : '나쁨'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 