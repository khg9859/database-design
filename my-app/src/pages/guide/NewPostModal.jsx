import { useState } from "react";

export default function NewPostModal({ onClose, onSubmit, darkMode, type, userId }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, tag, likes: 0, authorId: userId });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        } p-8 rounded-xl shadow-lg w-96`}
      >
        <h3 className="text-2xl font-bold mb-4">
          {type === "routine" ? "새 루틴 작성" : "새 식단 작성"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`w-full p-2 rounded border outline-none ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                : "bg-white text-black border-gray-300"
            }`}
          />
          <input
            type="text"
            placeholder="태그 (예: 다이어트, 벌크업)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className={`w-full p-2 rounded border outline-none ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                : "bg-white text-black border-gray-300"
            }`}
          />
          <textarea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className={`w-full p-2 h-24 rounded border resize-none outline-none ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                : "bg-white text-black border-gray-300"
            }`}
          ></textarea>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                darkMode
                  ? "bg-gray-600 hover:bg-gray-500 text-white"
                  : "bg-gray-400 hover:bg-gray-500 text-white"
              }`}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}