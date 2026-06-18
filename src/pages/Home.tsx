import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
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
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts(data);
    });

    return () => unsub();
  }, []);

  const filtered = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

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
          sin que nadie te juzgue.
        </h1>

        <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg">
          ECOS es un espacio minimalista donde puedes publicar
          pensamientos, historias y confesiones de forma completamente anónima.
        </p>

        <Link
          to="/crear"
          className="
            inline-flex
            mt-10
            px-8
            py-4
            rounded-full
            bg-black
            text-white
            text-sm
            font-medium
            hover:scale-105
            transition
          "
        >
          ✍️ Escribir publicación
        </Link>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-3xl p-8 border hover:shadow-sm transition">
            <p className="text-gray-500 text-sm">Publicaciones</p>
            <h2 className="text-4xl font-semibold mt-2">
              {posts.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-8 border hover:shadow-sm transition">
            <p className="text-gray-500 text-sm">Reacciones</p>
            <h2 className="text-4xl font-semibold mt-2">
              {posts.reduce((t, p) => t + p.likes, 0)}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-8 border hover:shadow-sm transition">
            <p className="text-gray-500 text-sm">Anonimato</p>
            <h2 className="text-4xl font-semibold mt-2">
              100%
            </h2>
          </div>

        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* FEED */}
          <div className="lg:col-span-2">

            {/* HEADER */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-semibold">
                  {selectedCategory || "Recientes"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {filtered.length} publicaciones
                </p>
              </div>
            </div>

            {/* POSTS */}
            <div className="space-y-6">
              {filtered.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => {}}
                />
              ))}
            </div>
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
                  <div
                    key={post.id}
                    className="border-b pb-3 last:border-none"
                  >
                    <p className="font-medium text-sm">
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
                <button
                  onClick={() => setSelectedCategory("")}
                  className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  Todas
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedCategory(cat)
                    }
                    className={`px-3 py-1 text-sm rounded-full transition ${
                      selectedCategory === cat
                        ? "bg-black text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
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