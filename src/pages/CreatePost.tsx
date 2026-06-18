import { useState } from "react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    alert("Publicación creada");

    console.log({
      title,
      content,
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-semibold text-[#1d1d1f]">
            Crear publicación
          </h1>

          <p className="text-[#6e6e73] mt-4">
            Comparte tus ideas de forma anónima.
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-200 p-8 mt-10">
          <input
            type="text"
            placeholder="Título de la publicación"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              w-full
              text-3xl
              font-medium
              border-none
              outline-none
              bg-transparent
            "
          />

          <div className="h-px bg-gray-200 my-6"></div>

          <textarea
            placeholder="¿Qué quieres compartir hoy?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="
              w-full
              min-h-[300px]
              resize-none
              border-none
              outline-none
              text-lg
              bg-transparent
            "
          />

          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmit}
              className="
                bg-black
                text-white
                px-8
                py-4
                rounded-full
                hover:opacity-90
                transition
              "
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}