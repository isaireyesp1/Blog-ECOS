import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";

import { db } from "../firebase";
import PostCard from "../components/PostCard";
import type { Post } from "../types/Post";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [lastDoc, setLastDoc] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [isRealtime, setIsRealtime] = useState(true);

  // 🔥 PRIMERA PÁGINA (TIEMPO REAL)
  const loadFirstPage = () => {
    setLoading(true);

    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

   const unsub = onSnapshot(q, (snapshot) => {
  const data: Post[] = snapshot.docs.map((doc) => {
    const d = doc.data();

    return {
      id: doc.id,
      title: d.title ?? "",
      content: d.content ?? "",
      category: d.category ?? "",
      likes: d.likes ?? 0,
      alias: d.alias ?? "",
      createdAt: d.createdAt ?? null,
    };
  });


      setPosts(data);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setLoading(false);
      setIsRealtime(true);
      setPage(1);
    });

    return unsub;
  };

  // 🔥 SIGUIENTE PÁGINA (SIN TIEMPO REAL)
  const nextPage = async () => {
    if (!lastDoc) return;

    setLoading(true);
    setIsRealtime(false);

    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(10)
    );

    const snap = await getDocs(q);

    const data: Post[] = snap.docs.map((doc) => {
  const d = doc.data();

  return {
    id: doc.id,
    title: d.title ?? "",
    content: d.content ?? "",
    category: d.category ?? "",
    likes: d.likes ?? 0,
    alias: d.alias ?? "",
    createdAt: d.createdAt ?? null,
  };
});
    setPosts(data);
    setLastDoc(snap.docs[snap.docs.length - 1] || null);
    setPage((p) => p + 1);
    setLoading(false);
  };

  // 🔙 ANTERIOR (regresa a tiempo real primera página)
  const prevPage = () => {
    if (page === 1) return;
    setPage(1);
    setLastDoc(null);
    loadFirstPage();
  };

  useEffect(() => {
    const unsub = loadFirstPage();
    return () => unsub && unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-semibold mb-12">
          Publicaciones
        </h1>

        {loading ? (
          <p className="text-gray-500">Cargando...</p>
        ) : (
          <>
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

            {/* PAGINACIÓN */}
            <div className="flex justify-center gap-4 mt-10">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className="px-4 py-2 rounded-full bg-gray-200 disabled:opacity-50"
              >
                Anterior
              </button>

              <span className="px-4 py-2">
                Página {page}
              </span>

              <button
                onClick={nextPage}
                disabled={posts.length < 10}
                className="px-4 py-2 rounded-full bg-black text-white disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>

            {isRealtime && (
              <p className="text-center text-xs text-gray-400 mt-4">
                🔴 Actualización en tiempo real activa (página 1)
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}