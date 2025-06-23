'use client'

import { useState, useEffect } from 'react'
import { ProspectWithIntelligence, ProspectFilters } from '@/lib/types'
import { getProspects } from '@/lib/api/analytics'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmailGeneratorModal } from './email-generator-modal'


interface ProspectListProps {
  filters?: ProspectFilters
}

export function ProspectList({ filters }: ProspectListProps) {
  const [prospects, setProspects] = useState<ProspectWithIntelligence[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [selectedProspect, setSelectedProspect] = useState<ProspectWithIntelligence | null>(null)

  useEffect(() => {
    async function loadProspects() {
      setLoading(true)
      try {
        const activeFilters: ProspectFilters = {}
        
        if (selectedStatus !== 'all') {
          activeFilters.status = selectedStatus as any
        }
        
        if (selectedPriority !== 'all') {
          activeFilters.priority_level = selectedPriority as any
        }

        const data = await getProspects(activeFilters)
        setProspects(data)
      } catch (error) {
        console.error('잠재고객 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProspects()
  }, [selectedStatus, selectedPriority])

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'critical': return '🔥'
      case 'high': return '⚡'
      case 'medium': return '📊'
      case 'low': return '💡'
      default: return '📋'
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-purple-100 text-purple-800'
      case 'responded': return 'bg-green-100 text-green-800'
      case 'converted': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getContactTimingColor = (timing?: string) => {
    switch (timing) {
      case 'immediate': return 'text-red-600 font-semibold'
      case 'this_week': return 'text-orange-600 font-medium'
      case 'this_month': return 'text-yellow-600'
      case 'next_quarter': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const formatRevenue = (revenue?: number) => {
    if (!revenue) return '-'
    return `${(revenue / 100000000).toFixed(0)}억원`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 필터 섹션 */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">상태:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="all">전체</option>
            <option value="discovered">발굴됨</option>
            <option value="qualified">검증됨</option>
            <option value="contacted">연락함</option>
            <option value="responded">응답받음</option>
            <option value="converted">전환됨</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">우선순위:</label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="all">전체</option>
            <option value="critical">매우 높음</option>
            <option value="high">높음</option>
            <option value="medium">중간</option>
            <option value="low">낮음</option>
          </select>
        </div>
      </div>

      {/* 잠재고객 리스트 */}
      <div className="grid gap-4">
        {prospects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">조건에 맞는 잠재고객이 없습니다</div>
            <div className="text-gray-400 text-sm">다른 필터를 시도해보세요</div>
          </div>
        ) : (
          prospects.map((prospect) => (
            <div
              key={prospect.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {prospect.company_name}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(prospect.status)}`}>
                      {prospect.status === 'qualified' ? '검증됨' :
                       prospect.status === 'contacted' ? '연락함' :
                       prospect.status === 'responded' ? '응답받음' :
                       prospect.status === 'converted' ? '전환됨' : '발굴됨'}
                    </span>
                    {prospect.intelligence && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(prospect.intelligence.priority_level)}`}>
                        {getPriorityIcon(prospect.intelligence.priority_level)} 
                        {prospect.intelligence.priority_level === 'critical' ? '매우 높음' :
                         prospect.intelligence.priority_level === 'high' ? '높음' :
                         prospect.intelligence.priority_level === 'medium' ? '중간' : '낮음'}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">업종:</span>
                      <span className="ml-1 font-medium">{prospect.industry}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">규모:</span>
                      <span className="ml-1 font-medium">{prospect.employee_count}명</span>
                    </div>
                    <div>
                      <span className="text-gray-500">매출:</span>
                      <span className="ml-1 font-medium">{formatRevenue(prospect.annual_revenue)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">위치:</span>
                      <span className="ml-1 font-medium">{prospect.location}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {prospect.qualification_score}
                  </div>
                  <div className="text-xs text-gray-500">적합도 점수</div>
                </div>
              </div>

              {/* AI 인텔리전스 정보 */}
              {prospect.intelligence && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">핵심 페인포인트</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {prospect.intelligence.pain_points.slice(0, 2).map((point, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">가치 제안</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {prospect.intelligence.value_props.slice(0, 2).map((prop, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            {prop}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">연락 타이밍:</span>
                        <span className={getContactTimingColor(prospect.intelligence.contact_timing)}>
                          {prospect.intelligence.contact_timing === 'immediate' ? '즉시' :
                           prospect.intelligence.contact_timing === 'this_week' ? '이번 주' :
                           prospect.intelligence.contact_timing === 'this_month' ? '이번 달' : '다음 분기'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {prospect.intelligence.decision_makers.primary && (
                          <div className="text-sm">
                            <span className="text-gray-500">담당자:</span>
                            <span className="ml-1 font-medium">
                              {prospect.intelligence.decision_makers.primary.name}
                            </span>
                            <span className="text-gray-400 ml-1">
                              ({prospect.intelligence.decision_makers.primary.title})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 기술 스택 */}
              {prospect.technologies && prospect.technologies.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">현재 기술 스택</h4>
                  <div className="flex flex-wrap gap-2">
                    {prospect.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 최근 펀딩 정보 */}
              {prospect.recent_funding && (
                <div className="mb-4 p-3 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">💰</span>
                    <span className="font-medium text-green-800">
                      {prospect.recent_funding.round} {prospect.recent_funding.amount} 투자 유치
                    </span>
                    <span className="text-green-600">
                      ({prospect.recent_funding.date})
                    </span>
                  </div>
                </div>
              )}

              {/* 액션 버튼들 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>데이터 출처:</span>
                  {prospect.data_sources?.map((source, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {source}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  {prospect.intelligence && (
                    <button 
                      onClick={() => {
                        setSelectedProspect(prospect)
                        setEmailModalOpen(true)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      이메일 생성
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    상세 보기
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 통계 요약 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-900 mb-1">
            {prospects.length}개
          </div>
          <div className="text-sm text-blue-700">
            현재 필터 조건에 맞는 잠재고객
          </div>
        </div>
      </div>

      {/* 이메일 생성 모달 */}
      {selectedProspect && (
        <EmailGeneratorModal
          prospect={selectedProspect}
          isOpen={emailModalOpen}
          onClose={() => {
            setEmailModalOpen(false)
            setSelectedProspect(null)
          }}
        />
      )}
    </div>
  )
} 