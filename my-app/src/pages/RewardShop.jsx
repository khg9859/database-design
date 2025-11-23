import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePoints } from '../context/PointContext';
import toast from 'react-hot-toast';

// 보상 상품 더미 데이터
const DUMMY_REWARDS = [
    // 음료/보충제
    { reward_id: 1, reward_name: '프로틴 쉐이크', required_points: 150, stock_quantity: 50, category: '음료/보충제', icon: '🥤', description: '고단백 프로틴 쉐이크 1회분' },
    { reward_id: 2, reward_name: '스포츠 음료', required_points: 80, stock_quantity: 200, category: '음료/보충제', icon: '🧃', description: '전해질 보충 스포츠 음료' },
    { reward_id: 3, reward_name: '에너지바 5개', required_points: 120, stock_quantity: 100, category: '음료/보충제', icon: '🍫', description: '운동 전후 간편 에너지바' },
    { reward_id: 4, reward_name: 'BCAA 보충제', required_points: 250, stock_quantity: 30, category: '음료/보충제', icon: '💊', description: '근육 회복 BCAA 보충제' },
    { reward_id: 5, reward_name: '크레아틴 보충제', required_points: 280, stock_quantity: 25, category: '음료/보충제', icon: '💊', description: '근력 향상 크레아틴' },

    // 운동 용품
    { reward_id: 6, reward_name: '운동 타올', required_points: 150, stock_quantity: 100, category: '운동 용품', icon: '🧻', description: '고급 스포츠 타올' },
    { reward_id: 7, reward_name: '운동 장갑', required_points: 200, stock_quantity: 50, category: '운동 용품', icon: '🧤', description: '논슬립 운동 장갑' },
    { reward_id: 8, reward_name: '헬스 벨트', required_points: 350, stock_quantity: 30, category: '운동 용품', icon: '⚫', description: '허리 보호 헬스 벨트' },
    { reward_id: 9, reward_name: '무릎 보호대', required_points: 250, stock_quantity: 40, category: '운동 용품', icon: '🦵', description: '무릎 보호 슬리브' },
    { reward_id: 10, reward_name: '손목 보호대', required_points: 180, stock_quantity: 60, category: '운동 용품', icon: '💪', description: '손목 보호 랩' },
    { reward_id: 11, reward_name: '요가 매트', required_points: 400, stock_quantity: 20, category: '운동 용품', icon: '🧘', description: '프리미엄 요가 매트' },
    { reward_id: 12, reward_name: '짐백', required_points: 450, stock_quantity: 15, category: '운동 용품', icon: '🎒', description: '대용량 스포츠 백' },

    // 이용권
    { reward_id: 13, reward_name: 'PT 1회 무료 이용권', required_points: 300, stock_quantity: 30, category: '이용권', icon: '🎫', description: '퍼스널 트레이닝 1회' },
    { reward_id: 14, reward_name: 'PT 5회 무료 이용권', required_points: 1200, stock_quantity: 10, category: '이용권', icon: '🎟️', description: '퍼스널 트레이닝 5회' },
    { reward_id: 15, reward_name: '헬스장 1개월 무료 이용권', required_points: 500, stock_quantity: 20, category: '이용권', icon: '🏋️', description: '헬스장 1개월 연장' },
    { reward_id: 16, reward_name: '헬스장 3개월 무료 이용권', required_points: 1300, stock_quantity: 5, category: '이용권', icon: '🏋️', description: '헬스장 3개월 연장' },
    { reward_id: 17, reward_name: '락커 1개월 무료 이용', required_points: 400, stock_quantity: 15, category: '이용권', icon: '🔐', description: '개인 락커 1개월' },

    // 의류
    { reward_id: 18, reward_name: '운동복 상의', required_points: 500, stock_quantity: 25, category: '의류', icon: '👕', description: '기능성 운동복 상의' },
    { reward_id: 19, reward_name: '운동복 하의', required_points: 450, stock_quantity: 30, category: '의류', icon: '👖', description: '기능성 운동복 하의' },
    { reward_id: 20, reward_name: '운동화 할인권 50%', required_points: 600, stock_quantity: 15, category: '의류', icon: '👟', description: '운동화 50% 할인' },
    { reward_id: 21, reward_name: '헬스장 후드티', required_points: 700, stock_quantity: 10, category: '의류', icon: '🧥', description: '헬스장 로고 후드티' },

    // 기타
    { reward_id: 22, reward_name: '헬스장 물병', required_points: 180, stock_quantity: 80, category: '기타', icon: '🍶', description: '스테인리스 물병' },
    { reward_id: 23, reward_name: '블루투스 이어폰', required_points: 800, stock_quantity: 8, category: '기타', icon: '🎧', description: '무선 스포츠 이어폰' },
    { reward_id: 24, reward_name: '스마트 워치 할인권 30%', required_points: 1000, stock_quantity: 5, category: '기타', icon: '⌚', description: '스마트 워치 30% 할인' },
    { reward_id: 25, reward_name: '마사지 건', required_points: 1500, stock_quantity: 3, category: '기타', icon: '🔫', description: '근육 이완 마사지 건' },
];

export default function RewardShop() {
    const { totalPoints, subtractPoints } = usePoints();
    const [rewards, setRewards] = useState(DUMMY_REWARDS);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [selectedReward, setSelectedReward] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [exchangeHistory, setExchangeHistory] = useState([]);
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('rewardShopTheme');
        return saved ? saved === 'dark' : true;
    });

    useEffect(() => {
        localStorage.setItem('rewardShopTheme', isDark ? 'dark' : 'light');
    }, [isDark]);

    // 카테고리 목록
    const categories = ['전체', ...new Set(rewards.map(r => r.category))];

    // 필터링된 보상 목록
    const filteredRewards = selectedCategory === '전체'
        ? rewards
        : rewards.filter(r => r.category === selectedCategory);

    // 교환 가능 여부 확인
    const canExchange = (reward) => {
        return totalPoints >= reward.required_points && reward.stock_quantity > 0;
    };

    // 교환 확인 모달 열기
    const openConfirmModal = (reward) => {
        if (!canExchange(reward)) {
            if (totalPoints < reward.required_points) {
                toast.error(`포인트가 부족합니다! (${reward.required_points - totalPoints}P 부족)`);
            } else {
                toast.error('재고가 없습니다!');
            }
            return;
        }
        setSelectedReward(reward);
        setShowConfirmModal(true);
    };

    // 교환 실행
    const handleExchange = () => {
        if (!selectedReward) return;

        // 포인트 차감
        subtractPoints(selectedReward.required_points);

        // 재고 감소
        setRewards(rewards.map(r =>
            r.reward_id === selectedReward.reward_id
                ? { ...r, stock_quantity: r.stock_quantity - 1 }
                : r
        ));

        // 교환 내역 추가
        const newExchange = {
            exchange_id: exchangeHistory.length + 1,
            reward_name: selectedReward.reward_name,
            used_points: selectedReward.required_points,
            exchanged_at: new Date().toISOString(),
            icon: selectedReward.icon
        };
        setExchangeHistory([newExchange, ...exchangeHistory]);

        toast.success(`${selectedReward.reward_name} 교환 완료!`);
        setShowConfirmModal(false);
        setSelectedReward(null);
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'} p-6 transition-colors duration-300`}>
            {/* 헤더 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                            포인트 교환소
                        </h1>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>포인트로 다양한 보상을 받아가세요!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* 다크모드 토글 */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsDark(!isDark)}
                            className={`p-3 rounded-xl font-semibold transition ${isDark
                                ? 'bg-gray-800 hover:bg-gray-700'
                                : 'bg-white hover:bg-gray-100 shadow-lg'
                                }`}
                        >
                            {isDark ? '☀️' : '🌙'}
                        </motion.button>

                        {/* 포인트 표시 */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 shadow-xl">
                            <div className="text-sm opacity-80">보유 포인트</div>
                            <div className="text-3xl font-bold">{totalPoints.toLocaleString()}P</div>
                        </div>
                    </div>
                </div>

                {/* 카테고리 필터 */}
                <div className="flex gap-2 flex-wrap">
                    {categories.map(category => (
                        <motion.button
                            key={category}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-xl font-semibold transition ${selectedCategory === category
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : isDark
                                    ? 'bg-gray-800 hover:bg-gray-700'
                                    : 'bg-white hover:bg-gray-100 shadow'
                                }`}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* 보상 상품 그리드 */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRewards.map((reward, idx) => {
                        const affordable = canExchange(reward);

                        return (
                            <motion.div
                                key={reward.reward_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className={`rounded-2xl p-6 border shadow-xl relative overflow-hidden ${isDark
                                    ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50'
                                    : 'bg-white border-gray-200'
                                    } ${!affordable && 'opacity-60'}`}
                            >
                                {/* 배경 장식 */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

                                {/* 재고 부족 표시 */}
                                {reward.stock_quantity === 0 && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                        품절
                                    </div>
                                )}

                                <div className="relative z-10">
                                    {/* 아이콘 */}
                                    <div className="text-6xl mb-4 text-center">{reward.icon}</div>

                                    {/* 상품명 */}
                                    <h3 className="text-xl font-bold mb-2 text-center">{reward.reward_name}</h3>

                                    {/* 설명 */}
                                    <p className={`text-sm mb-4 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {reward.description}
                                    </p>

                                    {/* 카테고리 */}
                                    <div className="flex justify-center mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                                            }`}>
                                            {reward.category}
                                        </span>
                                    </div>

                                    {/* 포인트 & 재고 */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-2xl font-bold text-blue-400">
                                            {reward.required_points}P
                                        </div>
                                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            재고: {reward.stock_quantity}개
                                        </div>
                                    </div>

                                    {/* 교환 버튼 */}
                                    <motion.button
                                        whileHover={{ scale: affordable ? 1.05 : 1 }}
                                        whileTap={{ scale: affordable ? 0.95 : 1 }}
                                        onClick={() => openConfirmModal(reward)}
                                        disabled={!affordable}
                                        className={`w-full py-3 rounded-xl font-bold transition ${affordable
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                                            : isDark
                                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {totalPoints < reward.required_points
                                            ? `${reward.required_points - totalPoints}P 부족`
                                            : reward.stock_quantity === 0
                                                ? '품절'
                                                : '교환하기'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* 교환 확인 모달 */}
            <AnimatePresence>
                {showConfirmModal && selectedReward && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`rounded-2xl p-8 max-w-md w-full ${isDark
                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                                : 'bg-white border border-gray-200'
                                } shadow-2xl`}
                        >
                            <div className="text-center">
                                <div className="text-7xl mb-4">{selectedReward.icon}</div>
                                <h2 className="text-2xl font-bold mb-2">{selectedReward.reward_name}</h2>
                                <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {selectedReward.description}
                                </p>

                                <div className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span>필요 포인트</span>
                                        <span className="font-bold text-red-400">{selectedReward.required_points}P</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span>보유 포인트</span>
                                        <span className="font-bold">{totalPoints}P</span>
                                    </div>
                                    <div className="border-t border-gray-600 my-2"></div>
                                    <div className="flex items-center justify-between">
                                        <span>교환 후 포인트</span>
                                        <span className="font-bold text-green-400">
                                            {totalPoints - selectedReward.required_points}P
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-yellow-400 mb-6">
                                    ⚠️ 교환 후에는 취소할 수 없습니다
                                </p>

                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowConfirmModal(false)}
                                        className={`flex-1 py-3 rounded-xl font-bold transition ${isDark
                                            ? 'bg-gray-700 hover:bg-gray-600'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                    >
                                        취소
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleExchange}
                                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold transition shadow-lg"
                                    >
                                        교환 확정
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 교환 내역 (하단 고정) */}
            {exchangeHistory.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto mt-8"
                >
                    <h2 className="text-2xl font-bold mb-4">📋 최근 교환 내역</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exchangeHistory.slice(0, 6).map((exchange) => (
                            <motion.div
                                key={exchange.exchange_id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-4 rounded-xl border ${isDark
                                    ? 'bg-gray-800/50 border-gray-700'
                                    : 'bg-white border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{exchange.icon}</div>
                                    <div className="flex-1">
                                        <div className="font-bold">{exchange.reward_name}</div>
                                        <div className="text-sm text-gray-400">
                                            {new Date(exchange.exchanged_at).toLocaleString('ko-KR')}
                                        </div>
                                    </div>
                                    <div className="text-red-400 font-bold">-{exchange.used_points}P</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
