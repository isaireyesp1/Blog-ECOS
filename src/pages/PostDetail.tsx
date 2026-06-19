import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  onSnapshot,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "../firebase";
import type { Post } from "../types/Post";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    if (!id) return;

    const ref = doc(db, "posts", id);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();

          setPost({
            id: snap.id,
            title: data.title,
            content: data.content,
            category: data.category,
            likes: data.likes || 0,
            alias: data.alias,
            createdAt: data.createdAt,
          } as Post);
        } else {
          setPost(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [id]);

  const handleLike = async () => {
    if (!id || liking) return;

    try {
      setLiking(true);

      await updateDoc(doc(db, "posts", id), {
        likes: increment(1),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-[#6e6e73] animate-pulse">
          Cargando publicación...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#1d1d1f]">
            Publicación no encontrada
          </h2>

          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-black text-white rounded-full"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-3xl mx-auto px-6 py-20">

        {/* BOTÓN VOLVER */}
        <button
          onClick={() => navigate(-1)}
          className="mb-10 text-sm text-[#6e6e73] hover:text-black transition"
        >
          ← Volver
        </button>

        {/* CARD */}
        <div className="bg-white rounded-[32px] shadow-lg border border-gray-200 p-10">

          {/* CATEGORÍA */}
          <span className="inline-block px-4 py-1 text-sm rounded-full bg-[#f5f5f7] text-[#1d1d1f]">
            {post.category}
          </span>

          {/* TÍTULO */}
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mt-6 leading-tight">
            {post.title}
          </h1>

          {/* META */}
          <div className="flex items-center justify-between mt-6 text-sm text-[#6e6e73]">
            <span>{post.alias}</span>

            <span className="font-medium">
              ❤️ {post.likes} likes
            </span>
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-gray-200 my-8"></div>

          {/* CONTENIDO */}
          <div className="text-lg leading-relaxed text-[#1d1d1f] whitespace-pre-line">
            {post.content}
          </div>

          {/* FOOTER */}
          <div className="mt-10 flex justify-between items-center">

            <button
              onClick={() => navigate(-1)}
              className="text-sm text-[#6e6e73] hover:text-black transition"
            >
              ← Regresar
            </button>

            <button
              onClick={handleLike}
              disabled={liking}
              className="
                px-6
                py-3
                rounded-full
                bg-black
                text-white
                text-sm
                hover:opacity-90
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              ❤️ Me gusta ({post.likes})
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}