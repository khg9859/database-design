import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Class() {
  const [classes, setClasses] = useState([]);
  const [classSchedules, setClassSchedules] = useState({});
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
    // 1분마다 현재 시간 업데이트
    const timer = setInterval(() => {
      setCurrentTime(new Date());
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
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 전체 수업 시간표 */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
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
                    className={`rounded-2xl p-6 border shadow-xl hover:shadow-2xl transition-all ${
                      isDark
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
                                className={`px-4 py-3 rounded-xl border transition ${
                                  isDark
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
          transition={{ delay: 0.2 }}
        >
          <div className={`rounded-2xl p-6 border shadow-2xl sticky top-6 ${
            isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
              : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-2xl">🏋️</span> 헬스장 이용 현황
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
              className={`rounded-xl p-6 mb-6 text-center ${
                isGymAvailable
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
                className={`rounded-xl p-4 mb-4 ${
                  isDark
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
                className={`rounded-xl p-4 ${
                  isDark
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
