import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import NewPostModal from "./NewPostModal";

export default function DietTab({ darkMode, userId }) {
  // ✅ localStorage에서 식단 게시글 로드 (초기 1회)
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("dietPosts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ✅ 좋아요 누른 게시글 ID 저장 (계정별 1회 제한)
  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("dietLikedPosts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);

  // ✅ 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("dietPosts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("dietLikedPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  // ❤️ 좋아요 기능 (1회 제한)
  const handleLike = (id) => {
    if (likedPosts.includes(id)) {
      alert("이미 좋아요를 누른 게시글입니다 👍");
      return;
    }

    const updated = posts.map((p) =>
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    );
    setPosts(updated);
    setLikedPosts([...likedPosts, id]);
  };

  // 🗑 게시글 삭제 기능 (작성자만 가능)
  const handleDelete = (id) => {
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);

    // 해당 글이 좋아요 기록에도 있으면 제거
    setLikedPosts(likedPosts.filter((likedId) => likedId !== id));
  };

  // ✍️ 새 글 작성
  const handleAddPost = (newPost) => {
    setPosts([{ ...newPost, id: Date.now() }, ...posts]);
  };

  return (
    <div>
      {/* 상단 새 글 작성 버튼 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
        >
          새 식단 작성
        </button>
      </div>

      {/* 게시글 카드 목록 */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {posts
          .sort((a, b) => b.likes - a.likes) // 좋아요 순 정렬
          .map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onLike={() => handleLike(p.id)}
              onDelete={handleDelete}
              darkMode={darkMode}
              userId={userId}
            />
          ))}
      </div>

      {/* 새 글 작성 모달 */}
      {showModal && (
        <NewPostModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddPost}
          darkMode={darkMode}
          type="diet"
          userId={userId}
        />
      )}
    </div>
  );
}