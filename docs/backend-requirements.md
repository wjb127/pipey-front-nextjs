# Pipey 백엔드 개발 요구사항

## 📋 프로젝트 개요

**Pipey Sales Intelligence Platform**의 백엔드 API 개발 요구사항입니다.
- **목적**: B2B 세일즈 인텔리전스 자동화 SaaS 플랫폼
- **핵심 가치**: 고객사 정보 입력 → AI 기반 잠재고객 자동 발굴 → 컨택 전략 제안
- **기술스택**: FastAPI + Supabase + PostgreSQL
- **배포환경**: Render (render.com)
- **개발도구**: Cursor IDE + 바이브 코딩

## 🎯 SaaS 비즈니스 모델

### 핵심 플로우
1. **고객사 정보 입력**: 사용자가 자신의 회사 정보와 제품/서비스 정보 입력
2. **AI 기반 잠재고객 발굴**: 백엔드에서 자동으로 관련 기업들을 크롤링하고 AI로 분석
3. **세일즈 인텔리전스 생성**: 발굴된 잠재고객들의 우선순위 및 컨택 전략 제안
4. **자동화된 아웃리치**: GPT 기반 개인화된 세일즈 메시지 생성 및 발송

### 기존 모델과의 차이점
- ❌ **기존**: 사용자가 직접 타겟 기업 입력
- ✅ **신규**: AI가 고객사 정보 기반으로 잠재고객 자동 발굴

## 🛠️ 기술 스택

### 필수 기술
```python
# Core Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0

# Database
supabase==2.0.0
asyncpg==0.29.0
sqlalchemy==2.0.23

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

# AI/ML
openai==1.3.0
langchain==0.0.335

# Web Scraping & Data Collection
scrapy==2.11.0
selenium==4.15.2
beautifulsoup4==4.12.2
newspaper3k==0.2.8

# Business Data APIs
linkedin-api==2.0.0a0
crunchbase-api==0.1.0
clearbit==0.1.7

# Utilities
pydantic==2.5.0
python-dotenv==1.0.0
httpx==0.25.2
celery==5.3.4  # 비동기 작업용
redis==5.0.1   # Celery 브로커
```

### 개발 도구
```python
# Development
pytest==7.4.3
pytest-asyncio==0.21.1
black==23.11.0
isort==5.12.0
mypy==1.7.1
```

## 🏗️ 프로젝트 구조

```
pipey-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI 앱 초기화
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py          # 환경변수 및 설정
│   │   ├── security.py        # 인증/보안
│   │   └── database.py        # DB 연결 설정
│   ├── api/
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── router.py      # 메인 라우터
│   │   │   ├── auth.py        # 인증 엔드포인트
│   │   │   ├── client_companies.py  # 고객사 관리
│   │   │   ├── prospect_discovery.py # 잠재고객 발굴
│   │   │   ├── intelligence.py # 세일즈 인텔리전스
│   │   │   ├── outreach.py    # 아웃리치/이메일
│   │   │   └── analytics.py   # 분석 및 리포트
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py            # 사용자 모델
│   │   ├── client_company.py  # 고객사 모델
│   │   ├── prospect.py        # 잠재고객 모델
│   │   ├── discovery_job.py   # 발굴 작업 모델
│   │   └── intelligence.py    # 인텔리전스 모델
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py            # 사용자 Pydantic 스키마
│   │   ├── client_company.py  # 고객사 스키마
│   │   ├── prospect.py        # 잠재고객 스키마
│   │   └── intelligence.py    # 인텔리전스 스키마
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py    # 인증 서비스
│   │   ├── client_service.py  # 고객사 관리 서비스
│   │   ├── discovery_service.py # 잠재고객 발굴 서비스
│   │   ├── intelligence_service.py # AI 분석 서비스
│   │   ├── scraping_service.py # 웹 크롤링 서비스
│   │   ├── matching_service.py # AI 매칭 서비스
│   │   └── outreach_service.py # 아웃리치 서비스
│   ├── crawlers/
│   │   ├── __init__.py
│   │   ├── linkedin_crawler.py # LinkedIn 크롤링
│   │   ├── crunchbase_crawler.py # Crunchbase API
│   │   ├── company_website_crawler.py # 기업 웹사이트
│   │   └── news_crawler.py    # 뉴스 수집
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── database.py        # DB 유틸리티
│   │   ├── logger.py          # 로깅 유틸리티
│   │   └── validators.py      # 검증 유틸리티
│   └── tasks/
│       ├── __init__.py
│       ├── discovery_tasks.py # 잠재고객 발굴 작업
│       ├── intelligence_tasks.py # AI 분석 작업
│       └── crawling_tasks.py  # 크롤링 작업
├── tests/
├── alembic/                   # DB 마이그레이션
├── requirements.txt
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🗄️ 수정된 데이터베이스 스키마

### 핵심 테이블 구조 변경

```sql
-- 1. 고객사 정보 (사용자의 회사)
CREATE TABLE pipey_client_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES pipey_users(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  company_size VARCHAR(50), -- 'startup', 'small', 'medium', 'large'
  website VARCHAR(500),
  description TEXT,
  target_market TEXT, -- 타겟 시장 설명
  products_services JSONB, -- 제품/서비스 정보
  value_proposition TEXT, -- 가치 제안
  ideal_customer_profile JSONB, -- ICP 정보
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 발굴 작업 관리
CREATE TABLE pipey_discovery_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_company_id UUID REFERENCES pipey_client_companies(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  job_type VARCHAR(50) DEFAULT 'full_discovery', -- 'full_discovery', 'incremental'
  search_criteria JSONB, -- 검색 조건
  total_prospects_found INTEGER DEFAULT 0,
  qualified_prospects INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 발굴된 잠재고객 정보
CREATE TABLE pipey_prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discovery_job_id UUID REFERENCES pipey_discovery_jobs(id) ON DELETE CASCADE,
  client_company_id UUID REFERENCES pipey_client_companies(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  domain VARCHAR(200),
  industry VARCHAR(100),
  company_size VARCHAR(50),
  location VARCHAR(200),
  employee_count INTEGER,
  annual_revenue BIGINT,
  technologies JSONB, -- 사용 중인 기술 스택
  recent_funding JSONB, -- 최근 투자 정보
  key_personnel JSONB, -- 주요 인사 정보
  social_links JSONB, -- LinkedIn, Twitter 등
  qualification_score DECIMAL(3,2), -- 0.00 ~ 1.00
  data_sources JSONB, -- 데이터 수집 출처
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. AI 생성 세일즈 인텔리전스
CREATE TABLE pipey_sales_intelligences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID REFERENCES pipey_prospects(id) ON DELETE CASCADE,
  client_company_id UUID REFERENCES pipey_client_companies(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL, -- 0-100 매칭 점수
  contact_timing VARCHAR(50), -- 'immediate', 'this_week', 'this_month', 'next_quarter'
  pain_points JSONB, -- 식별된 pain points
  value_props JSONB, -- 맞춤형 가치 제안
  decision_makers JSONB, -- 의사결정자 정보
  recommended_approach TEXT,
  conversation_starters JSONB, -- 대화 시작점들
  objection_handling JSONB, -- 예상 반박과 대응
  recent_triggers JSONB, -- 최근 트리거 이벤트
  competitive_landscape JSONB, -- 경쟁사 분석
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📡 수정된 API 엔드포인트 명세

### 1. 고객사 정보 API (`/api/v1/client-companies`)

```python
# POST /api/v1/client-companies
{
  "company_name": "테크스타트업",
  "industry": "SaaS",
  "company_size": "startup",
  "website": "https://techstartup.com",
  "description": "B2B 마케팅 자동화 솔루션 제공",
  "target_market": "중소기업 마케팅 담당자",
  "products_services": {
    "main_product": "마케팅 자동화 플랫폼",
    "key_features": ["이메일 마케팅", "리드 스코링", "CRM 연동"],
    "pricing_model": "SaaS 구독"
  },
  "value_proposition": "마케팅 ROI 300% 향상, 리드 전환율 2배 증가",
  "ideal_customer_profile": {
    "company_size": "10-500명",
    "industry": ["Technology", "E-commerce", "Professional Services"],
    "pain_points": ["수동 마케팅 프로세스", "낮은 리드 품질"],
    "budget_range": "$1000-$10000/month"
  }
}

# Response
{
  "id": "uuid",
  "company_name": "테크스타트업",
  "status": "active",
  "discovery_jobs_count": 0,
  "total_prospects": 0,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 2. 잠재고객 발굴 API (`/api/v1/prospect-discovery`)

```python
# POST /api/v1/prospect-discovery/start
{
  "client_company_id": "uuid",
  "search_criteria": {
    "industries": ["Technology", "SaaS", "E-commerce"],
    "company_sizes": ["startup", "small", "medium"],
    "locations": ["United States", "Canada", "United Kingdom"],
    "employee_range": [10, 500],
    "technologies": ["Salesforce", "HubSpot", "Marketo"],
    "funding_stage": ["Series A", "Series B", "Growth"],
    "growth_signals": ["recent_hiring", "funding_raised", "product_launch"]
  },
  "max_prospects": 1000,
  "priority_keywords": ["marketing automation", "lead generation"]
}

# Response
{
  "discovery_job_id": "uuid",
  "status": "pending",
  "estimated_completion": "2024-01-01T02:00:00Z",
  "message": "잠재고객 발굴 작업이 시작되었습니다."
}

# GET /api/v1/prospect-discovery/jobs/{job_id}/status
{
  "job_id": "uuid",
  "status": "running",
  "progress": 65,
  "prospects_found": 234,
  "qualified_prospects": 89,
  "current_task": "LinkedIn 데이터 수집 중...",
  "estimated_remaining": "35분"
}

# GET /api/v1/prospect-discovery/jobs/{job_id}/results
{
  "job_id": "uuid",
  "total_prospects": 412,
  "qualified_prospects": 156,
  "top_prospects": [
    {
      "id": "uuid",
      "company_name": "마케팅허브",
      "industry": "MarTech",
      "employee_count": 45,
      "qualification_score": 0.92,
      "match_reasons": [
        "최근 Series A 투자 유치",
        "마케팅 팀 대폭 확장 중",
        "경쟁사 솔루션 사용 중"
      ]
    }
  ]
}
```

### 3. 세일즈 인텔리전스 API (`/api/v1/intelligence`)

```python
# GET /api/v1/intelligence
# Query params: ?client_company_id=uuid&match_score_min=80&limit=50

# Response
{
  "intelligences": [
    {
      "id": "uuid",
      "prospect": {
        "company_name": "마케팅허브",
        "industry": "MarTech",
        "employee_count": 45,
        "website": "https://marketinghub.com"
      },
      "match_score": 92,
      "contact_timing": "immediate",
      "pain_points": [
        "수동 리드 관리로 인한 비효율",
        "마케팅 ROI 측정 어려움",
        "영업-마케팅 팀 소통 단절"
      ],
      "value_props": [
        "리드 관리 자동화로 50% 시간 절약",
        "실시간 ROI 대시보드 제공",
        "영업팀과 마케팅팀 통합 플랫폼"
      ],
      "decision_makers": [
        {
          "name": "김마케팅",
          "title": "Head of Marketing",
          "linkedin": "linkedin.com/in/kimmarketing",
          "contact_priority": "high"
        }
      ],
      "recommended_approach": "최근 투자 유치와 팀 확장을 축하하며 성장 과정에서 발생할 수 있는 마케팅 효율성 이슈에 대한 솔루션 제안",
      "conversation_starters": [
        "Series A 투자 유치 축하드립니다. 빠른 성장 과정에서 마케팅 프로세스 확장에 어려움은 없으신가요?",
        "마케팅 팀 확장 중이신 것으로 알고 있는데, 새로운 팀원들의 온보딩과 협업 효율성은 어떠신가요?"
      ],
      "recent_triggers": [
        "Series A $5M 투자 유치 (2024-01-15)",
        "마케팅 팀 3명 추가 채용 (2024-01-10)",
        "새로운 제품 라인 출시 예정 공지"
      ]
    }
  ],
  "summary": {
    "total_intelligences": 156,
    "high_priority": 23,
    "medium_priority": 89,
    "low_priority": 44
  }
}
```

### 4. 아웃리치 API (`/api/v1/outreach`)

```python
# POST /api/v1/outreach/generate-message
{
  "intelligence_id": "uuid",
  "message_type": "cold_email", # "cold_email", "linkedin_message", "follow_up"
  "tone": "professional", # "professional", "friendly", "consultative"
  "length": "medium", # "short", "medium", "long"
  "include_case_study": true,
  "call_to_action": "demo_request" # "demo_request", "call_booking", "content_share"
}

# Response
{
  "subject": "Series A 축하 & 마케팅 효율성 3배 향상 솔루션",
  "content": "안녕하세요 김마케팅님,\n\nSeries A 투자 유치를 진심으로 축하드립니다...",
  "personalization_elements": [
    "Series A 투자 유치 언급",
    "마케팅 팀 확장 현황 반영",
    "업계별 맞춤 case study 포함"
  ],
  "confidence_score": 0.89,
  "estimated_response_rate": "15-20%",
  "alternative_versions": [
    {
      "tone": "friendly",
      "subject": "축하드려요! 마케팅허브의 성장 여정을 응원합니다 🚀"
    }
  ]
}
```

## 🤖 AI 서비스 통합

### 잠재고객 발굴 AI
```python
# app/services/discovery_service.py
class ProspectDiscoveryService:
    def __init__(self):
        self.openai_client = OpenAI()
        self.scrapers = {
            'linkedin': LinkedInCrawler(),
            'crunchbase': CrunchbaseCrawler(),
            'clearbit': ClearbitAPI()
        }
    
    async def discover_prospects(self, client_company: dict, criteria: dict):
        """고객사 정보 기반 잠재고객 발굴"""
        # 1. ICP 기반 검색 쿼리 생성
        search_queries = await self.generate_search_queries(client_company, criteria)
        
        # 2. 다중 소스에서 데이터 수집
        raw_prospects = await self.collect_from_sources(search_queries)
        
        # 3. AI 기반 자격 검증
        qualified_prospects = await self.qualify_prospects(raw_prospects, client_company)
        
        # 4. 중복 제거 및 데이터 정제
        final_prospects = await self.dedupe_and_clean(qualified_prospects)
        
        return final_prospects
    
    async def generate_search_queries(self, client_company: dict, criteria: dict):
        """AI가 고객사 정보를 분석해서 검색 쿼리 생성"""
        prompt = f"""
        고객사 정보:
        - 회사: {client_company['company_name']}
        - 산업: {client_company['industry']}
        - 제품/서비스: {client_company['products_services']}
        - ICP: {client_company['ideal_customer_profile']}
        
        다음 조건으로 잠재고객을 찾기 위한 최적의 검색 쿼리를 생성해주세요:
        {criteria}
        
        LinkedIn, Crunchbase, Google 검색에 각각 최적화된 쿼리를 제공해주세요.
        """
        
        response = await self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        
        return self.parse_search_queries(response.choices[0].message.content)
```

### 세일즈 인텔리전스 AI
```python
# app/services/intelligence_service.py
class SalesIntelligenceService:
    async def generate_intelligence(self, prospect: dict, client_company: dict):
        """잠재고객-고객사 매칭 분석 및 세일즈 인텔리전스 생성"""
        
        # 1. 매칭 점수 계산
        match_score = await self.calculate_match_score(prospect, client_company)
        
        # 2. Pain Points 식별
        pain_points = await self.identify_pain_points(prospect, client_company)
        
        # 3. 맞춤형 가치 제안 생성
        value_props = await self.generate_value_propositions(prospect, client_company)
        
        # 4. 컨택 전략 수립
        approach_strategy = await self.develop_approach_strategy(prospect, client_company)
        
        return {
            'match_score': match_score,
            'pain_points': pain_points,
            'value_props': value_props,
            'recommended_approach': approach_strategy,
            # ... 기타 인텔리전스 정보
        }
```

## 🔄 비동기 작업 (Celery)

### 잠재고객 발굴 작업
```python
# app/tasks/discovery_tasks.py
@celery_app.task(bind=True)
def discover_prospects_task(self, client_company_id: str, criteria: dict):
    """대규모 잠재고객 발굴 비동기 작업"""
    try:
        # 진행 상황 업데이트
        self.update_state(state='PROGRESS', meta={'current': 0, 'total': 100})
        
        # 1. 검색 쿼리 생성
        self.update_state(state='PROGRESS', meta={'current': 10, 'total': 100, 'status': '검색 쿼리 생성 중...'})
        
        # 2. LinkedIn 크롤링
        self.update_state(state='PROGRESS', meta={'current': 30, 'total': 100, 'status': 'LinkedIn 데이터 수집 중...'})
        
        # 3. Crunchbase API 호출
        self.update_state(state='PROGRESS', meta={'current': 60, 'total': 100, 'status': 'Crunchbase 데이터 수집 중...'})
        
        # 4. AI 분석 및 자격 검증
        self.update_state(state='PROGRESS', meta={'current': 80, 'total': 100, 'status': 'AI 분석 중...'})
        
        # 5. 데이터베이스 저장
        self.update_state(state='PROGRESS', meta={'current': 95, 'total': 100, 'status': '결과 저장 중...'})
        
        return {'status': 'completed', 'prospects_found': 156, 'qualified_prospects': 89}
        
    except Exception as exc:
        self.update_state(state='FAILURE', meta={'error': str(exc)})
        raise
```

## 📋 수정된 개발 단계별 우선순위

### Phase 1: SaaS 기반 인프라 (1.5주)
- [x] FastAPI 프로젝트 구조 설정
- [x] Supabase 연동 (수정된 스키마)
- [x] 인증 시스템 구현
- [x] 고객사 정보 관리 API
- [ ] 기본 크롤링 인프라 구축

### Phase 2: 잠재고객 발굴 시스템 (2주)
- [ ] LinkedIn/Crunchbase 크롤러 개발
- [ ] AI 기반 검색 쿼리 생성
- [ ] 잠재고객 자격 검증 시스템
- [ ] 비동기 발굴 작업 시스템
- [ ] 실시간 진행 상황 추적

### Phase 3: 세일즈 인텔리전스 엔진 (1.5주)
- [ ] AI 기반 매칭 알고리즘
- [ ] Pain Points 자동 식별
- [ ] 맞춤형 가치 제안 생성
- [ ] 컨택 전략 수립 AI
- [ ] 개인화된 메시지 생성

### Phase 4: 배포 및 최적화 (1주)
- [ ] Render 배포 설정
- [ ] 성능 최적화 (캐싱, 인덱싱)
- [ ] 모니터링 및 로깅
- [ ] 종합 테스트
- [ ] 문서화

## ✅ 수정된 완료 체크리스트

### 필수 구현 사항
- [ ] 고객사 정보 관리 시스템
- [ ] 다중 소스 크롤링 시스템 (LinkedIn, Crunchbase, 웹사이트)
- [ ] AI 기반 잠재고객 발굴 엔진
- [ ] 자동 자격 검증 시스템
- [ ] 세일즈 인텔리전스 생성 AI
- [ ] 비동기 작업 및 진행 상황 추적
- [ ] 개인화된 아웃리치 메시지 생성
- [ ] 실시간 대시보드 API
- [ ] 종합 테스트 및 문서화
- [ ] Render SaaS 배포

---

**핵심 가치 제안**: "고객사 정보만 입력하면 AI가 자동으로 최적의 잠재고객을 발굴하고 맞춤형 컨택 전략까지 제안하는 완전 자동화된 B2B 세일즈 인텔리전스 플랫폼"

## 📞 연락처 및 질문

개발 중 궁금한 사항이나 추가 요구사항이 있으면 언제든 연락주세요.

---

**마감일**: 개발 시작 후 5주 이내
**우선순위**: Phase 1-2 완료 후 프론트엔드와 연동 테스트
**배포 목표**: Phase 3 완료 후 Render 배포 