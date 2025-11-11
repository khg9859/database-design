import { useState } from "react";
import { useMatch } from "./MatchContext";
import { v4 as uuidv4 } from "uuid";
import MatchModal from "./MatchModal";

export default function MenteeRecruitTab({ userId, darkMode }) {
  const {
    mentees,
    mentors,
    matches,
    addMentee,
    deleteMentee,
    requestMatch,
    acceptMatch,
    terminateMatch,
  } = useMatch();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState(""); // Testing
  const [modal, setModal] = useState(null);

  // 내 모집글
  const myMenteePost = mentees.find((m) => m.userId === userId);

  // 현재 매칭 상태
  const activeMatch = matches.find(
    (m) => myMenteePost && m.menteeId === myMenteePost.id && m.status === "active"
  );
  const pendingList = matches.filter(
    (m) => myMenteePost && m.menteeId === myMenteePost.id && m.status === "pending"
  );

  // 글 등록
  const handleSubmit = () => {
    if (myMenteePost) return alert("이미 등록된 모집글이 있습니다.");
    addMentee({
      id: uuidv4(),
      userId,
      title,
      description: desc,
    });
    setTitle("");
    setDesc("");
  };

  // 모달 확인 동작
  const handleConfirm = (type, target) => {
    if (!myMenteePost) return;
    if (type === "accept") acceptMatch(target.mentorId, myMenteePost.id);
    if (type === "reject") terminateMatch(target.mentorId, myMenteePost.id);
    if (type === "terminate") terminateMatch(target.mentorId, myMenteePost.id);
    if (type === "request") requestMatch(target.id, myMenteePost.id, "익명 멘티");
    setModal(null);
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-xl transition-colors duration-300 max-w-6xl mx-auto ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h3 className="text-2xl font-bold text-center mb-6">멘토링 신청 (멘티용)</h3>

      {/* ✅ 모집글 등록 */}
      {!myMenteePost && (
        <div className="flex flex-col gap-3 mb-10">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`border p-2 rounded w-full ${
              darkMode ? "text-black bg-gray-100" : "text-black"
            }`}
          />
          <textarea
            placeholder="멘토에게 전달하고 싶은 내용이나 목표를 적어보세요"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className={`border p-2 rounded w-full h-32 resize-none ${
              darkMode ? "text-black bg-gray-100" : "text-black"
            }`}
          />
          <button
            onClick={handleSubmit}
            className="self-center bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            모집글 등록
          </button>
        </div>
      )}

      {/* ✅ 내 모집글 */}
      {myMenteePost && (
        <div className="mb-10 border rounded-lg p-4 shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h4 className="text-xl font-bold">내 모집글</h4>
            <button
              onClick={() => deleteMentee(myMenteePost.id)}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 mt-2 md:mt-0"
            >
              삭제
            </button>
          </div>
          <p className="mt-2 font-semibold">{myMenteePost.title}</p>
          <p className="text-gray-400 mt-1">{myMenteePost.description}</p>

          {/* 대기중 멘토 */}
          {pendingList.length > 0 && (
            <div className="mt-4">
              <h5 className="font-bold mb-2 text-lg">신청 대기중 멘토</h5>
              <div className="space-y-2">
                {pendingList.map((mentor) => (
                  <div
                    key={mentor.mentorId}
                    className="flex justify-between border p-2 rounded-md"
                  >
                    <span>{mentor.mentorName}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal({ type: "accept", target: mentor })}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        수락
                      </button>
                      <button
                        onClick={() => setModal({ type: "reject", target: mentor })}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 현재 매칭 */}
          {activeMatch && (
            <div className="mt-5">
              <h5 className="text-green-400 font-bold text-lg">매칭된 멘토 ✅</h5>
              <p>{activeMatch.mentorName}</p>
              <button
                onClick={() => setModal({ type: "terminate", target: activeMatch })}
                className="bg-red-600 text-white px-3 py-1 rounded mt-3 hover:bg-red-700"
              >
                매칭 파기
              </button>
            </div>
          )}
        </div>
      )}

      {/* ✅ 멘토 목록 (프로필 카드 형식) */}
      <div>
        <h4 className="text-xl font-bold mb-3">멘토 목록</h4>
        {mentors.length === 0 && <p>등록된 멘토가 없습니다.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className={`rounded-xl shadow-lg p-5 flex flex-col justify-between transition ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div>
                <h5 className="font-bold text-lg mb-1">{mentor.title}</h5>
                <p className="text-gray-400 text-sm mb-3">{mentor.description}</p>
              </div>
              <button
                onClick={() => setModal({ type: "request", target: mentor })}
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
          targetName={
            modal.target.mentorName ||
            modal.target.title ||
            "선택된 사용자"
          }
          darkMode={darkMode}
          onConfirm={() => handleConfirm(modal.type, modal.target)}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}