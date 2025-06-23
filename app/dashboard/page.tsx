'use client'

import { useQuery } from '@tanstack/react-query'
import { getRecentAnalyses } from '@/lib/api/analytics'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RecentActivities } from '@/components/dashboard/recent-activities'
import { CompanyList } from '@/components/dashboard/company-list'
import { Building2, TrendingUp, Mail, Clock } from 'lucide-react'

export default function DashboardPage() {
  const { data: analyses } = useQuery({
    queryKey: ['dashboard-analyses'],
    queryFn: getRecentAnalyses,
    refetchInterval: 30000,
  })

  const completedAnalyses = analyses?.filter(a => a.status === 'completed') || []
  const goodTimingCount = completedAnalyses.filter(a => a.timing === 'good').length
  const totalNewsCount = completedAnalyses.reduce((sum, a) => sum + a.newsCount, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">
          전체 분석 현황과 최근 활동을 확인하세요
        </p>
      </div>

      {/* 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="등록된 기업"
          value={analyses?.length || 0}
          icon={<Building2 className="h-5 w-5" />}
          description="전체 등록된 기업 수"
          trend={{
            value: 12,
            isPositive: true
          }}
        />
        <StatsCard
          title="완료된 분석"
          value={completedAnalyses.length}
          icon={<TrendingUp className="h-5 w-5" />}
          description="AI 분석 완료"
          trend={{
            value: 8,
            isPositive: true
          }}
        />
        <StatsCard
          title="Hot 리드"
          value={goodTimingCount}
          icon={<Clock className="h-5 w-5" />}
          description="컨택 추천 기업"
          trend={{
            value: 25,
            isPositive: true
          }}
        />
        <StatsCard
          title="분석된 뉴스"
          value={totalNewsCount}
          icon={<Mail className="h-5 w-5" />}
          description="총 뉴스 기사 수"
          trend={{
            value: 15,
            isPositive: true
          }}
        />
      </div>

      {/* 메인 컨텐츠 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            최근 활동
          </h2>
          <RecentActivities />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            기업 목록
          </h2>
          <CompanyList />
        </div>
      </div>
    </div>
  )
} 