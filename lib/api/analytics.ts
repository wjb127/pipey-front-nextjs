import { 
  ClientCompany, 
  DiscoveryJob, 
  Prospect, 
  SalesIntelligence, 
  DashboardStats,
  ProspectWithIntelligence,
  DiscoveryJobWithProgress,
  ProspectFilters 
} from '@/lib/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'



// ==========================================
// Sample Client Company: 클라우드브릿지
// ==========================================
const SAMPLE_CLIENT_COMPANY: ClientCompany = {
  id: 'client-001',
  user_id: 'user-001',
  company_name: '클라우드브릿지',
  industry: '클라우드 마이그레이션 서비스',
  company_size: 'small',
  website: 'https://cloudbridge.co.kr',
  description: 'B2B 기업을 위한 AI 기반 클라우드 마이그레이션 및 인프라 최적화 서비스',
  target_market: '중소기업 IT 담당자, CTO, 개발팀장',
  products_services: {
    main_product: 'CloudBridge Migration Suite',
    key_features: [
      'AI 기반 마이그레이션 계획 수립',
      '무중단 데이터 이전',
      '비용 최적화 분석',
      '보안 컴플라이언스 자동화'
    ],
    pricing_model: 'SaaS 구독 모델 (월 $299-$2999)'
  },
  value_proposition: '기존 인프라 대비 30% 비용 절감과 99.9% 안정성을 보장하는 클라우드 마이그레이션',
  ideal_customer_profile: {
    company_size: '50-500명',
    industry: ['제조업', 'IT 서비스', '금융', '헬스케어', '교육'],
    pain_points: [
      '레거시 시스템 유지비용 부담',
      '클라우드 마이그레이션 전문성 부족',
      '다운타임 우려',
      '비용 예측 어려움'
    ],
    budget_range: '월 $300-$5000'
  },
  is_active: true,
  created_at: '2024-01-15T09:00:00Z',
  updated_at: '2024-01-15T09:00:00Z'
}

// ==========================================
// Sample Discovery Job
// ==========================================
const SAMPLE_DISCOVERY_JOB: DiscoveryJob = {
  id: 'job-001',
  client_company_id: 'client-001',
  user_id: 'user-001',
  status: 'completed',
  job_type: 'full_discovery',
  search_criteria: {
    industries: ['제조업', 'IT 서비스', '금융', '헬스케어'],
    company_sizes: ['medium', 'large'],
    locations: ['서울', '경기', '부산'],
    employee_range: [50, 500],
    technologies: ['온프레미스 서버', 'Oracle DB', 'SAP'],
    funding_stage: ['시리즈 A', '시리즈 B', 'IPO 준비'],
    growth_signals: ['IT 인력 채용', '디지털 전환', '시스템 현대화']
  },
  progress: 100,
  current_task: 'AI 인텔리전스 생성 완료',
  total_prospects_found: 47,
  qualified_prospects: 23,
  started_at: '2024-01-15T10:00:00Z',
  completed_at: '2024-01-15T14:30:00Z',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T14:30:00Z'
}

// ==========================================
// Sample Prospects (현실적인 한국 기업들)
// ==========================================
const SAMPLE_PROSPECTS: Prospect[] = [
  {
    id: 'prospect-001',
    discovery_job_id: 'job-001',
    client_company_id: 'client-001',
    user_id: 'user-001',
    company_name: '한국테크솔루션',
    domain: 'ktech.co.kr',
    industry: 'IT 서비스',
    company_size: 'medium',
    location: '서울 강남구',
    employee_count: 180,
    annual_revenue: 250000000,
    technologies: ['온프레미스 서버', 'Oracle DB', 'Java 레거시'],
    recent_funding: {
      round: '시리즈 B',
      amount: '150억원',
      date: '2023-11-15',
      investors: ['KB인베스트먼트', '네오플럭스']
    },
    key_personnel: {
      CTO: {
        name: '김준호',
        title: 'CTO',
        linkedin: 'https://linkedin.com/in/junho-kim-tech',
        email: 'junho.kim@ktech.co.kr'
      },
      'IT 부문장': {
        name: '이소영',
        title: 'IT 인프라 부문장',
        linkedin: 'https://linkedin.com/in/soyoung-lee-infra'
      }
    },
    qualification_score: 92,
    data_sources: ['LinkedIn', '크레딧잡', '기업정보'],
    status: 'qualified',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z'
  },
  {
    id: 'prospect-002',
    discovery_job_id: 'job-001',
    client_company_id: 'client-001',
    user_id: 'user-001',
    company_name: '미래제조',
    domain: 'futuremanu.com',
    industry: '제조업',
    company_size: 'medium',
    location: '경기 안산시',
    employee_count: 320,
    annual_revenue: 800000000,
    technologies: ['SAP ERP', '온프레미스 데이터센터', 'Oracle'],
    key_personnel: {
      'IT 담당임원': {
        name: '박민수',
        title: 'IT 담당 상무',
        linkedin: 'https://linkedin.com/in/minsu-park-manufacturing'
      },
      '시스템 관리자': {
        name: '정유진',
        title: '시스템 관리팀장',
        email: 'yujin.jung@futuremanu.com'
      }
    },
    qualification_score: 88,
    data_sources: ['기업정보', '채용공고'],
    status: 'qualified',
    created_at: '2024-01-15T11:15:00Z',
    updated_at: '2024-01-15T11:15:00Z'
  },
  {
    id: 'prospect-003',
    discovery_job_id: 'job-001',
    client_company_id: 'client-001',
    user_id: 'user-001',
    company_name: '스마트헬스케어',
    domain: 'smarthc.co.kr',
    industry: '헬스케어',
    company_size: 'medium',
    location: '서울 송파구',
    employee_count: 95,
    annual_revenue: 120000000,
    technologies: ['온프레미스 EMR', 'MS SQL Server', '의료영상시스템'],
    recent_funding: {
      round: '시리즈 A',
      amount: '80억원',
      date: '2024-01-05',
      investors: ['한국투자파트너스', 'IMM인베스트먼트']
    },
    key_personnel: {
      CTO: {
        name: '홍대식',
        title: '기술이사',
        linkedin: 'https://linkedin.com/in/daesik-hong-healthcare'
      }
    },
    qualification_score: 95,
    data_sources: ['뉴스', 'LinkedIn', '투자정보'],
    status: 'qualified',
    created_at: '2024-01-15T11:30:00Z',
    updated_at: '2024-01-15T11:30:00Z'
  },
  {
    id: 'prospect-004',
    discovery_job_id: 'job-001',
    client_company_id: 'client-001',
    user_id: 'user-001',
    company_name: '글로벌에듀테크',
    domain: 'globaledu.kr',
    industry: '교육',
    company_size: 'medium',
    location: '서울 마포구',
    employee_count: 150,
    annual_revenue: 180000000,
    technologies: ['온프레미스 LMS', 'MySQL', '동영상 스트리밍 서버'],
    key_personnel: {
      'IT 팀장': {
        name: '차민영',
        title: 'IT개발팀장',
        linkedin: 'https://linkedin.com/in/minyoung-cha-edutech'
      }
    },
    qualification_score: 85,
    data_sources: ['LinkedIn', '채용공고'],
    status: 'discovered',
    created_at: '2024-01-15T11:45:00Z',
    updated_at: '2024-01-15T11:45:00Z'
  },
  {
    id: 'prospect-005',
    discovery_job_id: 'job-001',
    client_company_id: 'client-001',
    user_id: 'user-001',
    company_name: 'K-핀테크',
    domain: 'kfintech.com',
    industry: '금융',
    company_size: 'medium',
    location: '서울 여의도',
    employee_count: 220,
    annual_revenue: 450000000,
    technologies: ['온프레미스 코어뱅킹', 'Oracle RAC', '보안서버'],
    key_personnel: {
      'IT 본부장': {
        name: '강현우',
        title: 'IT본부장',
        linkedin: 'https://linkedin.com/in/hyunwoo-kang-fintech'
      }
    },
    qualification_score: 90,
    data_sources: ['기업정보', 'LinkedIn'],
    status: 'contacted',
    created_at: '2024-01-15T12:00:00Z',
    updated_at: '2024-01-15T12:00:00Z'
  }
]

// ==========================================
// Sample Sales Intelligence
// ==========================================
const SAMPLE_SALES_INTELLIGENCE: SalesIntelligence[] = [
  {
    id: 'intel-001',
    prospect_id: 'prospect-001',
    client_company_id: 'client-001',
    user_id: 'user-001',
    match_score: 92,
    priority_level: 'critical',
    contact_timing: 'immediate',
    pain_points: [
      '레거시 Oracle DB 라이선스 비용 급증',
      'Java 시스템 유지보수 인력 부족',
      '서버 하드웨어 노후화로 성능 저하',
      '백업 및 DR 솔루션 구축 필요성'
    ],
    value_props: [
      'Oracle 클라우드 마이그레이션으로 40% 라이선스 비용 절감',
      '무중단 서비스로 비즈니스 연속성 보장',
      'AI 기반 성능 최적화로 응답속도 50% 개선',
      '자동화된 백업과 DR로 데이터 안전성 확보'
    ],
    decision_makers: {
      primary: {
        name: '김준호',
        title: 'CTO',
        linkedin: 'https://linkedin.com/in/junho-kim-tech',
        contact_priority: 'high'
      },
      secondary: {
        name: '이소영',
        title: 'IT 인프라 부문장',
        linkedin: 'https://linkedin.com/in/soyoung-lee-infra',
        contact_priority: 'medium'
      }
    },
    recommended_approach: '시리즈 B 투자 이후 확장성 확보 필요성을 어필하며, 기존 Oracle 시스템의 클라우드 마이그레이션 ROI를 구체적 수치로 제시',
    conversation_starters: [
      '시리즈 B 투자 축하드립니다! 확장에 따른 인프라 확장성 계획이 있으신지요?',
      '현재 Oracle DB 라이선스 비용이 매년 증가하고 있는 것으로 보이는데, 비용 최적화 방안을 검토해보셨나요?',
      'Java 레거시 시스템의 현대화 계획이 있으시다면 함께 논의해보고 싶습니다.'
    ],
    objection_handling: {
      '마이그레이션 중 다운타임 우려': '저희는 무중단 마이그레이션 기술로 99.9% 가용성을 보장합니다. 실제 비슷한 규모의 IT서비스 기업에서 0분 다운타임을 달성했습니다.',
      '보안 우려': 'ISO 27001, SOC 2 인증을 받은 클라우드 환경으로 기존 온프레미스보다 더 강화된 보안을 제공합니다.',
      '비용 부담': '초기 투자비는 6개월 내 Oracle 라이선스 절감비용으로 회수 가능하며, 연간 40% 인프라 비용을 절감할 수 있습니다.'
    },
    recent_triggers: [
      '시리즈 B 150억원 투자 유치 (2023.11)',
      'CTO 김준호 인터뷰에서 "인프라 현대화" 언급',
      'IT 개발자 대량 채용 공고 게시',
      '클라우드 엔지니어 채용 시작'
    ],
    competitive_landscape: {
      current_solutions: ['Oracle Cloud', 'AWS', 'Naver Cloud Platform'],
      switching_probability: 0.75,
      decision_timeline: '3-6개월'
    },
    ai_confidence: 0.92,
    generated_at: '2024-01-15T14:00:00Z',
    created_at: '2024-01-15T14:00:00Z'
  },
  {
    id: 'intel-002',
    prospect_id: 'prospect-002',
    client_company_id: 'client-001',
    user_id: 'user-001',
    match_score: 88,
    priority_level: 'high',
    contact_timing: 'this_week',
    pain_points: [
      'SAP ERP 시스템 성능 한계',
      '온프레미스 데이터센터 운영비용 증가',
      '제조 데이터 실시간 분석 필요',
      'IoT 센서 데이터 처리 인프라 부족'
    ],
    value_props: [
      'SAP on Cloud로 성능 3배 향상',
      '데이터센터 운영비 50% 절감',
      '실시간 제조 데이터 분석으로 품질 개선',
      'IoT 플랫폼 통합으로 스마트팩토리 구현'
    ],
    decision_makers: {
      primary: {
        name: '박민수',
        title: 'IT 담당 상무',
        linkedin: 'https://linkedin.com/in/minsu-park-manufacturing',
        contact_priority: 'high'
      },
      secondary: {
        name: '정유진',
        title: '시스템 관리팀장',
        contact_priority: 'medium'
      }
    },
    recommended_approach: '제조업 특화 클라우드 솔루션과 스마트팩토리 연계방안을 제시하여 디지털 전환 파트너로 포지셔닝',
    conversation_starters: [
      '제조업 디지털 전환을 위한 클라우드 인프라 현대화에 관심이 있으실까요?',
      '현재 SAP 시스템의 성능 이슈를 클라우드로 해결한 제조업 사례를 공유드리고 싶습니다.',
      'IoT 센서 데이터를 실시간으로 분석할 수 있는 클라우드 플랫폼을 검토해보셨나요?'
    ],
    recent_triggers: [
      '스마트팩토리 구축 계획 발표',
      'IT 시스템 관리자 추가 채용',
      '제조 데이터 분석팀 신설',
      'IoT 도입 프로젝트 착수'
    ],
    ai_confidence: 0.88,
    generated_at: '2024-01-15T14:15:00Z',
    created_at: '2024-01-15T14:15:00Z'
  },
  {
    id: 'intel-003',
    prospect_id: 'prospect-003',
    client_company_id: 'client-001',
    user_id: 'user-001',
    match_score: 95,
    priority_level: 'critical',
    contact_timing: 'immediate',
    pain_points: [
      '의료 데이터 보안 컴플라이언스 요구사항',
      'EMR 시스템 확장성 한계',
      '의료영상 데이터 저장비용 급증',
      '원격진료 인프라 구축 필요'
    ],
    value_props: [
      'HIPAA/개인정보보호법 완벽 준수',
      '클라우드 EMR로 무제한 확장성',
      '의료영상 스토리지 비용 60% 절감',
      '원격진료 플랫폼 즉시 구축 가능'
    ],
    decision_makers: {
      primary: {
        name: '홍대식',
        title: '기술이사',
        linkedin: 'https://linkedin.com/in/daesik-hong-healthcare',
        contact_priority: 'high'
      }
    },
    recommended_approach: '최근 투자 유치 이후 급성장하는 헬스케어 서비스의 인프라 확장성과 보안 컴플라이언스를 핵심으로 어필',
    conversation_starters: [
      '시리즈 A 투자 유치 축하드립니다! 헬스케어 서비스 확장을 위한 클라우드 인프라 계획이 있으신지요?',
      '의료 데이터 보안과 컴플라이언스를 완벽히 지원하는 클라우드 솔루션에 관심이 있으실까요?',
      '원격진료 서비스 확장을 위한 인프라 현대화 방안을 함께 검토해보면 어떨까요?'
    ],
    recent_triggers: [
      '시리즈 A 80억원 투자 유치 (2024.01)',
      '원격진료 서비스 확장 계획 발표',
      '의료 AI 개발팀 신규 채용',
      '클라우드 보안 전문가 채용공고'
    ],
    ai_confidence: 0.95,
    generated_at: '2024-01-15T14:30:00Z',
    created_at: '2024-01-15T14:30:00Z'
  }
]

// ==========================================
// Mock API Functions
// ==========================================

export async function getClientCompany(): Promise<ClientCompany> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return SAMPLE_CLIENT_COMPANY
}

export async function getDiscoveryJobs(): Promise<DiscoveryJobWithProgress[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  return [{
    ...SAMPLE_DISCOVERY_JOB,
    client_company: SAMPLE_CLIENT_COMPANY,
    prospects_preview: SAMPLE_PROSPECTS.slice(0, 3)
  }]
}

export async function getProspects(filters?: ProspectFilters): Promise<ProspectWithIntelligence[]> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  let prospects = SAMPLE_PROSPECTS
  
  // Apply filters
  if (filters?.priority_level) {
    const intel = SAMPLE_SALES_INTELLIGENCE.find(s => s.priority_level === filters.priority_level)
    if (intel) {
      prospects = prospects.filter(p => p.id === intel.prospect_id)
    }
  }
  
  if (filters?.status) {
    prospects = prospects.filter(p => p.status === filters.status)
  }
  
  // Add intelligence data
  return prospects.map(prospect => ({
    ...prospect,
    intelligence: SAMPLE_SALES_INTELLIGENCE.find(s => s.prospect_id === prospect.id)
  }))
}

export async function getSalesIntelligence(prospectId: string): Promise<SalesIntelligence | null> {
  await new Promise(resolve => setTimeout(resolve, 400))
  return SAMPLE_SALES_INTELLIGENCE.find(s => s.prospect_id === prospectId) || null
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const totalProspects = SAMPLE_PROSPECTS.length
  const qualifiedProspects = SAMPLE_PROSPECTS.filter(p => p.status === 'qualified').length
  const hotLeads = SAMPLE_SALES_INTELLIGENCE.filter(s => s.priority_level === 'critical').length
  const contactedProspects = SAMPLE_PROSPECTS.filter(p => p.status === 'contacted').length
  const respondedProspects = SAMPLE_PROSPECTS.filter(p => p.status === 'responded').length
  
  return {
    total_prospects: totalProspects,
    qualified_prospects: qualifiedProspects,
    hot_leads: hotLeads,
    contacted_prospects: contactedProspects,
    responded_prospects: respondedProspects,
    conversion_rate: respondedProspects > 0 ? (respondedProspects / contactedProspects) * 100 : 0,
    average_response_rate: 24.5,
    active_discovery_jobs: 1
  }
}

export async function createDiscoveryJob(clientCompanyId: string): Promise<DiscoveryJob> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const newJob: DiscoveryJob = {
    id: `job-${Date.now()}`,
    client_company_id: clientCompanyId,
    user_id: 'user-001',
    status: 'pending',
    job_type: 'full_discovery',
    search_criteria: SAMPLE_DISCOVERY_JOB.search_criteria,
    progress: 0,
    current_task: 'AI 잠재고객 발굴 시작',
    total_prospects_found: 0,
    qualified_prospects: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  return newJob
}

 