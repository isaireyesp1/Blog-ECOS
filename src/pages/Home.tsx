import { useState } from "react";
import Hero from "../components/Hero";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import type { Post } from "../types/Post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "Mi primera confesión",
      content: "Hoy tuve un gran día.",
      category: "Confesión",
      likes: 15,
      alias: "Anónimo #1234",
    },
  ]);

  const createPost = (post: Post) => {
    setPosts([post, ...posts]);
  };

  const likePost = (id: number) => {
    setPosts(
      posts.map((p) =>
        p.id === id
          ? { ...p, likes: p.likes + 1 }
          : p
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Hero />

      <CreatePostModal onCreate={createPost} />

      <div className="grid gap-6 mt-10">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={likePost}
          />
        ))}
      </div>
    </div>
  );
}