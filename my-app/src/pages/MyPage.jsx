import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Goal from "./Goal";

// 더미 데이터
const DUMMY_USER = {
  member_id: 1,
  name: "김철수",
  student_no: "20210001",
  department: "체육학과",
  grade: 4,
  mypoints: 500
};

const DUMMY_EXERCISE_LOGS = [
  {
    log_id: 1,
    performed_at: "2025-01-15T10:00:00",
    exercise_name: "벤치프레스",
    sets: 3,
    reps: 10,
    weight_kg: 80,
    duration_minutes: 30
  },
  {
    log_id: 2,
    performed_at: "2025-01-15T10:30:00",
    exercise_name: "스쿼트",
    sets: 4,
    reps: 12,
    weight_kg: 100,
    duration_minutes: 25
  },
  {
    log_id: 3,
    performed_at: "2025-01-13T14:00:00",
    exercise_name: "데드리프트",
    sets: 3,
    reps: 8,
    weight_kg: 120,
    duration_minutes: 20
  }
];

const DUMMY_DIET_LOGS = [
  {
    log_id: 1,
    ate_at: "2025-01-15T08:00:00",
    meal_type: "아침",
    food_name: "닭가슴살 샐러드",
    calories: 350,
    amount: 1
  },
  {
    log_id: 2,
    ate_at: "2025-01-15T12:00:00",
    meal_type: "점심",
    food_name: "현미밥 + 제육볶음",
    calories: 600,
    amount: 1
  },
  {
    log_id: 3,
    ate_at: "2025-01-13T19:00:00",
    meal_type: "저녁",
    food_name: "연어 구이",
    calories: 450,
    amount: 1
  }
];

const DUMMY_HEALTH_RECORDS = [
  {
    record_id: 1,
    measured_at: "2025-01-15",
    weight_kg: 75,
    muscle_mass_kg: 32,
    body_fat_percent: 15,
    bmi: 22.5
  },
  {
    record_id: 2,
    measured_at: "2025-01-08",
    weight_kg: 76,
    muscle_mass_kg: 31.5,
    body_fat_percent: 16,
    bmi: 22.8
  }
];

const DUMMY_ATTENDANCES = [
  { attendance_id: 1, attended_at: "2025-01-13T09:00:00" },
  { attendance_id: 2, attended_at: "2025-01-14T10:00:00" },
  { attendance_id: 3, attended_at: "2025-01-15T09:30:00" },
  { attendance_id: 4, attended_at: "2025-01-16T14:00:00" },
  { attendance_id: 5, attended_at: "2025-01-17T11:00:00" }
];

const DUMMY_POINT_HISTORY = [
  {
    ledger_id: 1,
    point_change: 100,
    reason_type: "ACHIEVEMENT",
    created_at: "2025-01-15T12:00:00",
    description: "5일 연속 출석 달성"
  },
  {
    ledger_id: 2,
    point_change: 50,
    reason_type: "ACHIEVEMENT",
    created_at: "2025-01-14T12:00:00",
    description: "목표 달성 보너스"
  },
  {
    ledger_id: 3,
    point_change: -200,
    reason_type: "REWARD_USED",
    created_at: "2025-01-10T15:00:00",
    description: "리워드 교환"
  }
];

export default function MyPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [dietLogs, setDietLogs] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [pointHistory, setPointHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('myPageTheme');
    return saved ? saved === 'dark' : true;
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPointModal, setShowPointModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('myPageTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // 더미 데이터 로드
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // 더미 데이터를 비동기처럼 로드 (실제 API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentUser(DUMMY_USER);
      setExerciseLogs(DUMMY_EXERCISE_LOGS);
      setDietLogs(DUMMY_DIET_LOGS);
      setHealthRecords(DUMMY_HEALTH_RECORDS);
      setAttendances(DUMMY_ATTENDANCES);
      setPointHistory(DUMMY_POINT_HISTORY);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 캘린더 생성
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  // 출석 체크
  const isAttendance = (day) => {
    if (!day || !Array.isArray(attendances)) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return attendances.some((a) => {
      const attendDate = new Date(a.attended_at).toISOString().split("T")[0];
      return attendDate === dateStr;
    });
  };

  // 날짜 클릭
  const handleDateClick = (day) => {
    if (!day) return;
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
  };

  // 선택된 날짜의 기록 필터링
  const getRecordsForDate = (date) => {
    return {
      exercises: exerciseLogs.filter((log) => {
        const logDate = new Date(log.performed_at).toISOString().split("T")[0];
        return logDate === date;
      }),
      diets: dietLogs.filter((log) => {
        const logDate = new Date(log.ate_at).toISOString().split("T")[0];
        return logDate === date;
      }),
      health: healthRecords.filter((log) => log.measured_at === date),
    };
  };

  const selectedRecords = selectedDate ? getRecordsForDate(selectedDate) : null;
  const days = getDaysInMonth(currentDate);
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 날짜 포맷팅
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className={`inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'} mb-4`}></div>
          <div className="text-xl font-semibold">로딩 중...</div>
        </motion.div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl">회원 정보를 불러올 수 없습니다</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'} p-6 transition-colors duration-300`}>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              마이페이지
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>{currentUser.name}님의 활동 기록</p>
          </div>
          <div className="flex items-center gap-4">
            {/* 다크모드 토글 */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-xl font-semibold transition ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-100 shadow-lg'
              }`}
              title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            >
              {isDark ? (
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </motion.button>

            <div className="text-right">
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>총 출석일</div>
              <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {Array.isArray(attendances) ? attendances.length : 0}일
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 캘린더 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className={`rounded-2xl p-6 border shadow-2xl ${
            isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                  )
                }
                className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition text-lg font-semibold shadow-lg"
              >
                ←
              </motion.button>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                  )
                }
                className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl transition text-lg font-semibold shadow-lg"
              >
                →
              </motion.button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day, index) => (
                <div
                  key={day}
                  className={`text-center font-bold py-2 ${
                    index === 0 ? "text-red-400" : index === 6 ? "text-blue-400" : "text-gray-400"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 그리드 */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  disabled={!day}
                  whileHover={day ? { scale: 1.08, y: -2 } : {}}
                  whileTap={day ? { scale: 0.95 } : {}}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center text-lg font-bold
                    transition-all relative overflow-hidden
                    ${!day ? "invisible" : ""}
                    ${
                      isAttendance(day)
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                        : "bg-gray-800/80 hover:bg-gray-700/80 text-white"
                    }
                    ${
                      selectedDate ===
                      `${currentDate.getFullYear()}-${String(
                        currentDate.getMonth() + 1
                      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                        ? "ring-4 ring-blue-400 ring-offset-2 ring-offset-gray-900"
                        : ""
                    }
                  `}
                >
                  {day}
                  {isAttendance(day) && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* 선택된 날짜의 기록 */}
          <AnimatePresence>
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">{selectedDate} 기록</h3>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    ✕
                  </button>
                </div>

                {/* 운동 기록 */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <span className="text-2xl">💪</span> 운동 기록
                  </h4>
                  {selectedRecords.exercises.length > 0 ? (
                    <div className="space-y-3">
                      {selectedRecords.exercises.map((log) => (
                        <motion.div
                          key={log.log_id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-xl border border-blue-700/30"
                        >
                          <div className="font-bold text-lg">{log.exercise_name}</div>
                          <div className="text-sm text-gray-300 mt-1">
                            {log.sets}세트 × {log.reps}회
                            {log.weight_kg > 0 && ` • ${log.weight_kg}kg`}
                            {log.duration_minutes > 0 && ` • ${log.duration_minutes}분`}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm bg-gray-800/30 p-3 rounded-lg">기록 없음</p>
                  )}
                </div>

                {/* 식단 기록 */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🍽️</span> 식단 기록
                  </h4>
                  {selectedRecords.diets.length > 0 ? (
                    <div className="space-y-3">
                      {selectedRecords.diets.map((log) => (
                        <motion.div
                          key={log.log_id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-4 rounded-xl border border-green-700/30"
                        >
                          <div className="font-bold text-lg">
                            {log.meal_type} - {log.food_name}
                          </div>
                          <div className="text-sm text-gray-300 mt-1">
                            {log.calories}kcal
                            {log.amount > 1 && ` • ${log.amount}인분`}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm bg-gray-800/30 p-3 rounded-lg">기록 없음</p>
                  )}
                </div>

                {/* 건강 기록 */}
                <div>
                  <h4 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                    <span className="text-2xl">❤️</span> 건강 기록
                  </h4>
                  {selectedRecords.health.length > 0 ? (
                    <div className="space-y-3">
                      {selectedRecords.health.map((log) => (
                        <motion.div
                          key={log.record_id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-gradient-to-r from-red-900/30 to-pink-900/30 p-4 rounded-xl border border-red-700/30"
                        >
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">체중:</span>
                              <span className="font-bold">{log.weight_kg}kg</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">근육량:</span>
                              <span className="font-bold">{log.muscle_mass_kg}kg</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">체지방률:</span>
                              <span className="font-bold">{log.body_fat_percent}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">BMI:</span>
                              <span className="font-bold">{log.bmi}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm bg-gray-800/30 p-3 rounded-lg">기록 없음</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 오른쪽: 포인트 & 회원정보 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* 포인트 카드 */}
          <motion.div
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 cursor-pointer shadow-2xl shadow-purple-500/30 relative overflow-hidden"
            onClick={() => setShowPointModal(true)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-2 text-white/90">나의 포인트</h3>
              <p className="text-5xl font-extrabold mb-2">
                {(currentUser.mypoints || 0).toLocaleString()}P
              </p>
              <p className="text-sm text-white/80">클릭하여 내역 확인 →</p>
            </div>
          </motion.div>

          {/* 회원 정보 */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              회원 정보
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">이름</span>
                <span className="font-bold text-lg">{currentUser.name}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">학번</span>
                <span className="font-bold">{currentUser.student_no}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">학과</span>
                <span className="font-bold">{currentUser.department}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">학년</span>
                <span className="font-bold">{currentUser.grade}학년</span>
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              이번 달 활동
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-900/30 p-4 rounded-xl text-center border border-blue-700/30">
                <div className="text-3xl font-bold text-blue-400">
                  {exerciseLogs.filter(log => {
                    const logMonth = new Date(log.performed_at).getMonth();
                    return logMonth === currentDate.getMonth();
                  }).length}
                </div>
                <div className="text-xs text-gray-400 mt-1">운동 기록</div>
              </div>
              <div className="bg-green-900/30 p-4 rounded-xl text-center border border-green-700/30">
                <div className="text-3xl font-bold text-green-400">
                  {dietLogs.filter(log => {
                    const logMonth = new Date(log.ate_at).getMonth();
                    return logMonth === currentDate.getMonth();
                  }).length}
                </div>
                <div className="text-xs text-gray-400 mt-1">식단 기록</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 포인트 내역 모달 */}
      <AnimatePresence>
        {showPointModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPointModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700 shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                포인트 내역
              </h2>

              {pointHistory.length > 0 ? (
                <div className="space-y-3">
                  {pointHistory.map((item) => (
                    <motion.div
                      key={item.ledger_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl flex justify-between items-center border border-gray-700/50 hover:border-gray-600/50 transition"
                    >
                      <div>
                        <div className="font-semibold text-lg">
                          {item.description || item.reason_type}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatDateTime(item.created_at)}
                        </div>
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          item.point_change > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {item.point_change > 0 ? "+" : ""}
                        {item.point_change}P
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-12 text-lg">
                  포인트 내역이 없습니다.
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPointModal(false)}
                className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-lg transition shadow-lg"
              >
                닫기
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal 섹션 */}
      <div className="max-w-7xl mx-auto mt-8">
        <Goal isDark={isDark} />
      </div>
    </div>
  );
}