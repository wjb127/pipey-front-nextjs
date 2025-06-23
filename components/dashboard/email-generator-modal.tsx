'use client'

import { useState } from 'react'
import { ProspectWithIntelligence } from '@/lib/types'
import { X, Copy, Check, Mail, User, Building2, Target } from 'lucide-react'

interface EmailGeneratorModalProps {
  prospect: ProspectWithIntelligence
  isOpen: boolean
  onClose: () => void
}

export function EmailGeneratorModal({ prospect, isOpen, onClose }: EmailGeneratorModalProps) {
  const [copied, setCopied] = useState(false)
  const [emailType, setEmailType] = useState<'initial' | 'follow_up' | 'proposal'>('initial')

  if (!isOpen) return null

  // 이메일 템플릿 생성
  const generateEmailContent = () => {
    const primaryContact = prospect.intelligence?.decision_makers?.primary
    const companyName = prospect.company_name
    const painPoints = prospect.intelligence?.pain_points || []
    const valueProps = prospect.intelligence?.value_props || []
    const recentEvent = prospect.intelligence?.recent_triggers?.[0]

    const templates = {
      initial: {
        subject: `${companyName} 클라우드 마이그레이션 비용 30% 절감 방안`,
        body: `안녕하세요 ${primaryContact?.name || '담당자'}님,

클라우드브릿지의 ${primaryContact?.name || '세일즈 담당자'} 김세일즈입니다.

${companyName}의 ${recentEvent ? `최근 ${recentEvent}와 관련하여` : '현재 IT 인프라 현황을 검토하던 중'}, 저희 CloudBridge Migration Suite가 도움이 될 수 있을 것 같아 연락드립니다.

**${companyName}의 현재 상황에서 예상되는 주요 이슈:**
${painPoints.slice(0, 2).map(point => `• ${point}`).join('\n')}

**저희 솔루션으로 해결 가능한 부분:**
${valueProps.slice(0, 2).map(prop => `✓ ${prop}`).join('\n')}

특히 ${companyName}와 같은 ${prospect.industry} 업계의 ${prospect.employee_count}명 규모 기업에서는 평균적으로:
• 클라우드 마이그레이션 후 30% 운영비용 절감
• 99.9% 시스템 안정성 보장
• 3-6개월 내 완전한 클라우드 전환 완료

간단한 15분 통화로 ${companyName}의 현재 상황을 더 자세히 듣고, 맞춤형 마이그레이션 플랜을 제안드릴 수 있습니다.

이번 주 중 통화 가능한 시간이 있으실까요?

감사합니다.

김세일즈
클라우드브릿지 | 세일즈 매니저
📧 sales@cloudbridge.com
📞 02-1234-5678
🌐 www.cloudbridge.com

P.S. 첨부한 케이스 스터디는 ${prospect.industry} 업계의 비슷한 규모 기업이 저희 솔루션으로 어떤 성과를 얻었는지 보여줍니다.`
      },
      follow_up: {
        subject: `${companyName} 클라우드 마이그레이션 제안 - 팔로업`,
        body: `안녕하세요 ${primaryContact?.name || '담당자'}님,

지난 주 보내드린 클라우드 마이그레이션 관련 제안에 대해 팔로업 드립니다.

${companyName}의 현재 ${prospect.technologies?.join(', ') || 'IT 인프라'} 환경에서 클라우드로의 전환은 단순히 비용 절감뿐만 아니라, 비즈니스 민첩성 향상에도 큰 도움이 될 것으로 생각됩니다.

**추가로 고려해볼 만한 포인트들:**
• 현재 ${prospect.industry} 업계 트렌드: 클라우드 우선 정책 확산
• 규제 준수: 데이터 보안 및 개인정보보호 강화
• 확장성: 비즈니스 성장에 따른 유연한 인프라 확장

혹시 더 구체적인 질문이나 우려사항이 있으시다면 언제든 말씀해 주세요.

10분만 시간을 내주신다면 ${companyName}만의 맞춤형 ROI 분석 자료를 준비해서 보여드릴 수 있습니다.

답변 기다리겠습니다.

김세일즈
클라우드브릿지`
      },
      proposal: {
        subject: `${companyName} 맞춤형 클라우드 마이그레이션 제안서`,
        body: `${primaryContact?.name || '담당자'}님께,

${companyName}의 클라우드 마이그레이션 프로젝트에 대한 상세 제안서를 보내드립니다.

**프로젝트 개요:**
• 대상: ${prospect.technologies?.join(', ') || '기존 IT 인프라'} → AWS/Azure 클라우드
• 기간: 4-6개월 (단계별 진행)
• 예상 효과: 30% 비용 절감, 99.9% 가용성 보장

**제안 내용:**
1. Phase 1: 현상 분석 및 마이그레이션 계획 수립 (4주)
2. Phase 2: 파일럿 시스템 마이그레이션 (6주)
3. Phase 3: 전체 시스템 순차적 마이그레이션 (8-12주)
4. Phase 4: 최적화 및 운영 안정화 (4주)

**투자 대비 효과 (ROI):**
• 1년차: 운영비 ${Math.floor((prospect.annual_revenue || 5000000000) * 0.05 / 100000000)}억원 절감
• 3년차: 총 ${Math.floor((prospect.annual_revenue || 5000000000) * 0.15 / 100000000)}억원 비용 효율화
• 비즈니스 연속성: 다운타임 95% 감소

첨부된 상세 제안서를 검토해 주시고, 다음 주 중 30분 정도 미팅 시간을 가질 수 있을까요?

제안서에 대한 질문이나 추가 정보가 필요하시면 언제든 연락주세요.

감사합니다.

김세일즈
클라우드브릿지 | 세일즈 매니저
sales@cloudbridge.com`
      }
    }

    return templates[emailType]
  }

  const emailContent = generateEmailContent()

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('복사 실패:', err)
    }
  }

  const emailInfo = {
    to: `${prospect.intelligence?.decision_makers?.primary?.name?.toLowerCase().replace(' ', '.')}@${prospect.company_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    cc: '',
    subject: emailContent.subject,
    body: emailContent.body
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                세일즈 이메일 생성
              </h2>
              <p className="text-sm text-gray-600">
                {prospect.company_name} • {prospect.intelligence?.decision_makers?.primary?.name || '담당자'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* 좌측: 이메일 정보 */}
          <div className="w-1/3 border-r bg-gray-50 p-6 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              잠재고객 정보
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700">회사명</label>
                <p className="text-sm text-gray-900">{prospect.company_name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">업종</label>
                <p className="text-sm text-gray-900">{prospect.industry}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">규모</label>
                <p className="text-sm text-gray-900">{prospect.employee_count}명</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">주요 담당자</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {prospect.intelligence?.decision_makers?.primary?.name || '담당자'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {prospect.intelligence?.decision_makers?.primary?.title || '직책 미상'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">적합도 점수</label>
                <div className="flex items-center gap-2 mt-1">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-lg font-bold text-blue-600">{prospect.qualification_score}</span>
                  <span className="text-sm text-gray-500">/ 100</span>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-4">이메일 유형</h3>
            <div className="space-y-2 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="initial"
                  checked={emailType === 'initial'}
                  onChange={(e) => setEmailType(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">첫 연락 (Initial Outreach)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="follow_up"
                  checked={emailType === 'follow_up'}
                  onChange={(e) => setEmailType(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">팔로업 (Follow-up)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="proposal"
                  checked={emailType === 'proposal'}
                  onChange={(e) => setEmailType(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-sm">제안서 (Proposal)</span>
              </label>
            </div>

            <h3 className="font-semibold text-gray-900 mb-4">이메일 정보</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="font-medium text-gray-700">받는 사람:</label>
                <div className="mt-1 p-2 bg-white border rounded flex items-center justify-between">
                  <span className="text-gray-900 truncate">{emailInfo.to}</span>
                  <button
                    onClick={() => handleCopy(emailInfo.to)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {emailInfo.cc && (
                <div>
                  <label className="font-medium text-gray-700">참조:</label>
                  <div className="mt-1 p-2 bg-white border rounded flex items-center justify-between">
                    <span className="text-gray-900 truncate">{emailInfo.cc}</span>
                    <button
                      onClick={() => handleCopy(emailInfo.cc)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <div>
                <label className="font-medium text-gray-700">제목:</label>
                <div className="mt-1 p-2 bg-white border rounded flex items-center justify-between">
                  <span className="text-gray-900 truncate">{emailInfo.subject}</span>
                  <button
                    onClick={() => handleCopy(emailInfo.subject)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 우측: 이메일 내용 */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">이메일 내용</h3>
              <button
                onClick={() => handleCopy(emailContent.body)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    내용 복사
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-white border rounded-lg p-6 h-[calc(100%-80px)] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans leading-relaxed">
                {emailContent.body}
              </pre>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            이메일 내용을 복사한 후 메일 프로그램에 붙여넣어 사용하세요.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              닫기
            </button>
            <button
              onClick={() => handleCopy(`받는 사람: ${emailInfo.to}\n제목: ${emailInfo.subject}\n\n${emailContent.body}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              전체 복사
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 