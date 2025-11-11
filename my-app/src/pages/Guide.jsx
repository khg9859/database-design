import { useState, useEffect } from "react";
import RoutineTab from "./guide/RoutineTab";
import DietTab from "./guide/DietTab";
import { v4 as uuidv4 } from "uuid"; // npm install uuid

export default function Guide() {
  const [tab, setTab] = useState("routine");
  const [darkMode, setDarkMode] = useState(false);
  const [userId, setUserId] = useState("");

  // 유저 고유 ID 저장
  useEffect(() => {
    let savedId = localStorage.getItem("userId");
    if (!savedId) {
      savedId = uuidv4();
      localStorage.setItem("userId", savedId);
    }
    setUserId(savedId);
  }, []);

  // 다크모드 유지
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">헬스 가이드</h2>
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

      {/* 탭 버튼 */}
      <div className="flex justify-center space-x-6 mb-8">
        <button
          className={`px-4 py-2 rounded-md font-semibold ${
            tab === "routine"
              ? "bg-blue-600 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setTab("routine")}
        >
          운동 루틴 추천
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold ${
            tab === "diet"
              ? "bg-blue-600 text-white"
              : darkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setTab("diet")}
        >
          식단 추천
        </button>
      </div>

      {tab === "routine" ? (
        <RoutineTab darkMode={darkMode} userId={userId} />
      ) : (
        <DietTab darkMode={darkMode} userId={userId} />
      )}
    </div>
  );
}