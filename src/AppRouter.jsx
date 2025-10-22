// src/AppRouter.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AuthorDashboard from "./pages/AuthorDashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 16, padding: 12 }}>
        <Link to="/">Accueil</Link>
        <Link to="/auteur">Auteurs</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auteur" element={<AuthorDashboard />} />
        {/* 404 simple */}
        <Route path="*" element={<div style={{ padding: 24 }}>Page introuvable.</div>} />
      </Routes>
    </BrowserRouter>
  );
}




