export default function PostCard({ post, onLike, onDelete, darkMode, userId }) {
  const isOwner = post.authorId === userId;

  return (
    <div
      className={`p-6 rounded-lg shadow transition ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-white text-gray-900 border border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold">{post.title}</h3>
        <span
          className={`text-sm px-2 py-1 rounded-md ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          #{post.tag || "태그없음"}
        </span>
      </div>

      <p className="mb-4">{post.content}</p>

      <div className="flex justify-between items-center">
        <button
          onClick={onLike}
          className="bg-pink-500 text-white px-4 py-1 rounded-md hover:bg-pink-600 transition"
        >
          ❤️ {post.likes}
        </button>

        {isOwner && (
          <button
            onClick={() => {
              if (window.confirm("정말 이 글을 삭제하시겠습니까?"))
                onDelete(post.id);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
          >
            🗑 삭제
          </button>
        )}
      </div>
    </div>
  );
}