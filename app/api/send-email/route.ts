import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, content } = await request.json()

    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, content' },
        { status: 400 }
      )
    }

    // Mock email sending (실제로는 Resend나 다른 이메일 서비스 사용)
    // 개발 환경에서는 시뮬레이션만 진행
    console.log('이메일 전송 시뮬레이션:', { to, subject, content })
    
    // 이메일 전송 시뮬레이션 지연
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: '이메일이 성공적으로 전송되었습니다.'
    })

  } catch (error) {
    console.error('이메일 전송 오류:', error)
    return NextResponse.json(
      { error: '이메일 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 