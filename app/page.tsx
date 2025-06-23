import { LeadDiscovery } from '@/components/sales/lead-discovery'
import { SalesIntelligence } from '@/components/dashboard/sales-intelligence'
import { ArrowRight, Target, Clock, Mail, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            🚀 <span className="ml-2">AI 기반 B2B 세일즈 인텔리전스</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Pipey AI
            </span>로<br />
            <span className="text-gray-700">완벽한 타이밍에</span><br />
            <span className="text-gray-700">세일즈 성공률을</span> 
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"> 3배</span> 높이세요
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            <strong>실시간 뉴스 분석</strong>으로 고객사의 <strong>최적 컨택 타이밍</strong>을 찾고,<br />
            <strong>AI가 생성한 맞춤형 세일즈 메시지</strong>로 응답률을 극대화하세요.
          </p>

          {/* Value Proposition Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. 스마트 리드 발굴</h3>
              <p className="text-gray-600">
                타겟 기업 정보만 입력하면 AI가 자동으로<br />
                <strong>비즈니스 기회를 분석</strong>합니다.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. 최적 타이밍 분석</h3>
              <p className="text-gray-600">
                실시간 뉴스와 시장 동향을 분석해<br />
                <strong>컨택 타이밍을 정확히 예측</strong>합니다.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. AI 세일즈 메시지</h3>
              <p className="text-gray-600">
                상황에 맞는 <strong>개인화된 세일즈 메시지</strong>를<br />
                자동 생성하고 바로 발송할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Discovery Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                지금 시작해보세요
              </h2>
              <p className="text-lg text-gray-600">
                타겟 기업을 입력하면 <strong>무료로 3개 리드 분석</strong>을 받을 수 있습니다
              </p>
            </div>
            
            <LeadDiscovery />
          </div>
        </div>
      </div>

      {/* Sales Intelligence Preview */}
      <div className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                실시간 세일즈 인텔리전스
              </h2>
              <p className="text-lg text-gray-600">
                AI가 분석한 <strong>Hot 리드</strong>를 우선순위대로 확인하고 즉시 액션하세요
              </p>
            </div>
            
            <SalesIntelligence />
          </div>
        </div>
      </div>

      {/* Performance Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pipey 도입 후 성과
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              이미 수백 개의 B2B 스타트업이 Pipey로 세일즈 성과를 개선하고 있습니다
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">3.2배</div>
                <div className="text-gray-600">응답률 향상</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">87%</div>
                <div className="text-gray-600">세일즈 프로세스 자동화</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">2.8배</div>
                <div className="text-gray-600">전환율 개선</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl mb-8 opacity-90">
              무료 체험으로 3개 리드 분석을 받아보고<br />
              Pipey의 강력함을 직접 경험해보세요
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
              무료로 시작하기 <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 