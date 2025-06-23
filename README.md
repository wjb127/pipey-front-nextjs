# Pipey - 스마트 세일즈 솔루션

기업 뉴스 분석을 통한 최적의 컨택 타이밍을 찾는 SaaS 대시보드입니다.

## 🚀 주요 기능

- **기업 등록**: 기업명과 업종을 입력하여 뉴스 크롤링 시작
- **뉴스 분석**: AI를 통한 뉴스 분석 및 컨택 타이밍 평가
- **메일 생성**: GPT 기반 개인화된 세일즈 메일 자동 생성
- **대시보드**: 전체 분석 현황과 최근 활동 모니터링

## 🛠 기술 스택

- **프론트엔드**: Next.js 15, React 19, TypeScript
- **스타일링**: Tailwind CSS
- **상태관리**: React Query
- **데이터베이스**: Supabase
- **이메일**: Resend
- **아이콘**: Lucide React
- **배포**: Vercel

## 📁 프로젝트 구조

```
pipey/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── analytics/         # 뉴스 분석 페이지
│   ├── dashboard/         # 대시보드 페이지
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈 페이지
├── components/            # 재사용 컴포넌트
│   ├── analytics/         # 분석 관련 컴포넌트
│   ├── company/          # 기업 등록 컴포넌트
│   ├── dashboard/        # 대시보드 컴포넌트
│   ├── email/            # 이메일 관련 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   └── ui/               # 기본 UI 컴포넌트
├── lib/                  # 유틸리티 및 설정
│   ├── actions/          # 서버 액션
│   ├── api/              # API 클라이언트
│   ├── providers/        # 컨텍스트 프로바이더
│   ├── supabase/         # Supabase 설정
│   ├── types.ts          # TypeScript 타입 정의
│   └── utils.ts          # 유틸리티 함수
└── ...config files
```

## 🔧 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd pipey
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Resend API 키
RESEND_API_KEY=your_resend_api_key_here

# 백엔드 API URL (FastAPI)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# OpenAI API 키 (GPT 메일 생성용)
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)를 열어 확인하세요.

## 📝 주요 사용 흐름

1. **기업 등록**: 홈페이지에서 기업명 입력 후 뉴스 분석 시작
2. **분석 결과 확인**: `/analytics` 페이지에서 분석 진행 상황 및 결과 확인
3. **메일 생성**: 컨택 타이밍이 좋은 기업에 대해 세일즈 메일 자동 생성
4. **대시보드 모니터링**: `/dashboard`에서 전체 현황 확인

## 🔗 백엔드 연동

현재 프론트엔드는 FastAPI 백엔드와 연동하도록 설계되었습니다. 백엔드 API 엔드포인트:

- `POST /api/crawl-news`: 기업 뉴스 크롤링 시작
- `POST /api/analyze-news`: 뉴스 분석 수행
- `GET /api/analyses/recent`: 최근 분석 결과 조회
- `GET /api/analyses/{id}`: 특정 분석 결과 조회
- `POST /api/generate-email`: GPT 기반 메일 생성

백엔드가 아직 구현되지 않은 상태에서는 Mock 데이터를 반환합니다.

## 🎨 커스터마이징

### 테마 변경
`tailwind.config.ts`와 `app/globals.css`에서 색상 테마를 수정할 수 있습니다.

### 컴포넌트 확장
`components/` 디렉토리의 각 컴포넌트는 독립적으로 확장 가능합니다.

## 📦 배포

### Vercel 배포
```bash
npm run build
vercel deploy
```

### 환경변수 설정
Vercel 대시보드에서 환경변수를 설정하세요.

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🔧 개발 노트

- React 19의 `useActionState`, `useFormStatus` 훅을 활용한 최신 폼 처리
- Next.js 15의 App Router와 서버 컴포넌트 활용
- TypeScript로 타입 안정성 확보
- React Query를 통한 효율적인 서버 상태 관리
- Tailwind CSS로 반응형 디자인 구현 