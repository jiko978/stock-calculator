# JIKO 금융 계산기 공통 개발 가이드

신규 금융 계산기 메뉴를 추가할 때 준수해야 할 아키텍처 및 공통 기능 가이드입니다.

## 1. 폴더 및 파일 구조
모든 새 메뉴는 아래와 같은 구조를 따릅니다.
```text
app/calculator/finance/[menu-name]/
ㄴ page.tsx             # 기본 서버 컴포넌트 (범용 계산기)
ㄴ [slug]/page.tsx      # 동적 서버 컴포넌트 (금융상품별 SEO 전용)
ㄴ [ComponentName].tsx  # 실제 계산기 로직 (클라이언트 컴포넌트)

**[신규] SEO 및 한글 슬러그 매핑 가이드**:
- `[slug]/page.tsx`는 `app/calculator/finance/data/products.json`을 참조하여 `product`를 조회해야 합니다.
- **한글 슬러그 처리**: URL 파라미터를 `decodeURIComponent`로 디코딩하고, `.normalize('NFC')`를 적용하여 데이터의 `slug` 필드와 비교합니다.
- **정적 생성**: `generateStaticParams`에서 `encodeURIComponent`를 사용하여 안전한 정적 경로를 생성합니다.
- 사용자가 금융 상품명(한글 슬러그)으로 접속하면 해당 데이터를 매핑하여 상품명 배지 및 맞춤형 SEO를 구현합니다.
```

## 2. 필수 SEO 구현

### 2.1 메타데이터 (Metadata)
- `page.tsx`에는 메뉴별 기본 메타데이터 정의.
- `[slug]/page.tsx`에는 `generateMetadata`를 통해 금융상품명이 포함된 동적 메타데이터 구현.

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
- **카드형 레이아웃**: 모든 입력 영역 및 하단 콘텐츠는 `bg-white dark:bg-gray-800`와 `rounded-2xl`을 사용하여 카드 형태로 디자인.
- **다크모드**: `dark:` 클래스를 사용하여 완벽한 다크모드 대응.
- **반응형**: 모바일 기기(320px 이상)에서도 레이아웃이 깨지지 않도록 `px-4` 등 패딩 값 준수.
- **공통 하단 컴포넌트**: 모든 금융 계산기는 최하단에 `FAQ`와 `FinanceMoreCalculators` 컴포넌트를 반드시 포함하여 UI 일관성을 유지해야 함.
- **FAQ 스타일**: 질문과 답변이 상시 노출되는 정적 디자인을 우선하며, `FAQ.tsx` 공통 컴포넌트를 활용함.

## 5. 화면 및 디자인 패턴 (Standard Content)
1. **[공통 카드세션]**
   - **메뉴 설명**: 금융 계산기의 가치(생활비 기여도, 목표 달성) 설명
   - **사용 방법**: 금융 계산기 사용 방법 가이드 (2열 그리드)
   - **계산 예시**: 금융 계산기 계산 예시 (2열 그리드)
    - **자주 묻는 질문(FAQ)**: 금융 계산기 관련 질문과 답변 안내 (**공통 `FAQ` 컴포넌트 적용**)
    - **금융 계산기 더 보기**: 다른 금융 계산기 메뉴 바로가기 (**공통 `FinanceMoreCalculators` 컴포넌트 적용**)
2. **[개별 카드세션]**
    - 각 금융 계산기별 필요시 추가 카드세션

## 6. 입력 및 계산 가이드
- **최대 입력 제한**: 큰 금액을 다루는 금융 특성상 숫자 필드는 `100조(13자리)` 미만으로 입력 차단(`maxLength={13}`).
- **입력 편의성**: '1만', '10만', '100만' 등 단위 버튼을 제공하여 사용자 편의성 증대.
- **결과 복사**: `navigator.clipboard.writeText`를 활용한 결과값 복사 기능 제공 필수.
- **초기화**: 입력 데이터를 초기 상태로 돌리는 버튼에 쉐이크 애니메이션 적용 필수.

## 7. UI/UX 차별화 포인트
1. **생활 기준 결과**: "이 금융 상품으로 매달 [OO] 만큼의 생활비를 해결할 수 있어요!" 등 친숙한 비유 노출.
2. **결과 UI**: 복잡한 표 형태를 지양하고, 직관적인 시각적 강조와 요약형 텍스트 위주 구성.