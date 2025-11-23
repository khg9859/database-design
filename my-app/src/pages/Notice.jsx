import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Notice() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('noticePageTheme');
    return saved ? saved === 'dark' : true;
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('noticePageTheme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'} p-6 transition-colors duration-300`}>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              공지사항
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>헬스장 이용 안내 및 포인트 지급 조건</p>
          </div>

          {/* 다크모드 토글 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`p-3 rounded-xl font-semibold transition ${isDark
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-100 shadow-lg'
              }`}
          >
            {isDark ? '☀️' : '🌙'}
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* 포인트 지급 조건 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-8 border shadow-xl ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
              : 'bg-white border-gray-200'
            }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">💰</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              포인트 지급 조건
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 운동 기록 */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className={`p-6 rounded-xl border-2 ${isDark
                  ? 'bg-blue-900/20 border-blue-700/50 hover:border-blue-600'
                  : 'bg-blue-50 border-blue-200 hover:border-blue-400'
                }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💪</span>
                <h3 className="text-xl font-bold">운동 기록</h3>
              </div>
              <div className={`text-lg font-semibold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                5회 달성 시 → 100P
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                운동 기록을 5회 추가할 때마다 자동으로 100포인트가 지급됩니다.
              </p>
            </motion.div>

            {/* 식단 기록 */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className={`p-6 rounded-xl border-2 ${isDark
                  ? 'bg-green-900/20 border-green-700/50 hover:border-green-600'
                  : 'bg-green-50 border-green-200 hover:border-green-400'
                }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🥗</span>
                <h3 className="text-xl font-bold">식단 기록</h3>
              </div>
              <div className={`text-lg font-semibold mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                3회 달성 시 → 50P
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                식단 기록을 3회 추가할 때마다 자동으로 50포인트가 지급됩니다.
              </p>
            </motion.div>

            {/* 출석 */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className={`p-6 rounded-xl border-2 ${isDark
                  ? 'bg-purple-900/20 border-purple-700/50 hover:border-purple-600'
                  : 'bg-purple-50 border-purple-200 hover:border-purple-400'
                }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📅</span>
                <h3 className="text-xl font-bold">출석 체크</h3>
              </div>
              <div className={`text-lg font-semibold mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                10회 달성 시 → 200P
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                헬스장 출석을 10회 할 때마다 자동으로 200포인트가 지급됩니다.
              </p>
            </motion.div>

            {/* 목표 설정 */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className={`p-6 rounded-xl border-2 ${isDark
                  ? 'bg-pink-900/20 border-pink-700/50 hover:border-pink-600'
                  : 'bg-pink-50 border-pink-200 hover:border-pink-400'
                }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎯</span>
                <h3 className="text-xl font-bold">목표 설정</h3>
              </div>
              <div className={`text-lg font-semibold mb-2 ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                2개 달성 시 → 80P
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                운동 목표를 2개 설정할 때마다 자동으로 80포인트가 지급됩니다.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-6 p-4 rounded-xl ${isDark
                ? 'bg-yellow-900/20 border border-yellow-700/30'
                : 'bg-yellow-50 border border-yellow-200'
              }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className="font-semibold mb-1">자동 지급 시스템</p>
                <p>포인트는 조건 달성 시 자동으로 지급되며, 실시간 알림으로 확인할 수 있습니다!</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 이용 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-8 border shadow-xl ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
              : 'bg-white border-gray-200'
            }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">📢</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              헬스장 이용 안내
            </h2>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <h3 className="font-bold text-lg mb-2">🏋️ 이용 시간</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                평일: 06:00 - 23:00 | 주말: 08:00 - 20:00
              </p>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <h3 className="font-bold text-lg mb-2">👥 최대 수용 인원</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                동시 이용 가능 인원: 30명 (교양 수업 시간 제외)
              </p>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <h3 className="font-bold text-lg mb-2">📚 교양 수업 시간</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                교양 수업 진행 중에는 헬스장 이용 인원이 제한됩니다. 수업 시간표는 '교양수업 시간표' 메뉴에서 확인하세요.
              </p>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <h3 className="font-bold text-lg mb-2">🎁 포인트 사용</h3>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                획득한 포인트는 '포인트 교환소'에서 다양한 보상 상품으로 교환할 수 있습니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 멘토링 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-8 border shadow-xl ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
              : 'bg-white border-gray-200'
            }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🤝</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              멘토링 시스템
            </h2>
          </div>

          <div className="space-y-4">
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              운동 초보자와 경험자를 연결하는 멘토링 시스템을 운영하고 있습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <h3 className="font-bold text-lg mb-2">👨‍🏫 멘토가 되려면?</h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  '멘토링 신청' 메뉴에서 멘토 모집글을 작성하고, 멘티의 신청을 받아보세요.
                </p>
              </div>

              <div className={`p-4 rounded-xl ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <h3 className="font-bold text-lg mb-2">🙋 멘티가 되려면?</h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  '멘토링 신청' 메뉴에서 멘토를 찾아 신청하거나, 멘티 모집글을 작성하세요.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 문의 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl p-8 border shadow-xl text-center ${isDark
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
              : 'bg-white border-gray-200'
            }`}
        >
          <span className="text-5xl mb-4 block">📞</span>
          <h2 className="text-2xl font-bold mb-4">문의사항</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            헬스장 이용 및 시스템 관련 문의
          </p>
          <p className="text-xl font-bold text-blue-500">
            📧 gym@hansung.ac.kr | ☎️ 02-1234-5678
          </p>
        </motion.div>
      </div>
    </div>
  );
}