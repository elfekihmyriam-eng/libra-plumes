// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import Rewards from "../components/Rewards.jsx"; // OK même si pas utilisé selon état

export default function Home() {
  const USER_ID = 1;    // Myriam
  const SANDY_ID = 2;   // Sandy

  // états
  const [packs, setPacks] = useState([]);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [project, setProject] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [transferAmount, setTransferAmount] = useState("");
  const [sending, setSending] = useState(false);

  const [printAmount, setPrintAmount] = useState("");
  const [printing, setPrinting] = useState(false);

  const [buyingId, setBuyingId] = useState(null);
  const [supering, setSupering] = useState(false);

  async function refreshAll() {
    try {
      setError("");
      setLoading(true);
      const [p, u, h, prj] = await Promise.all([
        api.getPacks(),
        api.getUser(USER_ID),
        api.getHistory(),
        api.getProject(1),
      ]);
      setPacks(p || []);
      setUser(u || null);
      setHistory(h || []);
      setProject(prj || null);
    } catch (e) {
      setError(e?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
  }, []);

  async function handlePurchase(packId) {
    try {
      setError("");
      setBuyingId(packId);
      await api.purchase({
        userId: USER_ID,
        packId,
        idempotencyKey: `credit-${Date.now()}`,
      });
      await refreshAll();
    } catch (e) {
      setError(e?.message || "Erreur achat");
    } finally {
      setBuyingId(null);
    }
  }

  async function handleTransfer() {
    const amount = Number(transferAmount);
    if (!Number.isFinite(amount) || amount <= 0) return alert("Montant invalide");
    try {
      setSending(true);
      await api.transfer({ fromId: USER_ID, toId: SANDY_ID, amount });
      setTransferAmount("");
      await refreshAll();
    } catch (e) {
      setError(e?.message || "Erreur transfert");
    } finally {
      setSending(false);
    }
  }

  async function handlePrint() {
    const amount = Number(printAmount);
    if (!Number.isFinite(amount) || amount <= 0) return alert("Montant invalide");
    try {
      setPrinting(true);
      await api.redeem({
        userId: USER_ID,
        mode: "print",
        amountPlumes: amount,
        idempotencyKey: `print-${Date.now()}`,
      });
      setPrintAmount("");
      await refreshAll();
    } catch (e) {
      setError(e?.message || "Erreur impression");
    } finally {
      setPrinting(false);
    }
  }

  async function handleShare() {
    try {
      await api.shareProject(1);
      await refreshAll();
    } catch (e) {
      setError(e?.message || "Erreur partage");
    }
  }

  async function handleSuperPlume() {
    try {
      setSupering(true);
      await api.superPlume({
        projectId: 1,
        fromUserId: USER_ID,
        quantity: 1,
        idempotencyKey: `super-${Date.now()}`,
      });
      await refreshAll();
    } catch (e) {
      setError(e?.message || "Erreur Super Plume");
    } finally {
      setSupering(false);
    }
  }

  return (
    <>
      <nav style={{ marginBottom: 12 }}>
        <a href="/">Accueil</a>
        <a href="/authors" style={{ marginLeft: 12 }}>Auteurs</a>
      </nav>

      <main style={{ padding: 24, maxWidth: 900 }}>
        <h1>Accueil — Libra-Plumes</h1>

        {error && <p style={{ color: "crimson" }}>Erreur : {error}</p>}

        {/* Projet + Récompenses */}
        <section style={{ borderTop: "1px solid #aaa", paddingTop: 16 }}>
          <h2>Projet</h2>
          <p><b>{project?.title ?? "…"}</b></p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleShare}>Partager (+1)</button>
            <button onClick={handleSuperPlume} disabled={supering}>
              {supering ? "Envoi…" : "Offrir une Super Plume (1000 $)"}
            </button>
          </div>
          {project && <Rewards project={project} />}
        </section>

        {/* Mon solde */}
        <section style={{ borderTop: "1px solid #aaa", paddingTop: 16 }}>
          <h2>Mon solde</h2>
          <p>Utilisateur : <b>{user?.name ?? "…"}</b></p>
          <p>Plumes : <b>{user?.balance ?? "…"}</b></p>
        </section>

        {/* Packs */}
        <section style={{ borderTop: "1px solid #aaa", paddingTop: 16 }}>
          <h2>Packs disponibles</h2>
          {loading && <p>Chargement…</p>}
          {!loading && packs.length === 0 && <p>Aucun pack pour l’instant.</p>}
          {!loading && packs.length > 0 && (
            <ul>
              {packs.map(pk => (
                <li key={pk.id} style={{ marginBottom: 8 }}>
                  {pk.plumes} plumes — {pk.price}$ {pk.bonus ? `(bonus ${pk.bonus})` : ""}
                  <button
                    style={{ marginLeft: 8 }}
                    disabled={buyingId === pk.id}
                    onClick={() => handlePurchase(pk.id)}
                  >
                    {buyingId === pk.id ? "Achat…" : "Acheter"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Transfert */}
        <section style={{ borderTop: "1px solid #aaa", paddingTop: 16 }}>
          <h2>Envoyer des plumes à Sandy</h2>
          <input
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Montant (ex: 20)"
          />
          <button disabled={sending} onClick={handleTransfer} style={{ marginLeft: 8 }}>
            {sending ? "Envoi…" : "Envoyer"}
          </button>
          <p style={{ color: "#666" }}>(Depuis Myriam → vers Sandy)</p>
        </section>

        {/* Impression */}
        <section style={{ borderTop: "1px solid #aaa", paddingTop: 16 }}>
          <h2>Imprimer avec mes plumes</h2>
          <p style={{ color: "#666" }}>
            💡 La conversion en cash est désactivée. Les plumes se réinvestissent dans la création.
          </p>
          <input
            type="number"
            value={printAmount}
            onChange={(e) => setPrintAmount(e.target.value)}
            placeholder="Nombre de plumes"
          />
          <button disabled={printing} onClick={handlePrint} style={{ marginLeft: 8 }}>
            {printing ? "Impression…" : "Imprimer"}
          </button>
        </section>

        {/* Historique */}
        <section style={{ borderTop: "1px solid #aaa", paddingTop: 16 }}>
          <h2>Historique (récent)</h2>
          {history.length === 0 && <p>Aucune opération pour l’instant.</p>}
          {history.length > 0 && (
            <ul>
              {history.map((h) => (
                <li key={h.id}>
                  <b>{h.type}</b> — {new Date(h.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
