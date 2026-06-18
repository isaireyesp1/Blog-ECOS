import type { Post } from "../types/Post";

interface Props {
  post: Post;
  onLike: (id: number) => void;
}

export default function PostCard({
  post,
  onLike,
}: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow">
      <span className="text-violet-600 text-sm">
        {post.category}
      </span>

      <h2 className="font-bold text-xl mt-2">
        {post.title}
      </h2>

      <p className="text-gray-600 mt-3">
        {post.content}
      </p>

      <div className="flex justify-between mt-5">
        <span>{post.alias}</span>

        <button
          onClick={() => onLike(post.id)}
          className="hover:scale-110 transition"
        >
          ❤️ {post.likes}
        </button>
      </div>
    </div>
  );
}