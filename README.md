#  Hansung Gym Management System (한성 헬스장 통합 관리 시스템)

> React + MySQL 기반의 로컬 통합 관리 웹 시스템  
> 운동/식단 루틴 가이드와 멘토링 매칭 기능을 포함한 **회원 중심 헬스장 플랫폼**

---

## 📘 프로젝트 개요

이 프로젝트는 **헬스장 회원 통합 관리 시스템**으로,  
회원(`Member`)을 중심으로 운동 루틴, 식단, 멘토링, 인센티브 등 다양한 기능을 통합 관리할 수 있도록 설계되었습니다.  

프론트엔드는 React 기반이며,  
데이터는 **로컬 MySQL 연동 방식**으로 처리됩니다.  
백엔드 API 서버는 별도로 두지 않고, 프론트 내부에서 직접 DB와 연결됩니다.

---

## ⚙️ 개발 환경

| 항목 | 내용 |
|------|------|
| **Frontend** | React 18 (Create React App) |
| **Styling** | TailwindCSS, Framer Motion |
| **Database** | MySQL (로컬 연결 방식) |
| **State Management** | Context API (`MatchContext.jsx`) |
| **UI Framework** | Responsive Design (TailwindCSS 기반) |
| **Animation** | Framer Motion |
| **Package Manager** | npm |

---

## 🚀 실행 방법

```bash
# 1. 패키지 설치
npm install

# 2. 개발 서버 실행
npm start

# 3. 브라우저에서 열기
http://localhost:3000


# 📁 프로젝트 구조
my-app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── logo192.png / logo512.png
│   ├── manifest.json / robots.txt
│   └── videos/
│       └── gym.mp4                 # 메인 소개 영상
│
├── src/
│   ├── assets/
│   │   └── mentoring/
│   │       ├── mentor.png          # 기본 멘토 이미지
│   │       ├── mentee.png          # 기본 멘티 이미지
│   │       └── defaultProfile.png  # 기본 프로필 이미지
│   │
│   ├── components/
│   │   └── Navbar.jsx              # 상단 네비게이션 (공통)
│   │
│   ├── context/
│   │   └── ThemeContext.jsx        # 🌓 전역 다크모드 테마 관리
│   │
│   ├── pages/
│   │   ├── guide/                  # 🥗 헬스 가이드 모듈
│   │   │   ├── Guide.jsx           # 가이드 메인 페이지
│   │   │   ├── DietTab.jsx         # 식단 가이드 탭
│   │   │   ├── RoutineTab.jsx      # 운동 루틴 탭
│   │   │   ├── PostCard.jsx        # 가이드 게시글 카드
│   │   │   └── NewPostModal.jsx    # 가이드 게시글 작성 모달
│   │   │
│   │   ├── mentoring/              # 🤝 멘토링 모듈
│   │   │   ├── Mentoring.jsx       # 멘토링 메인 탭 (다크모드/프로필)
│   │   │   ├── MentorRecruitTab.jsx# 멘토 모집글 작성 + 멘티 신청 관리
│   │   │   ├── MenteeRecruitTab.jsx# 멘티 모집글 작성 + 멘토 신청 관리
│   │   │   ├── MatchContext.jsx    # 멘토/멘티/매칭 상태 관리
│   │   │   ├── MatchModal.jsx      # 신청·수락·파기 모달창
│   │   │   ├── MentorCard.jsx      # 멘토 목록 카드 컴포넌트
│   │   │   └── Home.jsx            # (예비) 멘토링 소개 페이지
│   │   │
│   │   ├── Home.jsx                # 메인 홈 화면
│   │   ├── MyPage.jsx              # 🧑 개인 정보 및 매칭 현황 (다크모드 지원)
│   │   ├── Goal.jsx                # 🎯 목표 설정 및 운동 루틴
│   │   ├── Class.jsx               # 📚 교양수업 시간표 및 헬스장 가용성 확인
│   │   ├── Notice.jsx              # 공지사항
│   │   └── App.css                 # 전역 스타일
│   │
│   ├── App.js                      # 라우팅 및 전역 Provider 설정
│   ├── index.js                    # ReactDOM 진입점
│   ├── index.css                   # 공통 스타일
│   ├── reportWebVitals.js
│   └── setupTests.js
│
├── server/                         # 🔧 백엔드 서버 (Express.js + MySQL)
│   ├── server.js                   # Express 서버 및 REST API
│   └── sql/
│       ├── HS_Health.sql           # 데이터베이스 스키마
│       ├── insert_class_data.sql   # 교양수업 더미 데이터
│       └── README.md               # SQL 실행 가이드
│
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
└── README.md

---

## 🆕 최신 업데이트 (gyu 브랜치)

### 📚 **Class 페이지 - 교양수업 시간표 및 헬스장 가용성 확인**

학교 교양수업 시간표를 확인하고, 현재 헬스장 이용 가능 여부를 실시간으로 보여주는 페이지입니다.

#### 주요 기능:
- **실시간 헬스장 가용성 체크**: 현재 교양수업 진행 중이면 인원 제한 표시 (약 30명)
- **현재 진행 중인 수업 표시**: 지금 진행 중인 교양수업 정보 실시간 표시
- **다음 수업 미리보기**: 다음 예정된 교양수업 시간 안내
- **실시간 시계**: 1분마다 자동 업데이트되는 현재 시간
- **다크모드 지원**: 페이지별 독립적인 다크모드 토글
- **반응형 디자인**: Framer Motion 애니메이션과 함께 부드러운 UI/UX

#### 기술 스택:
```javascript
// 실시간 시간 업데이트
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000); // 1분마다 업데이트
  return () => clearInterval(timer);
}, []);

// 현재 진행 중인 수업 확인
const getCurrentClass = () => {
  const now = currentTime;
  const currentDay = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

  for (const cls of classes) {
    const schedules = classSchedules[cls.class_id] || [];
    for (const schedule of schedules) {
      if (schedule.day_of_week === currentDay) {
        if (currentTimeStr >= schedule.start_time && currentTimeStr < schedule.end_time) {
          return { class: cls, schedule };
        }
      }
    }
  }
  return null;
};
```

---

### 🌓 **다크모드 시스템**

#### ThemeContext (전역 테마 관리)
- Context API를 활용한 전역 다크모드 상태 관리
- localStorage에 테마 설정 저장으로 페이지 새로고침 시에도 유지
- HTML 루트 요소에 `dark` 클래스 자동 추가/제거

#### 페이지별 독립 다크모드
각 페이지마다 독립적인 다크모드 토글 버튼을 제공합니다:

1. **Class 페이지**: `classPageTheme` localStorage 키 사용
2. **MyPage**: `myPageTheme` localStorage 키 사용
3. **Mentoring 페이지**: 기존 독립 다크모드 유지
4. **Guide 페이지**: 기존 독립 다크모드 유지

```javascript
// 페이지별 독립 다크모드 예시 (Class.jsx)
const [isDark, setIsDark] = useState(() => {
  const saved = localStorage.getItem('classPageTheme');
  return saved ? saved === 'dark' : true;
});

useEffect(() => {
  localStorage.setItem('classPageTheme', isDark ? 'dark' : 'light');
}, [isDark]);
```

---

### 🧑 **MyPage 개선사항**

#### 새로운 기능:
- **다크모드 토글**: 우측 상단에 독립적인 다크모드 스위치 추가
- **Goal 컴포넌트 통합**: 목표 설정 및 운동 루틴 관리 기능 통합
- **다크모드 테마 전달**: MyPage의 isDark 상태를 Goal 컴포넌트로 전달하여 일관된 테마 유지

#### Goal.jsx (목표 관리 컴포넌트)
- 부모(MyPage)로부터 `isDark` prop을 받아 테마 동기화
- 운동 목표 설정 및 트래킹 기능
- 다크모드 스타일 지원

---

### 🔧 **백엔드 서버 (server.js)**

#### Express.js + MySQL REST API
- **자동 더미 데이터 초기화**: 서버 시작 시 교양수업 데이터 자동 삽입
- **교양수업 API 엔드포인트**:
  - `GET /api/classes`: 모든 교양수업 조회
  - `GET /api/class-schedules/:classId`: 특정 수업의 시간표 조회
  - `POST /api/classes`: 새 교양수업 추가
  - `PUT /api/classes/:id`: 수업 정보 수정
  - `DELETE /api/classes/:id`: 수업 삭제

#### 주요 테이블:
- **Class**: 교양수업 정보 (과목명, 담당교수, 학점 등)
- **Class_Schedule**: 수업 시간표 (요일, 시작/종료 시간)

---

### 📦 **의존성 추가**

```json
{
  "dependencies": {
    "express": "^4.21.2",
    "mysql2": "^3.11.5",
    "cors": "^2.8.5",
    "react-hot-toast": "^2.4.1"
  }
}
```

- **express**: REST API 서버
- **mysql2**: MySQL 데이터베이스 연결
- **cors**: CORS 미들웨어
- **react-hot-toast**: 토스트 알림 UI

---

### 🎨 **UI/UX 개선사항**

1. **Framer Motion 애니메이션**: 부드러운 페이지 전환 및 카드 애니메이션
2. **반응형 그라디언트 배경**: 다크/라이트 모드별 최적화된 배경색
3. **실시간 상태 표시**: 펄스 애니메이션으로 현재 상태 강조
4. **일관된 디자인 시스템**: Tailwind CSS 기반 통일된 스타일

---

## 🔄 **브랜치 정보**

- **gyu 브랜치**: Class 페이지, 다크모드, 백엔드 서버 개발
- **hong 브랜치**: gyu 브랜치 변경사항 머지 완료
