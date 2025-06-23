import Link from 'next/link'
import { ArrowRight, Target, Brain, MessageCircle, Zap, Users, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI가 자동으로
            </span>
            <br />
            잠재고객을 발굴합니다
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            고객사 정보만 입력하면 AI가 최적의 잠재고객을 찾아내고, 
            맞춤형 컨택 전략까지 제안하는 완전 자동화된 B2B 세일즈 인텔리전스 플랫폼
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              무료로 시작하기
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
            <Link
              href="/analytics"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
            >
              데모 보기
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">95%</div>
              <div className="text-gray-600">타겟팅 정확도</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">10x</div>
              <div className="text-gray-600">발굴 속도 향상</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">300%</div>
              <div className="text-gray-600">응답률 증가</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              어떻게 작동하나요?
            </h2>
            <p className="text-xl text-gray-600">
              단 3단계로 완전 자동화된 잠재고객 발굴을 경험하세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                1. 고객사 정보 입력
              </h3>
              <p className="text-gray-600">
                회사 정보, 제품/서비스, 이상적 고객 프로필(ICP)을 
                한 번만 입력하면 끝!
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                2. AI 자동 발굴
              </h3>
              <p className="text-gray-600">
                AI가 LinkedIn, Crunchbase 등에서 
                최적의 잠재고객을 자동으로 발굴하고 분석
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                3. 맞춤형 컨택 전략
              </h3>
              <p className="text-gray-600">
                개인화된 메시지와 최적의 컨택 타이밍을 
                AI가 자동으로 제안
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              강력한 AI 기능들
            </h2>
            <p className="text-xl text-gray-600">
              세일즈 팀의 생산성을 10배 향상시키는 스마트 기능들
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Target className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                정밀한 타겟팅
              </h3>
              <p className="text-gray-600">
                ICP 기반으로 95% 정확도의 잠재고객 매칭
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Brain className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                실시간 인텔리전스
              </h3>
              <p className="text-gray-600">
                최신 뉴스와 트리거 이벤트 기반 컨택 타이밍 분석
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Zap className="h-12 w-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                자동화 워크플로우
              </h3>
              <p className="text-gray-600">
                발굴부터 아웃리치까지 완전 자동화된 프로세스
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <MessageCircle className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                개인화 메시지
              </h3>
              <p className="text-gray-600">
                각 잠재고객에 맞춤화된 GPT 기반 세일즈 메시지
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <TrendingUp className="h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                성과 분석
              </h3>
              <p className="text-gray-600">
                응답률, 전환율 등 상세한 성과 지표 제공
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <Users className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                팀 협업
              </h3>
              <p className="text-gray-600">
                영업팀 전체가 함께 사용할 수 있는 통합 대시보드
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            이미 많은 기업들이 사용하고 있습니다
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            <div className="flex items-center justify-center h-16">
              <div className="text-lg font-bold text-gray-400">삼성전자</div>
            </div>
            <div className="flex items-center justify-center h-16">
              <div className="text-lg font-bold text-gray-400">현대자동차</div>
            </div>
            <div className="flex items-center justify-center h-16">
              <div className="text-lg font-bold text-gray-400">LG화학</div>
            </div>
            <div className="flex items-center justify-center h-16">
              <div className="text-lg font-bold text-gray-400">네이버</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            첫 10개 잠재고객 발굴은 무료입니다
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            무료로 잠재고객 발굴하기
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
} 