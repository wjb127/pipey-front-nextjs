'use client'

import { useState, useEffect } from 'react'
import { ClientCompany } from '@/lib/types'
import { getClientCompany } from '@/lib/api/analytics'
import { registerClientCompany } from '@/lib/actions/company-actions'
import { Building2, Target, Lightbulb, Users, DollarSign, Save, Check, AlertCircle } from 'lucide-react'

export default function CompanySetupPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [clientCompany, setClientCompany] = useState<ClientCompany | null>(null)
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    description: '',
    targetMarket: '',
    mainProduct: '',
    valueProposition: '',
    icpCompanySize: '',
    icpIndustries: '',
    icpPainPoints: '',
    icpBudgetRange: ''
  })

  useEffect(() => {
    async function loadCompanyData() {
      try {
        const company = await getClientCompany()
        if (company) {
          setClientCompany(company)
          setFormData({
            companyName: company.company_name,
            industry: company.industry,
            description: company.description,
            targetMarket: company.target_market,
            mainProduct: company.products_services.main_product,
            valueProposition: company.value_proposition,
            icpCompanySize: company.ideal_customer_profile.company_size,
            icpIndustries: company.ideal_customer_profile.industry.join(', '),
            icpPainPoints: company.ideal_customer_profile.pain_points.join(', '),
            icpBudgetRange: company.ideal_customer_profile.budget_range || ''
          })
        }
      } catch (error) {
        console.error('고객사 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCompanyData()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      const result = await registerClientCompany(formDataObj)
      
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('저장 실패:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">고객사 설정</h1>
              <p className="text-gray-600">AI 잠재고객 발굴을 위한 회사 정보를 입력해주세요</p>
            </div>
          </div>
          
          {saved && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">설정이 성공적으로 저장되었습니다!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 폼 (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 클라우드브릿지"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    업종 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">업종을 선택하세요</option>
                    <option value="IT 서비스">IT 서비스</option>
                    <option value="소프트웨어 개발">소프트웨어 개발</option>
                    <option value="클라우드 서비스">클라우드 서비스</option>
                    <option value="AI/머신러닝">AI/머신러닝</option>
                    <option value="핀테크">핀테크</option>
                    <option value="헬스케어">헬스케어</option>
                    <option value="이커머스">이커머스</option>
                    <option value="교육">교육</option>
                    <option value="제조업">제조업</option>
                    <option value="컨설팅">컨설팅</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  회사 설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="회사가 제공하는 서비스나 제품에 대해 간단히 설명해주세요"
                />
              </div>
            </div>

            {/* 제품/서비스 정보 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">제품/서비스 정보</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    타겟 시장
                  </label>
                  <input
                    type="text"
                    value={formData.targetMarket}
                    onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 중소기업 IT 담당자, CTO, 개발팀장"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    주요 제품/서비스
                  </label>
                  <input
                    type="text"
                    value={formData.mainProduct}
                    onChange={(e) => handleInputChange('mainProduct', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: CloudBridge Migration Suite"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가치 제안
                  </label>
                  <textarea
                    value={formData.valueProposition}
                    onChange={(e) => handleInputChange('valueProposition', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="고객에게 제공하는 핵심 가치를 설명해주세요"
                  />
                </div>
              </div>
            </div>

            {/* 이상적 고객 프로필 (ICP) */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">이상적 고객 프로필 (ICP)</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      타겟 회사 규모
                    </label>
                    <select
                      value={formData.icpCompanySize}
                      onChange={(e) => handleInputChange('icpCompanySize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">규모를 선택하세요</option>
                      <option value="1-10명">1-10명 (스타트업)</option>
                      <option value="11-50명">11-50명 (소기업)</option>
                      <option value="51-200명">51-200명 (중소기업)</option>
                      <option value="201-1000명">201-1000명 (중견기업)</option>
                      <option value="1000명+">1000명+ (대기업)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      예산 범위
                    </label>
                    <select
                      value={formData.icpBudgetRange}
                      onChange={(e) => handleInputChange('icpBudgetRange', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">예산 범위를 선택하세요</option>
                      <option value="월 $100-$500">월 $100-$500</option>
                      <option value="월 $500-$2000">월 $500-$2000</option>
                      <option value="월 $2000-$5000">월 $2000-$5000</option>
                      <option value="월 $5000-$10000">월 $5000-$10000</option>
                      <option value="월 $10000+">월 $10000+</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    타겟 업종 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={formData.icpIndustries}
                    onChange={(e) => handleInputChange('icpIndustries', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 제조업, IT 서비스, 금융, 헬스케어"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    핵심 페인포인트 (쉼표로 구분)
                  </label>
                  <textarea
                    value={formData.icpPainPoints}
                    onChange={(e) => handleInputChange('icpPainPoints', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: 레거시 시스템 유지비용 부담, 클라우드 전문성 부족, 다운타임 우려"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 사이드바 (1/3) */}
          <div className="space-y-6">
            {/* 저장 버튼 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    설정 저장
                  </>
                )}
              </button>
            </div>

            {/* 도움말 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">설정 팁</h3>
              </div>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>정확한 고객사 정보는 더 정밀한 AI 잠재고객 발굴로 이어집니다</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>ICP 설정이 구체적일수록 높은 품질의 리드를 발굴할 수 있습니다</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>언제든지 설정을 수정하여 발굴 결과를 최적화할 수 있습니다</p>
                </div>
              </div>
            </div>

            {/* 현재 설정 요약 */}
            {clientCompany && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">현재 설정</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">회사:</span>
                    <span className="ml-2 font-medium">{clientCompany.company_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">업종:</span>
                    <span className="ml-2 font-medium">{clientCompany.industry}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">타겟 규모:</span>
                    <span className="ml-2 font-medium">{clientCompany.ideal_customer_profile.company_size || '미설정'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">타겟 업종:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {clientCompany.ideal_customer_profile.industry.map((ind, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 경고 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">중요 안내</p>
                  <p className="text-yellow-700">
                    고객사 설정 변경 후에는 새로운 잠재고객 발굴 작업을 시작해야 업데이트된 기준이 적용됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 