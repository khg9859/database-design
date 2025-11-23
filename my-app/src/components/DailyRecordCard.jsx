import { motion } from "framer-motion";

export default function DailyRecordCard({ date, records, isDark, onClose }) {
    const { exercises, diets, health } = records;

    const formatTime = (datetime) => {
        const date = new Date(datetime);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mt-6 rounded-2xl p-6 border shadow-2xl ${isDark
                    ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
                    : 'bg-white border-gray-200'
                }`}
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {date} 기록
                </h3>
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                >
                    <span className="text-xl">✕</span>
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 운동 기록 */}
                <div>
                    <h4 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                        <span className="text-2xl">💪</span> 운동 기록
                        <span className="text-sm font-normal text-gray-400">({exercises.length}개)</span>
                    </h4>
                    {exercises.length > 0 ? (
                        <div className="space-y-3">
                            {exercises.map((log, idx) => (
                                <motion.div
                                    key={log.exercise_log_id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`p-4 rounded-xl border relative overflow-hidden group ${isDark
                                            ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/30 hover:border-blue-600/50'
                                            : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300'
                                        } transition-all`}
                                >
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-bold text-lg">{log.exercise_name}</div>
                                            <div className="text-xs text-gray-400">{formatTime(log.performed_at)}</div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-400">⏱️</span>
                                                <span className="font-semibold">{log.duration_minutes}분</span>
                                            </div>
                                            {log.achievement_id && (
                                                <div className="flex items-center gap-1 text-green-400">
                                                    <span>✓</span>
                                                    <span className="text-xs">보상 획득</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-800/30' : 'bg-gray-100'
                            }`}>
                            <div className="text-4xl mb-2">🏋️</div>
                            <p className="text-sm text-gray-500">운동 기록이 없습니다</p>
                        </div>
                    )}
                </div>

                {/* 식단 기록 */}
                <div>
                    <h4 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                        <span className="text-2xl">🍽️</span> 식단 기록
                        <span className="text-sm font-normal text-gray-400">({diets.length}개)</span>
                    </h4>
                    {diets.length > 0 ? (
                        <div className="space-y-3">
                            {diets.map((log, idx) => (
                                <motion.div
                                    key={log.diet_log_id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`p-4 rounded-xl border relative overflow-hidden group ${isDark
                                            ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/30 hover:border-green-600/50'
                                            : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
                                        } transition-all`}
                                >
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.meal_type === '아침' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        log.meal_type === '점심' ? 'bg-orange-500/20 text-orange-400' :
                                                            log.meal_type === '저녁' ? 'bg-purple-500/20 text-purple-400' :
                                                                'bg-pink-500/20 text-pink-400'
                                                    }`}>
                                                    {log.meal_type}
                                                </span>
                                                <div className="font-bold">{log.food_name}</div>
                                            </div>
                                            <div className="text-xs text-gray-400">{formatTime(log.ate_at)}</div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="flex items-center gap-1">
                                                <span className="text-gray-400">🔥</span>
                                                <span className="font-semibold">{log.calories}kcal</span>
                                            </div>
                                            {log.achievement_id && (
                                                <div className="flex items-center gap-1 text-green-400">
                                                    <span>✓</span>
                                                    <span className="text-xs">보상 획득</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-800/30' : 'bg-gray-100'
                            }`}>
                            <div className="text-4xl mb-2">🍴</div>
                            <p className="text-sm text-gray-500">식단 기록이 없습니다</p>
                        </div>
                    )}
                </div>

                {/* 건강 기록 */}
                <div>
                    <h4 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                        <span className="text-2xl">❤️</span> 건강 기록
                        <span className="text-sm font-normal text-gray-400">({health.length}개)</span>
                    </h4>
                    {health.length > 0 ? (
                        <div className="space-y-3">
                            {health.map((log, idx) => (
                                <motion.div
                                    key={log.record_id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`p-4 rounded-xl border relative overflow-hidden ${isDark
                                            ? 'bg-gradient-to-r from-red-900/30 to-pink-900/30 border-red-700/30'
                                            : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                                        }`}
                                >
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl"></div>
                                    <div className="relative z-10 grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-gray-400 text-xs mb-1">체중</span>
                                            <span className="font-bold text-lg">{log.weight_kg}kg</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-400 text-xs mb-1">근육량</span>
                                            <span className="font-bold text-lg">{log.muscle_mass_kg}kg</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-400 text-xs mb-1">체지방</span>
                                            <span className="font-bold text-lg">{log.fat_mass_kg}kg</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-400 text-xs mb-1">BMI</span>
                                            <span className="font-bold text-lg">{log.bmi}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className={`p-4 rounded-lg text-center ${isDark ? 'bg-gray-800/30' : 'bg-gray-100'
                            }`}>
                            <div className="text-4xl mb-2">📊</div>
                            <p className="text-sm text-gray-500">건강 기록이 없습니다</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
