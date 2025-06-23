import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
})

// 도구별 시스템 프롬프트
const SYSTEM_PROMPTS = {
  'prospect-research': `
당신은 B2B 세일즈 전문가입니다. 주어진 회사명을 분석하여 잠재고객으로서의 가치를 평가해주세요.
다음 항목들을 포함하여 상세한 분석을 제공하세요:

1. 기본 정보 (업종, 설립년도, 직원 수, 위치)
2. 재무 현황 (투자, 매출, 성장률)
3. 비즈니스 모델 및 주력 사업
4. 잠재적 페인포인트
5. 세일즈 접근 포인트
6. 추천 커뮤니케이션 방법

분석은 한국어로 작성하고, 실제 데이터가 없는 경우 합리적인 추정치를 제공하되 이를 명시해주세요.
`,

  'email-generator': `
당신은 전문적인 세일즈 이메일 작성 전문가입니다. 
클라우드브릿지라는 클라우드 인프라 서비스 회사의 세일즈 담당자로서 맞춤형 이메일을 작성해주세요.

이메일 구성:
1. 매력적인 제목
2. 개인화된 인사말
3. 타겟 회사 상황 분석
4. 명확한 가치 제안
5. 구체적인 베네핏
6. 간단한 CTA (Call to Action)
7. 전문적인 서명

톤앤매너: 전문적이지만 친근하고, 고압적이지 않으며 도움이 되고자 하는 느낌
`,

  'pitch-analyzer': `
당신은 세일즈 피치 분석 전문가입니다. 주어진 세일즈 피치를 분석하고 개선안을 제시해주세요.

분석 항목:
1. 전체 점수 (100점 만점)
2. 강점 분석
3. 개선 포인트
4. 구체적인 개선 제안
5. 수정된 버전 (옵션)

평가 기준:
- 명확성 (메시지가 명확한가?)
- 가치 제안 (고객에게 어떤 가치를 주는가?)
- 차별화 (경쟁사와 어떻게 다른가?)
- 증거/신뢰성 (주장을 뒷받침하는 증거가 있는가?)
- 감정적 어필 (고객의 감정에 어필하는가?)
`,

  'objection-handler': `
당신은 세일즈 이의제기 대응 전문가입니다. 고객의 이의제기에 대한 효과적인 대응 방법을 제시해주세요.

대응 프레임워크:
1. 공감 표시 (고객의 우려를 인정)
2. 재프레이밍 (다른 관점 제시)
3. 증거 제시 (사례, 데이터, 레퍼런스)
4. 리스크 해결 (우려사항 해결 방안)
5. 다음 단계 제안 (작은 합의점 찾기)

실제 대화에서 사용할 수 있는 구체적인 스크립트를 제공해주세요.
`
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, tool, model = 'gpt-4o-mini' } = await request.json()

    if (!prompt || !tool) {
      return NextResponse.json({ error: '프롬프트와 도구를 지정해주세요.' }, { status: 400 })
    }

    const systemPrompt = SYSTEM_PROMPTS[tool as keyof typeof SYSTEM_PROMPTS]
    if (!systemPrompt) {
      return NextResponse.json({ error: '지원하지 않는 도구입니다.' }, { status: 400 })
    }

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const result = completion.choices[0]?.message?.content || '응답을 생성할 수 없습니다.'

    return NextResponse.json({ result })

  } catch (error: any) {
    console.error('OpenAI API 오류:', error)
    
    // API 키가 없거나 잘못된 경우 개발용 목업 응답 반환
    if (error?.code === 'invalid_api_key' || !process.env.OPENAI_API_KEY) {
      const { tool: errorTool, prompt: errorPrompt } = await request.json()
      return NextResponse.json({ 
        result: getDevelopmentMockResponse(errorTool, errorPrompt)
      })
    }

    return NextResponse.json(
      { error: 'AI 서비스 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 개발용 목업 응답
function getDevelopmentMockResponse(tool: string, prompt: string) {
  const responses = {
    'prospect-research': `
## 🏢 ${prompt} 회사 분석 결과

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

*이 분석은 개발 환경용 샘플 데이터입니다.*
    `,
    'email-generator': `
## 📧 맞춤형 세일즈 이메일

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

*이 이메일은 개발 환경용 샘플입니다.*
    `,
    'pitch-analyzer': `
## 🎯 피치 분석 결과

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

*이 분석은 개발 환경용 샘플입니다.*
    `,
    'objection-handler': `
## 🛡️ 이의제기 대응 스크립트

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
답변: "네, 정말 중요한 포인트입니다. 실제로 저희 고객 중 85%가 처음에 같은 우려를 표현하셨는데요. 오히려 그런 신중함 때문에 더 성공적인 결과를 얻으실 수 있을 거라 생각합니다..."

*이 스크립트는 개발 환경용 샘플입니다.*
    `
  }

  return responses[tool as keyof typeof responses] || '개발 환경용 샘플 응답입니다.'
} 