import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Post } from "../types/Post";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      try {
        const ref = doc(db, "posts", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setPost({
            id: snap.id,
            ...snap.data(),
          } as Post);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

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

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-10 text-sm text-[#6e6e73] hover:text-black transition"
        >
          ← Volver
        </button>

        {/* CARD */}
        <div className="bg-white rounded-[32px] shadow-lg border border-gray-200 p-10">

          {/* CATEGORY */}
          <span className="inline-block px-4 py-1 text-sm rounded-full bg-[#f5f5f7] text-[#1d1d1f]">
            {post.category}
          </span>

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] mt-6 leading-tight">
            {post.title}
          </h1>

          {/* META */}
          <div className="flex items-center justify-between mt-6 text-sm text-[#6e6e73]">
            <span>{post.alias}</span>
            <span>❤️ {post.likes} likes</span>
          </div>

          {/* DIVIDER */}
          <div className="h-px bg-gray-200 my-8"></div>

          {/* CONTENT */}
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

            <button className="px-6 py-3 rounded-full bg-black text-white text-sm hover:opacity-90 transition">
              ❤️ Me gusta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}