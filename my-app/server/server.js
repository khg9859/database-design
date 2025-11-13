const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 데베 연결 설정
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'health2025', //MySQL비밀번호로~
  database: 'hs_health',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);


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

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});