
import { useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import type { Post } from "../types/Post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: "Extraño a alguien que nunca fue mío",
      content:
        "A veces pienso en lo diferente que habría sido todo si hubiera dicho lo que sentía.",
      category: "Amor",
      likes: 245,
      alias: "Anónimo #4832",
    },
    {
      id: 2,
      title: "Hoy aprobé mi examen",
      content:
        "Después de semanas estudiando por fin logré pasarlo. Estoy muy feliz.",
      category: "Escuela",
      likes: 187,
      alias: "Anónimo #1921",
    },
    {
      id: 3,
      title: "Nunca es tarde para comenzar",
      content:
        "Hoy empecé a aprender programación. Espero algún día dedicarme a esto.",
      category: "Historias",
      likes: 321,
      alias: "Anónimo #7568",
    },
  ]);

  const likePost = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const popularPosts = [...posts]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="text-gray-500 text-sm tracking-[0.2em] uppercase">
          Comunidad anónima
        </span>

        <h1 className="text-6xl md:text-7xl font-semibold text-[#1d1d1f] mt-6 leading-tight">
          Comparte tus ideas.
          <br />
          Sin mostrar quién eres.
        </h1>

        <p className="text-xl text-[#6e6e73] mt-8 max-w-3xl mx-auto leading-relaxed">
          Un espacio donde cualquier persona puede publicar
          pensamientos, historias, confesiones y opiniones
          libremente, sin necesidad de registrarse.
        </p>

        <Link
          to="/crear"
          className="
            inline-flex
            items-center
            gap-2
            mt-10
            bg-black
            text-white
            px-8
            py-4
            rounded-full
            text-sm
            font-medium
            hover:opacity-90
            transition
          "
        >
          ✍️ Escribir publicación
        </Link>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[32px] p-8 border border-gray-200">
            <h3 className="text-4xl font-semibold text-[#1d1d1f]">
              {posts.length}
            </h3>

            <p className="text-[#6e6e73] mt-2">
              Publicaciones
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-gray-200">
            <h3 className="text-4xl font-semibold text-[#1d1d1f]">
              {posts.reduce(
                (total, post) => total + post.likes,
                0
              )}
            </h3>

            <p className="text-[#6e6e73] mt-2">
              Reacciones
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-gray-200">
            <h3 className="text-4xl font-semibold text-[#1d1d1f]">
              100%
            </h3>

            <p className="text-[#6e6e73] mt-2">
              Anónimo
            </p>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* PUBLICACIONES */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-semibold text-[#1d1d1f]">
                Recientes
              </h2>

              <span className="text-[#6e6e73]">
                {posts.length} publicaciones
              </span>
            </div>

            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={likePost}
                />
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-200 p-8">
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-6">
                🔥 Populares
              </h3>

              <div className="space-y-5">
                {popularPosts.map((post) => (
                  <div
                    key={post.id}
                    className="pb-5 border-b border-gray-100 last:border-none"
                  >
                    <h4 className="font-medium text-[#1d1d1f]">
                      {post.title}
                    </h4>

                    <p className="text-sm text-[#6e6e73] mt-2">
                      ❤️ {post.likes}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-200 p-8">
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-6">
                🏷️ Categorías
              </h3>

              <div className="flex flex-wrap gap-3">
                {[
                  "Amor",
                  "Historias",
                  "Humor",
                  "Escuela",
                  "Trabajo",
                  "Opiniones",
                  "Confesiones",
                ].map((category) => (
                  <span
                    key={category}
                    className="
                      px-4
                      py-2
                      rounded-full
                      bg-[#f5f5f7]
                      text-sm
                      text-[#1d1d1f]
                    "
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-200 p-8">
              <h3 className="text-2xl font-semibold text-[#1d1d1f]">
                ✨ Frase del día
              </h3>

              <p className="text-[#6e6e73] mt-4 leading-relaxed">
                “Tus palabras tienen valor, incluso cuando nadie
                sabe quién las escribió.”
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

