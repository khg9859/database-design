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

---

## 🆕 최신 업데이트 (hongrecent 브랜치)

### 📊 **마이페이지 대폭 개선**

회원의 운동/식단/건강 기록을 시각화하고 관리할 수 있는 통합 대시보드로 개선되었습니다.

#### 🎯 주요 기능

##### 1. **Chart.js 기반 체중 변화 차트**
- Line Chart로 체중 변화 추이 시각화
- 부드러운 곡선과 그라데이션 배경
- 마우스 호버 시 정확한 값 표시
- 다크모드 지원 및 반응형 디자인

```javascript
// WeightChart.jsx - Chart.js 설정
const data = {
  labels: recentRecords.map((record, idx) => {
    if (idx === 0) return '시작';
    if (idx === recentRecords.length - 1) return '현재';
    return '';
  }),
  datasets: [{
    label: '체중 (kg)',
    data: recentRecords.map(r => r.weight_kg),
    borderColor: 'rgb(34, 197, 94)',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    fill: true,
    tension: 0.4
  }]
};
```

##### 2. **사이드 패널 목표 관리**
- 오른쪽 하단 고정 버튼 (🎯)으로 접근
- 오른쪽에서 슬라이드되는 사이드 패널
- Spring 애니메이션으로 부드러운 전환
- 배경 오버레이로 포커스 강조
- 모바일: 전체 화면 / 데스크톱: 600-700px 너비

```javascript
// 사이드 패널 애니메이션
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
>
  <Goal isDark={isDark} />
</motion.div>
```

##### 3. **나의 요약 섹션**
6개의 인사이트 카드로 구성된 대시보드:

- **🔥 최근 활동 요약**: 요일별 운동 빈도 차트
- **❤️ 많이 수행한 운동 TOP 3**: 가장 많이 한 운동 순위
- **📈 많이 성장한 운동 TOP 3**: 성장률 기준 순위 (307.8% 증가 등)
- **🔍 부위별 운동 분석**: 도넛 차트로 운동 부위 분포 시각화
- **💪 이번달 요약**: 개인화된 타이틀 및 성취 요약
- **⚖️ 체중 변화**: Chart.js 라인 차트로 추이 표시

##### 4. **개선된 기록 표시 (DailyRecordCard)**
날짜 클릭 시 해당 날짜의 모든 기록을 카드 형식으로 표시:

- **운동 기록**: 파란색 그라데이션, 시간 표시, 보상 획득 여부
- **식단 기록**: 초록색 그라데이션, 식사 시간별 배지 (아침/점심/저녁/간식)
- **건강 기록**: 빨간색 그라데이션, 체중/근육량/체지방/BMI 표시
- 각 카드에 호버 효과 및 애니메이션 적용
- 빈 상태 UI 개선 (이모지 + 안내 메시지)

```javascript
// 식사 시간별 배지 색상
const mealColors = {
  '아침': 'bg-yellow-500/20 text-yellow-400',
  '점심': 'bg-orange-500/20 text-orange-400',
  '저녁': 'bg-purple-500/20 text-purple-400',
  '간식': 'bg-pink-500/20 text-pink-400'
};
```

##### 5. **캘린더 개선**
- **현재 날짜 강조**: 오렌지-레드 그라데이션 + 노란색 링
- **출석 기록**: 파란색-보라색 그라데이션 + 초록 점
- **선택된 날짜**: 파란색 링으로 강조
- 날짜 클릭 시 해당 날짜의 모든 기록 표시

##### 6. **뱃지 시스템**
- 8개 뱃지 종류: 헬스 입문자, 식단 관리자, 출석왕, 근육 빌더 등
- 획득한 뱃지: 컬러풀 + 획득 날짜 표시
- 미획득 뱃지: 흑백 + 잠금 아이콘
- 뱃지 모달에서 전체 컬렉션 확인

##### 7. **기록 추가 기능**
캘린더 아래 3개 버튼으로 빠른 기록 추가:

- **💪 운동 기록**: 카테고리별 필터링 (가슴/등/하체/어깨/팔/복근/유산소)
- **🍽️ 식단 기록**: 카테고리별 필터링 (단백질/탄수화물/채소/과일/유제품/보충제/한식)
- **❤️ 건강 기록**: 키/체중/근육량/체지방 입력, BMI 자동 계산

---

### 🗄️ **데이터베이스 개선**

#### 스키마 업데이트 (HS_Health.sql)
```sql
-- 포인트 캐싱 추가
ALTER TABLE Member ADD COLUMN total_points INT DEFAULT 0;

-- 보상 연결 추가
ALTER TABLE ExerciseLog ADD COLUMN achievement_id INT;
ALTER TABLE DietLog ADD COLUMN achievement_id INT;
ALTER TABLE Attendance ADD COLUMN achievement_id INT;
ALTER TABLE Goal ADD COLUMN achievement_id INT;

-- 트리거 추가: 자동 포인트 증감
CREATE TRIGGER TRG_Achievement_Point_Earn
AFTER INSERT ON AchievementLog
FOR EACH ROW
BEGIN
    UPDATE Member SET total_points = total_points + NEW.points_earned
    WHERE member_id = NEW.member_id;
END;
```

#### 더미 데이터 대폭 확장 (insert_dummy_data.sql)
- **운동 리스트**: 40개 (카테고리별 분류)
  - 가슴 6개, 등 6개, 하체 6개, 어깨 5개, 팔 5개, 복근 5개, 유산소 7개
- **음식 리스트**: 45개 (카테고리별 분류)
  - 단백질 8개, 탄수화물 7개, 채소 7개, 과일 6개, 유제품 4개, 보충제 4개, 한식 6개, 간식 3개
- **운동 로그**: 40개 (최근 30일)
- **식단 로그**: 50개 (최근 30일)
- **건강 기록**: 7개 (주간 측정)
- **출석 기록**: 7개
- **뱃지**: 8개
- **회원 뱃지**: 4개 획득

---

### 🎨 **컴포넌트 구조 개선**

#### 새로운 컴포넌트
```
src/components/
├── WeightChart.jsx          # Chart.js 체중 변화 차트
├── DailyRecordCard.jsx      # 일일 기록 카드 (운동/식단/건강)
└── Navbar.jsx               # 기존 네비게이션
```

#### 컴포넌트 분리 이점
- **재사용성**: WeightChart는 다른 페이지에서도 사용 가능
- **유지보수성**: 각 컴포넌트가 독립적으로 관리됨
- **성능**: 필요한 컴포넌트만 렌더링
- **테스트**: 개별 컴포넌트 단위 테스트 용이

---

### 📦 **새로운 의존성**

```json
{
  "dependencies": {
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0"
  }
}
```

#### Chart.js 설정
```javascript
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
```

---

### 🎯 **UI/UX 개선사항**

#### 1. **애니메이션**
- Framer Motion으로 모든 카드에 부드러운 등장 애니메이션
- 호버 시 scale, rotate 효과
- 사이드 패널 슬라이드 애니메이션 (Spring)
- 모달 fade in/out 효과

#### 2. **색상 시스템**
```javascript
// 카테고리별 색상 구분
const categoryColors = {
  exercise: 'from-blue-500 to-purple-600',    // 운동: 파랑-보라
  diet: 'from-green-500 to-emerald-600',      // 식단: 초록
  health: 'from-red-500 to-pink-600',         // 건강: 빨강-핑크
  badge: 'from-yellow-500 to-orange-600',     // 뱃지: 노랑-주황
  point: 'from-blue-600 to-pink-600'          // 포인트: 파랑-핑크
};
```

#### 3. **반응형 디자인**
- 모바일: 1열 그리드
- 태블릿: 2열 그리드
- 데스크톱: 3열 그리드
- 사이드 패널: 모바일 전체 화면, 데스크톱 600-700px

#### 4. **다크모드 최적화**
- 모든 카드에 backdrop-blur 효과
- 그라데이션 배경으로 깊이감 표현
- 텍스트 가독성 최적화
- 차트 색상 다크모드 대응

---

### 📊 **데이터 시각화**

#### 1. **체중 변화 차트**
- Line Chart with gradient fill
- 8개 데이터 포인트 (최근 기록)
- 시작점과 현재점 라벨 표시
- 툴팁으로 정확한 값 확인

#### 2. **요일별 활동 차트**
- 바 차트 형식
- 화요일, 목요일 강조 (가장 많이 운동)
- 높이로 빈도 표현

#### 3. **부위별 운동 분석**
- 도넛 차트 (SVG)
- 등 24%, 하체 20%, 팔 14%, 복근 12%, 기타 31%
- 범례와 함께 표시

---

### 🔧 **데이터베이스 가이드**

#### 설정 방법
```bash
# 1. MySQL 접속
mysql -u root -p

# 2. 데이터베이스 생성
CREATE DATABASE hs_health CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hs_health;

# 3. 스키마 적용
source my-app/server/sql/HS_Health.sql;

# 4. 더미 데이터 삽입
source my-app/server/sql/insert_dummy_data.sql;
```

#### 주요 테이블
- **Member**: 회원 정보 + 포인트 캐싱
- **ExerciseList**: 운동 목록 (40개, 카테고리별)
- **FoodList**: 음식 목록 (45개, 카테고리별)
- **ExerciseLog**: 운동 기록 + achievement_id
- **DietLog**: 식단 기록 + achievement_id
- **HealthRecord**: 건강 기록 (체중/근육량/체지방/BMI)
- **Attendance**: 출석 기록 + achievement_id
- **AchievementLog**: 성취 로그 (포인트 획득)
- **Badge**: 뱃지 목록
- **MemberBadge**: 회원 뱃지 획득 기록

---

### 🚀 **성능 최적화**

#### 1. **컴포넌트 분리**
- 큰 MyPage.jsx를 작은 컴포넌트로 분리
- 필요한 부분만 리렌더링

#### 2. **메모이제이션**
```javascript
// 필터링된 목록 캐싱
const filteredExercises = useMemo(() => 
  exerciseCategory === '전체' 
    ? exerciseList.filter(e => e.status === 'APPROVED')
    : exerciseList.filter(e => e.status === 'APPROVED' && e.category === exerciseCategory),
  [exerciseCategory, exerciseList]
);
```

#### 3. **지연 로딩**
- 모달은 열릴 때만 렌더링 (AnimatePresence)
- 차트는 데이터가 있을 때만 렌더링

---

### 📱 **모바일 최적화**

- 터치 제스처 지원 (Framer Motion)
- 큰 터치 영역 (최소 44x44px)
- 스와이프로 사이드 패널 닫기
- 반응형 폰트 크기
- 모바일 네비게이션 최적화

---

## 🔄 **브랜치 정보**

- **main**: 프로덕션 브랜치
- **gyu**: Class 페이지, 다크모드, 백엔드 서버 개발
- **hong**: gyu 브랜치 변경사항 머지 완료
- **hongrecent**: 마이페이지 대폭 개선, Chart.js 적용, 데이터베이스 확장 ⭐ NEW

---

## 📝 **커밋 히스토리**

### hongrecent 브랜치 (2025-01-23)
```
feat: 마이페이지 개선 및 Chart.js 적용

- Chart.js를 사용한 체중 변화 차트 추가
- 목표 관리를 사이드 패널로 변경 (접었다 펼칠 수 있음)
- DailyRecordCard 컴포넌트로 기록 표시 개선
- 운동/식단/건강 기록 UI 개선 (카테고리별 색상, 애니메이션)
- 데이터베이스 더미 데이터 추가 (insert_dummy_data.sql)
- 운동 리스트 40개, 음식 리스트 45개로 확장
- 카테고리별 필터링 기능 추가
- 나의 요약 섹션 추가 (활동 요약, TOP 3, 부위별 분석 등)
- 현재 날짜 강조 기능 추가
- 뱃지 시스템 구현
- WeightChart 컴포넌트 분리
```

---

## 🎓 **학습 포인트**

### 1. **Chart.js 통합**
- React에서 Chart.js 사용법
- 반응형 차트 구현
- 다크모드 대응 차트 스타일링

### 2. **컴포넌트 설계**
- 재사용 가능한 컴포넌트 분리
- Props를 통한 데이터 전달
- 컴포넌트 간 통신

### 3. **애니메이션**
- Framer Motion 고급 기법
- Spring 애니메이션
- 사이드 패널 구현

### 4. **데이터베이스 설계**
- 정규화와 비정규화 (포인트 캐싱)
- 트리거를 통한 자동화
- 외래키 관계 설정

### 5. **UI/UX 패턴**
- 카드 기반 레이아웃
- 모달과 사이드 패널
- 반응형 그리드 시스템
- 색상 시스템 설계

---

## 🐛 **알려진 이슈**

1. **백엔드 서버 미구현**: 현재는 더미 데이터만 사용
2. **실시간 업데이트**: WebSocket 미구현
3. **이미지 업로드**: 프로필 이미지 업로드 기능 없음
4. **검색 기능**: 운동/음식 검색 기능 미구현

---

## 🔮 **향후 계획**

- [ ] 백엔드 API 서버 구현 (Express.js)
- [ ] 실시간 알림 시스템 (WebSocket)
- [ ] 이미지 업로드 기능
- [ ] 운동/음식 검색 및 필터링 고도화
- [ ] 소셜 기능 (친구, 랭킹)
- [ ] PWA 지원
- [ ] 모바일 앱 (React Native)

---

## 👥 **기여자**

- **gyu**: Class 페이지, 백엔드 서버
- **hong**: 마이페이지 개선, Chart.js 통합, 데이터베이스 확장

---

## 📄 **라이선스**

이 프로젝트는 교육 목적으로 제작되었습니다.
