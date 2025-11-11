import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast"; // ✅ 추가

const MatchContext = createContext();
export const useMatch = () => useContext(MatchContext);

export function MatchProvider({ children }) {
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [matches, setMatches] = useState([]);

  // ✅ 로컬스토리지 로드
  useEffect(() => {
    setMentors(JSON.parse(localStorage.getItem("mentors") || "[]"));
    setMentees(JSON.parse(localStorage.getItem("mentees") || "[]"));
    setMatches(JSON.parse(localStorage.getItem("matches") || "[]"));
  }, []);

  // ✅ 자동 저장
  useEffect(() => {
    localStorage.setItem("mentors", JSON.stringify(mentors));
    localStorage.setItem("mentees", JSON.stringify(mentees));
    localStorage.setItem("matches", JSON.stringify(matches));
  }, [mentors, mentees, matches]);

  // ✅ 글 등록
  const addMentor = (mentor) => {
    if (mentors.some((m) => m.userId === mentor.userId)) {
      toast.error("이미 멘토 모집글이 있습니다.");
      return;
    }
    setMentors([...mentors, mentor]);
    toast.success("멘토 모집글이 등록되었습니다!");
  };

  const addMentee = (mentee) => {
    if (mentees.some((m) => m.userId === mentee.userId)) {
      toast.error("이미 멘티 모집글이 있습니다.");
      return;
    }
    setMentees([...mentees, mentee]);
    toast.success("멘티 모집글이 등록되었습니다!");
  };

  // ✅ 글 삭제
  const deleteMentor = (id) => {
    setMentors(mentors.filter((m) => m.id !== id));
    setMatches(matches.filter((mt) => mt.mentorId !== id));
    toast.success("멘토 모집글이 삭제되었습니다.");
  };

  const deleteMentee = (id) => {
    setMentees(mentees.filter((m) => m.id !== id));
    setMatches(matches.filter((mt) => mt.menteeId !== id));
    toast.success("멘티 모집글이 삭제되었습니다.");
  };

  // ✅ 매칭 요청
  const requestMatch = (mentorId, menteeId, menteeName) => {
    const mentor = mentors.find((m) => m.id === mentorId);
    const mentee = mentees.find((m) => m.id === menteeId);

    if (!mentor || !mentee) {
      toast.error("멘토 또는 멘티 정보를 찾을 수 없습니다.");
      return;
    }

    // 이미 매칭 존재?
    if (matches.some((m) => m.mentorId === mentorId && m.menteeId === menteeId)) {
      toast.error("이미 매칭된 상태입니다.");
      return;
    }

    const newMatch = {
      mentorId,
      menteeId,
      mentorName: mentor.title || "익명 멘토",
      menteeName: mentee.title || menteeName || "익명 멘티",
      status: "active",
    };

    setMatches((prev) => {
      const updated = [...prev, newMatch];
      localStorage.setItem("matches", JSON.stringify(updated)); // 즉시 저장
      return updated;
    });

    toast.success("🎉 매칭이 완료되었습니다!");
  };

  // ✅ 매칭 파기
  const terminateMatch = (mentorId, menteeId) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.mentorId === mentorId && m.menteeId === menteeId
          ? { ...m, status: "terminated" }
          : m
      )
    );
    toast("매칭이 종료되었습니다.", {
      icon: "⚠️",
      style: { background: "#555", color: "#fff" },
    });
  };

  return (
    <MatchContext.Provider
      value={{
        mentors,
        mentees,
        matches,
        addMentor,
        addMentee,
        deleteMentor,
        deleteMentee,
        requestMatch,
        terminateMatch,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
}