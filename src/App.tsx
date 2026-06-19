import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Popular from "./pages/Popular";
import CreatePost from "./pages/CreatePost";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CategoryPage from "./pages/CategoryPage";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/crear" element={<CreatePost />} />
        <Route path="/publicaciones" element={<Posts />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categoria/:category" element={<CategoryPage />} />
        <Route path="/gestion-ecos-2026" element={<Admin />} />
      </Routes>
    </div>
  );
}