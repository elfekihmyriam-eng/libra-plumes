// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Author from "./pages/Author.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 16 }}>
        <Link to="/" style={{ marginRight: 12 }}>Accueil</Link>
        <Link to="/auteur">Auteurs</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auteur" element={<Author />} />
      </Routes>
    </BrowserRouter>
  );
}




