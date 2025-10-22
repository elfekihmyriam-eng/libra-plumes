// src/components/Rewards.jsx
import React from "react";

const Chip = ({ children }) => (
  <span style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#fff7d6",
    border: "1px solid #f1d27a",
    fontSize: 14
  }}>
    {children}
  </span>
);

export default function Rewards({ project }) {
  if (!project) return null;
  const b = new Set(project.badges || []);
  const t = new Set(project.trophies || []);

  return (
    <div style={{ display:"flex", gap:12, flexWrap:"wrap", margin:"8px 0 16px" }}>
      {b.has("plume-or") && (
        <Chip>🥇 Plume d’Or <small style={{opacity:.7}}>(1000 $)</small></Chip>
      )}
      {b.has("plume-or-partages") && (
        <Chip>🥇 Plume d’Or <small style={{opacity:.7}}>(50 partages)</small></Chip>
      )}
      {t.has("meilleur-projet") && (
        <Chip>🏆 Meilleur projet</Chip>
      )}
      {/* Petit rappel utile */}
      <span style={{marginLeft:8, color:"#666"}}>
        <small>
          Partages: {project.sharesCount ?? 0} • Support: ${project.totalSupportUSD ?? 0}
        </small>
      </span>
    </div>
  );
}
