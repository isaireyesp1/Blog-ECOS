import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root")!
);

// 🔥 Render directo, sin Firebase Auth
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);