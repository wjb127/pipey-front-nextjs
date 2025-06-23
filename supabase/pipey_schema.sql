-- Pipey SaaS Platform Database Schema
-- 고객사 정보 기반 AI 잠재고객 발굴 플랫폼

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS pipey_emails CASCADE;
DROP TABLE IF EXISTS pipey_sales_intelligences CASCADE;
DROP TABLE IF EXISTS pipey_news_items CASCADE;
DROP TABLE IF EXISTS pipey_contact_attempts CASCADE;
DROP TABLE IF EXISTS pipey_prospects CASCADE;
DROP TABLE IF EXISTS pipey_discovery_jobs CASCADE;
DROP TABLE IF EXISTS pipey_client_companies CASCADE;
DROP TABLE IF EXISTS pipey_analyses CASCADE;
DROP TABLE IF EXISTS pipey_companies CASCADE;
DROP TABLE IF EXISTS pipey_users CASCADE;

-- 1. 사용자 테이블
CREATE TABLE pipey_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'starter', 'pro', 'enterprise'
  api_credits INTEGER DEFAULT 10, -- 무료 크레딧
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 고객사 정보 테이블 (사용자의 회사)
CREATE TABLE pipey_client_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 잠재고객 발굴 작업 테이블
CREATE TABLE pipey_discovery_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_company_id UUID REFERENCES pipey_client_companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES pipey_users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'cancelled'
  job_type VARCHAR(50) DEFAULT 'full_discovery', -- 'full_discovery', 'incremental', 'refresh'
  search_criteria JSONB, -- 검색 조건
  progress INTEGER DEFAULT 0, -- 0-100
  current_task TEXT, -- 현재 진행 중인 작업
  total_prospects_found INTEGER DEFAULT 0,
  qualified_prospects INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 발굴된 잠재고객 테이블
CREATE TABLE pipey_prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discovery_job_id UUID REFERENCES pipey_discovery_jobs(id) ON DELETE CASCADE,
  client_company_id UUID REFERENCES pipey_client_companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES pipey_users(id) ON DELETE CASCADE,
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
  qualification_score DECIMAL(4,2), -- 0.00 ~ 100.00
  data_sources JSONB, -- 데이터 수집 출처
  raw_data JSONB, -- 원본 크롤링 데이터
  status VARCHAR(50) DEFAULT 'discovered', -- 'discovered', 'qualified', 'contacted', 'responded', 'converted'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. AI 생성 세일즈 인텔리전스 테이블
CREATE TABLE pipey_sales_intelligences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES pipey_prospects(id) ON DELETE CASCADE,
  client_company_id UUID REFERENCES pipey_client_companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES pipey_users(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL, -- 0-100 매칭 점수
  priority_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  contact_timing VARCHAR(50), -- 'immediate', 'this_week', 'this_month', 'next_quarter'
  pain_points JSONB, -- 식별된 pain points
  value_props JSONB, -- 맞춤형 가치 제안
  decision_makers JSONB, -- 의사결정자 정보
  recommended_approach TEXT,
  conversation_starters JSONB, -- 대화 시작점들
  objection_handling JSONB, -- 예상 반박과 대응
  recent_triggers JSONB, -- 최근 트리거 이벤트
  competitive_landscape JSONB, -- 경쟁사 분석
  ai_confidence DECIMAL(3,2), -- AI 분석 신뢰도 0.00-1.00
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 이메일 생성 및 발송 테이블
CREATE TABLE pipey_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intelligence_id UUID REFERENCES pipey_sales_intelligences(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES pipey_prospects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES pipey_users(id) ON DELETE CASCADE,
  message_type VARCHAR(50) DEFAULT 'cold_email', -- 'cold_email', 'linkedin_message', 'follow_up'
  subject VARCHAR(500),
  content TEXT NOT NULL,
  tone VARCHAR(50), -- 'professional', 'friendly', 'consultative'
  personalization_elements JSONB, -- 개인화 요소들
  confidence_score DECIMAL(3,2), -- 생성 품질 신뢰도
  estimated_response_rate VARCHAR(20), -- 예상 응답률
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'opened', 'replied', 'bounced'
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  recipient_email VARCHAR(255),
  sender_email VARCHAR(255),
  tracking_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 뉴스 및 트리거 이벤트 테이블
CREATE TABLE pipey_news_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES pipey_prospects(id) ON DELETE CASCADE,
  company_name VARCHAR(200) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT,
  url VARCHAR(1000),
  source VARCHAR(200),
  published_at TIMESTAMP WITH TIME ZONE,
  relevance_score DECIMAL(3,2), -- 0.00-1.00
  sentiment VARCHAR(20), -- 'positive', 'negative', 'neutral'
  trigger_type VARCHAR(50), -- 'funding', 'hiring', 'product_launch', 'acquisition', 'executive_change'
  keywords JSONB, -- 관련 키워드들
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 컨택 시도 이력 테이블
CREATE TABLE pipey_contact_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES pipey_prospects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES pipey_users(id) ON DELETE CASCADE,
  email_id UUID REFERENCES pipey_emails(id) ON DELETE SET NULL,
  attempt_type VARCHAR(50), -- 'email', 'linkedin', 'phone', 'meeting'
  status VARCHAR(50), -- 'sent', 'opened', 'replied', 'meeting_booked', 'no_response'
  response_content TEXT,
  follow_up_needed BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_pipey_client_companies_user_id ON pipey_client_companies(user_id);
CREATE INDEX idx_pipey_discovery_jobs_client_company_id ON pipey_discovery_jobs(client_company_id);
CREATE INDEX idx_pipey_discovery_jobs_status ON pipey_discovery_jobs(status);
CREATE INDEX idx_pipey_prospects_client_company_id ON pipey_prospects(client_company_id);
CREATE INDEX idx_pipey_prospects_qualification_score ON pipey_prospects(qualification_score DESC);
CREATE INDEX idx_pipey_prospects_status ON pipey_prospects(status);
CREATE INDEX idx_pipey_sales_intelligences_prospect_id ON pipey_sales_intelligences(prospect_id);
CREATE INDEX idx_pipey_sales_intelligences_match_score ON pipey_sales_intelligences(match_score DESC);
CREATE INDEX idx_pipey_emails_prospect_id ON pipey_emails(prospect_id);
CREATE INDEX idx_pipey_emails_status ON pipey_emails(status);
CREATE INDEX idx_pipey_news_items_prospect_id ON pipey_news_items(prospect_id);
CREATE INDEX idx_pipey_news_items_relevance_score ON pipey_news_items(relevance_score DESC);

-- 자동 업데이트 타임스탬프 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 자동 업데이트 트리거 생성
CREATE TRIGGER update_pipey_users_updated_at 
  BEFORE UPDATE ON pipey_users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipey_client_companies_updated_at 
  BEFORE UPDATE ON pipey_client_companies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipey_discovery_jobs_updated_at 
  BEFORE UPDATE ON pipey_discovery_jobs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipey_prospects_updated_at 
  BEFORE UPDATE ON pipey_prospects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 정책
ALTER TABLE pipey_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipey_client_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipey_discovery_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipey_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipey_sales_intelligences ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipey_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipey_news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipey_contact_attempts ENABLE ROW LEVEL SECURITY;

-- 사용자별 데이터 격리 정책
CREATE POLICY "Users can view own data" ON pipey_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON pipey_users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own client companies" ON pipey_client_companies
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own discovery jobs" ON pipey_discovery_jobs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own prospects" ON pipey_prospects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sales intelligences" ON pipey_sales_intelligences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own emails" ON pipey_emails
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own news items" ON pipey_news_items
  FOR SELECT USING (
    prospect_id IN (
      SELECT id FROM pipey_prospects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own contact attempts" ON pipey_contact_attempts
  FOR ALL USING (auth.uid() = user_id);

-- 샘플 데이터 삽입 (개발/테스트용)
INSERT INTO pipey_users (id, email, name, password_hash, subscription_tier, api_credits) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'demo@pipey.co', '데모 사용자', '$2b$10$example_hash', 'pro', 100),
  ('550e8400-e29b-41d4-a716-446655440002', 'startup@example.com', '스타트업 대표', '$2b$10$example_hash', 'starter', 50);

INSERT INTO pipey_client_companies (id, user_id, company_name, industry, company_size, website, description, target_market, products_services, value_proposition, ideal_customer_profile) VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '테크이노베이션',
    'SaaS',
    'startup',
    'https://techinnovation.co.kr',
    'B2B 마케팅 자동화 솔루션 제공 스타트업',
    '중소기업 마케팅 담당자 및 세일즈팀',
    '{"main_product": "마케팅 자동화 플랫폼", "key_features": ["이메일 마케팅", "리드 스코링", "CRM 연동", "분석 대시보드"], "pricing_model": "SaaS 구독"}',
    '마케팅 ROI 300% 향상, 리드 전환율 2배 증가, 세일즈 프로세스 완전 자동화',
    '{"company_size": "10-500명", "industry": ["Technology", "E-commerce", "Professional Services"], "pain_points": ["수동 마케팅 프로세스", "낮은 리드 품질", "세일즈-마케팅 팀 소통 단절"], "budget_range": "$1000-$10000/month"}'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'AI솔루션즈',
    'AI/ML',
    'small',
    'https://aisolutions.co.kr',
    'AI 기반 비즈니스 솔루션 개발 회사',
    'IT 스타트업 및 중소기업 CTO',
    '{"main_product": "AI 분석 플랫폼", "key_features": ["예측 분석", "자동화 워크플로우", "실시간 모니터링"], "pricing_model": "커스텀"}',
    'AI로 비즈니스 의사결정 속도 5배 향상, 운영 비용 40% 절감',
    '{"company_size": "50-1000명", "industry": ["Technology", "FinTech", "Manufacturing"], "pain_points": ["데이터 활용 미흡", "수동 분석 프로세스", "예측 정확도 부족"], "budget_range": "$5000-$50000/month"}'
  );

INSERT INTO pipey_discovery_jobs (id, client_company_id, user_id, status, search_criteria, progress, total_prospects_found, qualified_prospects, started_at, completed_at) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'completed',
    '{"industries": ["Technology", "SaaS", "E-commerce"], "company_sizes": ["startup", "small", "medium"], "locations": ["Seoul", "Busan", "Global"], "employee_range": [10, 500], "technologies": ["Salesforce", "HubSpot"], "funding_stage": ["Series A", "Series B"], "growth_signals": ["recent_hiring", "funding_raised"]}',
    100,
    156,
    89,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '30 minutes'
  );

INSERT INTO pipey_prospects (id, discovery_job_id, client_company_id, user_id, company_name, domain, industry, company_size, location, employee_count, annual_revenue, technologies, recent_funding, key_personnel, qualification_score, status) VALUES
  (
    '880e8400-e29b-41d4-a716-446655440001',
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '마케팅허브',
    'marketinghub.co.kr',
    'MarTech',
    'startup',
    'Seoul, South Korea',
    45,
    5000000000,
    '["HubSpot", "Google Analytics", "Slack", "Notion"]',
    '{"round": "Series A", "amount": "$5M", "date": "2024-01-15", "investors": ["KDB산업은행", "스마일게이트"]}',
    '{"ceo": {"name": "김마케팅", "linkedin": "linkedin.com/in/kimmarketing"}, "cmo": {"name": "박세일즈", "linkedin": "linkedin.com/in/parksales"}}',
    92.5,
    'qualified'
  ),
  (
    '880e8400-e29b-41d4-a716-446655440002',
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '이커머스플러스',
    'ecommerceplus.co.kr',
    'E-commerce',
    'small',
    'Busan, South Korea',
    78,
    8000000000,
    '["Shopify", "Google Ads", "Facebook Ads", "Zendesk"]',
    '{"round": "Seed", "amount": "$2M", "date": "2023-11-20", "investors": ["본엔젤스", "프라이머"]}',
    '{"ceo": {"name": "이커머스", "linkedin": "linkedin.com/in/leecommerce"}, "cto": {"name": "최테크", "linkedin": "linkedin.com/in/choitech"}}',
    87.3,
    'qualified'
  ),
  (
    '880e8400-e29b-41d4-a716-446655440003',
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '핀테크이노베이션',
    'fintechinnovation.co.kr',
    'FinTech',
    'medium',
    'Seoul, South Korea',
    123,
    15000000000,
    '["Stripe", "AWS", "React", "PostgreSQL"]',
    '{"round": "Series B", "amount": "$15M", "date": "2024-02-01", "investors": ["카카오벤처스", "네이버", "IMM인베스트먼트"]}',
    '{"ceo": {"name": "정핀테크", "linkedin": "linkedin.com/in/jungfintech"}, "cpo": {"name": "강프로덕트", "linkedin": "linkedin.com/in/kangproduct"}}',
    95.8,
    'qualified'
  );

INSERT INTO pipey_sales_intelligences (id, prospect_id, client_company_id, user_id, match_score, priority_level, contact_timing, pain_points, value_props, decision_makers, recommended_approach, conversation_starters, recent_triggers, ai_confidence) VALUES
  (
    '990e8400-e29b-41d4-a716-446655440001',
    '880e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    92,
    'high',
    'immediate',
    '["수동 리드 관리로 인한 비효율", "마케팅 ROI 측정 어려움", "영업-마케팅 팀 소통 단절", "성장에 따른 프로세스 확장 한계"]',
    '["리드 관리 자동화로 50% 시간 절약", "실시간 ROI 대시보드 제공", "영업팀과 마케팅팀 통합 플랫폼", "확장성 있는 자동화 시스템"]',
    '{"primary": {"name": "김마케팅", "title": "Head of Marketing", "linkedin": "linkedin.com/in/kimmarketing", "contact_priority": "high"}, "secondary": {"name": "박세일즈", "title": "Sales Director", "linkedin": "linkedin.com/in/parksales", "contact_priority": "medium"}}',
    '최근 투자 유치와 팀 확장을 축하하며 성장 과정에서 발생할 수 있는 마케팅 효율성 이슈에 대한 솔루션 제안. 기존 HubSpot 사용 경험을 언급하여 친밀감 형성.',
    '["Series A 투자 유치 축하드립니다. 빠른 성장 과정에서 마케팅 프로세스 확장에 어려움은 없으신가요?", "마케팅 팀 확장 중이신 것으로 알고 있는데, 새로운 팀원들의 온보딩과 협업 효율성은 어떠신가요?", "HubSpot을 활용 중이신 것 같은데, 더 고도화된 자동화 기능이 필요하지 않으실까요?"]',
    '["Series A $5M 투자 유치 (2024-01-15)", "마케팅 팀 3명 추가 채용 (2024-01-10)", "새로운 제품 라인 출시 예정 공지", "CEO 인터뷰에서 글로벌 확장 계획 언급"]',
    0.94
  );

INSERT INTO pipey_news_items (id, prospect_id, company_name, title, content, url, source, published_at, relevance_score, sentiment, trigger_type) VALUES
  (
    'aa0e8400-e29b-41d4-a716-446655440001',
    '880e8400-e29b-41d4-a716-446655440001',
    '마케팅허브',
    '마케팅허브, Series A 라운드에서 50억원 투자 유치 성공',
    '마케팅 자동화 솔루션을 제공하는 마케팅허브가 KDB산업은행, 스마일게이트로부터 50억원 규모의 Series A 투자를 유치했다고 15일 발표했다.',
    'https://news.example.com/marketinghub-series-a',
    '테크크런치 코리아',
    '2024-01-15 09:00:00+09',
    0.95,
    'positive',
    'funding'
  ),
  (
    'aa0e8400-e29b-41d4-a716-446655440002',
    '880e8400-e29b-41d4-a716-446655440003',
    '핀테크이노베이션',
    '핀테크이노베이션, 카카오벤처스 등으로부터 150억원 투자 유치',
    '디지털 금융 솔루션 전문기업 핀테크이노베이션이 카카오벤처스, 네이버, IMM인베스트먼트로부터 150억원 규모의 Series B 투자를 유치했다.',
    'https://news.example.com/fintech-series-b',
    '조선비즈',
    '2024-02-01 14:30:00+09',
    0.92,
    'positive',
    'funding'
  );

-- 뷰 생성 (자주 사용되는 조인 쿼리 최적화)
CREATE VIEW pipey_prospect_summary AS
SELECT 
  p.*,
  si.match_score,
  si.priority_level,
  si.contact_timing,
  cc.company_name as client_company_name,
  u.name as user_name
FROM pipey_prospects p
LEFT JOIN pipey_sales_intelligences si ON p.id = si.prospect_id
LEFT JOIN pipey_client_companies cc ON p.client_company_id = cc.id
LEFT JOIN pipey_users u ON p.user_id = u.id;

-- 통계 뷰
CREATE VIEW pipey_discovery_stats AS
SELECT 
  dj.client_company_id,
  COUNT(DISTINCT dj.id) as total_discovery_jobs,
  SUM(dj.total_prospects_found) as total_prospects_found,
  SUM(dj.qualified_prospects) as total_qualified_prospects,
  COUNT(DISTINCT p.id) as total_prospects,
  COUNT(DISTINCT CASE WHEN si.priority_level = 'high' THEN p.id END) as high_priority_prospects,
  COUNT(DISTINCT CASE WHEN p.status = 'contacted' THEN p.id END) as contacted_prospects,
  COUNT(DISTINCT CASE WHEN p.status = 'responded' THEN p.id END) as responded_prospects
FROM pipey_discovery_jobs dj
LEFT JOIN pipey_prospects p ON dj.id = p.discovery_job_id
LEFT JOIN pipey_sales_intelligences si ON p.id = si.prospect_id
GROUP BY dj.client_company_id;

-- 성능 통계 업데이트를 위한 함수
CREATE OR REPLACE FUNCTION refresh_prospect_stats()
RETURNS void AS $$
BEGIN
  -- 통계 테이블이 있다면 여기서 업데이트
  -- 현재는 뷰를 사용하므로 실시간 업데이트
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- 코멘트 추가
COMMENT ON TABLE pipey_users IS '사용자 계정 정보';
COMMENT ON TABLE pipey_client_companies IS '고객사 정보 (사용자의 회사)';
COMMENT ON TABLE pipey_discovery_jobs IS '잠재고객 발굴 작업';
COMMENT ON TABLE pipey_prospects IS '발굴된 잠재고객 정보';
COMMENT ON TABLE pipey_sales_intelligences IS 'AI 생성 세일즈 인텔리전스';
COMMENT ON TABLE pipey_emails IS '생성된 이메일 및 발송 이력';
COMMENT ON TABLE pipey_news_items IS '뉴스 및 트리거 이벤트';
COMMENT ON TABLE pipey_contact_attempts IS '컨택 시도 이력'; 