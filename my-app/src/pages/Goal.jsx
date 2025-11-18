import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 더미 목표 데이터
const DUMMY_GOALS = [
  {
    goal_id: 1,
    member_id: 1,
    item_name: "벤치프레스 100kg 달성",
    target_date: "2025-02-28",
    is_achieved: false
  },
  {
    goal_id: 2,
    member_id: 1,
    item_name: "체지방률 15% 이하",
    target_date: "2025-03-31",
    is_achieved: false
  },
  {
    goal_id: 3,
    member_id: 1,
    item_name: "30일 연속 출석",
    target_date: "2025-02-15",
    is_achieved: true
  }
];

export default function Goal({ isDark = true }) {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // 더미 데이터 로드
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      
      // 로컬스토리지에서 먼저 확인
      const savedGoals = localStorage.getItem('goals');
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      } else {
        // 없으면 더미 데이터 사용
        setGoals(DUMMY_GOALS);
        localStorage.setItem('goals', JSON.stringify(DUMMY_GOALS));
      }
    } catch (error) {
      console.error('목표 로드 실패:', error);
      setGoals(DUMMY_GOALS);
    } finally {
      setLoading(false);
    }
  };

  // 목표 추가
  const handleAddGoal = async () => {
    if (!newGoal.trim() || !targetDate) return;

    try {
      const newGoalData = {
        goal_id: Date.now(),
        member_id: 1,
        item_name: newGoal,
        target_date: targetDate,
        is_achieved: false
      };

      const updatedGoals = [...goals, newGoalData];
      setGoals(updatedGoals);
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
      
      setNewGoal("");
      setTargetDate("");
      setShowAddForm(false);
    } catch (error) {
      console.error('목표 추가 실패:', error);
      alert('목표 추가에 실패했습니다.');
    }
  };

  // 목표 체크 토글
  const toggleGoal = async (goalId) => {
    try {
      const updatedGoals = goals.map((g) =>
        g.goal_id === goalId ? { ...g, is_achieved: !g.is_achieved } : g
      );
      setGoals(updatedGoals);
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('목표 업데이트 실패:', error);
      alert('목표 업데이트에 실패했습니다.');
    }
  };

  // 목표 삭제
  const deleteGoal = async (goalId) => {
    try {
      const updatedGoals = goals.filter((g) => g.goal_id !== goalId);
      setGoals(updatedGoals);
      localStorage.setItem('goals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('목표 삭제 실패:', error);
      alert('목표 삭제에 실패했습니다.');
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // D-day 계산
  const getDday = (targetDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "기한 만료";
    if (diffDays === 0) return "D-Day";
    return `D-${diffDays}`;
  };

  if (loading) {
    return (
      <div className={`min-h-[400px] flex items-center justify-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-transparent text-white' : 'bg-transparent text-gray-900'} p-6`}>
      {/* 헤더 */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2">목표 관리</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>나의 운동 목표를 설정하고 달성해보세요</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* 목표 추가 버튼 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className={`w-full mb-6 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 ${
            isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <span className="text-2xl">+</span>
          새 목표 추가
        </motion.button>

        {/* 목표 추가 폼 */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-900 rounded-lg p-6 mb-6 border border-gray-800"
          >
            <h3 className="text-xl font-bold mb-4">새 목표 등록</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  목표 내용
                </label>
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="예: 벤치프레스 100kg 달성"
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  목표 기한
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddGoal}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                  등록
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewGoal("");
                    setTargetDate("");
                  }}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition"
                >
                  취소
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 목표 리스트 */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <motion.div
                key={goal.goal_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`
                  bg-gray-900 rounded-lg p-5 border border-gray-800 transition-all
                  ${goal.is_achieved ? "opacity-60 bg-gray-800" : ""}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* 체크박스 */}
                  <button
                    onClick={() => toggleGoal(goal.goal_id)}
                    className={`
                      flex-shrink-0 w-7 h-7 rounded border-2 flex items-center justify-center transition-all
                      ${
                        goal.is_achieved
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-600 hover:border-blue-500"
                      }
                    `}
                  >
                    {goal.is_achieved && (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>

                  {/* 목표 내용 */}
                  <div className="flex-1">
                    <h3
                      className={`
                        text-lg font-semibold mb-2
                        ${goal.is_achieved ? "line-through text-gray-500" : ""}
                      `}
                    >
                      {goal.item_name}
                    </h3>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">
                        목표일: {formatDate(goal.target_date)}
                      </span>
                      <span
                        className={`
                          px-3 py-1 rounded-full font-semibold
                          ${
                            goal.is_achieved
                              ? "bg-green-600 text-white"
                              : getDday(goal.target_date) === "기한 만료"
                              ? "bg-red-600 text-white"
                              : getDday(goal.target_date) === "D-Day"
                              ? "bg-yellow-600 text-white"
                              : "bg-blue-600 text-white"
                          }
                        `}
                      >
                        {goal.is_achieved ? "완료" : getDday(goal.target_date)}
                      </span>
                    </div>
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => deleteGoal(goal.goal_id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-lg">아직 등록된 목표가 없습니다</p>
              <p className="text-sm mt-2">
                위 버튼을 눌러 새 목표를 추가해보세요!
              </p>
            </div>
          )}
        </div>

        {/* 통계 */}
        {goals.length > 0 && (
          <div className="mt-8 bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">목표 달성 현황</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400">
                  {goals.length}
                </div>
                <div className="text-sm text-gray-400 mt-1">전체 목표</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">
                  {goals.filter((g) => g.is_achieved).length}
                </div>
                <div className="text-sm text-gray-400 mt-1">달성 완료</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">
                  {goals.filter((g) => !g.is_achieved).length}
                </div>
                <div className="text-sm text-gray-400 mt-1">진행 중</div>
              </div>
            </div>

            {/* 달성률 프로그레스 바 */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>달성률</span>
                <span className="font-bold">
                  {goals.length > 0
                    ? Math.round(
                        (goals.filter((g) => g.is_achieved).length /
                          goals.length) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      goals.length > 0
                        ? (goals.filter((g) => g.is_achieved).length /
                            goals.length) *
                          100
                        : 0
                    }%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-blue-600 to-green-500 h-full rounded-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}