import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-5">
        <h1 className="text-2xl font-bold text-violet-600">
          🌙 ECOS
        </h1>

        <div className="flex gap-6">
          <Link to="/">Inicio</Link>
          <Link to="/popular">Populares</Link>
        </div>
      </div>
    </nav>
  );
}