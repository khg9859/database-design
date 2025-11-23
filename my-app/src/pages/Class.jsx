import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Class() {
  const [classes, setClasses] = useState([]);
  const [classSchedules, setClassSchedules] = useState({});
  const [currentUsers, setCurrentUsers] = useState([]); // 현재 이용 중인 회원 목록
  const [crowdInfo, setCrowdInfo] = useState({ current: 0, available: 30 }); // 혼잡도
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('classPageTheme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('classPageTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    loadAllData();
    loadGymStatus(); // 헬스장 이용 현황 로드

    // 1분마다 현재 시간 및 헬스장 현황 업데이트
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      loadGymStatus();
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);

      const classesRes = await fetch('/api/classes');
      const classesData = await classesRes.json();
      setClasses(classesData);

      const schedules = {};
      for (const cls of classesData) {
        const scheduleRes = await fetch(`/api/class-schedules/${cls.class_id}`);
        const scheduleData = await scheduleRes.json();
        schedules[cls.class_id] = scheduleData;
      }
      setClassSchedules(schedules);

    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 헬스장 이용 현황 로드 (Attendance 기반)
  const loadGymStatus = async () => {
    try {
      // localStorage에서 Attendance 데이터 가져오기
      const savedAttendances = localStorage.getItem('attendances');
      let attendances = [];

      if (savedAttendances) {
        attendances = JSON.parse(savedAttendances);
      } else {
        // 더미 데이터 (SQL VIEW 시뮬레이션)
        attendances = [
          { member_id: 1, name: '김철수', student_no: '20210001', entered_at: '2025-01-23T09:30:00', left_at: null },
          { member_id: 2, name: '이영희', student_no: '20210002', entered_at: '2025-01-23T10:15:00', left_at: null },
          { member_id: 3, name: '박민수', student_no: '20210003', entered_at: '2025-01-23T10:45:00', left_at: null },
          { member_id: 4, name: '최지은', student_no: '20210004', entered_at: '2025-01-23T11:00:00', left_at: null },
          { member_id: 5, name: '정우성', student_no: '20210005', entered_at: '2025-01-23T11:20:00', left_at: null },
          { member_id: 6, name: '강민지', student_no: '20210006', entered_at: '2025-01-23T11:35:00', left_at: null },
          { member_id: 7, name: '윤서준', student_no: '20210007', entered_at: '2025-01-23T12:00:00', left_at: null },
          { member_id: 8, name: '한지민', student_no: '20210008', entered_at: '2025-01-23T12:15:00', left_at: null },
        ];
        localStorage.setItem('attendances', JSON.stringify(attendances));
      }

      // SQL VIEW 시뮬레이션: left_at이 NULL인 회원만 필터링 (현재 이용 중)
      const currentUsers = attendances.filter(a => !a.left_at);

      setCurrentUsers(currentUsers);
      setCrowdInfo({
        current: currentUsers.length,
        available: 30 - currentUsers.length
      });
    } catch (error) {
      console.error('헬스장 현황 로드 실패:', error);
    }
  };

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

  // 다음 수업 확인
  const getNextClass = () => {
    const now = currentTime;
    const currentDay = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

    let nextClass = null;
    let minTimeDiff = Infinity;

    for (const cls of classes) {
      const schedules = classSchedules[cls.class_id] || [];
      for (const schedule of schedules) {
        if (schedule.day_of_week === currentDay && schedule.start_time > currentTimeStr) {
          const timeDiff = timeStringToMinutes(schedule.start_time) - timeStringToMinutes(currentTimeStr);
          if (timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            nextClass = { class: cls, schedule };
          }
        }
      }
    }
    return nextClass;
  };

  const timeStringToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const dayOrder = { '월': 1, '화': 2, '수': 3, '목': 4, '금': 5, '토': 6, '일': 7 };

  const currentClass = getCurrentClass();
  const nextClass = getNextClass();
  const isGymAvailable = !currentClass;

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
              교양수업 시간표
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>교양 수업 시간에는 헬스장 이용이 제한됩니다</p>
          </div>

          {/* 다크모드 토글 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-xl font-semibold transition ${isDark
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
        </div>
      </motion.div>

      {/* 상단: 실시간 헬스장 이용 현황 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className={`rounded-2xl p-8 border shadow-xl ${isDark
          ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
          : 'bg-white border-gray-200'
          }`}>
          {/* 헤더와 혼잡도 */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-6">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3 mb-2">
                <span className="text-4xl"></span> 실시간 헬스장 이용 현황
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                현재 헬스장을 이용 중인 회원을 실시간으로 확인하세요
              </p>
            </div>

            {/* 혼잡도 표시 */}
            <div className={`flex items-center gap-6 px-8 py-4 rounded-2xl ${isDark
              ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-2 border-blue-700/50'
              : 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300'
              }`}>
              <div className="text-center">
                <div className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>현재 인원</div>
                <div className="text-4xl font-bold text-blue-500">{crowdInfo.current}명</div>
              </div>
              <div className={`w-px h-16 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              <div className="text-center">
                <div className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>남은 자리</div>
                <div className="text-4xl font-bold text-green-500">{crowdInfo.available}명</div>
              </div>
            </div>
          </div>

          {/* 혼잡도 바 */}
          <div className="mb-8">
            <div className={`h-6 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'} shadow-inner`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(crowdInfo.current / 30) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${crowdInfo.current < 15
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : crowdInfo.current < 25
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
              />
            </div>
            <div className="flex justify-between mt-3 px-2">
              <span className={`text-sm font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>여유</span>
              <span className={`text-sm font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>보통</span>
              <span className={`text-sm font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>혼잡</span>
            </div>
          </div>

          {/* 현재 이용 중인 회원 목록 */}
          <div>
            <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              현재 이용 중인 회원 ({currentUsers.length}명)
            </h3>

            {currentUsers.length === 0 ? (
              <div className={`text-center py-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <div className="text-7xl mb-4">🏋️</div>
                <div className="text-xl font-semibold">현재 이용 중인 회원이 없습니다</div>
                <div className="text-sm mt-2">헬스장이 비어있습니다</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentUsers.map((user, index) => (
                  <motion.div
                    key={user.member_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`rounded-xl p-5 border-2 transition-all ${isDark
                      ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 hover:border-blue-500'
                      : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-400 shadow-md hover:shadow-xl'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg ${isDark
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                        : 'bg-gradient-to-br from-blue-400 to-purple-400'
                        }`}>
                        👤
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg">{user.name}</div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.student_no}
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      <span>🕐</span>
                      <span>입장: {new Date(user.entered_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* 이용 시간 표시 */}
                    <div className={`px-3 py-1 rounded-lg text-xs font-semibold text-center ${isDark
                      ? 'bg-blue-900/50 text-blue-300'
                      : 'bg-blue-100 text-blue-700'
                      }`}>
                      이용 중: {Math.floor((new Date() - new Date(user.entered_at)) / 60000)}분
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* 안내 메시지 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-8 p-5 rounded-xl ${isDark
              ? 'bg-blue-900/20 border border-blue-700/30'
              : 'bg-blue-50 border border-blue-200'
              }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className="font-semibold mb-2">이용 안내</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>헬스장 최대 수용 인원은 30명입니다</li>
                  <li>교양 수업 시간에는 이용 인원이 제한됩니다</li>
                  <li>현재 이용 현황은 1분마다 자동으로 업데이트됩니다</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 하단: 수업 시간표와 이용 가능 여부 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 전체 수업 시간표 */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-3xl"></span> 교양수업 목록
            </h2>
            <div className="grid gap-5">
              {classes.map((cls, index) => {
                const schedules = classSchedules[cls.class_id] || [];

                return (
                  <motion.div
                    key={cls.class_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`rounded-2xl p-6 border shadow-xl hover:shadow-2xl transition-all ${isDark
                      ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
                      : 'bg-white border-gray-200'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">{cls.class_name}</h3>

                        <div className={`space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <p className="flex items-center gap-2">
                            <span className="text-blue-400">👨‍🏫</span>
                            <span className="font-semibold">담당교수:</span> {cls.instructor_name || '미정'}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-purple-400">👥</span>
                            <span className="font-semibold">헬스장 제한 인원:</span> {cls.capacity}명
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 수업 시간표 */}
                    {schedules.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`mt-5 pt-5 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                      >
                        <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3 flex items-center gap-2`}>
                          <span className="text-lg">📅</span> 수업 시간
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {schedules
                            .sort((a, b) => dayOrder[a.day_of_week] - dayOrder[b.day_of_week])
                            .map((schedule, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`px-4 py-3 rounded-xl border transition ${isDark
                                  ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-700/30 hover:border-blue-600/50'
                                  : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300'
                                  }`}
                              >
                                <div className={`font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{schedule.day_of_week}요일</div>
                                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mt-1`}>
                                  {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* 오른쪽: 현재 헬스장 이용 가능 여부 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={`rounded-2xl p-6 border shadow-2xl sticky top-6 ${isDark
            ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
            : 'bg-white border-gray-200'
            }`}>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-2xl"></span> 현재 상태
            </h2>

            {/* 현재 시간 */}
            <div className={`mb-6 pb-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>현재 시간</div>
              <div className="text-3xl font-bold">
                {currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentTime.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
              </div>
            </div>

            {/* 현재 상태 */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`rounded-xl p-6 mb-6 text-center ${isGymAvailable
                ? isDark
                  ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-700/50'
                  : 'bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300'
                : isDark
                  ? 'bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-700/50'
                  : 'bg-gradient-to-r from-red-100 to-orange-100 border border-red-300'
                }`}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl mb-3"
              >
                {isGymAvailable ? '✅' : '⚠️'}
              </motion.div>
              <div className={`text-2xl font-bold mb-2 ${isGymAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {isGymAvailable ? '이용 가능' : '이용 제한'}
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {isGymAvailable
                  ? '지금 헬스장을 자유롭게 이용할 수 있습니다'
                  : '교양 수업으로 인해 헬스장 이용이 제한됩니다'}
              </div>
            </motion.div>

            {/* 현재 진행 중인 수업 */}
            {currentClass && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-4 mb-4 ${isDark
                  ? 'bg-red-900/30 border border-red-700/50'
                  : 'bg-red-100 border border-red-300'
                  }`}
              >
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>현재 진행 중인 수업</div>
                <div className="font-bold text-lg mb-1">{currentClass.class.class_name}</div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  📅 {currentClass.schedule.day_of_week}요일 {currentClass.schedule.start_time?.substring(0, 5)} - {currentClass.schedule.end_time?.substring(0, 5)}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  👥 헬스장 제한 인원: {currentClass.class.capacity}명
                </div>
              </motion.div>
            )}

            {/* 다음 수업 */}
            {nextClass && !currentClass && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-4 ${isDark
                  ? 'bg-blue-900/30 border border-blue-700/50'
                  : 'bg-blue-100 border border-blue-300'
                  }`}
              >
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>다음 수업</div>
                <div className="font-bold text-lg mb-1">{nextClass.class.class_name}</div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  📅 {nextClass.schedule.start_time?.substring(0, 5)} 시작
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
