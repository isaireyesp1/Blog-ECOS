import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import PostCard from "../components/PostCard";
import type { Post } from "../types/Post";

export default function Popular() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("likes", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Cargando populares...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#1d1d1f]">
            🔥 Populares
          </h1>

          <p className="mt-4 text-[#6e6e73] text-lg">
            Publicaciones con más reacciones de la comunidad.
          </p>
        </div>

        {/* LISTA */}
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
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}