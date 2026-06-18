import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import PostCard from "../components/PostCard";
import type { Post } from "../types/Post";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Post),
        }));

        setPosts(data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const likePost = () => {
    // aquí luego conectas updateDoc
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Cargando publicaciones...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-semibold mb-12">
          Publicaciones
        </h1>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-gray-500">
              No hay publicaciones aún.
            </p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={likePost}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}