import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import MentorRecruitTab from "./MentorRecruitTab";
import MenteeRecruitTab from "./MenteeRecruitTab";
import { useMatch } from "./MatchContext"; // ✅ Context 가져오기
import mentorImg from "../../assets/mentoring/mentor.png";
import menteeImg from "../../assets/mentoring/mentee.png";

export default function Mentoring() {
  const [tab, setTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(false);
  const [userId, setUserId] = useState("");
  const { matches } = useMatch(); // ✅ 매칭 상태 감시

  useEffect(() => {
    let savedId = localStorage.getItem("userId");
    if (!savedId) {
      savedId = uuidv4();
      localStorage.setItem("userId", savedId);
    }
    setUserId(savedId);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // ✅ matches 변경 시 profile 탭 자동 업데이트
  useEffect(() => {
  if (tab === "profile") {
    setTab("profile");
  }
}, [matches, tab]); // tab 추가


  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">멘토링 신청</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {darkMode ? "🌙 다크모드 ON" : "☀️ 다크모드 OFF"}
        </button>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex justify-center space-x-6 mb-8">
        <TabButton tab={tab} setTab={setTab} current="profile" text="내 멘토/멘티" darkMode={darkMode} />
        <TabButton tab={tab} setTab={setTab} current="mentor" text="멘토 모집" darkMode={darkMode} />
        <TabButton tab={tab} setTab={setTab} current="mentee" text="멘티 모집" darkMode={darkMode} />
      </div>

      {/* 탭 내용 */}
      <AnimatePresence mode="wait">
        {tab === "profile" && <MentorMenteeProfile key="profile" darkMode={darkMode} userId={userId} />}
        {tab === "mentor" && <MentorRecruitTab key="mentor" darkMode={darkMode} userId={userId} />}
        {tab === "mentee" && <MenteeRecruitTab key="mentee" darkMode={darkMode} userId={userId} />}
      </AnimatePresence>
    </div>
  );
}

// ✅ 탭 버튼 컴포넌트
function TabButton({ tab, setTab, current, text, darkMode }) {
  const active = tab === current;
  return (
    <button
      onClick={() => setTab(current)}
      className={`px-4 py-2 rounded-md font-semibold ${
        active
          ? "bg-blue-600 text-white"
          : darkMode
          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {text}
    </button>
  );
}

// ✅ 프로필 카드 섹션
function MentorMenteeProfile({ darkMode, userId }) {
  const { mentors, mentees, matches } = useMatch();
  const [modalData, setModalData] = useState(null);

  // 내 글 찾기
  const myMentorPost = mentors.find((m) => m.userId === userId);
  const myMenteePost = mentees.find((m) => m.userId === userId);

  // 매칭 관계
  const myMentorMatch = matches.find(
    (m) => myMenteePost && m.menteeId === myMenteePost.id && m.status === "active"
  );
  const myMenteeMatch = matches.find(
    (m) => myMentorPost && m.mentorId === myMentorPost.id && m.status === "active"
  );

  // 멘토 정보
  const mentorData = myMentorMatch
    ? {
        name: myMentorMatch.mentorName,
        career: "한성헬스장 전임 트레이너 (5년차)",
        specialty: "근비대 및 체형 교정 전문",
        contact: "mentor@hsu.ac.kr",
        image: mentorImg,
      }
    : {
        name: "매칭된 멘토 없음",
        career: "-",
        specialty: "-",
        contact: "-",
        image: mentorImg,
      };

  // 멘티 정보
  const menteeData = myMenteeMatch
    ? {
        name: myMenteeMatch.menteeName,
        goal: "체지방 감량 및 식단관리 배우기",
        interest: "PT 입문 / 식단 루틴 설계",
        contact: "mentee@hsu.ac.kr",
        image: menteeImg,
      }
    : {
        name: "매칭된 멘티 없음",
        goal: "-",
        interest: "-",
        contact: "-",
        image: menteeImg,
      };

  return (
    <>
      <motion.div
        className="flex flex-col md:flex-row justify-center gap-8 mt-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileCard
          title="나의 멘토"
          data={mentorData}
          onView={() => setModalData(mentorData)}
          darkMode={darkMode}
        />
        <ProfileCard
          title="나의 멘티"
          data={menteeData}
          onView={() => setModalData(menteeData)}
          darkMode={darkMode}
        />
      </motion.div>

      {/* 모달 */}
      <AnimatePresence>
        {modalData && (
          <ProfileModal data={modalData} onClose={() => setModalData(null)} darkMode={darkMode} />
        )}
      </AnimatePresence>
    </>
  );
}

// ✅ 개별 프로필 카드
function ProfileCard({ title, data, onView, darkMode }) {
  return (
    <motion.div
      onClick={onView}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`w-full md:w-1/3 cursor-pointer rounded-lg overflow-hidden shadow-xl transition ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <img src={data.image} alt={title} className="w-full h-64 object-cover" />
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-1">{title}</h3>
        <p className="text-gray-400 mb-3">{data.name}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView();
          }}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {title} 프로필 보기
        </button>
      </div>
    </motion.div>
  );
}

// ✅ 모달창
function ProfileModal({ data, onClose, darkMode }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`w-96 rounded-lg shadow-2xl p-6 relative ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-2xl font-bold hover:text-red-500"
          >
            ✖
          </button>
          <img
            src={data.image}
            alt={data.name}
            className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-blue-500"
          />
          <h3 className="text-2xl font-bold text-center mb-3">{data.name}</h3>
          <div className="text-sm space-y-2">
            {data.career && <p><strong>경력:</strong> {data.career}</p>}
            {data.specialty && <p><strong>전문 분야:</strong> {data.specialty}</p>}
            {data.goal && <p><strong>목표:</strong> {data.goal}</p>}
            {data.interest && <p><strong>관심:</strong> {data.interest}</p>}
            <p><strong>연락처:</strong> {data.contact}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}