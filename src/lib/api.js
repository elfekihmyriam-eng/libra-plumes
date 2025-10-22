// src/lib/api.js
// =============================
// Libra-Plumes — API client (via proxy Vite)
// =============================

// ⚠️ IMPORTANT : on passe par le proxy Vite.
// Le backend est atteint via le préfixe /api (configuré dans vite.config.js).
const BASE = "/api";

// --- Fonction générique HTTP ---
async function http(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (_) {
    // OK si pas de JSON
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data ?? {};
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
};




