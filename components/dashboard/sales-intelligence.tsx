'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SalesIntelligenceCard } from '@/components/analytics/sales-intelligence-card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Filter, RefreshCw, Flame } from 'lucide-react'

// sales-intelligence-card에서 사용하는 Analysis 타입
interface Analysis {
  id: string
  companyName: string
  industry: string
  status: 'hot' | 'processing' | 'waiting'
  priority: number
  lastAnalyzed: string
  newsCount: number
  keyInsights: string[]
  contactInfo: {
    name?: string
    position?: string
    email?: string
    phone?: string
  }
  relevantNews: {
    title: string
    date: string
    summary: string
    relevance: 'high' | 'medium' | 'low'
  }[]
}

// Mock 데이터 생성 함수
const generateMockSalesAnalyses = (): Analysis[] => [
  {
    id: 'sales-1',
    companyName: '삼성전자',
    industry: '전자/반도체',
    status: 'hot',
    priority: 95,
    lastAnalyzed: '2분 전',
    newsCount: 23,
    keyInsights: [
      '🔥 최신 AI 반도체 기술 발표로 B2B 솔루션 분야 확장 중',
      '📈 글로벌 파트너십 확대로 신규 비즈니스 기회 증가',
      '💡 스마트팩토리 솔루션 도입 가속화로 협력 가능성 높음',
      '🌐 해외 시장 진출 활발화로 글로벌 네트워크 필요성 증대'
    ],
    contactInfo: {
      name: '김철수',
      position: 'VP of Business Development',
      email: 'cs.kim@samsung.com',
      phone: '+82-10-1234-5678'
    },
    relevantNews: [
      {
        title: '삼성전자, AI 반도체 기술 혁신으로 글로벌 시장 선도',
        date: '2시간 전',
        summary: 'AI 전용 반도체 개발 성과 발표와 함께 B2B 시장 확장 전략 공개',
        relevance: 'high'
      },
      {
        title: '삼성 스마트팩토리 솔루션, 중소기업 대상 확산',
        date: '4시간 전',
        summary: '중소 제조업체를 위한 맞춤형 디지털 전환 솔루션 런칭',
        relevance: 'high'
      }
    ]
  },
  {
    id: 'sales-2',
    companyName: '현대자동차',
    industry: '자동차/모빌리티',
    status: 'hot',
    priority: 87,
    lastAnalyzed: '1시간 전',
    newsCount: 18,
    keyInsights: [
      '🚗 전기차 신모델 출시와 충전 인프라 확장 계획 발표',
      '🌱 친환경 기술 투자 확대로 ESG 관련 협력사 모집 중',
      '🔋 배터리 기술 혁신으로 공급망 파트너십 기회 증가',
      '🌍 해외 시장 진출 가속화로 글로벌 서비스 수요 증가'
    ],
    contactInfo: {
      name: '박영희',
      position: 'Director of Strategic Partnerships',
      email: 'yh.park@hyundai.com',
      phone: '+82-10-2345-6789'
    },
    relevantNews: [
      {
        title: '현대차, 2025년 전기차 라인업 대폭 확장 발표',
        date: '3시간 전',
        summary: '신규 전기차 모델 5종 출시 예정, 충전 인프라 파트너십 확대',
        relevance: 'high'
      }
    ]
  },
  {
    id: 'sales-3',
    companyName: 'LG화학',
    industry: '화학/에너지',
    status: 'processing',
    priority: 72,
    lastAnalyzed: '30분 전',
    newsCount: 8,
    keyInsights: [
      '🔋 2차전지 사업 확장으로 신규 공급업체 발굴 중',
      '🏭 생산 시설 증설로 효율화 솔루션 도입 검토'
    ],
    contactInfo: {
      name: '이민수',
      position: 'Senior Manager',
      email: 'ms.lee@lgchem.com'
    },
    relevantNews: [
      {
        title: 'LG화학 배터리 생산 능력 2배 확대',
        date: '1일 전',
        summary: '배터리 생산라인 증설과 함께 스마트 공장 시스템 도입 예정',
        relevance: 'medium'
      }
    ]
  },
  {
    id: 'sales-4',
    companyName: '네이버',
    industry: 'IT/플랫폼',
    status: 'waiting',
    priority: 45,
    lastAnalyzed: '6시간 전',
    newsCount: 12,
    keyInsights: [
      '📱 클라우드 서비스 확장으로 B2B 솔루션 강화',
      '🔍 AI 검색 기술 고도화로 기업용 서비스 개발 중',
      '⚖️ 플랫폼 규제 대응으로 신중한 파트너십 접근 필요'
    ],
    contactInfo: {
      name: '정수연',
      position: 'Business Development Lead',
      email: 'sy.jung@navercorp.com'
    },
    relevantNews: [
      {
        title: '네이버 클라우드, 기업용 AI 서비스 강화',
        date: '1일 전',
        summary: 'B2B 고객 대상 AI 솔루션 포트폴리오 확대 발표',
        relevance: 'medium'
      }
    ]
  }
]

export function SalesIntelligence() {
  const [filter, setFilter] = useState<'all' | 'hot' | 'processing' | 'waiting'>('all')
  
  const { data: analyses = [], isLoading, refetch } = useQuery({
    queryKey: ['sales-intelligence'],
    queryFn: async () => {
      // API 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      return generateMockSalesAnalyses()
    },
    refetchInterval: 30000 // 30초마다 업데이트
  })

  const filteredAnalyses = analyses.filter(analysis => 
    filter === 'all' || analysis.status === filter
  )

  const hotLeadsCount = analyses.filter(a => a.status === 'hot').length
  const totalLeads = analyses.length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">세일즈 인텔리전스</h2>
          <p className="text-gray-600 mt-1">
            AI 분석 기반 우선순위 리드 {totalLeads}개 중 🔥 Hot 리드 {hotLeadsCount}개
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => refetch()}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>새로고침</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Hot 리드</span>
          </div>
          <div className="text-2xl font-bold text-red-900 mt-1">{hotLeadsCount}</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm font-medium text-yellow-800">분석 중</div>
          <div className="text-2xl font-bold text-yellow-900 mt-1">
            {analyses.filter(a => a.status === 'processing').length}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-800">대기 중</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {analyses.filter(a => a.status === 'waiting').length}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-800">전환율</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {Math.round((hotLeadsCount / totalLeads) * 100)}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto">
        <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
        {[
          { key: 'all', label: '전체', count: totalLeads },
          { key: 'hot', label: '🔥 Hot', count: analyses.filter(a => a.status === 'hot').length },
          { key: 'processing', label: '분석중', count: analyses.filter(a => a.status === 'processing').length },
          { key: 'waiting', label: '대기', count: analyses.filter(a => a.status === 'waiting').length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Analytics Cards */}
      <div className="space-y-6">
        {filteredAnalyses.length > 0 ? (
          filteredAnalyses.map((analysis) => (
            <SalesIntelligenceCard
              key={analysis.id}
              analysis={analysis}
              onViewDetails={(id) => {
                console.log('상세 분석 보기:', id)
                // TODO: 상세 분석 모달 또는 페이지로 이동
              }}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">선택한 필터에 해당하는 분석 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
} 