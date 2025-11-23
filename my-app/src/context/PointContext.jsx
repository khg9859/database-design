import { createContext, useContext, useState, useEffect } from 'react';

const PointContext = createContext();

export const usePoints = () => {
    const context = useContext(PointContext);
    if (!context) {
        throw new Error('usePoints must be used within a PointProvider');
    }
    return context;
};

export const PointProvider = ({ children }) => {
    // 초기 포인트 (localStorage에서 불러오기)
    const [totalPoints, setTotalPoints] = useState(() => {
        const saved = localStorage.getItem('userTotalPoints');
        return saved ? parseInt(saved) : 500; // 기본값 500
    });

    // 포인트 변경 시 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('userTotalPoints', totalPoints.toString());
    }, [totalPoints]);

    // 포인트 추가
    const addPoints = (points) => {
        setTotalPoints(prev => prev + points);
    };

    // 포인트 차감
    const subtractPoints = (points) => {
        setTotalPoints(prev => Math.max(0, prev - points));
    };

    // 포인트 직접 설정
    const setPoints = (points) => {
        setTotalPoints(points);
    };

    const value = {
        totalPoints,
        addPoints,
        subtractPoints,
        setPoints
    };

    return (
        <PointContext.Provider value={value}>
            {children}
        </PointContext.Provider>
    );
};
