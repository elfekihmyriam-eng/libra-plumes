// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import Home from "./pages/Home.jsx";
import Authors from "./pages/Authors.jsx";

function App() {
  const path = window.location.pathname.toLowerCase();
  const isAuthors = path.includes("author") || path.includes("auteur");

  return isAuthors ? <Authors /> : <Home />;
}

createRoot(document.getElementById("root")).render(<App />);

