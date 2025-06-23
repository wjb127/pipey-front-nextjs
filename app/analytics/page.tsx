'use client'

import { useQuery } from '@tanstack/react-query'
import { getRecentAnalyses } from '@/lib/api/analytics'
import { SalesIntelligenceCard } from '@/components/analytics/sales-intelligence-card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { AlertCircle, Zap, Target, Filter, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export default function SalesIntelligencePage() {
  const [filter, setFilter] = useState<'all' | 'hot' | 'processing' | 'waiting'>('all')
  
  const { data: analyses, isLoading, error, refetch } = useQuery({
    queryKey: ['sales-intelligence-all'],
    queryFn: getRecentAnalyses,
    refetchInterval: 10000, // 10초마다 새로고침
  })

  const filteredAnalyses = analyses?.filter(analysis => {
    switch (filter) {
      case 'hot':
        return analysis.status === 'completed' && analysis.timing === 'good'
      case 'processing':
        return analysis.status === 'processing'
      case 'waiting':
        return analysis.status === 'pending'
      default:
        return true
    }
  }) || []

  const hotLeadsCount = analyses?.filter(a => a.status === 'completed' && a.timing === 'good').length || 0
  const processingCount = analyses?.filter(a => a.status === 'processing').length || 0

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
            총 {analyses?.length || 0}개 리드 • {hotLeadsCount}개 핫 리드
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
          <div className="text-2xl font-bold text-gray-900 mt-1">{analyses?.length || 0}</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-purple-800 font-medium">컨버전율</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 mt-1">
            {analyses?.length ? Math.round((hotLeadsCount / analyses.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">필터:</span>
        <div className="flex space-x-2">
          {[
            { key: 'all', label: '전체', count: analyses?.length || 0 },
            { key: 'hot', label: '🔥 핫 리드', count: hotLeadsCount },
            { key: 'processing', label: '📊 분석중', count: processingCount },
            { key: 'waiting', label: '⏳ 대기중', count: analyses?.filter(a => a.status === 'pending').length || 0 },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnalyses.map((analysis) => (
            <SalesIntelligenceCard key={analysis.id} analysis={analysis} />
          ))}
        </div>
      )}
    </div>
  )
} 