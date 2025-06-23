'use client'

import { useState, useEffect } from 'react'
import { AnalysisCard } from '@/components/analytics/analysis-card'
import { SalesIntelligenceCard } from '@/components/analytics/sales-intelligence-card'
import { 
  getProspects, 
  getSalesIntelligence, 
  getDashboardStats,
  getClientCompany 
} from '@/lib/api/analytics'
import { 
  ProspectWithIntelligence, 
  SalesIntelligence, 
  DashboardStats,
  ClientCompany 
} from '@/lib/types'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Mail, 
  Calendar,
  Filter,
  Download
} from 'lucide-react'

export default function AnalyticsPage() {
  const [prospects, setProspects] = useState<ProspectWithIntelligence[]>([])
  const [selectedProspect, setSelectedProspect] = useState<ProspectWithIntelligence | null>(null)
  const [intelligence, setIntelligence] = useState<SalesIntelligence | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [clientCompany, setClientCompany] = useState<ClientCompany | null>(null)
  const [loading, setLoading] = useState(true)
  const [intelligenceLoading, setIntelligenceLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'prospects' | 'performance'>('overview')

  useEffect(() => {
    async function loadAnalyticsData() {
      try {
        const [prospectsData, statsData, companyData] = await Promise.all([
          getProspects(),
          getDashboardStats(),
          getClientCompany()
        ])
        
        setProspects(prospectsData)
        setStats(statsData)
        setClientCompany(companyData)
        
        // 첫 번째 잠재고객 선택
        if (prospectsData.length > 0) {
          setSelectedProspect(prospectsData[0])
          await loadIntelligence(prospectsData[0].id)
        }
      } catch (error) {
        console.error('분석 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalyticsData()
  }, [])

  const loadIntelligence = async (prospectId: string) => {
    setIntelligenceLoading(true)
    try {
      const intelligenceData = await getSalesIntelligence(prospectId)
      setIntelligence(intelligenceData)
    } catch (error) {
      console.error('인텔리전스 데이터 로드 실패:', error)
    } finally {
      setIntelligenceLoading(false)
    }
  }

  const handleProspectSelect = async (prospect: ProspectWithIntelligence) => {
    setSelectedProspect(prospect)
    await loadIntelligence(prospect.id)
  }

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
            세일즈 인텔리전스 분석
          </h1>
          <p className="text-gray-600 mt-1">
            AI 기반 잠재고객 분석 및 성과 인사이트
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            필터
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            내보내기
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: '개요', icon: BarChart3 },
            { id: 'prospects', label: '잠재고객 상세', icon: Users },
            { id: 'performance', label: '성과 분석', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* 전체 성과 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 발굴</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_prospects}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <div className="text-xs text-green-600">+12.3% vs 지난 주</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hot 리드</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.hot_leads}</p>
                </div>
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <div className="mt-4">
                <div className="text-xs text-green-600">+15.2% vs 지난 주</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">응답률</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.average_response_rate}%</p>
                </div>
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4">
                <div className="text-xs text-green-600">+2.4% vs 지난 주</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">전환율</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.conversion_rate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4">
                <div className="text-xs text-green-600">+5.1% vs 지난 주</div>
              </div>
            </div>
          </div>

          {/* 업종별 분석 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">업종별 잠재고객 분포</h3>
            <div className="space-y-4">
              {[
                { industry: 'IT 서비스', count: 2, percentage: 40, color: 'bg-blue-500' },
                { industry: '제조업', count: 1, percentage: 20, color: 'bg-green-500' },
                { industry: '헬스케어', count: 1, percentage: 20, color: 'bg-red-500' },
                { industry: '교육', count: 1, percentage: 20, color: 'bg-yellow-500' }
              ].map((item) => (
                <div key={item.industry} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600">{item.industry}</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-sm text-gray-900 font-medium">
                    {item.count}개 ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 트렌드 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 발굴 트렌드</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">47</div>
                <div className="text-sm text-gray-600">이번 주 발굴</div>
                <div className="text-xs text-green-600 mt-1">+18% ↗</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">23</div>
                <div className="text-sm text-gray-600">검증 완료</div>
                <div className="text-xs text-green-600 mt-1">+12% ↗</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">8</div>
                <div className="text-sm text-gray-600">연락 시도</div>
                <div className="text-xs text-green-600 mt-1">+25% ↗</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prospects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 잠재고객 목록 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">잠재고객 목록</h3>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {prospects.map((prospect) => (
                  <div
                    key={prospect.id}
                    onClick={() => handleProspectSelect(prospect)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedProspect?.id === prospect.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{prospect.company_name}</h4>
                      {prospect.intelligence && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          prospect.intelligence.priority_level === 'critical' ? 'bg-red-100 text-red-800' :
                          prospect.intelligence.priority_level === 'high' ? 'bg-orange-100 text-orange-800' :
                          prospect.intelligence.priority_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {prospect.intelligence.priority_level === 'critical' ? '🔥 매우 높음' :
                           prospect.intelligence.priority_level === 'high' ? '⚡ 높음' :
                           prospect.intelligence.priority_level === 'medium' ? '📊 중간' : '💡 낮음'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {prospect.industry} • {prospect.employee_count}명
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      적합도: {prospect.qualification_score}/100
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 상세 분석 */}
          <div className="lg:col-span-2">
            {selectedProspect ? (
              <div className="space-y-6">
                <AnalysisCard prospect={selectedProspect} />
                {intelligenceLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : intelligence ? (
                  <SalesIntelligenceCard intelligence={intelligence} prospect={selectedProspect} />
                ) : (
                  <div className="bg-white rounded-lg border p-8 text-center">
                    <div className="text-gray-500">인텔리전스 데이터를 불러올 수 없습니다.</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">잠재고객을 선택해주세요</h3>
                <p className="text-gray-500">왼쪽 목록에서 잠재고객을 선택하면 상세 분석을 확인할 수 있습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'performance' && clientCompany && (
        <div className="space-y-6">
          {/* 성과 지표 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">발굴 효율성</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">시간당 발굴</span>
                  <span className="font-medium">3.2개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">검증 비율</span>
                  <span className="font-medium">49%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">평균 점수</span>
                  <span className="font-medium">88.4</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">연락 성과</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">이메일 발송</span>
                  <span className="font-medium">15개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">열람률</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">응답률</span>
                  <span className="font-medium">24.5%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI 분석</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">예상 파이프라인</span>
                  <span className="font-medium">$45K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">투자 대비</span>
                  <span className="font-medium text-green-600">+380%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">예상 전환</span>
                  <span className="font-medium">3-4개월</span>
                </div>
              </div>
            </div>
          </div>

          {/* ICP 매칭 분석 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ICP 매칭 분석 - {clientCompany.company_name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">업종별 매칭도</h4>
                <div className="space-y-3">
                  {clientCompany.ideal_customer_profile.industry.map((industry, idx) => {
                    const matchingProspects = prospects.filter(p => p.industry === industry)
                    const percentage = (matchingProspects.length / prospects.length) * 100
                    
                    return (
                      <div key={idx} className="flex items-center">
                        <div className="w-20 text-sm text-gray-600">{industry}</div>
                        <div className="flex-1 mx-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-sm font-medium">{percentage.toFixed(0)}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-3">페인포인트 매칭</h4>
                <div className="space-y-2">
                  {clientCompany.ideal_customer_profile.pain_points.slice(0, 4).map((painPoint, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{painPoint}</span>
                      <span className="text-xs text-green-600 ml-auto">85% 매칭</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 타임라인 성과 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">발굴 타임라인</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {[
                  { date: '1월 15일', event: 'AI 발굴 작업 시작', count: '47개 발굴', status: 'completed' },
                  { date: '1월 15일', event: '자동 검증 완료', count: '23개 검증', status: 'completed' },
                  { date: '1월 16일', event: '인텔리전스 생성', count: '15개 Hot 리드', status: 'completed' },
                  { date: '1월 17일', event: '이메일 발송', count: '8개 발송', status: 'in-progress' },
                  { date: '1월 18일', event: '후속 관리', count: '예정', status: 'pending' }
                ].map((item, idx) => (
                  <div key={idx} className="relative flex items-start">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      item.status === 'completed' ? 'bg-green-500 border-green-500' :
                      item.status === 'in-progress' ? 'bg-blue-500 border-blue-500' :
                      'bg-gray-300 border-gray-300'
                    }`}></div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{item.event}</h4>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 