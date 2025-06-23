'use client'

import { useState, useEffect } from 'react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ProspectList } from '@/components/dashboard/company-list'

import { getDashboardStats, getClientCompany, getDiscoveryJobs } from '@/lib/api/analytics'
import { DashboardStats, ClientCompany, DiscoveryJobWithProgress } from '@/lib/types'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Search, Users, Target, TrendingUp, Mail, Building2, Zap } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [clientCompany, setClientCompany] = useState<ClientCompany | null>(null)
  const [discoveryJobs, setDiscoveryJobs] = useState<DiscoveryJobWithProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, companyData, jobsData] = await Promise.all([
          getDashboardStats(),
          getClientCompany(),
          getDiscoveryJobs()
        ])
        
        setStats(statsData)
        setClientCompany(companyData)
        setDiscoveryJobs(jobsData)
      } catch (error) {
        console.error('대시보드 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            AI 잠재고객 발굴 대시보드
          </h1>
          <p className="text-gray-600 mt-1">
            {clientCompany?.company_name}의 맞춤형 잠재고객 현황
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Search className="h-4 w-4" />
            새 발굴 시작
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            고객사 정보 수정
          </button>
        </div>
      </div>

      {/* 고객사 정보 카드 */}
      {clientCompany && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                {clientCompany.company_name}
              </h2>
              <p className="text-blue-100 mb-4">
                {clientCompany.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-200">업종:</span>
                  <span className="ml-2 font-medium">{clientCompany.industry}</span>
                </div>
                <div>
                  <span className="text-blue-200">타겟 시장:</span>
                  <span className="ml-2 font-medium">{clientCompany.target_market}</span>
                </div>
                <div>
                  <span className="text-blue-200">핵심 제품:</span>
                  <span className="ml-2 font-medium">{clientCompany.products_services.main_product}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold">
                {clientCompany.company_size === 'startup' ? '🚀' :
                 clientCompany.company_size === 'small' ? '🏢' :
                 clientCompany.company_size === 'medium' ? '🏭' : '🌆'}
              </div>
              <div className="text-xs text-blue-200 mt-1">
                {clientCompany.company_size === 'startup' ? '스타트업' :
                 clientCompany.company_size === 'small' ? '소기업' :
                 clientCompany.company_size === 'medium' ? '중기업' : '대기업'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 통계 카드들 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="발굴된 잠재고객"
            value={stats.total_prospects}
            suffix="개"
            trend="+12.3%"
            icon={<Users className="h-6 w-6" />}
            color="blue"
          />
          <StatsCard
            title="검증된 잠재고객"
            value={stats.qualified_prospects}
            suffix="개"
            trend="+8.1%"
            icon={<Target className="h-6 w-6" />}
            color="green"
          />
          <StatsCard
            title="Hot 리드"
            value={stats.hot_leads}
            suffix="개"
            trend="+15.2%"
            icon={<Zap className="h-6 w-6" />}
            color="red"
          />
          <StatsCard
            title="평균 응답률"
            value={stats.average_response_rate}
            suffix="%"
            trend="+2.4%"
            icon={<Mail className="h-6 w-6" />}
            color="purple"
          />
        </div>
      )}

      {/* 발굴 작업 현황 */}
      {discoveryJobs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            최근 발굴 작업
          </h3>
          <div className="space-y-4">
            {discoveryJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {job.job_type === 'full_discovery' ? '전체 발굴' :
                       job.job_type === 'incremental' ? '추가 발굴' : '새로고침'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {job.current_task || '작업 대기중'}
                    </p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    job.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status === 'completed' ? '완료' :
                     job.status === 'running' ? '진행중' :
                     job.status === 'failed' ? '실패' : '대기중'}
                  </span>
                </div>

                {/* 진행률 바 */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">진행률</span>
                    <span className="font-medium">{job.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* 결과 요약 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">총 발굴:</span>
                    <span className="ml-1 font-medium">{job.total_prospects_found}개</span>
                  </div>
                  <div>
                    <span className="text-gray-500">검증됨:</span>
                    <span className="ml-1 font-medium">{job.qualified_prospects}개</span>
                  </div>
                  <div>
                    <span className="text-gray-500">시작:</span>
                    <span className="ml-1 font-medium">
                      {job.started_at ? new Date(job.started_at).toLocaleDateString() : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">완료:</span>
                    <span className="ml-1 font-medium">
                      {job.completed_at ? new Date(job.completed_at).toLocaleDateString() : '-'}
                    </span>
                  </div>
                </div>

                {/* 타겟 조건 */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">타겟 조건</h5>
                  <div className="flex flex-wrap gap-2">
                    {job.search_criteria.industries.map((industry, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {industry}
                      </span>
                    ))}
                    {job.search_criteria.company_sizes.map((size, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {size === 'medium' ? '중기업' : size === 'large' ? '대기업' : size}
                      </span>
                    ))}
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                      {job.search_criteria.employee_range[0]}-{job.search_criteria.employee_range[1]}명
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 잠재고객 리스트 (2/3 공간) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                잠재고객 현황
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                AI가 발굴한 맞춤형 잠재고객 목록
              </p>
            </div>
            <div className="p-6">
              <ProspectList />
            </div>
          </div>
        </div>

        {/* 사이드바 (1/3 공간) */}
        <div className="space-y-6">
          {/* 퀵 액션 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              퀵 액션
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">새 발굴 시작</div>
                    <div className="text-sm text-gray-500">AI 잠재고객 발굴 작업 시작</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">일괄 이메일 생성</div>
                    <div className="text-sm text-gray-500">Hot 리드에게 이메일 발송</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">성과 분석</div>
                    <div className="text-sm text-gray-500">발굴 성과 및 트렌드 분석</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* ICP (이상적 고객 프로필) */}
          {clientCompany && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                이상적 고객 프로필 (ICP)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">회사 규모</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {clientCompany.ideal_customer_profile.company_size}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">타겟 업종</h4>
                  <div className="flex flex-wrap gap-2">
                    {clientCompany.ideal_customer_profile.industry.map((ind, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">핵심 페인포인트</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {clientCompany.ideal_customer_profile.pain_points.slice(0, 3).map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {clientCompany.ideal_customer_profile.budget_range && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">예산 범위</h4>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      {clientCompany.ideal_customer_profile.budget_range}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 