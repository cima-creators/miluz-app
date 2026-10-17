// Botones "carpeta en Drive" de cada sección (pedido de Luz 17/10/2026: "en la principal de cada sección un link a la carpeta madre").
// Los IDs los publica la Mac de Luz cada 10 min en Firestore miluz_drive/carpetas (drive/carpetas_drive.py).
// Uso: <div data-carpeta="Estáticos"></div> (formato = nombre de la carpeta en Drive; vacío = las dos carpetas generales).
(function () {
  const URL = "https://firestore.googleapis.com/v1/projects/cleargy-creators/databases/(default)/documents/miluz_drive/carpetas";
  const dec = f => { const [k, v] = Object.entries(f)[0]; return k === "mapValue" ? Object.fromEntries(Object.entries(v.fields || {}).map(([a, b]) => [a, dec(b)])) : v; };
  const css = document.createElement("style");
  css.textContent = `.drv{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:-6px 0 18px}
.drv a{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;font-weight:600;font-size:13px;text-decoration:none;
  background:#fff;border:1px solid #E0D2CB;color:#2A1F1F}
.drv a.ok{background:#E7F2EC;border-color:#CFE5D8;color:#2F6E52}
.drv a:hover{filter:brightness(.97)} .drv small{color:#8A7B76;font-size:11.5px}`;
  document.head.appendChild(css);
  const dia = d => d ? new Date(d + "T12:00").toLocaleDateString("es-AR", {day: "numeric", month: "short"}) : "";
  const f = id => `https://drive.google.com/drive/folders/${id}`;
  window.miluzDrive = fetch(URL, {cache: "no-store"}).then(r => r.ok ? r.json() : null)
    .then(j => j && j.fields ? Object.fromEntries(Object.entries(j.fields).map(([k, v]) => [k, dec(v)])) : null).catch(() => null);
  // Link de un formato (o de las carpetas generales si no hay formato): {listos, revision} → URL
  window.miluzDriveLinks = (c, fmt) => {
    const x = (fmt && c.formatos && c.formatos[fmt]) || {};
    return {listos: x.listos ? f(x.listos.id) : c.listos ? f(c.listos) : "", listosDia: x.listos && x.listos.dia,
            revision: x.revision ? f(x.revision.id) : c.revision ? f(c.revision) : "", revisionDia: x.revision && x.revision.dia,
            todoListos: c.listos ? f(c.listos) : "", todoRevision: c.revision ? f(c.revision) : ""};
  };
  window.miluzDrive.then(c => {
    document.querySelectorAll("[data-carpeta]").forEach(el => {
      if (!c) { el.innerHTML = ""; return; }
      const fmt = el.dataset.carpeta, l = miluzDriveLinks(c, fmt);
      el.className = "drv";
      el.innerHTML = (l.listos ? `<a class="ok" href="${l.listos}" target="_blank" rel="noopener">📁 ${fmt ? fmt + " · " : ""}Listos para subir${l.listosDia ? " · " + dia(l.listosDia) : ""}</a>` : "")
        + (l.revision ? `<a href="${l.revision}" target="_blank" rel="noopener">🔍 ${fmt ? fmt + " · " : ""}En revisión${l.revisionDia ? " · " + dia(l.revisionDia) : ""}</a>` : "")
        + (fmt && l.todoListos ? `<small>· <a href="${l.todoListos}" target="_blank" rel="noopener" style="all:unset;cursor:pointer;text-decoration:underline">todos los días</a></small>` : "");
    });
  });
})();
