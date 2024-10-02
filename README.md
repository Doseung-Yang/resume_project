<img width="1658" alt="스크린샷 2024-10-02 오후 3 39 58" src="https://github.com/user-attachments/assets/9482a814-cf7b-40b8-8b48-1dad3dda04e0">
# 견적서 프로젝트

## 프로젝트 설명

이 프로젝트는 젠데스크 필드와 연동하여, 특정 티켓 번호를 입력하면 해당 티켓의 정보를 자동으로 매핑해 견적서를 생성해주는 시스템입니다. 사용자는 Next.js 및 TypeScript 기반의 웹 애플리케이션을 통해 견적서를 손쉽게 작성하고 PDF로 다운로드할 수 있습니다.

---

## 주요 기능

- 젠데스크 연동: 특정 티켓 번호 입력 시, 해당 티켓의 필드 값이 자동으로 매핑됨
- PDF 다운로드: 작성한 견적서를 PDF 형식으로 저장
- 사용자 편의성: 입력된 정보에 따라 견적서가 자동 생성되고 사용자 커스터마이징 가능

---

<img width="760" alt="스크린샷 2024-10-02 오후 3 42 10" src="https://github.com/user-attachments/assets/3d130057-e67e-44b5-a673-86da32dc6636">


## 사용된 기술 스택

### 프론트엔드

- Next.js: 프로젝트의 주요 프레임워크로, 빠르고 효율적인 SSR(서버사이드 렌더링) 제공
- TypeScript: 타입 안정성을 보장하여 코드 유지보수성을 향상시킴
- Tailwind CSS: 간편한 스타일링 및 레이아웃 구성에 사용
- React: 컴포넌트 기반 UI 라이브러리로, 견적서 페이지의 인터랙티브한 UI 구성

### 백엔드 연동

- Zendesk API: 티켓 번호를 통해 자동으로 데이터를 가져와 견적서에 반영

### 배포

- Vercel: Next.js 애플리케이션을 배포 및 운영

---

## 설치 및 실행 방법

1. 프로젝트 클론

   ```bash
   git clone https://github.com/your-repository-url.git
   cd your-repository
   필수 패키지 설치
   ```

bash
코드 복사
npm install
개발 서버 실행

bash
코드 복사
npm run dev
브라우저에서 확인

브라우저에서 http://localhost:3000으로 접속하여 프로젝트를 확인할 수 있습니다.

환경 변수 설정
젠데스크 API 연동을 위해 환경 변수를 설정해야 합니다. .env.local 파일을 프로젝트 루트 디렉토리에 추가하고 아래와 같이 설정하세요:

makefile(.env.local) 환경 변수 설정
코드 복사
- ZENDESK_API_TOKEN=your_zendesk_api_token
- ZENDESK_SUBDOMAIN=your_zendesk_subdomain
- ZENDESK_EMAIL=your_email@example.com
# 개선 사항
- 견적 항목의 더 많은 커스터마이징 기능 추가
- PDF 디자인 및 템플릿 확장
# 기여 방법
- 프로젝트를 Fork합니다.
- 새 브랜치에서 작업하세요 (git checkout -b feature/your-feature).
- 커밋 후 푸시하세요 (git commit -am 'Add some feature').
- Pull Request를 생성하세요.
