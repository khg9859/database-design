import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const PointContext = createContext();

export const usePoints = () => {
    const context = useContext(PointContext);
    if (!context) {
        throw new Error('usePoints must be used within a PointProvider');
    }
    return context;
};

// 보상 정책 (IncentivePolicy 시뮬레이션)
const REWARD_POLICIES = {
    EXERCISE: { condition_value: 5, points_awarded: 100, description: '운동 5회 달성' },
    DIET: { condition_value: 3, points_awarded: 50, description: '식단 기록 3회' },
    ATTENDANCE: { condition_value: 10, points_awarded: 200, description: '출석 10회 달성' },
    GOAL: { condition_value: 2, points_awarded: 80, description: '목표 설정 2개' }
};

export const PointProvider = ({ children }) => {
    // 초기 포인트 (localStorage에서 불러오기)
    const [totalPoints, setTotalPoints] = useState(() => {
        const saved = localStorage.getItem('userTotalPoints');
        return saved ? parseInt(saved) : 500; // 기본값 500
    });

    // AchievementLog 시뮬레이션 (localStorage)
    const [achievementLogs, setAchievementLogs] = useState(() => {
        const saved = localStorage.getItem('achievementLogs');
        return saved ? JSON.parse(saved) : [];
    });

    // 포인트 변경 시 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('userTotalPoints', totalPoints.toString());
    }, [totalPoints]);

    // AchievementLog 변경 시 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('achievementLogs', JSON.stringify(achievementLogs));
    }, [achievementLogs]);

    // 포인트 추가
    const addPoints = (points, description = '포인트 획득') => {
        setTotalPoints(prev => prev + points);

        // AchievementLog 생성
        const newLog = {
            achievement_id: achievementLogs.length + 1,
            member_id: 1,
            source_type: 'ETC',
            points_earned: points,
            points_snapshot: totalPoints,
            achieved_at: new Date().toISOString(),
            description
        };
        setAchievementLogs(prev => [newLog, ...prev]);

        toast.success(`${description} (+${points}P)`, {
            icon: '🎉',
            duration: 3000
        });
    };

    // 포인트 차감
    const subtractPoints = (points) => {
        setTotalPoints(prev => Math.max(0, prev - points));
    };

    // 포인트 직접 설정
    const setPoints = (points) => {
        setTotalPoints(points);
    };

    // 배치 보상 체크 (운동)
    const checkExerciseBatchReward = (exerciseLogs) => {
        const policy = REWARD_POLICIES.EXERCISE;
        const unrewardedLogs = exerciseLogs.filter(log => !log.achievement_id);

        if (unrewardedLogs.length >= policy.condition_value) {
            // AchievementLog 생성
            const newAchievementId = achievementLogs.length + 1;
            const newLog = {
                achievement_id: newAchievementId,
                member_id: 1,
                source_type: 'EXERCISE',
                points_earned: policy.points_awarded,
                points_snapshot: totalPoints,
                achieved_at: new Date().toISOString(),
                description: policy.description
            };

            setAchievementLogs(prev => [newLog, ...prev]);
            setTotalPoints(prev => prev + policy.points_awarded);

            toast.success(`🎉 ${policy.description}! +${policy.points_awarded}P`, {
                duration: 4000,
                style: {
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 'bold'
                }
            });

            return newAchievementId;
        }
        return null;
    };

    // 배치 보상 체크 (식단)
    const checkDietBatchReward = (dietLogs) => {
        const policy = REWARD_POLICIES.DIET;
        const unrewardedLogs = dietLogs.filter(log => !log.achievement_id);

        if (unrewardedLogs.length >= policy.condition_value) {
            const newAchievementId = achievementLogs.length + 1;
            const newLog = {
                achievement_id: newAchievementId,
                member_id: 1,
                source_type: 'DIET',
                points_earned: policy.points_awarded,
                points_snapshot: totalPoints,
                achieved_at: new Date().toISOString(),
                description: policy.description
            };

            setAchievementLogs(prev => [newLog, ...prev]);
            setTotalPoints(prev => prev + policy.points_awarded);

            toast.success(`🎉 ${policy.description}! +${policy.points_awarded}P`, {
                duration: 4000,
                style: {
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 'bold'
                }
            });

            return newAchievementId;
        }
        return null;
    };

    // 배치 보상 체크 (출석)
    const checkAttendanceBatchReward = (attendances) => {
        const policy = REWARD_POLICIES.ATTENDANCE;
        const unrewardedLogs = attendances.filter(log => !log.achievement_id);

        if (unrewardedLogs.length >= policy.condition_value) {
            const newAchievementId = achievementLogs.length + 1;
            const newLog = {
                achievement_id: newAchievementId,
                member_id: 1,
                source_type: 'ATTENDANCE',
                points_earned: policy.points_awarded,
                points_snapshot: totalPoints,
                achieved_at: new Date().toISOString(),
                description: policy.description
            };

            setAchievementLogs(prev => [newLog, ...prev]);
            setTotalPoints(prev => prev + policy.points_awarded);

            toast.success(`🎉 ${policy.description}! +${policy.points_awarded}P`, {
                duration: 4000,
                style: {
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 'bold'
                }
            });

            return newAchievementId;
        }
        return null;
    };

    // 배치 보상 체크 (목표)
    const checkGoalBatchReward = (goals) => {
        const policy = REWARD_POLICIES.GOAL;
        const unrewardedGoals = goals.filter(goal => !goal.achievement_id);

        if (unrewardedGoals.length >= policy.condition_value) {
            const newAchievementId = achievementLogs.length + 1;
            const newLog = {
                achievement_id: newAchievementId,
                member_id: 1,
                source_type: 'GOAL',
                points_earned: policy.points_awarded,
                points_snapshot: totalPoints,
                achieved_at: new Date().toISOString(),
                description: policy.description
            };

            setAchievementLogs(prev => [newLog, ...prev]);
            setTotalPoints(prev => prev + policy.points_awarded);

            toast.success(`🎉 ${policy.description}! +${policy.points_awarded}P`, {
                duration: 4000,
                style: {
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 'bold'
                }
            });

            return newAchievementId;
        }
        return null;
    };

    const value = {
        totalPoints,
        addPoints,
        subtractPoints,
        setPoints,
        achievementLogs,
        checkExerciseBatchReward,
        checkDietBatchReward,
        checkAttendanceBatchReward,
        checkGoalBatchReward,
        REWARD_POLICIES
    };

    return (
        <PointContext.Provider value={value}>
            {children}
        </PointContext.Provider>
    );
};
