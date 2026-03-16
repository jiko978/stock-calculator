# JIKO 계산기 공통 개발 가이드

신규 계산기 메뉴를 추가할 때 준수해야 할 아키텍처 및 공통 기능 가이드입니다.

## 1. 폴더 및 파일 구조
모든 새 메뉴는 아래와 같은 구조를 따릅니다.
```text
app/calculator/stock/[menu-name]/
ㄴ page.tsx             # 기본 서버 컴포넌트 (범용 계산기)
ㄴ [slug]/page.tsx      # 동적 서버 컴포넌트 (종목별 SEO 전용)
ㄴ [ComponentName].tsx  # 실제 계산기 로직 (클라이언트 컴포넌트)

**[신규] SEO Ticker 매핑 가이드**:
- `[slug]/page.tsx`는 `stocks.json`을 참조하여 `findStock` 로직을 구현해야 합니다.
- 사용자가 종목코드, 종목명, 혹은 `명칭-코드` 형태로 접속해도 정확한 데이터를 매핑하도록 설계합니다.
```

## 2. 필수 SEO 구현

### 2.1 메타데이터 (Metadata)
- `page.tsx`에는 메뉴별 기본 메타데이터 정의.
- `[slug]/page.tsx`에는 `generateMetadata`를 통해 종목명이 포함된 동적 메타데이터 구현.

### 2.2 JSON-LD (스키마 데이터)
- 모든 `page.tsx` 하단에 아래 3가지 JSON-LD 스크립트 삽입 필수.
  1. `SoftwareApplication`: 앱 기본 정보
  2. `FAQPage`: 자주 묻는 질문 (검색 결과 노출 증대)
  3. `BreadcrumbList`: 계층 구조 (구글 리치 스니펫)
     - `app/utils/seo.ts`의 `generateBreadcrumbJsonLd` 유틸리티 사용.

## 3. PWA 연동 (설치 유도)
사용자 설치 경험을 위해 페이지 하단에 반드시 `InstallBanner`가 노출되어야 합니다.

- **위치**: 클라이언트 컴포넌트(`[ComponentName].tsx`)의 최하단 (Footer 직전).
- **코드 예시**:
```tsx
import InstallBanner from "@/app/calculator/components/InstallBanner";

export default function MyCalculator() {
    return (
        <div>
            {/* 계산기 UI... */}
            <InstallBanner />
        </div>
    );
}
```

## 4. UI/UX 공통 요소

### 4.1 내비게이션 바 (NavBar)
- 뒤로가기 및 공유 기능을 위해 `NavBar` 컴포넌트를 필수 사용합니다.
- `<NavBar title="제목" description="소개문구" />`

### 4.2 디자인 가이드
- **카드형 레이아웃**: 모든 입력 영역은 `bg-white dark:bg-gray-800`와 `rounded-2xl`을 사용하여 카드 형태로 디자인.
- **다크모드**: `dark:` 클래스를 사용하여 완벽한 다크모드 대응.
- **반응형**: 모바일 기기(320px 이상)에서도 레이아웃이 깨지지 않도록 `px-4` 등 패딩 값 준수.

## 5. 입력 및 계산 가이드
- **최대 입력 제한**: 모든 숫자 필드는 `10억(9자리)` 미만으로 입력 차단(`maxLength={9}`).
- **결과 복사**: `navigator.clipboard.writeText`를 활용한 결과값 복사 기능 제공 권장.
- **초기화**: 입력 데이터를 초기 상태로 돌리는 버튼에 쉐이크 애니메이션 적용 권장.
