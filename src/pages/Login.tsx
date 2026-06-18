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
      <div className="bg-white p-10 rounded-3xl border w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-4">
          Panel de Administración
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Inicia sesión con tu cuenta de Google
        </p>

        <button
          onClick={loginGoogle}
          className="w-full bg-black text-white py-4 rounded-full"
        >
          Continuar con Google
        </button>

      </div>
    </div>
  );
}