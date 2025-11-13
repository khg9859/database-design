import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Goal from "./Goal";//한 페이지로 합침.

export default function MyPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [dietLogs, setDietLogs] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [pointHistory, setPointHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPointModal, setShowPointModal] = useState(false);

  // 데이터 로드
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const memberId = 1; // 실제는 로그인된 

      const [user, exercises, diets, health, attendance, points] = await Promise.all([
        fetch(`/api/members/${memberId}`).then(r => r.json()),
        fetch(`/api/exercise-logs/${memberId}`).then(r => r.json()),
        fetch(`/api/diet-logs/${memberId}`).then(r => r.json()),
        fetch(`/api/health-records/${memberId}`).then(r => r.json()),
        fetch(`/api/attendances/${memberId}`).then(r => r.json()),
        fetch(`/api/point-ledger/${memberId}`).then(r => r.json())
      ]);

      setCurrentUser(user);
      setExerciseLogs(exercises);
      setDietLogs(diets);
      setHealthRecords(health);
      setAttendances(attendance);
      setPointHistory(points);
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
    if (!day) return false;
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl">회원 정보를 불러올 수 없습니다</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* 헤더 */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2">마이페이지</h1>
        <p className="text-gray-400">{currentUser.name}님의 활동 기록</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 캘린더 */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                  )
                }
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                ←
              </button>
              <h2 className="text-2xl font-bold">
                {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
              </h2>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                  )
                }
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                →
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center font-bold text-gray-400 py-2">
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
                  whileHover={day ? { scale: 1.05 } : {}}
                  whileTap={day ? { scale: 0.95 } : {}}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-lg font-semibold
                    transition-all relative
                    ${!day ? "invisible" : ""}
                    ${
                      isAttendance(day)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 hover:bg-gray-700 text-white"
                    }
                    ${
                      selectedDate ===
                      `${currentDate.getFullYear()}-${String(
                        currentDate.getMonth() + 1
                      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                        ? "ring-2 ring-blue-400"
                        : ""
                    }
                  `}
                >
                  {day}
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
                className="mt-6 bg-gray-900 rounded-lg p-6 border border-gray-800"
              >
                <h3 className="text-xl font-bold mb-4">{selectedDate} 기록</h3>

                {/* 운동 기록 */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">
                    💪 운동 기록
                  </h4>
                  {selectedRecords.exercises.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedRecords.exercises.map((log) => (
                        <li key={log.log_id} className="bg-gray-800 p-3 rounded-lg">
                          <div className="font-semibold">{log.exercise_name}</div>
                          <div className="text-sm text-gray-400">
                            {log.sets}세트 × {log.reps}회
                            {log.weight_kg > 0 && ` (${log.weight_kg}kg)`}
                            {log.duration_minutes > 0 && ` · ${log.duration_minutes}분`}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">기록 없음</p>
                  )}
                </div>

                {/* 식단 기록 */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-green-400 mb-2">
                    🍽️ 식단 기록
                  </h4>
                  {selectedRecords.diets.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedRecords.diets.map((log) => (
                        <li key={log.log_id} className="bg-gray-800 p-3 rounded-lg">
                          <div className="font-semibold">
                            {log.meal_type} - {log.food_name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {log.calories}kcal
                            {log.amount > 1 && ` · ${log.amount}인분`}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">기록 없음</p>
                  )}
                </div>

                {/* 건강 기록 */}
                <div>
                  <h4 className="text-lg font-semibold text-red-400 mb-2">
                    ❤️ 건강 기록
                  </h4>
                  {selectedRecords.health.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedRecords.health.map((log) => (
                        <li key={log.record_id} className="bg-gray-800 p-3 rounded-lg">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>체중: {log.weight_kg}kg</div>
                            <div>근육량: {log.muscle_mass_kg}kg</div>
                            <div>체지방률: {log.body_fat_percent}%</div>
                            <div>BMI: {log.bmi}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">기록 없음</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 오른쪽: 포인트 */}
        <div className="space-y-6">
          {/* 포인트 카드 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 cursor-pointer"
            onClick={() => setShowPointModal(true)}
          >
            <h3 className="text-lg font-semibold mb-2">나의 포인트</h3>
            <p className="text-4xl font-bold">
              {(currentUser.mypoints || 0).toLocaleString()}P
            </p>
            <p className="text-sm text-blue-100 mt-2">클릭하여 내역 확인</p>
          </motion.div>

          {/* 회원 정보 */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">회원 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">이름</span>
                <span className="font-semibold">{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">학번</span>
                <span className="font-semibold">{currentUser.student_no}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">학과</span>
                <span className="font-semibold">{currentUser.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">학년</span>
                <span className="font-semibold">{currentUser.grade}학년</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 포인트 내역 모달 */}
      <AnimatePresence>
        {showPointModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPointModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-800"
            >
              <h2 className="text-2xl font-bold mb-4">포인트 내역</h2>

              {pointHistory.length > 0 ? (
                <div className="space-y-3">
                  {pointHistory.map((item) => (
                    <div
                      key={item.ledger_id}
                      className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold">
                          {item.description || item.reason_type}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatDateTime(item.created_at)}
                        </div>
                      </div>
                      <div
                        className={`text-lg font-bold ${
                          item.point_change > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {item.point_change > 0 ? "+" : ""}
                        {item.point_change}P
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  포인트 내역이 없습니다.
                </p>
              )}

              <button
                onClick={() => setShowPointModal(false)}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                닫기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto mt-6">//goal합침 코드
        <Goal />
      </div>
    </div>
  );
}