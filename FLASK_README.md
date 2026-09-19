# Bhutan Raëlian Movement - Python Flask & HTML Portal

부탄 라엘리안 무브먼트(Bhutan Raëlian Movement) 공식 포털 웹 애플리케이션의 Python Flask 버전입니다.

## 프로젝트 구조 (Project Architecture)

```
├── app.py                      # Flask 메인 서버 애플리케이션 (라우팅, 세션, DB 입출력)
├── requirements.txt            # 파이썬 의존성 패키지 (Flask, Jinja2, Werkzeug)
├── data/
│   └── site_data.json          # 포털 콘텐츠, 테마, 아티클, 이벤트, 관리자 계정 JSON 저장소
├── templates/                  # Jinja2 HTML 템플릿 파일
│   ├── base.html               # 전체 레이아웃 베이스 (헤더, 네비게이션, 푸터, 관리자 바)
│   ├── index.html              # 메인 랜딩 포털 (Hero, About, Philosophy, Embassy, Books, Events, Contact)
│   ├── articles.html           # 아티클 & 뉴스 피드 (카테고리 필터링)
│   ├── article_detail.html     # 아티클 상세 뷰어 및 독자 댓글 시스템
│   ├── admin_login.html        # 관리자 로그인 페이지 (마스터 계정 안내)
│   └── admin_dashboard.html    # 관리자 전용 대시보드 (콘텐츠, 게시글, 일정, 테마, 백업)
└── static/                     # 정적 에셋 폴더
```

---

## 실행 방법 (Quick Start)

### 1. 가상환경 생성 및 패키지 설치
```bash
# 가상환경 생성
python3 -m venv venv

# 가상환경 활성화 (Linux/macOS)
source venv/bin/activate

# 가상환경 활성화 (Windows)
# venv\Scripts\activate

# 필수 패키지 설치
pip install -r requirements.txt
```

### 2. Flask 서버 실행
```bash
python app.py
```
브라우저에서 `http://localhost:3000` (또는 `http://127.0.0.1:5000`)에 접속하여 확인하실 수 있습니다.

---

## 주요 기능 및 라우트 안내

### 1. 퍼블릭 서비스 (Public Portal)
- `/`: 메인 랜딩 페이지 (소개, 지적설계 철학, 대사관 프로젝트, 무료 도서 다운로드, 세미나 일정, FAQ, 문의 폼)
- `/articles`: 아티클 목록 및 카테고리별(공지, 과학, 명상 등) 필터링
- `/articles/<post_id>`: 아티클 전문 읽기 및 실시간 댓글 작성
- `/contact`: 방문자 문의사항 접수 (대표 메일: `navihan01@gmail.com`)
- `/lang/<ko|en>`: 한국어 / 영어 원클릭 언어 전환

### 2. 관리자 시스템 (Admin Control Center)
- `/admin/login`: 관리자 로그인
  - **마스터 계정:** `navihan01@gmail.com`
  - **초기 비밀번호:** `rael2026!`
- `/admin`: 실시간 관리자 대시보드
  - **메인 콘텐츠 편집**: 히어로 문구, 소개글, 대사관 프로젝트 설명 즉시 변경
  - **아티클 관리**: 새 글 발행, 삭제, 조회수 관리
  - **행사 일정 관리**: 세미나 & 워크숍 등록 및 삭제
  - **테마 & 공지 배너**: 포인트 컬러 변경, 최상단 공지 알림 설정
  - **비밀번호 변경 & 백업**: JSON 다운로드 및 영구 보존
- `/admin/logout`: 안전한 로그아웃
- **상단 메뉴 빠른 이동**: 관리자 화면 상단에 사이트 주요 섹션(소개, 철학, 대사관, 소식, 도서, 일정, 연락처)으로 즉시 이동할 수 있는 바로가기 메뉴가 내장되어 있습니다.
