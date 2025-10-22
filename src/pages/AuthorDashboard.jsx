// src/pages/AuthorDashboard.jsx
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function AuthorDashboard() {
  // Auteur "Sandy" a l'ID 2 dans notre backend
  const AUTHOR_ID = 2;

  const [data, setData] = useState(null);   // { author, stats, recent }
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setError("");
      setLoading(true);
      const res = await api.getAuthor(AUTHOR_ID);
      setData(res);
    } catch (e) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center my-6">Tableau de bord — Auteur</h1>

      {error && <p className="text-center text-red-600">Erreur : {error}</p>}
      {loading && <p className="text-center">Chargement…</p>}

      {data && (
        <>
          <section className="border p-4 my-6">
            <h2 className="text-xl font-semibold">Profil</h2>
            <p><strong>Nom :</strong> {data.author?.name}</p>
            <p><strong>Rôle :</strong> {data.author?.role}</p>
            <p><strong>Plumes :</strong> {data.author?.balance}</p>
          </section>

          <section className="border p-4 my-6">
            <h2 className="text-xl font-semibold">Statistiques</h2>
            <ul className="list-disc ml-6">
              <li>Total reçu (plumes) : <strong>{data.stats?.totalReceived ?? 0}</strong></li>
              <li>Nombre de donateurs uniques : <strong>{data.stats?.donorsCount ?? 0}</strong></li>
              <li>Nombre de transferts reçus : <strong>{data.stats?.transfersCount ?? 0}</strong></li>
            </ul>
          </section>

          <section className="border p-4 my-6">
            <h2 className="text-xl font-semibold">Dernières opérations</h2>
            {(!data.recent || data.recent.length === 0) && (
              <p>Aucune opération récente.</p>
            )}
            <ul className="space-y-3">
              {data.recent?.map((op) => (
                <li key={op.id} className="border p-3 text-sm overflow-auto">
                  <div className="font-medium mb-1">
                    {op.type} — {new Date(op.timestamp).toLocaleString()}
                  </div>
                  <pre className="whitespace-pre-wrap break-words">
{JSON.stringify(op.details, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

