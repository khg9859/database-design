import React from 'react';

function QuestList(props) {
    return (
        <div className="mt-8">
            {/* 👇 폰트 크기 수정: text-2xl -> text-xl */}
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
                {props.title} 
                {/* 👇 폰트 크기 수정: text-lg -> text-base */}
                <span className="text-base font-normal text-gray-500 ml-2">
                    ({props.quests.length}개)
                </span>
            </h3>
            
            <ul className="space-y-3">
                
                {/* ... (목록이 비어있을 때 코드는 동일) ... */}
                {props.quests.length === 0 && (
                    <li className="bg-white border border-gray-200 rounded-lg p-4 text-center text-gray-500 shadow-sm">
                        목록이 비었습니다.
                    </li>
                )}
                
                {props.quests.map(quest => (
                    <li 
                        key={quest.id} 
                        className={`bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm transition-all hover:shadow-md ${
                            !props.isCompletable ? 'opacity-60 bg-gray-50' : ''
                        }`}
                    >
                        <div>
                            {/* 👇 폰트 크기 수정: text-lg -> text-base */}
                            <strong className={`text-base font-semibold text-gray-900 ${
                                !props.isCompletable ? 'line-through text-gray-600' : ''
                            }`}>
                                {quest.title} (+{quest.points} P)
                            </strong>
                            {/* <p> 태그는 text-sm (작은 글씨)이라 그대로 둡니다. */}
                            <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
                        </div>
                        
                        {/* ... (버튼 부분은 동일) ... */}
                        {props.isCompletable && (
                            <button 
                                className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                                onClick={() => props.onCompleteQuest(quest.id)}
                            >
                                완료
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default QuestList;