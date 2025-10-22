import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";

export default function Authors() {
  const [author, setAuthor]     = useState(null);
  const [stats, setStats]       = useState(null);
  const [err, setErr]           = useState("");
  const [loading, setLoading]   = useState(true);

  function getAuthorIdFromURL() {
    const path = window.location.pathname.toLowerCase();
    const m = path.match(/\/authors?\/(\d+)/);
    return m ? Number(m[1]) : 2; // défaut = Sandy
  }

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        setLoading(true);
        const id = getAuthorIdFromURL();
        const data = await api.getAuthor(id);
        setAuthor(data?.author ?? null);
        setStats(data?.stats ?? null);
      } catch (e) {
        setErr(e.message || "Erreur");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <nav style={{ marginBottom: 12 }}>
        <a href="/">Accueil</a>
        <a href="/authors" style={{ marginLeft: 12 }}>Auteurs</a>
      </nav>

      <h1>Auteur — Libra-Plumes</h1>

      {err && <p style={{ color: "crimson" }}>Erreur : {err}</p>}
      {loading && <p>Chargement…</p>}

      {!loading && author && (
        <>
          <section style={{ borderTop: "1px solid #aaa", paddingTop: 16 }}>
            <h2>Profil</h2>
            <p><b>{author.name}</b> — rôle : {author.role}</p>
            <p>Balance : {author.balance} plumes</p>
            {Array.isArray(author.badges) && author.badges.length > 0 && (
              <p>Badges : {author.badges.join(", ")}</p>
            )}
          </section>

          <section style={{ borderTop: "1px solid #aaa", paddingTop: 16 }}>
            <h2>Statistiques</h2>
            <ul>
              <li>Total reçu : <b>{stats?.totalReceived ?? 0}</b> plumes</li>
              <li>Donateurs uniques : <b>{stats?.donors ?? 0}</b></li>
            </ul>
          </section>
        </>
      )}

      {!loading && !author && !err && <p>Aucun auteur trouvé.</p>}
    </main>
  );
}
