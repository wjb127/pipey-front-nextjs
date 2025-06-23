import { SalesIntelligence, ProspectWithIntelligence } from '@/lib/types'
import { 
  Brain, 
  Target, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  User, 
  Mail,
  Phone,
  Calendar,
  ExternalLink
} from 'lucide-react'

interface SalesIntelligenceCardProps {
  intelligence: SalesIntelligence
  prospect: ProspectWithIntelligence
}

export function SalesIntelligenceCard({ intelligence, prospect }: SalesIntelligenceCardProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🔥'
      case 'high': return '⚡'
      case 'medium': return '📊'
      case 'low': return '💡'
      default: return '📋'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'immediate': return 'text-red-600 font-semibold'
      case 'this_week': return 'text-orange-600 font-medium'
      case 'this_month': return 'text-yellow-600'
      case 'next_quarter': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const formatTiming = (timing: string) => {
    switch (timing) {
      case 'immediate': return '즉시 연락 권장'
      case 'this_week': return '이번 주 내'
      case 'this_month': return '이번 달 내'
      case 'next_quarter': return '다음 분기'
      default: return '타이밍 미정'
    }
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">AI 세일즈 인텔리전스</h2>
            </div>
            <p className="text-sm text-gray-600">
              AI 신뢰도: {(intelligence.ai_confidence * 100).toFixed(0)}% • 
              생성 일시: {new Date(intelligence.generated_at).toLocaleString()}
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {intelligence.match_score}
            </div>
            <div className="text-sm text-gray-500">매칭 점수</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 우선순위 및 타이밍 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border ${getPriorityColor(intelligence.priority_level)}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{getPriorityIcon(intelligence.priority_level)}</span>
              <h3 className="font-medium">우선순위</h3>
            </div>
            <div className="font-semibold text-lg">
              {intelligence.priority_level === 'critical' ? '매우 높음' :
               intelligence.priority_level === 'high' ? '높음' :
               intelligence.priority_level === 'medium' ? '중간' : '낮음'}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-800">연락 타이밍</h3>
            </div>
            <div className={`font-semibold text-lg ${getTimingColor(intelligence.contact_timing)}`}>
              {formatTiming(intelligence.contact_timing)}
            </div>
          </div>
        </div>

        {/* 추천 접근 방법 */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">추천 접근 방법</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {intelligence.recommended_approach}
          </p>
        </div>

        {/* 페인포인트와 가치 제안 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              💢 핵심 페인포인트
            </h3>
            <ul className="space-y-2">
              {intelligence.pain_points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              ✨ 핵심 가치 제안
            </h3>
            <ul className="space-y-2">
              {intelligence.value_props.map((prop, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span className="text-gray-700">{prop}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 의사결정자 정보 */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            👥 핵심 의사결정자
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intelligence.decision_makers.primary && (
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800 uppercase tracking-wide">
                    주요 담당자
                  </span>
                </div>
                <div className="font-medium text-gray-900 mb-1">
                  {intelligence.decision_makers.primary.name}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {intelligence.decision_makers.primary.title}
                </div>
                <div className="flex items-center gap-2">
                  {intelligence.decision_makers.primary.linkedin && (
                    <a
                      href={intelligence.decision_makers.primary.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      LinkedIn
                    </a>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    intelligence.decision_makers.primary.contact_priority === 'high' 
                      ? 'bg-red-100 text-red-800'
                      : intelligence.decision_makers.primary.contact_priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {intelligence.decision_makers.primary.contact_priority === 'high' ? '높은 우선순위' :
                     intelligence.decision_makers.primary.contact_priority === 'medium' ? '중간 우선순위' : '낮은 우선순위'}
                  </span>
                </div>
              </div>
            )}

            {intelligence.decision_makers.secondary && (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                    보조 담당자
                  </span>
                </div>
                <div className="font-medium text-gray-900 mb-1">
                  {intelligence.decision_makers.secondary.name}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {intelligence.decision_makers.secondary.title}
                </div>
                <div className="flex items-center gap-2">
                  {intelligence.decision_makers.secondary.linkedin && (
                    <a
                      href={intelligence.decision_makers.secondary.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      LinkedIn
                    </a>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    intelligence.decision_makers.secondary.contact_priority === 'high' 
                      ? 'bg-red-100 text-red-800'
                      : intelligence.decision_makers.secondary.contact_priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {intelligence.decision_makers.secondary.contact_priority === 'high' ? '높은 우선순위' :
                     intelligence.decision_makers.secondary.contact_priority === 'medium' ? '중간 우선순위' : '낮은 우선순위'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 대화 시작 제안 */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            💬 대화 시작 제안
          </h3>
          <div className="space-y-3">
            {intelligence.conversation_starters.map((starter, idx) => (
              <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm text-gray-700">{starter}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 트리거 */}
        {intelligence.recent_triggers.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              📈 최근 트리거 이벤트
            </h3>
            <div className="space-y-2">
              {intelligence.recent_triggers.map((trigger, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-700">{trigger}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 경쟁사 분석 */}
        {intelligence.competitive_landscape && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              🏆 경쟁사 분석
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {intelligence.competitive_landscape.current_solutions && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">현재 솔루션</div>
                  <div className="space-y-1">
                    {intelligence.competitive_landscape.current_solutions.map((solution, idx) => (
                      <div key={idx} className="text-xs text-gray-600">{solution}</div>
                    ))}
                  </div>
                </div>
              )}
              
              {intelligence.competitive_landscape.switching_probability && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-700 mb-2">전환 가능성</div>
                  <div className="text-xl font-bold text-blue-900">
                    {(intelligence.competitive_landscape.switching_probability * 100).toFixed(0)}%
                  </div>
                </div>
              )}
              
              {intelligence.competitive_landscape.decision_timeline && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-700 mb-2">의사결정 일정</div>
                  <div className="text-sm font-semibold text-purple-900">
                    {intelligence.competitive_landscape.decision_timeline}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="border-t pt-6">
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Mail className="h-4 w-4" />
              이메일 생성
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="h-4 w-4" />
              연락처 정보
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="h-4 w-4" />
              미팅 일정
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 