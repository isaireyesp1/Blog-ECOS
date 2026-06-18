import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";
import PostCard from "../components/PostCard";
import type { Post } from "../types/Post";

const categories = [
  "Amor",
  "Historias",
  "Humor",
  "Escuela",
  "Trabajo",
  "Opiniones",
  "Confesiones",
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [unsubs, setUnsubs] = useState<(() => void)[]>([]);

  // 🔥 REALTIME LIKES SOLO PARA POSTS VISIBLES
  const attachLikesListeners = (list: Post[]) => {
    // limpiar anteriores
    unsubs.forEach((u) => u?.());

    const newUnsubs: (() => void)[] = [];

    list.forEach((post) => {
      const ref = doc(db, "posts", post.id);

      const unsub = onSnapshot(ref, (snap) => {
        if (!snap.exists()) return;

        const likes = snap.data().likes;

        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id ? { ...p, likes } : p
          )
        );
      });

      newUnsubs.push(unsub);
    });

    setUnsubs(newUnsubs);
  };

  // 🔥 PRIMERA PÁGINA
  const loadPosts = async () => {
    setLoading(true);

    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const snap = await getDocs(q);

    const data: Post[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Post),
    }));

    setPosts(data);
    setLastDoc(snap.docs[snap.docs.length - 1] || null);
    setHasMore(snap.docs.length === 10);
    setPage(1);

    attachLikesListeners(data);

    setLoading(false);
  };

  // 🔥 SIGUIENTE PÁGINA
  const nextPage = async () => {
    if (!lastDoc || !hasMore) return;

    setLoading(true);

    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(10)
    );

    const snap = await getDocs(q);

    const data: Post[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Post),
    }));

    setPosts(data);
    setLastDoc(snap.docs[snap.docs.length - 1] || null);
    setHasMore(snap.docs.length === 10);

    setPage((p) => p + 1);

    attachLikesListeners(data);

    setLoading(false);
  };

  // 🔙 RESET
  const reset = () => loadPosts();

  useEffect(() => {
    loadPosts();

    return () => {
      unsubs.forEach((u) => u?.());
    };
  }, []);

  const topPosts = [...posts]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <span className="text-xs tracking-[0.3em] uppercase text-gray-500">
          Comunidad anónima
        </span>

        <h1 className="text-5xl md:text-7xl font-semibold mt-6 leading-tight">
          Expresa lo que piensas,
          <br />
          sin ser juzgado.
        </h1>

        <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg">
          ECOS es un espacio donde puedes compartir ideas,
          pensamientos y confesiones de forma totalmente anónima.
        </p>

        <Link
          to="/crear"
          className="inline-flex mt-10 px-8 py-4 rounded-full bg-black text-white text-sm font-medium hover:scale-105 transition"
        >
          ✍️ Escribir publicación
        </Link>
      </section>

      {/* FEED */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2">

            <div className="mb-8">
              <h2 className="text-3xl font-semibold">
                Recientes
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Página {page}
              </p>
            </div>

            {loading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : (
              <>
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={() => {}}
                    />
                  ))}
                </div>

                <div className="flex justify-center gap-4 mt-10">
                  <button
                    onClick={reset}
                    className="px-4 py-2 rounded-full bg-gray-200"
                  >
                    Regresar
                  </button>

                  <span className="px-4 py-2">{page}</span>

                  <button
                    onClick={nextPage}
                    disabled={!hasMore || loading}
                    className="px-4 py-2 rounded-full bg-black text-white disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">

            <div className="bg-white rounded-3xl p-6 border">
              <h3 className="text-lg font-semibold mb-4">
                🔥 Tendencia
              </h3>

              <div className="space-y-4">
                {topPosts.map((post) => (
                  <div key={post.id} className="pb-3 border-b last:border-none">
                    <p className="font-medium text-sm line-clamp-1">
                      {post.title}
                    </p>
                    <span className="text-xs text-gray-500">
                      ❤️ {post.likes}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border">
              <h3 className="text-lg font-semibold mb-4">
                🏷️ Categorías
              </h3>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/categoria/${cat.toLowerCase()}`}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-black hover:text-white transition"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </section>
    </div>
  );
}