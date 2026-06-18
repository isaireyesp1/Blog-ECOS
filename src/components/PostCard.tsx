import type { Post } from "../types/Post";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const navigate = useNavigate();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const postRef = doc(db, "posts", post.id);

      await updateDoc(postRef, {
        likes: increment(1),
      });
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  return (
    <div
      onClick={() => navigate(`/post/${post.id}`)}
      className="
        bg-white
        rounded-3xl
        p-6
        shadow
        cursor-pointer
        hover:shadow-md
        transition
      "
    >
      {/* Categoría */}
      <span className="text-violet-600 text-sm">
        {post.category}
      </span>

      {/* Título */}
      <h2 className="font-bold text-xl mt-2">
        {post.title}
      </h2>

      {/* Preview */}
      <p className="text-gray-600 mt-3 line-clamp-3">
        {post.content}
      </p>

      {/* Footer */}
      <div className="flex justify-between mt-5 text-sm text-gray-500">
        <span>{post.alias}</span>

        <button
          onClick={handleLike}
          className="
            flex items-center gap-1
            hover:scale-110
            transition
          "
        >
          ❤️ {post.likes}
        </button>
      </div>
    </div>
  );
}