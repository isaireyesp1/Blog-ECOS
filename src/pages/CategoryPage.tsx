import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";
import PostCard from "../components/PostCard";
import type { Post } from "../types/Post";

const POSTS_PER_PAGE = 10;

export default function CategoryPage() {
  const { category } = useParams();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    setPage(1);

    const formattedCategory =
      category.charAt(0).toUpperCase() + category.slice(1);

    const q = query(
      collection(db, "posts"),
      where("category", "==", formattedCategory)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data: Post[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Post),
      }));

      setPosts(data);
      setLoading(false);
    });

    return () => unsub();
  }, [category]);

  const totalPages = Math.max(
    1,
    Math.ceil(posts.length / POSTS_PER_PAGE)
  );

  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <p className="text-gray-500 animate-pulse">
          Cargando categoría...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* HEADER */}
        <div className="mb-12">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-black transition"
          >
            ← Volver al inicio
          </Link>

          <h1 className="text-5xl font-semibold mt-4 capitalize">
            📂 {category}
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            {posts.length} publicación
            {posts.length !== 1 ? "es" : ""}
            {" "}en esta categoría
          </p>
        </div>

        {/* POSTS */}
        {posts.length === 0 ? (
          <div className="bg-white border rounded-3xl p-12 text-center">
            <h2 className="text-2xl font-semibold mb-3">
              Sin publicaciones
            </h2>

            <p className="text-gray-500">
              Aún no existen publicaciones en esta categoría.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {currentPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => {}}
                />
              ))}
            </div>

            {/* PAGINACIÓN */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() =>
                  setPage((p) => Math.max(1, p - 1))
                }
                disabled={page === 1}
                className="
                  px-5 py-2
                  rounded-full
                  bg-gray-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                ← Anterior
              </button>

              <span className="font-medium">
                Página {page} de {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={page >= totalPages}
                className="
                  px-5 py-2
                  rounded-full
                  bg-black
                  text-white
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}