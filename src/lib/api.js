// src/lib/api.js
// =============================
// Libra-Plumes — API client (via proxy Vite)
// =============================

// Le backend est atteint via le proxy Vite (vite.config.js)
// → toutes les requêtes passent par /api
const BASE = "/api";

// --- Fonction générique HTTP (avec timeout & erreurs claires) ---
async function http(path, options = {}) {
  const url = `${BASE}${path}`;

  // Timeout raisonnable (10s)
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10_000);

  // Headers: on n’ajoute "Content-Type: application/json" que si on envoie un body
  const hasBody = typeof options.body !== "undefined";
  const headers = {
    Accept: "application/json",
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: ctrl.signal,
    });

    // Tente de parser JSON (même en cas d’erreur HTTP)
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* Pas grave si pas de JSON (204, etc.) */
    }

    if (!res.ok) {
      const msg =
        (data && (data.message || data.error)) ||
        `${res.status} ${res.statusText}`;
      throw new Error(msg);
    }

    return data ?? {};
  } catch (e) {
    if (e.name === "AbortError") {
      throw new Error("Requête expirée (timeout).");
    }
    // Erreurs réseau (backend éteint, proxy HS, etc.)
    throw new Error(e.message || "Erreur réseau.");
  } finally {
    clearTimeout(timer);
  }
}

// --- Endpoints ---
export const api = {
  // ===== Utilisateurs et packs =====
  getPacks: () => http("/packs"),
  getUser: (id) => http(`/users/${id}`),
  getHistory: () => http("/history"),

  // ===== Transactions =====
  purchase: ({ userId, packId, idempotencyKey }) =>
    http("/purchase", {
      method: "POST",
      body: JSON.stringify({ userId, packId, idempotencyKey }),
    }),

  transfer: ({ fromId, toId, amount }) =>
    http("/transfer", {
      method: "POST",
      body: JSON.stringify({ fromId, toId, amount }),
    }),

  redeem: ({ userId, mode, amountPlumes, idempotencyKey }) =>
    http("/redeem", {
      method: "POST",
      body: JSON.stringify({ userId, mode, amountPlumes, idempotencyKey }),
    }),

  // ===== Auteurs et projets =====
  getAuthor: (id) => http(`/authors/${id}`),
  getProject: (id) => http(`/projects/${id}`),

  superPlume: ({ projectId, fromUserId, quantity = 1, idempotencyKey }) =>
    http("/supports/super-plume", {
      method: "POST",
      body: JSON.stringify({ projectId, fromUserId, quantity, idempotencyKey }),
    }),

  shareProject: (id) =>
    http(`/projects/${id}/share`, {
      method: "POST",
    }),

  // (optionnel) petite route santé si tu en as besoin côté UI
  health: () => http("/health"),
};




