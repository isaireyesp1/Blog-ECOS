import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Popular from "./pages/Popular";
import CreatePost from "./pages/CreatePost";
export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crear" element={<CreatePost />} />
        <Route
          path="/popular"
          element={<Popular />}
        />
      </Routes>
    </BrowserRouter>
  );
}