import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import NewPostModal from "./NewPostModal";

export default function RoutineTab({ darkMode, userId }) {
  // ✅ 게시글 저장 (새로고침 유지)
  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("routinePosts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ✅ 좋아요 누른 글 ID 배열 (계정별 1회 제한용)
  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("routineLikedPosts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);

  // ✅ 게시글 및 좋아요 상태 저장
  useEffect(() => {
    localStorage.setItem("routinePosts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("routineLikedPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  // ❤️ 좋아요 1회만 가능
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

  // 🗑 글 삭제
  const handleDelete = (id) => {
    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);

    // 혹시 좋아요 기록에 남아있다면 같이 제거
    setLikedPosts(likedPosts.filter((likedId) => likedId !== id));
  };

  // 📝 새 글 추가
  const handleAddPost = (newPost) => {
    setPosts([{ ...newPost, id: Date.now() }, ...posts]);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600"
        >
          새 루틴 작성
        </button>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {posts
          .sort((a, b) => b.likes - a.likes)
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

      {showModal && (
        <NewPostModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddPost}
          darkMode={darkMode}
          type="routine"
          userId={userId}
        />
      )}
    </div>
  );
}