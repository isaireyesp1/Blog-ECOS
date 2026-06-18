import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);

      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl border w-full max-w-md text-center">

        <h1 className="text-4xl font-bold mb-4">
          Panel Admin
        </h1>

        <p className="text-gray-500 mb-8">
          Inicia sesión para administrar publicaciones
        </p>

        <button
          onClick={loginGoogle}
          className="
            w-full
            py-4
            rounded-2xl
            bg-black
            text-white
            font-medium
            hover:scale-105
            transition
          "
        >
          Iniciar sesión con Google
        </button>

      </div>
    </div>
  );
}