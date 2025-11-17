const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// 데베 연결 설정
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234', //MySQL비밀번호로~
  database: 'hs_health',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// 더미 데이터 자동 삽입 함수
async function initializeDummyData() {
  try {
    // Member 테이블에 데이터가 있는지 확인
    const [members] = await pool.query('SELECT COUNT(*) as count FROM Member');

    if (members[0].count === 0) {
      console.log('📝 더미 회원 데이터 삽입 중...');
      await pool.query(`
        INSERT INTO Member (student_no, name, contact, department, grade, status, role_type, mypoints) VALUES
        ('20210001', '김철수', '010-1111-2222', '체육학과', 4, '재학', 'GENERAL', 500),
        ('20210002', '이영희', '010-2222-3333', '무용학과', 3, '재학', 'GENERAL', 300),
        ('20210003', '박민수', '010-3333-4444', '스포츠의학과', 4, '재학', 'GENERAL', 700),
        ('20220001', '홍길동', '010-4444-5555', '컴퓨터공학과', 2, '재학', 'GENERAL', 200)
      `);
      console.log('✅ 더미 회원 데이터 삽입 완료');
    }

    // Class 테이블에 데이터가 있는지 확인
    const [classes] = await pool.query('SELECT COUNT(*) as count FROM Class');

    if (classes[0].count === 0) {
      console.log('📚 더미 수업 데이터 삽입 중...');
      await pool.query(`
        INSERT INTO Class (class_name, instructor_id, capacity, is_exclusive) VALUES
        ('초급 웨이트 트레이닝', 1, 20, true),
        ('고급 크로스핏', 2, 15, true),
        ('요가 & 스트레칭', 3, 25, false),
        ('근력 강화 프로그램', 1, 18, true),
        ('다이어트 운동', 2, 20, false),
        ('체형 교정 필라테스', 3, 12, true)
      `);
      console.log('✅ 더미 수업 데이터 삽입 완료');

      console.log('📅 더미 시간표 데이터 삽입 중...');
      await pool.query(`
        INSERT INTO ClassSchedule (class_id, day_of_week, start_time, end_time) VALUES
        (1, '월', '09:00:00', '10:30:00'),
        (1, '수', '09:00:00', '10:30:00'),
        (1, '금', '09:00:00', '10:30:00'),
        (2, '화', '14:00:00', '15:30:00'),
        (2, '목', '14:00:00', '15:30:00'),
        (3, '월', '18:00:00', '19:00:00'),
        (3, '수', '18:00:00', '19:00:00'),
        (4, '화', '10:00:00', '11:30:00'),
        (4, '목', '10:00:00', '11:30:00'),
        (4, '토', '10:00:00', '11:30:00'),
        (5, '월', '16:00:00', '17:00:00'),
        (5, '수', '16:00:00', '17:00:00'),
        (5, '금', '16:00:00', '17:00:00'),
        (6, '화', '19:00:00', '20:00:00'),
        (6, '목', '19:00:00', '20:00:00')
      `);
      console.log('✅ 더미 시간표 데이터 삽입 완료');

      console.log('🎓 샘플 수강신청 데이터 삽입 중...');
      await pool.query(`
        INSERT INTO ClassRegistration (member_id, class_id, registered_at) VALUES
        (1, 1, NOW()),
        (1, 3, NOW()),
        (4, 2, NOW()),
        (4, 5, NOW())
      `);
      console.log('✅ 샘플 수강신청 데이터 삽입 완료');
    }

    console.log('🎉 데이터베이스 초기화 완료!');
  } catch (error) {
    console.error('⚠️ 더미 데이터 삽입 실패:', error.message);
  }
}

// 서버 시작 시 더미 데이터 확인 및 삽입
initializeDummyData();


//회원 정보 API
app.get('/api/members/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query(
      'SELECT member_id, name, student_no, department, grade, mypoints FROM Member WHERE member_id = ?',
      [memberId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: '회원을 찾을 수 없습니다' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('회원 정보 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 운동 기록 API
app.get('/api/exercise-logs/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        el.log_id,
        el.performed_at,
        e.name as exercise_name,
        el.sets,
        el.reps,
        el.weight_kg,
        el.duration_minutes
      FROM ExerciseLog el
      JOIN ExerciseList e ON el.exercise_id = e.exercise_id
      WHERE el.member_id = ?
      ORDER BY el.performed_at DESC
    `, [memberId]);
    
    res.json(rows);
  } catch (error) {
    console.error('운동 기록 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 식단 기록 API
app.get('/api/diet-logs/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        dl.log_id,
        dl.ate_at,
        dl.meal_type,
        f.name as food_name,
        dl.calories,
        dl.amount
      FROM DietLog dl
      JOIN FoodList f ON dl.food_id = f.food_id
      WHERE dl.member_id = ?
      ORDER BY dl.ate_at DESC
    `, [memberId]);
    
    res.json(rows);
  } catch (error) {
    console.error('식단 기록 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 건강 기록 API
app.get('/api/health-records/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        record_id,
        measured_at,
        weight_kg,
        muscle_mass_kg,
        body_fat_percent,
        bmi
      FROM HealthRecord
      WHERE member_id = ?
      ORDER BY measured_at DESC
    `, [memberId]);
    
    res.json(rows);
  } catch (error) {
    console.error('건강 기록 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 출석 기록 API
app.get('/api/attendances/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        attendance_id,
        attended_at
      FROM Attendance
      WHERE member_id = ?
      ORDER BY attended_at DESC
    `, [memberId]);
    
    res.json(rows);
  } catch (error) {
    console.error('출석 기록 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 포인트 내역 API
app.get('/api/point-ledger/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        ledger_id,
        point_change,
        reason_type,
        created_at,
        CASE 
          WHEN reason_type = 'ACHIEVEMENT' THEN '업적 달성'
          WHEN reason_type = 'REWARD_USED' THEN '리워드 사용'
          WHEN reason_type = 'ADMIN' THEN '관리자 지급'
          WHEN reason_type = 'EXPIRED' THEN '포인트 만료'
          ELSE reason_type
        END as description
      FROM PointLedger
      WHERE member_id = ?
      ORDER BY created_at DESC
    `, [memberId]);
    
    res.json(rows);
  } catch (error) {
    console.error('포인트 내역 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 목표 관리 API

// 목표 목록 조회
app.get('/api/goals/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        goal_id,
        member_id,
        item_name,
        target_date,
        is_achieved
      FROM Goal
      WHERE member_id = ?
      ORDER BY target_date ASC
    `, [memberId]);
    
    res.json(rows);
  } catch (error) {
    console.error('목표 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 목표 추가
app.post('/api/goals', async (req, res) => {
  try {
    const { member_id, item_name, target_date, is_achieved } = req.body;
    
    const [result] = await pool.query(`
      INSERT INTO Goal (member_id, item_name, target_date, is_achieved)
      VALUES (?, ?, ?, ?)
    `, [member_id, item_name, target_date, is_achieved || false]);
    
    const [newGoal] = await pool.query(
      'SELECT * FROM Goal WHERE goal_id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newGoal[0]);
  } catch (error) {
    console.error('목표 추가 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 목표 수정
app.patch('/api/goals/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    const { is_achieved } = req.body;
    
    await pool.query(
      'UPDATE Goal SET is_achieved = ? WHERE goal_id = ?',
      [is_achieved, goalId]
    );
    
    const [updated] = await pool.query(
      'SELECT * FROM Goal WHERE goal_id = ?',
      [goalId]
    );
    
    res.json(updated[0]);
  } catch (error) {
    console.error('목표 수정 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 목표 삭제
app.delete('/api/goals/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    
    await pool.query('DELETE FROM Goal WHERE goal_id = ?', [goalId]);
    
    res.json({ message: '목표가 삭제되었습니다' });
  } catch (error) {
    console.error('목표 삭제 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 수업 관리 API

// 전체 수업 목록 조회
app.get('/api/classes', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        c.class_id,
        c.class_name,
        c.capacity,
        c.is_exclusive,
        m.name as instructor_name
      FROM Class c
      LEFT JOIN Member m ON c.instructor_id = m.member_id
      ORDER BY c.class_name
    `);

    res.json(rows);
  } catch (error) {
    console.error('수업 목록 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 수업 스케줄 조회
app.get('/api/class-schedules/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    const [rows] = await pool.query(`
      SELECT
        schedule_id,
        class_id,
        day_of_week,
        start_time,
        end_time
      FROM ClassSchedule
      WHERE class_id = ?
      ORDER BY FIELD(day_of_week, '월', '화', '수', '목', '금', '토', '일')
    `, [classId]);

    res.json(rows);
  } catch (error) {
    console.error('수업 스케줄 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 내 수강 신청 목록 조회
app.get('/api/my-registrations/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query(`
      SELECT
        cr.registration_id,
        cr.member_id,
        cr.class_id,
        cr.registered_at,
        c.class_name
      FROM ClassRegistration cr
      JOIN Class c ON cr.class_id = c.class_id
      WHERE cr.member_id = ?
      ORDER BY cr.registered_at DESC
    `, [memberId]);

    res.json(rows);
  } catch (error) {
    console.error('수강 신청 목록 조회 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 수강 신청
app.post('/api/class-registrations', async (req, res) => {
  try {
    const { member_id, class_id } = req.body;

    // 이미 신청했는지 확인
    const [existing] = await pool.query(
      'SELECT * FROM ClassRegistration WHERE member_id = ? AND class_id = ?',
      [member_id, class_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: '이미 신청한 수업입니다' });
    }

    const [result] = await pool.query(`
      INSERT INTO ClassRegistration (member_id, class_id)
      VALUES (?, ?)
    `, [member_id, class_id]);

    const [newRegistration] = await pool.query(
      'SELECT * FROM ClassRegistration WHERE registration_id = ?',
      [result.insertId]
    );

    res.status(201).json(newRegistration[0]);
  } catch (error) {
    console.error('수강 신청 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 수강 신청 취소
app.delete('/api/class-registrations/:registrationId', async (req, res) => {
  try {
    const { registrationId } = req.params;

    await pool.query('DELETE FROM ClassRegistration WHERE registration_id = ?', [registrationId]);

    res.json({ message: '수강 신청이 취소되었습니다' });
  } catch (error) {
    console.error('수강 취소 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// [관리자] 수업 등록
app.post('/api/admin/classes', async (req, res) => {
  try {
    const { class_name, instructor_id, capacity, is_exclusive } = req.body;

    // 유효성 검사
    if (!class_name || !capacity) {
      return res.status(400).json({ error: '수업명과 정원은 필수입니다' });
    }

    if (capacity <= 0) {
      return res.status(400).json({ error: '정원은 0보다 커야 합니다' });
    }

    const [result] = await pool.query(`
      INSERT INTO Class (class_name, instructor_id, capacity, is_exclusive)
      VALUES (?, ?, ?, ?)
    `, [class_name, instructor_id || null, capacity, is_exclusive || false]);

    const [newClass] = await pool.query(
      'SELECT * FROM Class WHERE class_id = ?',
      [result.insertId]
    );

    res.status(201).json(newClass[0]);
  } catch (error) {
    console.error('수업 등록 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// [관리자] 수업 수정
app.patch('/api/admin/classes/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    const { class_name, instructor_id, capacity, is_exclusive } = req.body;

    // 유효성 검사
    if (capacity && capacity <= 0) {
      return res.status(400).json({ error: '정원은 0보다 커야 합니다' });
    }

    const updates = [];
    const values = [];

    if (class_name !== undefined) {
      updates.push('class_name = ?');
      values.push(class_name);
    }
    if (instructor_id !== undefined) {
      updates.push('instructor_id = ?');
      values.push(instructor_id);
    }
    if (capacity !== undefined) {
      updates.push('capacity = ?');
      values.push(capacity);
    }
    if (is_exclusive !== undefined) {
      updates.push('is_exclusive = ?');
      values.push(is_exclusive);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: '수정할 내용이 없습니다' });
    }

    values.push(classId);

    await pool.query(
      `UPDATE Class SET ${updates.join(', ')} WHERE class_id = ?`,
      values
    );

    const [updated] = await pool.query(
      'SELECT * FROM Class WHERE class_id = ?',
      [classId]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('수업 수정 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// [관리자] 수업 폐강 (삭제)
app.delete('/api/admin/classes/:classId', async (req, res) => {
  try {
    const { classId } = req.params;

    // 먼저 수강신청 데이터 삭제
    await pool.query('DELETE FROM ClassRegistration WHERE class_id = ?', [classId]);

    // 수업 스케줄 삭제
    await pool.query('DELETE FROM ClassSchedule WHERE class_id = ?', [classId]);

    // 수업 삭제
    await pool.query('DELETE FROM Class WHERE class_id = ?', [classId]);

    res.json({ message: '수업이 폐강되었습니다' });
  } catch (error) {
    console.error('수업 폐강 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// [관리자] 수업 시간표 등록
app.post('/api/admin/class-schedules', async (req, res) => {
  try {
    const { class_id, day_of_week, start_time, end_time } = req.body;

    // 유효성 검사
    if (!class_id || !day_of_week || !start_time || !end_time) {
      return res.status(400).json({ error: '모든 필드는 필수입니다' });
    }

    const validDays = ['월', '화', '수', '목', '금', '토', '일'];
    if (!validDays.includes(day_of_week)) {
      return res.status(400).json({ error: '유효하지 않은 요일입니다' });
    }

    // 시간 중복 체크
    const [overlapping] = await pool.query(`
      SELECT * FROM ClassSchedule
      WHERE class_id = ?
        AND day_of_week = ?
        AND (
          (start_time <= ? AND end_time > ?) OR
          (start_time < ? AND end_time >= ?) OR
          (start_time >= ? AND end_time <= ?)
        )
    `, [class_id, day_of_week, start_time, start_time, end_time, end_time, start_time, end_time]);

    if (overlapping.length > 0) {
      return res.status(400).json({ error: '동일한 수업의 겹치는 시간표가 존재합니다' });
    }

    const [result] = await pool.query(`
      INSERT INTO ClassSchedule (class_id, day_of_week, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `, [class_id, day_of_week, start_time, end_time]);

    const [newSchedule] = await pool.query(
      'SELECT * FROM ClassSchedule WHERE schedule_id = ?',
      [result.insertId]
    );

    res.status(201).json(newSchedule[0]);
  } catch (error) {
    console.error('시간표 등록 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// [관리자] 수업 시간표 수정
app.patch('/api/admin/class-schedules/:scheduleId', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { day_of_week, start_time, end_time } = req.body;

    const updates = [];
    const values = [];

    if (day_of_week !== undefined) {
      const validDays = ['월', '화', '수', '목', '금', '토', '일'];
      if (!validDays.includes(day_of_week)) {
        return res.status(400).json({ error: '유효하지 않은 요일입니다' });
      }
      updates.push('day_of_week = ?');
      values.push(day_of_week);
    }
    if (start_time !== undefined) {
      updates.push('start_time = ?');
      values.push(start_time);
    }
    if (end_time !== undefined) {
      updates.push('end_time = ?');
      values.push(end_time);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: '수정할 내용이 없습니다' });
    }

    values.push(scheduleId);

    await pool.query(
      `UPDATE ClassSchedule SET ${updates.join(', ')} WHERE schedule_id = ?`,
      values
    );

    const [updated] = await pool.query(
      'SELECT * FROM ClassSchedule WHERE schedule_id = ?',
      [scheduleId]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error('시간표 수정 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// [관리자] 수업 시간표 삭제
app.delete('/api/admin/class-schedules/:scheduleId', async (req, res) => {
  try {
    const { scheduleId } = req.params;

    await pool.query('DELETE FROM ClassSchedule WHERE schedule_id = ?', [scheduleId]);

    res.json({ message: '시간표가 삭제되었습니다' });
  } catch (error) {
    console.error('시간표 삭제 실패:', error);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});