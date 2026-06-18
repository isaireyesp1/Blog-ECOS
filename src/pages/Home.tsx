import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  getDocs,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
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
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🔥 CARGAR PRIMERA PÁGINA
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
    setLoading(false);
  };

  // 🔥 SIGUIENTE PÁGINA
  const nextPage = async () => {
    if (!lastDoc) return;

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
    setPage((p) => p + 1);
    setLoading(false);
  };

  // 🔙 PÁGINA ANTERIOR (simple reset)
  const prevPage = () => {
    if (page === 1) return;
    loadPosts();
    setPage(1);
  };

  useEffect(() => {
    loadPosts();
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

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-3xl p-8 border">
            <p className="text-gray-500 text-sm">Publicaciones</p>
            <h2 className="text-4xl font-semibold mt-2">
              {posts.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-8 border">
            <p className="text-gray-500 text-sm">Reacciones</p>
            <h2 className="text-4xl font-semibold mt-2">
              {posts.reduce((t, p) => t + (p.likes || 0), 0)}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-8 border">
            <p className="text-gray-500 text-sm">Anonimato</p>
            <h2 className="text-4xl font-semibold mt-2">100%</h2>
          </div>

        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* FEED */}
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
                    {page}
                  </span>

                  <button
                    onClick={nextPage}
                    disabled={posts.length < 10}
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

            {/* POPULAR */}
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

            {/* CATEGORIES */}
            <div className="bg-white rounded-3xl p-6 border">
              <h3 className="text-lg font-semibold mb-4">
                🏷️ Categorías
              </h3>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/categoria/${cat}`}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-black hover:text-white transition"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* QUOTE */}
            <div className="bg-black text-white rounded-3xl p-6">
              <p className="text-sm opacity-80">
                “A veces lo que no dices pesa más que lo que publicas.”
              </p>
            </div>

          </aside>
        </div>
      </section>
    </div>
  );
}