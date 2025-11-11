import { useState } from "react";

export default function NewPostModal({ onClose, onSubmit, darkMode, type, userId }) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    const newPost = {
      id: Date.now(),
      title,
      tag,
      content,
      likes: 0,
      authorId: userId,
    };
    onSubmit(newPost);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`p-6 rounded-xl w-96 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">
          {type === "mentor"
            ? "멘토 모집글 작성"
            : type === "mentee"
            ? "멘티 모집글 작성"
            : "새 게시글 작성"}
        </h3>

        <input
          type="text"
          placeholder="제목을 입력하세요"
          className="w-full border rounded-md p-2 mb-3 text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="태그나 키워드 (예: 근성장, 다이어트)"
          className="w-full border rounded-md p-2 mb-3 text-black"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <textarea
          placeholder="내용을 입력하세요"
          className="w-full border rounded-md p-2 h-32 text-black"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-gray-400 text-white hover:bg-gray-500"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
