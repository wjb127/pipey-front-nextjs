'use client'

import { useState } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateSalesEmail } from '@/lib/api/email'
import { EmailPreviewModal } from './email-preview-modal'

interface GenerateEmailButtonProps {
  companyName: string
  analysisId?: string
  insights?: string[]
  contactEmail?: string
  className?: string
}

export function GenerateEmailButton({ 
  companyName, 
  analysisId, 
  insights,
  contactEmail,
  className 
}: GenerateEmailButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [emailContent, setEmailContent] = useState<{
    subject: string
    content: string
  } | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleGenerateEmail = async () => {
    setIsGenerating(true)
    try {
      let result
      if (analysisId) {
        result = await generateSalesEmail(analysisId)
      } else {
        // insights 기반으로 이메일 생성 (모의 구현)
        result = {
          subject: `${companyName} 파트너십 제안`,
          content: `안녕하세요,

${companyName}의 최근 성장세와 시장 확장 소식을 보며 연락드립니다.

저희 Pipey는 AI 기반 세일즈 인텔리전스 솔루션을 제공하며, ${companyName}의 비즈니스 성장에 도움이 될 수 있는 솔루션을 보유하고 있습니다.

${insights ? insights.slice(0, 2).map(insight => `• ${insight}`).join('\n') : ''}

간단한 미팅을 통해 구체적인 협력 방안을 논의해보고 싶습니다.

언제 시간이 되실까요?

감사합니다.`
        }
      }
      
      if (result) {
        setEmailContent({
          subject: result.subject,
          content: result.content,
        })
        setShowModal(true)
      }
    } catch (error) {
      console.error('이메일 생성 실패:', error)
      // TODO: 에러 토스트 표시
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <button
        onClick={handleGenerateEmail}
        disabled={isGenerating}
        className={cn(
          'flex items-center justify-center space-x-2 px-4 py-2',
          'bg-blue-600 text-white rounded-lg font-medium',
          'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200',
          className
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>메일 생성 중...</span>
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" />
            <span>세일즈 메일 생성</span>
          </>
        )}
      </button>

      {emailContent && (
        <EmailPreviewModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          companyName={companyName}
          subject={emailContent.subject}
          content={emailContent.content}
          recipientEmail={contactEmail}
        />
      )}
    </>
  )
} 