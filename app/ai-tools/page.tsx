'use client'

import { useState } from 'react'
import { Bot, Sparkles, Target, Mail, MessageSquare, Search, Copy, Check, Loader2, Lightbulb } from 'lucide-react'

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState('prospect-research')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const tools = [
    {
      id: 'prospect-research',
      name: '잠재고객 리서치',
      icon: Search,
      description: '회사명으로 상세한 잠재고객 정보 분석'
    },
    {
      id: 'email-generator',
      name: '세일즈 이메일 생성',
      icon: Mail,
      description: '맞춤형 세일즈 이메일 자동 생성'
    },
    {
      id: 'pitch-analyzer',
      name: '피치 분석기',
      icon: Target,
      description: '세일즈 피치 효과성 분석 및 개선안 제시'
    },
    {
      id: 'objection-handler',
      name: '이의제기 대응',
      icon: MessageSquare,
      description: '고객 이의제기에 대한 AI 대응 스크립트'
    }
  ]

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('복사 실패:', err)
    }
  }

  const callAI = async (prompt: string, tool: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          tool,
          model: 'gpt-4o-mini'
        }),
      })

      if (!response.ok) {
        throw new Error('AI API 호출 실패')
      }

      const data = await response.json()
      return data.result
    } catch (error) {
      console.error('AI 호출 오류:', error)
      return getMockResponse(tool, prompt)
    } finally {
      setLoading(false)
    }
  }

  const getMockResponse = (tool: string, prompt: string) => {
    const mockResponses = {
      'prospect-research': `## 🏢 ${prompt} 회사 분석 결과

### 📊 기본 정보
- **업종**: IT 서비스
- **설립년도**: 2018년
- **직원 수**: 약 150명
- **위치**: 서울시 강남구

### 💰 재무 현황
- **최근 투자**: 시리즈 B 120억원 (2023년 9월)
- **연매출**: 약 200억원 (추정)
- **주요 투자자**: KB인베스트먼트, 스톤브릿지벤처스

### 🎯 비즈니스 모델
- **주력 사업**: 클라우드 기반 ERP 솔루션
- **타겟 고객**: 중소 제조업체
- **경쟁 우위**: 제조업 특화 기능

### 🔥 세일즈 포인트
1. **성장성**: 전년 대비 40% 매출 증가
2. **확장 계획**: 동남아 진출 예정
3. **기술 투자**: AI/ML 개발팀 신규 채용 중
4. **페인포인트**: 글로벌 확장을 위한 인프라 현대화 필요

### 📧 추천 접근 방법
"안녕하세요! ${prompt}의 동남아 진출 계획 관련하여 연락드립니다..."

*개발 환경용 샘플 데이터입니다.*`,

      'email-generator': `## 📧 맞춤형 세일즈 이메일

**제목**: ${prompt}의 클라우드 인프라 현대화 제안

안녕하세요 ${prompt} 담당자님,

클라우드브릿지의 김세일즈입니다.

최근 ${prompt}의 성장 소식을 보고 연락드립니다. 빠르게 성장하는 기업의 인프라 확장에 도움이 될 수 있을 것 같아 제안드립니다.

**현재 상황 분석:**
• 급속한 성장으로 인한 인프라 부하 증가
• 확장성 있는 클라우드 솔루션 검토 시점
• 비용 효율적인 인프라 운영 필요

**저희가 제공할 수 있는 가치:**
✅ 기존 인프라 대비 30% 비용 절감
✅ 99.9% 가용성 보장
✅ 24/7 전문 기술 지원
✅ 무중단 마이그레이션 서비스

${prompt}와 같은 성장 기업에서 평균 3-6개월 내 ROI를 달성하고 있습니다.

간단한 15분 통화로 구체적인 제안을 드릴 수 있습니다.
언제 시간이 되실까요?

감사합니다.

김세일즈 | 클라우드브릿지
sales@cloudbridge.com

*개발 환경용 샘플입니다.*`,

      'pitch-analyzer': `## 🎯 피치 분석 결과

### 📈 전체 점수: 78/100

**강점 (85점)**
✅ 명확한 가치 제안
✅ 구체적인 수치 제시
✅ 고객 페인포인트 정확히 파악

**개선 포인트 (65점)**
⚠️ 경쟁사 대비 차별화 부족
⚠️ 레퍼런스 케이스 미흡
⚠️ 구체적인 구현 일정 없음

### 🔧 개선 제안

**1. 차별화 강화**
기존: "저희 솔루션은..."
개선: "업계 유일의 AI 기반 자동 최적화로..."

**2. 사회적 증명 추가**
기존: "많은 기업에서..."
개선: "삼성SDS, LG CNS 등 30개 기업이 도입한..."

**3. 구체적 실행 계획**
기존: "빠른 도입이 가능합니다"
개선: "4주차 파일럿, 12주차 완전 이전 완료"

### 🎯 예상 개선 점수: 89/100

*개발 환경용 샘플입니다.*`,

      'objection-handler': `## 🛡️ 이의제기 대응 스크립트

### 고객 이의제기: "${prompt}"

**🎯 5단계 대응 전략**

**1단계: 공감 표시**
"그 우려 충분히 이해합니다. 실제로 많은 CTO분들이 같은 고민을 하고 계십니다."

**2단계: 재프레이밍**
"오히려 그런 신중함이 현명한 접근이라고 생각합니다. 그렇기 때문에..."

**3단계: 증거 제시**
"실제로 비슷한 우려를 가지셨던 A사의 경우..."
• 구체적 사례: OO기업 - 6개월 만에 40% 성능 향상
• 수치적 근거: 평균 다운타임 99.9% → 99.99% 개선
• 고객 증언: "처음엔 걱정했지만 결과적으로 최고의 결정"

**4단계: 리스크 해결**
"혹시 우려되시는 부분을 최소화하기 위해..."
• 단계적 마이그레이션 옵션
• 롤백 계획 수립
• 24/7 전담 지원팀 배정

**5단계: 다음 단계 제안**
"우선 작은 것부터 시작해보시는 건 어떨까요?"
• 무료 파일럿 프로그램
• 1개월 체험 서비스
• ROI 보장 약속

**🗣️ 실제 대화 스크립트**
고객: "${prompt}"
답변: "네, 정말 중요한 포인트입니다. 실제로 저희 고객 중 85%가 처음에 같은 우려를 표현하셨는데요..."

*개발 환경용 샘플입니다.*`
    }

    return mockResponses[tool as keyof typeof mockResponses] || '죄송합니다. 응답을 생성할 수 없습니다.'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI 세일즈 도구</h1>
              <p className="text-gray-600">GPT-4 기반 잠재고객 발굴 및 세일즈 자동화 도구</p>
            </div>
          </div>
        </div>

        {/* 도구 탭 */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tools.map((tool) => {
                const Icon = tool.icon
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tool.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tool.name}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'prospect-research' && (
              <ProspectResearchTool onAICall={callAI} loading={loading} onCopy={handleCopy} copied={copied} />
            )}
            {activeTab === 'email-generator' && (
              <EmailGeneratorTool onAICall={callAI} loading={loading} onCopy={handleCopy} copied={copied} />
            )}
            {activeTab === 'pitch-analyzer' && (
              <PitchAnalyzerTool onAICall={callAI} loading={loading} onCopy={handleCopy} copied={copied} />
            )}
            {activeTab === 'objection-handler' && (
              <ObjectionHandlerTool onAICall={callAI} loading={loading} onCopy={handleCopy} copied={copied} />
            )}
          </div>
        </div>

        {/* 사용 가이드 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">AI 도구 활용 팁</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>구체적인 정보를 입력할수록 더 정확한 결과를 얻을 수 있습니다</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>생성된 결과는 복사하여 바로 사용하거나 추가 편집이 가능합니다</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>각 도구는 실제 세일즈 상황에 최적화되어 있습니다</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>AI 결과를 참고하여 개인적인 스타일로 커스터마이징하세요</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 잠재고객 리서치 도구
function ProspectResearchTool({ onAICall, loading, onCopy, copied }: {
  onAICall: (prompt: string, tool: string) => Promise<string>
  loading: boolean
  onCopy: (text: string) => void
  copied: boolean
}) {
  const [companyName, setCompanyName] = useState('')
  const [result, setResult] = useState('')

  const handleResearch = async () => {
    if (!companyName.trim()) return
    const response = await onAICall(companyName, 'prospect-research')
    setResult(response)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">잠재고객 리서치</h3>
        <p className="text-gray-600">회사명을 입력하면 AI가 상세한 잠재고객 정보를 분석해드립니다.</p>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="회사명을 입력하세요 (예: 삼성전자, 카카오)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
        />
        <button
          onClick={handleResearch}
          disabled={loading || !companyName.trim()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              분석 시작
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">분석 결과</h4>
            <button
              onClick={() => onCopy(result)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              복사
            </button>
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{result}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

// 이메일 생성 도구
function EmailGeneratorTool({ onAICall, loading, onCopy, copied }: {
  onAICall: (prompt: string, tool: string) => Promise<string>
  loading: boolean
  onCopy: (text: string) => void
  copied: boolean
}) {
  const [companyName, setCompanyName] = useState('')
  const [context, setContext] = useState('')
  const [result, setResult] = useState('')

  const handleGenerate = async () => {
    if (!companyName.trim()) return
    const prompt = `${companyName}에게 보낼 세일즈 이메일을 생성해주세요. 추가 정보: ${context}`
    const response = await onAICall(prompt, 'email-generator')
    setResult(response)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">세일즈 이메일 생성</h3>
        <p className="text-gray-600">타겟 회사와 상황을 입력하면 맞춤형 세일즈 이메일을 생성해드립니다.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">타겟 회사명</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="예: 네이버, 쿠팡"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">추가 상황 정보 (선택)</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="예: 최근 투자 유치, 새로운 사업 진출, 특별한 니즈 등"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !companyName.trim()}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              이메일 생성 중...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              이메일 생성
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">생성된 이메일</h4>
            <button
              onClick={() => onCopy(result)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              복사
            </button>
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{result}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

// 피치 분석 도구
function PitchAnalyzerTool({ onAICall, loading, onCopy, copied }: {
  onAICall: (prompt: string, tool: string) => Promise<string>
  loading: boolean
  onCopy: (text: string) => void
  copied: boolean
}) {
  const [pitch, setPitch] = useState('')
  const [result, setResult] = useState('')

  const handleAnalyze = async () => {
    if (!pitch.trim()) return
    const response = await onAICall(pitch, 'pitch-analyzer')
    setResult(response)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">세일즈 피치 분석</h3>
        <p className="text-gray-600">세일즈 피치를 입력하면 AI가 효과성을 분석하고 개선안을 제시합니다.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">세일즈 피치</label>
          <textarea
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="분석할 세일즈 피치를 입력하세요..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !pitch.trim()}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              피치 분석 중...
            </>
          ) : (
            <>
              <Target className="h-4 w-4" />
              피치 분석
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">분석 결과</h4>
            <button
              onClick={() => onCopy(result)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              복사
            </button>
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{result}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

// 이의제기 대응 도구
function ObjectionHandlerTool({ onAICall, loading, onCopy, copied }: {
  onAICall: (prompt: string, tool: string) => Promise<string>
  loading: boolean
  onCopy: (text: string) => void
  copied: boolean
}) {
  const [objection, setObjection] = useState('')
  const [result, setResult] = useState('')

  const commonObjections = [
    "예산이 부족합니다",
    "기존 솔루션으로 충분합니다",
    "시기가 적절하지 않습니다",
    "의사결정권자가 따로 있습니다",
    "보안이 우려됩니다"
  ]

  const handleAnalyze = async () => {
    if (!objection.trim()) return
    const response = await onAICall(objection, 'objection-handler')
    setResult(response)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">이의제기 대응 스크립트</h3>
        <p className="text-gray-600">고객의 이의제기를 입력하면 효과적인 대응 스크립트를 생성해드립니다.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">고객 이의제기</label>
          <textarea
            value={objection}
            onChange={(e) => setObjection(e.target.value)}
            placeholder="고객이 제기한 이의나 우려사항을 입력하세요..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">자주 받는 이의제기</label>
          <div className="flex flex-wrap gap-2">
            {commonObjections.map((common, index) => (
              <button
                key={index}
                onClick={() => setObjection(common)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {common}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !objection.trim()}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              대응 스크립트 생성 중...
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4" />
              대응 스크립트 생성
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">대응 스크립트</h4>
            <button
              onClick={() => onCopy(result)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              복사
            </button>
          </div>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{result}</pre>
          </div>
        </div>
      )}
    </div>
  )
} 