'use client'

import { useState } from 'react'
import { X, Copy, Send, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sendEmail } from '@/lib/api/email'

interface EmailPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  companyName: string
  subject: string
  content: string
  recipientEmail?: string
}

export function EmailPreviewModal({
  isOpen,
  onClose,
  companyName,
  subject,
  content,
  recipientEmail: initialRecipientEmail,
}: EmailPreviewModalProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState(initialRecipientEmail || '')

  if (!isOpen) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`제목: ${subject}\n\n${content}`)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('클립보드 복사 실패:', error)
    }
  }

  const handleSend = async () => {
    if (!recipientEmail.trim()) {
      alert('수신자 이메일을 입력해주세요.')
      return
    }

    setIsSending(true)
    try {
      const result = await sendEmail(recipientEmail, subject, content)

      if (result.success) {
        alert('이메일이 성공적으로 발송되었습니다!')
        onClose()
      } else {
        alert('이메일 발송에 실패했습니다.')
      }
    } catch (error) {
      console.error('이메일 발송 실패:', error)
      alert('이메일 발송 중 오류가 발생했습니다.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {companyName} 세일즈 메일
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-gray-900">{subject}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border min-h-[200px]">
              <pre className="whitespace-pre-wrap text-gray-900 text-sm leading-relaxed">
                {content}
              </pre>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수신자 이메일 (발송시 필요)
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="example@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>복사됨!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>복사</span>
                </>
              )}
            </button>

            <button
              onClick={handleSend}
              disabled={isSending || !recipientEmail.trim()}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                'bg-blue-600 text-white hover:bg-blue-700',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>발송 중...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>이메일 발송</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 