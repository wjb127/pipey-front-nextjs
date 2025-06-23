# Pipey Supabase 설정 가이드

## 📋 목차
1. [데이터베이스 스키마 설치](#데이터베이스-스키마-설치)
2. [환경 변수 설정](#환경-변수-설정)
3. [RLS (Row Level Security) 정책](#rls-정책)
4. [API 사용법](#api-사용법)
5. [샘플 데이터](#샘플-데이터)

## 🗄️ 데이터베이스 스키마 설치

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. 새 프로젝트 생성
3. 프로젝트 설정에서 Database URL과 API 키 확인

### 2. 스키마 설치
```sql
-- supabase/pipey_schema.sql 파일의 내용을 Supabase SQL Editor에서 실행
```

Supabase 대시보드 → SQL Editor → 새 쿼리 → `pipey_schema.sql` 내용 복사 후 실행

## 🔑 환경 변수 설정

`.env.local` 파일에 다음 변수들을 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 이메일 설정 (Resend)
RESEND_API_KEY=your_resend_api_key

# OpenAI API (GPT 기능용)
OPENAI_API_KEY=your_openai_api_key
```

## 🔒 RLS (Row Level Security) 정책

### 사용자 인증 설정
```javascript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()
```

### 인증 후 데이터 접근
RLS 정책에 의해 사용자는 자신의 데이터만 접근할 수 있습니다:

- **Users**: 본인 프로필만 조회/수정
- **Companies**: 본인이 등록한 회사만 접근
- **Analyses**: 본인의 분석 작업만 접근
- **Emails**: 본인이 생성한 이메일만 접근

## 📡 API 사용법

### 회사 등록
```javascript
const { data, error } = await supabase
  .from('pipey_companies')
  .insert({
    name: '삼성전자',
    industry: 'Technology',
    website: 'https://samsung.com',
    user_id: user.id
  })
```

### 분석 생성
```javascript
const { data, error } = await supabase
  .from('pipey_analyses')
  .insert({
    company_id: 'company-uuid',
    user_id: user.id,
    status: 'processing'
  })
```

### 세일즈 인텔리전스 조회
```javascript
const { data, error } = await supabase
  .from('pipey_sales_intelligences')
  .select(`
    *,
    pipey_companies(name, industry),
    pipey_analyses(status, created_at)
  `)
  .order('priority_score', { ascending: false })
```

### 우선순위 높은 리드 조회
```javascript
const { data, error } = await supabase
  .from('pipey_sales_intelligences')
  .select(`
    *,
    pipey_companies(name, industry, website)
  `)
  .gte('priority_score', 80)
  .order('priority_score', { ascending: false })
```

## 📊 샘플 데이터

스키마에는 개발용 샘플 데이터가 포함되어 있습니다:

### 샘플 사용자
- `test@pipey.com` - 김세일즈 (테크스타트업)
- `demo@pipey.com` - 박영업 (마케팅에이전시)

### 샘플 회사
- 삼성전자 (Technology)
- 현대자동차 (Automotive)  
- LG화학 (Chemical)

### 샘플 분석
- 삼성전자: 완료된 분석 (우선순위 95점)
- 현대자동차: 진행중인 분석

## 🚀 성능 최적화

### 인덱스 활용
주요 쿼리 패턴에 맞춰 인덱스가 설정되어 있습니다:

- 사용자별 데이터 조회: `user_id` 인덱스
- 우선순위별 정렬: `priority_score DESC` 인덱스
- 시간순 정렬: `created_at DESC` 인덱스

### 쿼리 최적화 팁
```javascript
// ✅ 좋은 예: 필요한 컬럼만 선택
const { data } = await supabase
  .from('pipey_companies')
  .select('id, name, industry')
  .eq('status', 'active')

// ❌ 나쁜 예: 모든 컬럼 선택
const { data } = await supabase
  .from('pipey_companies')
  .select('*')
```

## 🔧 문제 해결

### 일반적인 오류

1. **RLS 정책 오류**
   ```
   Row Level Security policy violation
   ```
   → 사용자 인증 상태 확인 및 RLS 정책 검토

2. **Foreign Key 제약 오류**
   ```
   Foreign key constraint violation
   ```
   → 참조되는 레코드가 존재하는지 확인

3. **UUID 형식 오류**
   ```
   Invalid UUID format
   ```
   → UUID 형식 검증 (`gen_random_uuid()` 사용 권장)

### 디버깅 쿼리
```sql
-- 사용자별 데이터 현황 확인
SELECT 
  u.email,
  COUNT(c.id) as companies_count,
  COUNT(a.id) as analyses_count
FROM pipey_users u
LEFT JOIN pipey_companies c ON u.id = c.user_id
LEFT JOIN pipey_analyses a ON c.id = a.company_id
GROUP BY u.id, u.email;
```

## 📝 추가 참고사항

- 모든 테이블명은 `pipey_` 접두사 사용
- JSONB 필드는 복잡한 데이터 구조 저장용
- 자동 타임스탬프 관리 (created_at, updated_at)
- CASCADE 삭제로 데이터 일관성 보장

## 🔗 관련 링크

- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL JSONB 문서](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security) 