// src/pages/Authors.jsx
import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";

export default function Authors() {
  const AUTHOR_ID = 2; // Sandy (auteure)

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const res = await api.getAuthor(AUTHOR_ID);
      setData(res);
    } catch (e) {
      setErr(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const a = data?.author;
  const stats = data?.stats;

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <nav style={{ marginBottom: 12 }}>
        <a href="/">Accueil</a>
      </nav>

      <h1>Auteur — Libra-Plumes</h1>
      {err && <p style={{ color: "crimson" }}>Erreur : {err}</p>}

      {loading && <p>Chargement…</p>}
      {!loading && a && (
        <>
          <section style={{ borderTop: "1px solid #aaa", paddingTop: 16 }}>
            <h2>Profil</h2>
            <p><b>{a.name}</b> — rôle : {a.role}</p>
          </section>

          <section style={{ borderTop: "1px solid #aaa", paddingTop: 16 }}>
            <h2>Statistiques</h2>
            <ul>
              <li>Montant total reçu (transferts) : <b>{stats?.totalReceived ?? 0}</b> plumes</li>
              <li>Donateurs uniques : <b>{stats?.donors ?? 0}</b></li>
            </ul>
          </section>

          <section style={{ borderTop: "1px solid #aaa", paddingTop: 16 }}>
            <h2>Derniers soutiens</h2>
            {data.recent?.length ? (
              <ul>
                {data.recent.map((t) => (
                  <li key={t.id}>
                    {new Date(t.timestamp).toLocaleString()} — +{t.details?.amount} plumes
                    (de #{t.details?.fromId} → #{t.details?.toId})
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun soutien récent.</p>
            )}
          </section>
        </>
      )}
    </main>
  );
}


