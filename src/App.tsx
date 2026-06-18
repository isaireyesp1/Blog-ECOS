import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Popular from "./pages/Popular";
import CreatePost from "./pages/CreatePost";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CategoryPage from "./pages/CategoryPage";
import Admin from "./pages/Admin";
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f5f5f7]">
        
        {/* NAVBAR GLOBAL */}
        <Navbar />

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/popular" element={<Popular />} />

          <Route path="/crear" element={<CreatePost />} />

          <Route path="/publicaciones" element={<Posts />} />

          <Route path="/post/:id" element={<PostDetail />} />

          {/* CATEGORÍAS */}
          <Route
            path="/categoria/:category"
            element={<CategoryPage />}
          />

          <Route
  path="/gestion-ecos-2026"
  element={<Admin />}
/>
        </Routes>

      </div>
    </BrowserRouter>
  );
}