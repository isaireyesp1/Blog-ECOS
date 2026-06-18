import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";
import type { Post } from "../types/Post";

export default function Admin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Post[];

      setPosts(data);
    });

    return () => unsub();
  }, []);

  const deletePost = async (
    id: string,
    title: string
  ) => {
    const ok = confirm(
      `¿Eliminar la publicación "${title}"?`
    );

    if (!ok) return;

    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      post.content
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-[#1d1d1f]">
            🛡️ Panel de Administración
          </h1>

          <p className="text-gray-500 mt-3">
            Gestiona todas las publicaciones de ECOS.
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-gray-500">
              Publicaciones
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {posts.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-gray-500">
              Likes Totales
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {posts.reduce(
                (acc, p) => acc + (p.likes || 0),
                0
              )}
            </h2>
          </div>

          <div className="bg-white rounded-3xl border p-6">
            <p className="text-gray-500">
              Resultados
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {filteredPosts.length}
            </h2>
          </div>

        </div>

        {/* BUSCADOR */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar publicación..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              bg-white
              border
              rounded-2xl
              px-5
              py-4
              outline-none
            "
          />
        </div>

        {/* POSTS */}
        <div className="space-y-4">

          {filteredPosts.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border text-center">
              No se encontraron publicaciones.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="
                  bg-white
                  border
                  rounded-3xl
                  p-6
                  shadow-sm
                "
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">

                  <div className="flex-1">

                    <div className="flex gap-3 items-center mb-3">

                      <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                        {post.category}
                      </span>

                      <span className="text-sm text-gray-500">
                        ❤️ {post.likes || 0}
                      </span>

                    </div>

                    <h2 className="text-2xl font-semibold">
                      {post.title}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      {post.alias}
                    </p>

                    <p className="mt-4 text-gray-700 line-clamp-3">
                      {post.content}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      deletePost(
                        String(post.id),
                        post.title
                      )
                    }
                    className="
                      h-fit
                      bg-red-500
                      hover:bg-red-600
                      text-white
                      px-6
                      py-3
                      rounded-xl
                      font-medium
                      transition
                    "
                  >
                    🗑 Eliminar
                  </button>

                </div>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}