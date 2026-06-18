import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";

export default function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    if (!title.trim() || !content.trim()) {
      alert("Completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "posts"), {
        title,
        content,
        category,
        likes: 0,
        alias: `Anónimo #${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setContent("");

      navigate("/");
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Error al crear publicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-3xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-semibold text-center text-[#1d1d1f]">
          Crear publicación
        </h1>

        <p className="text-center text-[#6e6e73] mt-4">
          Comparte tus ideas de forma anónima.
        </p>

        <div className="bg-white rounded-[32px] border p-8 mt-10">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            className="w-full text-3xl font-medium outline-none bg-transparent"
          />

          <div className="h-px bg-gray-200 my-6" />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-xl border mb-6"
          >
            <option>General</option>
            <option>Amor</option>
            <option>Historias</option>
            <option>Humor</option>
            <option>Escuela</option>
            <option>Trabajo</option>
            <option>Opiniones</option>
            <option>Confesiones</option>
          </select>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe aquí..."
            className="w-full min-h-[300px] text-lg outline-none resize-none bg-transparent"
          />

          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-black text-white px-8 py-4 rounded-full disabled:opacity-50"
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}