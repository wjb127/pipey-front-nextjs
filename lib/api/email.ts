// Mock API functions for email generation
export async function generateSalesEmail(analysisId: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock email generation based on analysis
  return {
    subject: `맞춤형 세일즈 솔루션 제안 - AI 분석 기반`,
    content: `안녕하세요,

귀하의 회사에 대한 최신 시장 동향과 비즈니스 인사이트를 분석한 결과, 저희 Pipey AI 세일즈 인텔리전스 솔루션이 큰 도움이 될 것으로 판단됩니다.

주요 인사이트:
• 최근 시장 확장 동향에 따른 신규 기회 발견
• 고객 세그먼트 최적화를 통한 매출 증대 가능성
• AI 기반 세일즈 프로세스 자동화로 효율성 극대화

저희와 함께하면:
✅ 세일즈 성공률 3배 향상
✅ 리드 발굴 시간 87% 단축
✅ 개인화된 메시지로 응답률 대폭 개선

15분 정도의 간단한 데모를 통해 구체적인 성과를 보여드리고 싶습니다.

언제 시간이 되실까요?

감사합니다.

Pipey Sales Intelligence Team`
  }
}

export async function sendEmail(to: string, subject: string, content: string) {
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock successful send
  return {
    success: true,
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
} 