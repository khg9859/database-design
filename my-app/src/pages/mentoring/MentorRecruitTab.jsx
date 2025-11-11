import { useState } from "react";
import { useMatch } from "./MatchContext";
import { v4 as uuidv4 } from "uuid";
import MatchModal from "./MatchModal";

export default function MentorRecruitTab({ userId, darkMode }) {
  const {
    mentors,
    mentees,
    matches,
    addMentor,
    deleteMentor,
    requestMatch,
  } = useMatch();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [modal, setModal] = useState(null);

  const myMentorPost = mentors.find((m) => m.userId === userId);

  // ✅ 활성 매칭 확인
  const activeMatch = matches.find(
    (m) => myMentorPost && m.mentorId === myMentorPost.id && m.status === "active"
  );

  // 모집글 등록
  const handleSubmit = () => {
    if (myMentorPost) return alert("이미 등록된 모집글이 있습니다.");
    addMentor({
      id: uuidv4(),
      userId,
      title,
      description: desc,
    });
    setTitle("");
    setDesc("");
  };

  // 신청 시 바로 매칭 처리
  const handleConfirm = (type, target) => {
    if (!myMentorPost) return;
    if (type === "request") {
      // 즉시 매칭으로 처리
      requestMatch(myMentorPost.id, target.id, target.title);
    }
    setModal(null);
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-xl transition-colors duration-300 max-w-6xl mx-auto ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h3 className="text-2xl font-bold text-center mb-6">멘토 모집</h3>

      {/* ✅ 모집글 등록 */}
      {!myMentorPost && (
        <div className="flex flex-col gap-3 mb-10">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full text-black"
          />
          <textarea
            placeholder="멘토링 주제나 자기소개를 작성하세요"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border p-2 rounded w-full text-black h-32 resize-none"
          />
          <button
            onClick={handleSubmit}
            className="self-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            모집글 등록
          </button>
        </div>
      )}

      {/* ✅ 내 모집글 */}
      {myMentorPost && (
        <div className="mb-10 border rounded-lg p-4 shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h4 className="text-xl font-bold">내 모집글</h4>
            <button
              onClick={() => deleteMentor(myMentorPost.id)}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 mt-2 md:mt-0"
            >
              삭제
            </button>
          </div>
          <p className="mt-2 font-semibold">{myMentorPost.title}</p>
          <p className="text-gray-400 mt-1">{myMentorPost.description}</p>

          {/* 현재 매칭 */}
          {activeMatch && (
            <div className="mt-5">
              <h5 className="text-green-400 font-bold text-lg">매칭된 멘티 ✅</h5>
              <p>{activeMatch.menteeName || "익명 멘티"}</p>
            </div>
          )}
        </div>
      )}

      {/* ✅ 멘티 목록 (카드형식) */}
      <div>
        <h4 className="text-xl font-bold mb-3">멘티 목록</h4>
        {mentees.length === 0 && <p>등록된 멘티가 없습니다.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentees.map((mentee) => (
            <div
              key={mentee.id}
              className={`rounded-xl shadow-lg p-5 flex flex-col justify-between transition ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div>
                <h5 className="font-bold text-lg mb-1">{mentee.title}</h5>
                <p className="text-gray-400 text-sm mb-3">
                  {mentee.description}
                </p>
              </div>
              <button
                onClick={() => setModal({ type: "request", target: mentee })}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 self-end"
              >
                신청하기
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 모달 */}
      {modal && (
        <MatchModal
          type={modal.type}
          targetName={modal.target.title || "선택된 사용자"}
          darkMode={darkMode}
          onConfirm={() => handleConfirm(modal.type, modal.target)}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}