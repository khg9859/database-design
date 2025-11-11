import { motion, AnimatePresence } from "framer-motion";

export default function MatchModal({ type, targetName, onConfirm, onCancel, darkMode }) {
  const messages = {
    request: `${targetName} 님에게 멘토링 신청을 보내시겠습니까?`,
    accept: `${targetName} 님의 신청을 수락하시겠습니까?`,
    reject: `${targetName} 님의 신청을 거절하시겠습니까?`,
    terminate: `${targetName} 님과의 매칭을 종료하시겠습니까?`,
  };

  const confirmText = {
    request: "신청하기",
    accept: "수락",
    reject: "거절",
    terminate: "종료",
  };

  const colorStyle = {
    request: "bg-blue-600 hover:bg-blue-700",
    accept: "bg-green-600 hover:bg-green-700",
    reject: "bg-gray-500 hover:bg-gray-600",
    terminate: "bg-red-600 hover:bg-red-700",
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={`w-[90%] max-w-md rounded-2xl shadow-2xl p-6 relative text-center ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          {/* 헤더 */}
          <div className="flex flex-col items-center mb-5">
            <div className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 p-3 rounded-full mb-3">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-1">확인</h3>
            <p className="text-sm opacity-80">{messages[type]}</p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onConfirm}
              className={`${colorStyle[type]} text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition transform hover:scale-105 active:scale-95`}
            >
              {confirmText[type]}
            </button>
            <button
              onClick={onCancel}
              className={`px-5 py-2.5 rounded-lg border font-semibold transition transform hover:scale-105 active:scale-95 ${
                darkMode
                  ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              취소
            </button>
          </div>

          {/* 닫기 X 버튼 */}
          <button
            onClick={onCancel}
            className="absolute top-3 right-4 text-xl opacity-60 hover:opacity-100 transition"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}