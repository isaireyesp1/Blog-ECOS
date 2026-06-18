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
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-bold">
              🛡️ Panel de Administración
            </h1>

            <p className="text-gray-500 mt-3">
              Gestiona todas las publicaciones.
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-black text-white px-5 py-3 rounded-xl"
          >
            Cerrar sesión
          </button>
        </div>

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

        <div className="space-y-4">

          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border rounded-3xl p-6"
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

                  <p className="mt-4 text-gray-700">
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
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    px-6
                    py-3
                    rounded-xl
                  "
                >
                  🗑 Eliminar
                </button>

              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}