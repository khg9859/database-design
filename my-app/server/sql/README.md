# 데이터베이스 설정 가이드

## 1. 데이터베이스 생성

먼저 MySQL에 접속하여 데이터베이스를 생성합니다:

```sql
CREATE DATABASE hs_health CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hs_health;
```

## 2. 테이블 생성

`HS_Health.sql` 파일을 실행하여 모든 테이블을 생성합니다:

```bash
mysql -u root -p hs_health < HS_Health.sql
```

또는 MySQL에서 직접:

```sql
SOURCE /path/to/HS_Health.sql;
```

## 3. 더미 데이터 삽입

수업 관련 더미 데이터를 삽입합니다:

```bash
mysql -u root -p hs_health < insert_class_data.sql
```

또는 MySQL에서 직접:

```sql
SOURCE /path/to/insert_class_data.sql;
```

## 삽입된 더미 데이터 내용

### 회원 (Member)
- 김철수 (체육학과 4학년) - 강사
- 이영희 (무용학과 3학년) - 강사
- 박민수 (스포츠의학과 4학년) - 강사
- 홍길동 (컴퓨터공학과 2학년) - 학생

### 수업 (Class)
1. **초급 웨이트 트레이닝** - 김철수 강사, 정원 20명, 전용시간
   - 월/수/금 09:00-10:30

2. **고급 크로스핏** - 이영희 강사, 정원 15명, 전용시간
   - 화/목 14:00-15:30

3. **요가 & 스트레칭** - 박민수 강사, 정원 25명
   - 월/수 18:00-19:00

4. **근력 강화 프로그램** - 김철수 강사, 정원 18명, 전용시간
   - 화/목/토 10:00-11:30

5. **다이어트 운동** - 이영희 강사, 정원 20명
   - 월/수/금 16:00-17:00

6. **체형 교정 필라테스** - 박민수 강사, 정원 12명, 전용시간
   - 화/목 19:00-20:00

### 수강 신청 (ClassRegistration)
- 김철수: 초급 웨이트 트레이닝, 요가 & 스트레칭
- 홍길동: 고급 크로스핏, 다이어트 운동

## 관리자 API 엔드포인트

### 수업 관리
- `POST /api/admin/classes` - 수업 등록
- `PATCH /api/admin/classes/:classId` - 수업 수정
- `DELETE /api/admin/classes/:classId` - 수업 폐강

### 시간표 관리
- `POST /api/admin/class-schedules` - 시간표 등록
- `PATCH /api/admin/class-schedules/:scheduleId` - 시간표 수정
- `DELETE /api/admin/class-schedules/:scheduleId` - 시간표 삭제

## 비즈니스 규칙

### 수업 등록 규칙
✅ 수업명, 정원 필수
✅ 정원은 0보다 큰 자연수
✅ 담당자는 Member 테이블 참조 (선택)
✅ 전용 시간 여부 설정 가능

### 시간표 등록 규칙
✅ 수업ID, 요일, 시작시간, 종료시간 필수
✅ 요일: 월~일 중 하나
✅ 시간 형식: HH:MM:SS
✅ 동일 수업의 겹치는 시간표 불가

### 전용 시간 (is_exclusive)
- `true`: 해당 시간에는 수업만 진행, 일반 이용 제한
- `false`: 수업 진행 중에도 일반 이용 가능
