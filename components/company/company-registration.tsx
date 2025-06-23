'use client'

import { useState, useTransition } from 'react'

interface CompanyRegistrationForm {
  company_name: string
  industry: string
  company_size: string
  website: string
  description: string
  target_market: string
  main_product: string
  key_features: string[]
  pricing_model: string
  value_proposition: string
  target_company_size: string
  target_industries: string[]
  target_pain_points: string[]
  budget_range: string
}

export default function CompanyRegistration() {
  const [formData, setFormData] = useState<CompanyRegistrationForm>({
    company_name: '',
    industry: '',
    company_size: '',
    website: '',
    description: '',
    target_market: '',
    main_product: '',
    key_features: [],
    pricing_model: '',
    value_proposition: '',
    target_company_size: '',
    target_industries: [],
    target_pain_points: [],
    budget_range: ''
  })
  
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [keyFeature, setKeyFeature] = useState('')
  const [targetIndustry, setTargetIndustry] = useState('')
  const [painPoint, setPainPoint] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addKeyFeature = () => {
    if (keyFeature.trim() && formData.key_features.length < 5) {
      setFormData(prev => ({
        ...prev,
        key_features: [...prev.key_features, keyFeature.trim()]
      }))
      setKeyFeature('')
    }
  }

  const removeKeyFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      key_features: prev.key_features.filter((_, i) => i !== index)
    }))
  }

  const addTargetIndustry = () => {
    if (targetIndustry.trim() && !formData.target_industries.includes(targetIndustry.trim())) {
      setFormData(prev => ({
        ...prev,
        target_industries: [...prev.target_industries, targetIndustry.trim()]
      }))
      setTargetIndustry('')
    }
  }

  const removeTargetIndustry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      target_industries: prev.target_industries.filter((_, i) => i !== index)
    }))
  }

  const addPainPoint = () => {
    if (painPoint.trim() && formData.target_pain_points.length < 5) {
      setFormData(prev => ({
        ...prev,
        target_pain_points: [...prev.target_pain_points, painPoint.trim()]
      }))
      setPainPoint('')
    }
  }

  const removePainPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      target_pain_points: prev.target_pain_points.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      try {
        // 백엔드 API 형식에 맞게 데이터 구성
        const payload = {
          company_name: formData.company_name,
          industry: formData.industry,
          company_size: formData.company_size,
          website: formData.website,
          description: formData.description,
          target_market: formData.target_market,
          products_services: {
            main_product: formData.main_product,
            key_features: formData.key_features,
            pricing_model: formData.pricing_model
          },
          value_proposition: formData.value_proposition,
          ideal_customer_profile: {
            company_size: formData.target_company_size,
            industry: formData.target_industries,
            pain_points: formData.target_pain_points,
            budget_range: formData.budget_range
          }
        }

        // TODO: 실제 API 호출로 대체
        console.log('고객사 정보 등록:', payload)
        setMessage('고객사 정보가 성공적으로 등록되었습니다! AI가 잠재고객 발굴을 시작합니다.')
        
        // 폼 초기화
        setFormData({
          company_name: '',
          industry: '',
          company_size: '',
          website: '',
          description: '',
          target_market: '',
          main_product: '',
          key_features: [],
          pricing_model: '',
          value_proposition: '',
          target_company_size: '',
          target_industries: [],
          target_pain_points: [],
          budget_range: ''
        })
      } catch (error) {
        setMessage('등록 중 오류가 발생했습니다. 다시 시도해주세요.')
        console.error('Registration error:', error)
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          고객사 정보 등록
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          귀하의 회사 정보와 타겟 고객 프로필을 입력하시면, AI가 자동으로 최적의 잠재고객을 발굴해드립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 회사 기본 정보 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">회사 기본 정보</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                회사명 *
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 테크스타트업"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                산업 분야 *
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="SaaS">SaaS</option>
                <option value="E-commerce">E-commerce</option>
                <option value="FinTech">FinTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="EdTech">EdTech</option>
                <option value="MarTech">MarTech</option>
                <option value="AI/ML">AI/ML</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div>
              <label htmlFor="company_size" className="block text-sm font-medium text-gray-700 mb-1">
                회사 규모 *
              </label>
              <select
                id="company_size"
                name="company_size"
                value={formData.company_size}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="startup">스타트업 (1-10명)</option>
                <option value="small">소규모 (11-50명)</option>
                <option value="medium">중간 규모 (51-200명)</option>
                <option value="large">대규모 (200명+)</option>
              </select>
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                웹사이트
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-company.com"
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              회사 설명 *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="회사가 제공하는 서비스나 제품에 대해 간단히 설명해주세요."
            />
          </div>
        </div>

        {/* 제품/서비스 정보 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">제품/서비스 정보</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="main_product" className="block text-sm font-medium text-gray-700 mb-1">
                주력 제품/서비스 *
              </label>
              <input
                type="text"
                id="main_product"
                name="main_product"
                value={formData.main_product}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: B2B 마케팅 자동화 플랫폼"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                핵심 기능들 (최대 5개)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={keyFeature}
                  onChange={(e) => setKeyFeature(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="핵심 기능을 입력하세요"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyFeature())}
                />
                <button
                  type="button"
                  onClick={addKeyFeature}
                  disabled={!keyFeature.trim() || formData.key_features.length >= 5}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.key_features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeKeyFeature(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="pricing_model" className="block text-sm font-medium text-gray-700 mb-1">
                가격 모델 *
              </label>
              <select
                id="pricing_model"
                name="pricing_model"
                value={formData.pricing_model}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="SaaS 구독">SaaS 구독</option>
                <option value="일회성 구매">일회성 구매</option>
                <option value="라이센스">라이센스</option>
                <option value="프리미엄">프리미엄</option>
                <option value="커스텀">커스텀</option>
              </select>
            </div>

            <div>
              <label htmlFor="value_proposition" className="block text-sm font-medium text-gray-700 mb-1">
                핵심 가치 제안 *
              </label>
              <textarea
                id="value_proposition"
                name="value_proposition"
                value={formData.value_proposition}
                onChange={handleInputChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 마케팅 ROI 300% 향상, 리드 전환율 2배 증가"
              />
            </div>
          </div>
        </div>

        {/* 이상적 고객 프로필 (ICP) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">이상적 고객 프로필 (ICP)</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="target_market" className="block text-sm font-medium text-gray-700 mb-1">
                타겟 시장 설명 *
              </label>
              <input
                type="text"
                id="target_market"
                name="target_market"
                value={formData.target_market}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 중소기업 마케팅 담당자, IT 스타트업 창업자"
              />
            </div>

            <div>
              <label htmlFor="target_company_size" className="block text-sm font-medium text-gray-700 mb-1">
                타겟 고객사 규모 *
              </label>
              <input
                type="text"
                id="target_company_size"
                name="target_company_size"
                value={formData.target_company_size}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 10-500명"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                타겟 산업 분야들
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="타겟 산업을 입력하세요"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTargetIndustry())}
                />
                <button
                  type="button"
                  onClick={addTargetIndustry}
                  disabled={!targetIndustry.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.target_industries.map((industry, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {industry}
                    <button
                      type="button"
                      onClick={() => removeTargetIndustry(index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                타겟 고객의 Pain Points (최대 5개)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={painPoint}
                  onChange={(e) => setPainPoint(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="고객의 문제점을 입력하세요"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPainPoint())}
                />
                <button
                  type="button"
                  onClick={addPainPoint}
                  disabled={!painPoint.trim() || formData.target_pain_points.length >= 5}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.target_pain_points.map((point, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                  >
                    {point}
                    <button
                      type="button"
                      onClick={() => removePainPoint(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-1">
                예상 예산 범위
              </label>
              <select
                id="budget_range"
                name="budget_range"
                value={formData.budget_range}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택하세요</option>
                <option value="$100-$500/month">$100-$500/month</option>
                <option value="$500-$1000/month">$500-$1000/month</option>
                <option value="$1000-$5000/month">$1000-$5000/month</option>
                <option value="$5000-$10000/month">$5000-$10000/month</option>
                <option value="$10000+/month">$10000+/month</option>
                <option value="일회성 구매">일회성 구매</option>
              </select>
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'AI 분석 시작 중...' : 'AI 잠재고객 발굴 시작'}
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-md text-center ${
            message.includes('성공') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
} 