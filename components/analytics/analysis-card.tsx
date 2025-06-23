'use client'

import { ProspectWithIntelligence } from '@/lib/types'
import { Building2, Users, MapPin, DollarSign, TrendingUp, Calendar } from 'lucide-react'

interface AnalysisCardProps {
  prospect: ProspectWithIntelligence
}

export function AnalysisCard({ prospect }: AnalysisCardProps) {
  const formatRevenue = (revenue?: number) => {
    if (!revenue) return '미공개'
    return `${(revenue / 100000000).toFixed(0)}억원`
  }

  const formatFunding = () => {
    if (!prospect.recent_funding) return null
    return `${prospect.recent_funding.round} ${prospect.recent_funding.amount} (${prospect.recent_funding.date})`
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">{prospect.company_name}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              prospect.status === 'qualified' ? 'bg-blue-100 text-blue-800' :
              prospect.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
              prospect.status === 'responded' ? 'bg-green-100 text-green-800' :
              prospect.status === 'converted' ? 'bg-emerald-100 text-emerald-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {prospect.status === 'qualified' ? '검증됨' :
               prospect.status === 'contacted' ? '연락함' :
               prospect.status === 'responded' ? '응답받음' :
               prospect.status === 'converted' ? '전환됨' : '발굴됨'}
            </span>
          </div>
          
          {prospect.domain && (
            <div className="text-sm text-blue-600 mb-4">
              🌐 {prospect.domain}
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {prospect.qualification_score}
          </div>
          <div className="text-sm text-gray-500">적합도 점수</div>
        </div>
      </div>

      {/* 기본 정보 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Building2 className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">업종</div>
            <div className="font-medium text-gray-900">{prospect.industry}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">직원 수</div>
            <div className="font-medium text-gray-900">{prospect.employee_count}명</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">연 매출</div>
            <div className="font-medium text-gray-900">{formatRevenue(prospect.annual_revenue)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <MapPin className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">위치</div>
            <div className="font-medium text-gray-900">{prospect.location}</div>
          </div>
        </div>
      </div>

      {/* 최근 펀딩 정보 */}
      {prospect.recent_funding && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <h3 className="font-medium text-green-800">최근 투자 유치</h3>
          </div>
          <div className="text-sm text-green-700">
            <div className="font-medium">{formatFunding()}</div>
            {prospect.recent_funding.investors && (
              <div className="mt-1">
                투자사: {prospect.recent_funding.investors.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 기술 스택 */}
      {prospect.technologies && prospect.technologies.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            ⚙️ 현재 기술 스택
          </h3>
          <div className="flex flex-wrap gap-2">
            {prospect.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 핵심 담당자 */}
      {prospect.key_personnel && Object.keys(prospect.key_personnel).length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            👥 핵심 담당자
          </h3>
          <div className="space-y-3">
            {Object.entries(prospect.key_personnel).map(([role, person]) => (
              <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{person.name}</div>
                  <div className="text-sm text-gray-600">{person.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  {person.linkedin && (
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      LinkedIn
                    </a>
                  )}
                  {person.email && (
                    <a
                      href={`mailto:${person.email}`}
                      className="text-gray-600 hover:text-gray-700 text-sm"
                    >
                      {person.email}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 데이터 출처 */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">
              발굴일: {new Date(prospect.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-500">데이터 출처:</span>
            {prospect.data_sources?.map((source, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 