import React, { useState } from 'react';
import QuestList from '../components/QuestList.jsx'; 

// ... (위에 있는 수정된 initialQuests 데이터) ...
const initialQuests = [
    // (수정된 퀘스트 목록)
    { id: 1, title: "💪 헬스장 첫 방문", description: "처음으로 헬스장을 방문하여 출석체크", points: 300, isCompleted: true },
    { id: 2, title: "🤝 친구 초대하기",  description: "친구 1명 헬스장 신규 등록", points: 200, isCompleted: false },
    { id: 3, title: "🤝 친구 초대하기",  description: "친구 3명 헬스장 신규 등록", points: 500, isCompleted: false },
    { id: 4, title: "🤝 친구 초대하기",  description: "친구 5명 헬스장 신규 등록", points: 1000, isCompleted: false },
    { id: 5, title: "🧑‍🤝‍🧑 멘토링 결성하기",  description: "멘토링 구성", points: 200, isCompleted: false },
    { id: 6, title: "🧑‍🤝‍🧑 멘토 구하기", description: "멘토 구성", points: 200, isCompleted: false},
    { id: 7, title: "🧑‍🤝‍🧑 멘티 구하기",  description: "멘티 구성", points: 200, isCompleted: false },
    { id: 11, title: "🏋️ 3대 운동 챌린지", description: "벤치, 스쿼트, 데드 합 150kg 달성", points: 300, isCompleted: false },
    { id: 12, title: "🏋️ 3대 운동 챌린지", description: "벤치, 스쿼트, 데드 합 200kg 달성", points: 400, isCompleted: false },
    { id: 13, title: "🏋️ 3대 운동 챌린지", description: "벤치, 스쿼트, 데드 합 250kg 달성", points: 500, isCompleted: false },
    { id: 14, title: "🏋️ 3대 운동 챌린지", description: "벤치, 스쿼트, 데드 합 300kg 달성", points: 600, isCompleted: false },
    { id: 15, title: "🏋️ 3대 운동 챌린지", description: "벤치, 스쿼트, 데드 합 350kg 달성", points: 700, isCompleted: false },
    { id: 16, title: "🏋️ 3대 운동 챌린지", description: "벤치, 스쿼트, 데드 합 400kg 달성", points: 800, isCompleted: false },
    { id: 31, title: "📅 오늘 출석", description: "오늘 출석 달성", points: 50, isCompleted: false },
    { id: 32, title: "📅 주 3회 출석 달성", description: "이번 주 3회 이상 출석", points: 100, isCompleted: false },
    { id: 33, title: "📅 2주 7회 출석 달성", description: "2주 동안 7회 이상 출석", points: 100, isCompleted: false },
    { id: 34, title: "📅 한 달 20회 출석 달성", description: "이번 달에 20회 이상 출석", points: 600, isCompleted: false },
];

function IncentivePage() {
    const [quests, setQuests] = useState(initialQuests);
    // 👇 퀘스트 데이터(points: 300)와 초기 포인트(useState)를 일치시킴
    const [userPoints, setUserPoints] = useState(300); 
    const [activeView, setActiveView] = useState('available');

    const handleCompleteQuest = (questId) => {
        // ... (이 함수는 기존과 동일) ...
        const updatedQuests = quests.map(quest => {
            if (quest.id === questId && !quest.isCompleted) {
                setUserPoints(prevPoints => prevPoints + quest.points);
                return { ...quest, isCompleted: true }; 
            }
            return quest;
        });
        setQuests(updatedQuests);
    };

    // "진행 가능" 퀘스트 목록
    const availableQuests = quests.filter(quest => !quest.isCompleted);
    // "완료" 퀘스트 목록
    const completedQuests = quests.filter(quest => quest.isCompleted);

    return (
        // 👇 (이전과 동일: 폰트 줄이고, 꽉 찬 배경)
        <div className="p-5 px-10 bg-gray-100 rounded-none shadow-md flex-grow"> 
            <h2 className="text-2xl font-bold text-center text-gray-800 border-b-2 border-gray-200 pb-4 mb-8">
                🏆 나의 포인트: {userPoints} P
            </h2>

            {/* 👇 (이전과 동일: 탭 메뉴) */}
            <div className="flex justify-center space-x-2 mb-8 border-b border-gray-300">
                <button
                    className={`py-2 px-6 font-semibold rounded-t-lg transition-colors text-base ${
                        activeView === 'available' ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveView('available')}
                >
                    진행할 수 있는 퀘스트
                </button>
                <button
                    className={`py-2 px-6 font-semibold rounded-t-lg transition-colors text-base ${
                        activeView === 'completed' ? 'border-b-4 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveView('completed')}
                >
                    완료한 퀘스트
                </button>
            </div>

            {/* 👇 "진행할 수 있는 퀘스트" 탭이 활성화됐을 때 */}
            {activeView === 'available' && (
                // 👇 <div> 또는 <React.Fragment> (<>)로 감싸줍니다.
                <div className="space-y-8"> {/* 카테고리별 목록 사이에 간격 추가 */}
                    
                    {/* 1. 출석 퀘스트 목록 */}
                    <QuestList 
                        title="📅 출석 챌린지"
                        // availableQuests 목록에서 "출석"이 포함된 것만 필터링
                        quests={availableQuests.filter(q => q.title.includes("출석"))}
                        onCompleteQuest={handleCompleteQuest}
                        isCompletable={true}
                    />
                    
                    {/* 2. 3대 운동 퀘스트 목록 */}
                    <QuestList 
                        title="🏋️ 3대 운동 챌린지"
                        quests={availableQuests.filter(q => q.title.includes("3대 운동"))}
                        onCompleteQuest={handleCompleteQuest}
                        isCompletable={true}
                    />

                    {/* 3. 친구 초대 퀘스트 목록 */}
                    <QuestList 
                        title="🤝 친구 초대하기"
                        quests={availableQuests.filter(q => q.title.includes("친구 초대"))}
                        onCompleteQuest={handleCompleteQuest}
                        isCompletable={true}
                    />

                    {/* 4. 멘토링 퀘스트 목록 */}
                    <QuestList 
                        title="🧑‍🤝‍🧑 멘토링"
                        quests={availableQuests.filter(q => q.title.includes("멘토"))}
                        onCompleteQuest={handleCompleteQuest}
                        isCompletable={true}
                    />
                </div>
            )}

            {/* 👇 "완료한 퀘스트" 탭이 활성화됐을 때 */}
            {activeView === 'completed' && (
                <QuestList 
                    title="✅ 완료한 퀘스트"
                    quests={completedQuests} // 완료된 퀘스트는 카테고리 없이 모두 표시
                    onCompleteQuest={() => {}}
                    isCompletable={false}
                />
            )}
        </div>
    );
}

export default IncentivePage;