import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  db,
  auth,
  googleProvider,
} from "../firebase";

import type { Post } from "../types/Post";

export default function Admin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const POSTS_PER_PAGE = 10;
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // 🔥 CAMBIA ESTE CORREO POR EL TUYO
  const ADMIN_EMAIL = "isaireyes2003@gmail.com";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) return;

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
  }, [user]);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

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




  const totalPages = Math.ceil(
  filteredPosts.length / POSTS_PER_PAGE
);

const startIndex = (page - 1) * POSTS_PER_PAGE;

const paginatedPosts = filteredPosts.slice(
  startIndex,
  startIndex + POSTS_PER_PAGE
);
  // 🔥 CARGANDO AUTH
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Verificando acceso...
      </div>
    );
  }

  // 🔥 NO LOGUEADO
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="bg-white p-10 rounded-3xl border text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">
            🔒 Panel Admin
          </h1>

          <p className="text-gray-500 mb-6">
            Inicia sesión para continuar.
          </p>

          <button
            onClick={login}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Iniciar con Google
          </button>
        </div>
      </div>
    );
  }

  // 🔥 NO ES ADMIN
  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="bg-white p-10 rounded-3xl border text-center">
          <h1 className="text-3xl font-bold">
            ⛔ Acceso denegado
          </h1>

          <p className="mt-4 text-gray-500">
            Tu cuenta no tiene permisos.
          </p>

          <button
            onClick={logout}
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-[#f5f5f7]">
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">

        <div>
          <p className="uppercase tracking-[0.25em] text-xs text-gray-400 mb-3">
            ECOS ADMIN
          </p>

          <h1 className="text-6xl font-semibold tracking-tight text-[#1d1d1f]">
            Panel de control
          </h1>

          <p className="text-gray-500 mt-4 text-lg">
            Gestiona publicaciones, monitorea actividad y modera contenido.
          </p>
        </div>

        <button
          onClick={logout}
          className="
            px-6
            py-3
            rounded-full
            bg-black
            text-white
            text-sm
            font-medium
            hover:scale-105
            transition
          "
        >
          Cerrar sesión
        </button>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">

        <div
          className="
            bg-white/80
            backdrop-blur-xl
            rounded-[32px]
            p-8
            shadow-sm
          "
        >
          <p className="text-gray-500 text-sm">
            Publicaciones
          </p>

          <h2 className="text-5xl font-semibold mt-3">
            {posts.length}
          </h2>
        </div>

        <div
          className="
            bg-white/80
            backdrop-blur-xl
            rounded-[32px]
            p-8
            shadow-sm
          "
        >
          <p className="text-gray-500 text-sm">
            Likes Totales
          </p>

          <h2 className="text-5xl font-semibold mt-3">
            {posts.reduce(
              (acc, p) => acc + (p.likes || 0),
              0
            )}
          </h2>
        </div>

        <div
          className="
            bg-white/80
            backdrop-blur-xl
            rounded-[32px]
            p-8
            shadow-sm
          "
        >
          <p className="text-gray-500 text-sm">
            Resultados
          </p>

          <h2 className="text-5xl font-semibold mt-3">
            {filteredPosts.length}
          </h2>
        </div>

      </div>

      {/* SEARCH */}
      <div className="mb-10">

        <input
          type="text"
          placeholder="Buscar publicación..."
          value={search}
          onChange={(e) => {
  setSearch(e.target.value);
  setPage(1);
}}
          className="
            w-full
            bg-white
            rounded-full
            px-7
            py-5
            text-lg
            shadow-sm
            outline-none
          "
        />

      </div>

      {/* POSTS */}
      <div className="space-y-4">

      {paginatedPosts.map((post) => (
          <div
            key={post.id}
            className="
              bg-white/90
              backdrop-blur-xl
              rounded-[28px]
              p-6
              shadow-sm
              hover:shadow-lg
              transition-all
            "
          >
            <div className="flex items-start justify-between gap-6">

              <div className="flex-1">

                <div className="flex items-center gap-3 mb-3">

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-gray-100
                      text-xs
                      font-medium
                    "
                  >
                    {post.category}
                  </span>

                  <span className="text-sm text-gray-500">
                    ❤️ {post.likes || 0}
                  </span>

                </div>

                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {post.alias}
                </p>

                <p className="mt-4 text-gray-600 line-clamp-2">
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
                  shrink-0
                  w-10
                  h-10
                  rounded-full
                  bg-red-50
                  hover:bg-red-500
                  hover:text-white
                  text-red-500
                  flex
                  items-center
                  justify-center
                  transition
                "
              >
                🗑️
              </button>

            </div>
          </div>
        ))}

      </div>



<div className="flex items-center justify-center gap-4 mt-10">

  <button
    onClick={() => setPage((p) => p - 1)}
    disabled={page === 1}
    className="
      px-5
      py-2
      rounded-full
      bg-white
      shadow-sm
      disabled:opacity-40
      disabled:cursor-not-allowed
    "
  >
    ← Anterior
  </button>

  <div className="px-4 py-2 text-sm text-gray-500">
    Página {page} de {Math.max(totalPages, 1)}
  </div>

  <button
    onClick={() => setPage((p) => p + 1)}
    disabled={page >= totalPages}
    className="
      px-5
      py-2
      rounded-full
      bg-black
      text-white
      disabled:opacity-40
      disabled:cursor-not-allowed
    "
  >
    Siguiente →
  </button>

</div>


    </div>
  </div>
);
}