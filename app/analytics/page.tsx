'use client'

import { useQuery } from '@tanstack/react-query'
import { getRecentAnalyses } from '@/lib/api/analytics'
import { SalesIntelligenceCard } from '@/components/analytics/sales-intelligence-card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertCircle, Zap, Target, Filter, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Analysis as APIAnalysis } from '@/lib/types'

// SalesIntelligenceCard에서 사용하는 Analysis 타입
interface CardAnalysis {
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

// API Analysis를 Card Analysis로 변환하는 함수
const convertToCardAnalysis = (apiAnalysis: APIAnalysis): CardAnalysis => {
  // timing을 status로 변환
  const getStatus = (status: string, timing: string): 'hot' | 'processing' | 'waiting' => {
    if (status === 'processing') return 'processing'
    if (status === 'completed' && timing === 'good') return 'hot'
    return 'waiting'
  }

  // priority 점수 계산
  const getPriority = (timing: string, newsCount: number): number => {
    if (timing === 'good') return Math.min(85 + Math.floor(newsCount / 3), 100)
    if (timing === 'average') return Math.floor(Math.random() * 20) + 50
    return Math.floor(Math.random() * 30) + 20
  }

  // 시간 포맷 변환
  const getLastAnalyzed = (updatedAt: string): string => {
    const diffMs = Date.now() - new Date(updatedAt).getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    return `${diffDays}일 전`
  }

  // mock 연락처 정보 생성
  const generateContactInfo = (companyName: string) => {
    const contacts = {
      '삼성전자': { name: '김철수', position: 'VP of Business Development', email: 'cs.kim@samsung.com', phone: '+82-10-1234-5678' },
      '현대자동차': { name: '박영희', position: 'Director of Strategic Partnerships', email: 'yh.park@hyundai.com', phone: '+82-10-2345-6789' },
      'LG화학': { name: '이민수', position: 'Senior Manager', email: 'ms.lee@lgchem.com' },
      '네이버': { name: '정수연', position: 'Business Development Lead', email: 'sy.jung@navercorp.com' },
    }
    return contacts[companyName as keyof typeof contacts] || { name: '담당자', email: 'contact@company.com' }
  }

  // 키 인사이트 생성
  const generateKeyInsights = (companyName: string, timing: string, summary: string): string[] => {
    const baseInsights = summary ? [summary] : []
    
    if (timing === 'good') {
      return [
        ...baseInsights,
        '🔥 현재 비즈니스 확장 시기로 파트너십 기회 높음',
        '📈 긍정적인 시장 반응으로 의사결정 속도 빨라짐',
        '💡 새로운 기술 투자로 솔루션 도입 적극적',
      ]
    } else if (timing === 'average') {
      return [
        ...baseInsights,
        '⚡ 시장 동향 관찰 중으로 신중한 접근 필요',
        '🎯 전략적 파트너십 검토 단계',
      ]
    }
    
    return [
      ...baseInsights,
      '⏳ 현재 내부 정비 중으로 컨택 시기 조절 필요',
    ]
  }

  return {
    id: apiAnalysis.id,
    companyName: apiAnalysis.companyName,
    industry: apiAnalysis.industry || '기타',
    status: getStatus(apiAnalysis.status, apiAnalysis.timing),
    priority: getPriority(apiAnalysis.timing, apiAnalysis.newsCount),
    lastAnalyzed: getLastAnalyzed(apiAnalysis.updatedAt),
    newsCount: apiAnalysis.newsCount,
    keyInsights: generateKeyInsights(apiAnalysis.companyName, apiAnalysis.timing, apiAnalysis.summary),
    contactInfo: generateContactInfo(apiAnalysis.companyName),
    relevantNews: apiAnalysis.newsArticles?.slice(0, 3).map((article, index) => ({
      title: article.title,
      date: getLastAnalyzed(article.publishedAt),
      summary: article.content.substring(0, 150) + '...',
      relevance: index === 0 ? 'high' : index === 1 ? 'medium' : 'low'
    })) || []
  }
}

export default function SalesIntelligencePage() {
  const [filter, setFilter] = useState<'all' | 'hot' | 'processing' | 'waiting'>('all')
  
  const { data: analyses, isLoading, error, refetch } = useQuery({
    queryKey: ['sales-intelligence-all'],
    queryFn: getRecentAnalyses,
    refetchInterval: 10000, // 10초마다 새로고침
  })

  // API 데이터를 Card 형식으로 변환
  const cardAnalyses = analyses?.map(convertToCardAnalysis) || []

  const filteredAnalyses = cardAnalyses.filter(analysis => {
    return filter === 'all' || analysis.status === filter
  })

  const hotLeadsCount = cardAnalyses.filter(a => a.status === 'hot').length
  const processingCount = cardAnalyses.filter(a => a.status === 'processing').length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Zap className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">세일즈 인텔리전스</h1>
        </div>
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Zap className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">세일즈 인텔리전스</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>세일즈 인텔리전스를 불러오는 중 오류가 발생했습니다.</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">세일즈 인텔리전스</h1>
          </div>
          <p className="text-gray-600">
            AI 분석 기반 리드 우선순위와 컨택 추천 • 실시간 업데이트
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => refetch()}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>새로고침</span>
          </button>
          
          <div className="text-sm text-gray-500">
            총 {cardAnalyses.length}개 리드 • {hotLeadsCount}개 핫 리드
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-medium">🔥 지금 컨택</span>
          </div>
          <div className="text-2xl font-bold text-green-900 mt-1">{hotLeadsCount}</div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-800 font-medium">📊 분석 진행중</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-1">{processingCount}</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700 font-medium">전체 리드</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{cardAnalyses.length}</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-purple-800 font-medium">컨버전율</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 mt-1">
            {cardAnalyses.length ? Math.round((hotLeadsCount / cardAnalyses.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">필터:</span>
        <div className="flex space-x-2">
          {[
            { key: 'all', label: '전체', count: cardAnalyses.length },
            { key: 'hot', label: '🔥 핫 리드', count: hotLeadsCount },
            { key: 'processing', label: '📊 분석중', count: processingCount },
            { key: 'waiting', label: '⏳ 대기중', count: cardAnalyses.filter(a => a.status === 'waiting').length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} {count > 0 && `(${count})`}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredAnalyses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">
              {filter === 'all' ? '분석된 리드가 없습니다.' : '해당 조건의 리드가 없습니다.'}
            </p>
            <p>홈페이지에서 새 타겟 기업을 추가해보세요.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAnalyses.map((analysis) => (
            <SalesIntelligenceCard 
              key={analysis.id} 
              analysis={analysis}
              onViewDetails={(id) => {
                console.log('상세 분석 보기:', id)
                // TODO: 상세 분석 모달 또는 페이지로 이동
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
} 