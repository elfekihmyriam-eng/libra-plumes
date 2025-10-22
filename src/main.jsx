// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";

import Home from "./pages/Home.jsx";
import Authors from "./pages/Authors.jsx";

function App() {
  const path = window.location.pathname.toLowerCase();

  // On accepte /authors, /authors/2, et aussi /author, /author/2 (au cas où)
  const isAuthors =
    path === "/authors" ||
    /^\/authors\/\d+/.test(path) ||
    path === "/author" ||
    /^\/author\/\d+/.test(path);

  return isAuthors ? <Authors /> : <Home />;
}

createRoot(document.getElementById("root")).render(<App />);
