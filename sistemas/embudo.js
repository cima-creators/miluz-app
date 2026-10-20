// 🔻 Meta Ads · Embudo (Luz, 20/10/2026). SOLO LECTURA: los números los publica su Mac
// (~/Miluz/scripts/optimizacion/embudo_panel.py) en Firebase, colección embudo_luz. Para apagar se va al
// Administrador de anuncios o al embudo en Claude (con su sesión): desde acá no se apaga nada.
const CLAUDE = "https://claude.ai/artifact/YKsevTbWQDhjppwHzaEQ3p";
const CUENTAS = {usd: {n: "Dólares", full: "MiLuz USD Ads", act: "1549273329532687", cur: "USD"},
                 ars: {n: "Pesos", full: "MiLuzCosmetic", act: "923809259955896", cur: "ARS"}};
const ETAPA = {TOF: {n: "Prospecta", sub: "gente nueva", c: "#2d7c84"}, MOF: {n: "Calienta", sub: "gente que ya te vio", c: "#c4862a"},
               BOF: {n: "Cierra", sub: "gente lista para comprar", c: "#b0475d"}};
const ANILLO = {"No apagar": "#3F8F6B", "Candidato a apagar": "#B5523A", "Escalar": "#C9A227", "Asistidor": "#8a3fd1"};
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const S = {cuenta: "usd", datos: {usd: {}, ars: {}}, soloOn: false, pop: null, pin: false, ventana: "14"};

const css = `
#embudo .em-head{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-bottom:10px}
#embudo .em-acct{display:inline-flex;background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}
#embudo .em-acct button{border:0;background:none;padding:8px 14px;cursor:pointer;font-weight:600;font-size:13px;display:grid;text-align:left;line-height:1.2}
#embudo .em-acct button small{font-weight:400;font-size:11px;color:var(--mut)}
#embudo .em-acct button[aria-pressed=true]{background:var(--acc);color:#fff}
#embudo .em-acct button[aria-pressed=true] small{color:#fff;opacity:.75}
#embudo .em-tools{display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-size:12.5px;color:var(--mut)}
#embudo .em-take{font-size:13px;color:var(--mut);margin-bottom:12px;max-width:80ch}
#embudo .em-take b{color:var(--txt)}
#embudo .em-grid{display:grid;gap:12px}
#embudo .em-card{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:18px;min-width:0}
#embudo .em-card h3{font-size:15px;font-weight:600;margin-bottom:4px}
#embudo .em-note{font-size:12.5px;color:var(--mut);margin-bottom:10px;max-width:85ch}
#embudo .em-legend{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:11.5px;color:var(--mut);margin-bottom:10px}
#embudo .em-legend i{display:inline-block;width:11px;height:11px;border-radius:4px;margin-right:5px;vertical-align:-1px;box-shadow:0 0 0 2px var(--c)}
#embudo .em-funnel{position:relative;display:grid;gap:6px}
#embudo .em-band{position:relative;margin-inline:auto;padding:12px 0 14px;min-height:100px;display:grid;gap:6px}
#embudo .em-band::before{content:"";position:absolute;inset:0;background:var(--c);opacity:.12;clip-path:polygon(0 0,100% 0,calc(100% - var(--s)) 100%,var(--s) 100%);border-radius:4px}
#embudo .em-band::after{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:var(--c);opacity:.7}
#embudo .em-band>*{position:relative}
#embudo .em-bh{text-align:center;padding-inline:calc(var(--s) + 8px)}
#embudo .em-bh b{color:var(--c);font-size:16px}
#embudo .em-bh span{color:var(--mut);font-size:12px;margin-left:8px}
#embudo .em-bf{display:flex;flex-wrap:wrap;gap:4px 14px;justify-content:center;font-size:12px;color:var(--mut);padding-inline:calc(var(--s) + 8px)}
#embudo .em-bf b{color:var(--txt)}
#embudo .em-thumbs{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;padding-inline:calc(var(--s) + 10px)}
#embudo .em-t{--z:48px;width:var(--z);height:var(--z);border-radius:10px;border:0;padding:0;cursor:pointer;background:var(--soft);position:relative;box-shadow:0 0 0 var(--w,0) var(--r,transparent);transition:transform .15s}
#embudo .em-t img{width:100%;height:100%;object-fit:cover;border-radius:10px;display:block}
#embudo .em-t:hover,#embudo .em-t.sel{transform:scale(1.08);z-index:2}
#embudo .em-t.off img{filter:grayscale(1);opacity:.45}
#embudo .em-t .ini{position:absolute;inset:0;display:grid;place-items:center;font-size:10px;color:var(--mut);overflow:hidden;padding:2px;text-align:center}
#embudo .em-tip{width:34%;margin-inline:auto;height:30px;background:#b0475d;opacity:.12;clip-path:polygon(0 0,100% 0,60% 100%,40% 100%)}
#embudo .em-pop{position:absolute;z-index:20;width:min(360px,calc(100% - 8px));background:var(--card);border:1px solid var(--line2);border-radius:18px;box-shadow:0 14px 34px rgba(60,20,30,.18);padding:14px;display:grid;gap:10px;font-size:12.5px}
#embudo .em-pop .top{display:grid;grid-template-columns:60px minmax(0,1fr) auto;gap:10px}
#embudo .em-pop .top img,#embudo .em-pop .top .ph{width:60px;height:60px;border-radius:10px;object-fit:cover;background:var(--soft)}
#embudo .em-pop .x{border:0;background:none;cursor:pointer;font-size:18px;color:var(--mut)}
#embudo .em-pill{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--line);border-radius:99px;padding:1px 9px;font-size:11.5px;font-weight:600;margin-right:4px}
#embudo .em-tabs{display:inline-flex;border:1px solid var(--line);border-radius:10px;overflow:hidden}
#embudo .em-tabs button{border:0;background:none;padding:4px 10px;font-size:12px;cursor:pointer}
#embudo .em-tabs button[aria-pressed=true]{background:var(--acc);color:#fff}
#embudo .em-figs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
#embudo .em-figs b{display:block;font-size:16px}
#embudo .em-figs span{font-size:10.5px;color:var(--mut)}
#embudo .em-where{max-height:170px;overflow:auto;border-top:1px solid var(--line);padding-top:8px;display:grid;gap:4px}
#embudo .em-where div{display:grid;grid-template-columns:8px minmax(0,1fr) auto;gap:8px;align-items:center}
#embudo .em-where i{width:8px;height:8px;border-radius:50%;background:var(--mut2)}
#embudo .em-where i.on{background:var(--ok)}
#embudo .em-where small{display:block;color:var(--mut)}
#embudo .em-acts{display:flex;flex-wrap:wrap;gap:6px}
#embudo .em-acts .btn{min-height:32px;padding:6px 11px;font-size:12px;border-radius:10px}
#embudo .em-list{display:grid;gap:6px;max-height:26rem;overflow:auto;padding-right:4px}
#embudo .em-wins{max-height:24rem;overflow:auto;padding:3px 4px 3px 3px}
#embudo .em-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;border:1px solid var(--line);border-radius:14px;padding:9px 12px;font-size:12.5px}
#embudo .em-item b{font-weight:600}
#embudo .em-item small{display:block;color:var(--mut)}
#embudo .em-item .ojo{color:var(--warn)}
#embudo .em-wins{display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr))}
#embudo .em-win{display:grid;grid-template-columns:44px minmax(0,1fr);gap:10px;align-items:center;border:1px solid var(--line);border-radius:14px;padding:8px;cursor:pointer;background:var(--card);text-align:left;font-size:12px}
#embudo .em-win img,#embudo .em-win .ph{width:44px;height:44px;border-radius:9px;object-fit:cover;background:var(--soft);box-shadow:0 0 0 2px var(--r)}
#embudo .em-win b{display:block;font-size:12.5px;overflow-wrap:anywhere}
#embudo .em-win span{color:var(--mut)}
#embudo table{width:100%;border-collapse:collapse;font-size:12.5px}
#embudo th{position:sticky;top:0;background:var(--card);color:var(--mut);font-weight:500;text-align:right;padding:7px;border-bottom:1px solid var(--line);white-space:nowrap}
#embudo td{padding:7px;border-bottom:1px solid var(--line);text-align:right}
#embudo th.l,#embudo td.l{text-align:left}
#embudo .em-mix{display:flex;height:9px;border-radius:5px;overflow:hidden;min-width:110px;background:var(--soft)}
#embudo .em-tw{overflow:auto;max-height:30rem}
#embudo details summary{cursor:pointer;font-weight:600;color:var(--mut);font-size:12.5px}
@media (max-width:640px){#embudo .em-band{width:100%!important}#embudo .em-hide{display:none}}
`;
document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

const fmt = (x, d = 0) => (x == null || !isFinite(x)) ? "—" : Number(x).toLocaleString("es-AR", {minimumFractionDigits: d, maximumFractionDigits: d});
const plata = (x, d) => { const c = CUENTAS[S.cuenta].cur; return x == null ? "—" : (c === "USD" ? "US$ " : "$ ") + fmt(x, d ?? (c === "USD" && Math.abs(x) < 100 ? 2 : 0)); };
const pct = (x, d = 0) => x == null ? "—" : fmt(x * 100, d) + "%";
const cuando = iso => { if (!iso) return ""; const s = (Date.now() - new Date(iso)) / 1000; return s < 3600 ? `hace ${Math.max(1, Math.round(s / 60))} min` : s < 86400 ? `hace ${Math.round(s / 3600)} h` : new Date(iso).toLocaleDateString("es-AR"); };
const ads = (ids) => `https://adsmanager.facebook.com/adsmanager/manage/ads?act=${CUENTAS[S.cuenta].act}&selected_ad_ids=${ids.join(",")}`;
const conj = (id) => `https://adsmanager.facebook.com/adsmanager/manage/adsets?act=${CUENTAS[S.cuenta].act}&selected_adset_ids=${id}`;

function pintar() {
  const box = $("#embudo"); if (!box) return;
  const D = S.datos[S.cuenta], R = D.resumen, V = (D.videos && D.videos.lista) || [], P = (D.poca && D.poca.lista) || [];
  const acct = Object.entries(CUENTAS).map(([k, c]) => `<button type="button" data-cuenta="${k}" aria-pressed="${k === S.cuenta}">${c.n}<small>${c.full}</small></button>`).join("");
  if (!R) { box.innerHTML = `<div class="em-head"><div class="em-acct">${acct}</div></div><div class="em-card"><p class="em-note">Cargando el embudo…</p></div>`; return; }
  const E = R.etapas, tot = (E.TOF.gasto + E.MOF.gasto + E.BOF.gasto) || 1;
  const maxG = V.reduce((m, v) => Math.max(m, v.gasto), 1);
  const th = (v) => {
    const z = Math.round(24 + 46 * Math.sqrt(v.gasto / maxG)), r = ANILLO[v.accion];
    return `<button type="button" class="em-t ${v.prendidos ? "" : "off"}" data-k="${esc(v.k)}" title="${esc(v.nombre)}" style="--z:${z}px;${r ? `--r:${r};--w:${v.accion === "Escalar" || v.accion === "Asistidor" ? 3 : 2}px` : ""}">${v.thumb ? `<img src="${esc(v.thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : `<span class="ini">${esc(v.nombre.slice(0, 12))}</span>`}</button>`;
  };
  const banda = (e, w, s) => {
    const xs = V.filter(v => v.etapa === e && (!S.soloOn || v.prendidos)), t = E[e];
    return `<div class="em-band" style="width:${w}%;--c:${ETAPA[e].c};--s:${s}%"><div class="em-bh"><b>${ETAPA[e].n}</b><span>${ETAPA[e].sub}</span></div>
      <div class="em-bf"><span><b>${t.videos}</b> videos</span><span><b>${plata(t.gasto, 0)}</b> de gasto</span><span><b>${fmt(t.roas, 2)}</b> ROAS</span><span><b>${plata(t.cpa)}</b> por compra</span></div>
      <div class="em-thumbs">${xs.map(th).join("") || `<span class="em-note">Nada acá con este filtro.</span>`}</div></div>`;
  };
  const item = (a, prot) => `<div class="em-item"><div><b>${prot ? "🛡️ " : ""}${esc(a.campana)} › ${esc(a.conjunto)}</b>
      <small>3 días: ${plata(a.d3.gasto, 0)} · ${a.d3.carrito ? "carrito " + plata(a.d3.carrito) : "0 carritos"} · ${a.d3.ventas} ventas · ROAS ${fmt(a.d3.roas, 2)}</small>
      <small>7 días: ${plata(a.d7.gasto, 0)} · ${a.d7.carrito ? "carrito " + plata(a.d7.carrito) : "0 carritos"} · ${a.d7.ventas} ventas · ROAS ${fmt(a.d7.roas, 2)}</small>
      ${a.pct_protegido > 0 ? `<small class="ojo">${prot ? "" : "⚠️ ojo: "}${pct(a.pct_protegido)} del gasto prospecta o asiste: ${esc(a.videos_protegidos.join("; "))}</small>` : ""}</div>
      <div class="em-acts"><a class="btn ${prot ? "" : "dark"}" href="${conj(a.id)}" target="_blank" rel="noopener">${prot ? "Ver" : "Apagar en el Administrador →"}</a></div></div>`;
  const tarjeta = (v) => `<button type="button" class="em-win" data-k="${esc(v.k)}" style="--r:${ANILLO[v.accion]}">${v.thumb ? `<img src="${esc(v.thumb)}" alt="" referrerpolicy="no-referrer">` : `<div class="ph"></div>`}
      <div><b>${esc(v.nombre)}</b><span>${v.prendidos ? "Prendido" : "APAGADO"} · ${ETAPA[v.etapa].n} · ROAS ${fmt(v.roas, 2)} · ${v.compras} compras${v.accion === "Asistidor" ? " · " + esc(v.por.join(", ")) + " · " + v.carritos + " carritos" : ""}</span></div></button>`;
  const asis = V.filter(v => v.accion === "Asistidor").sort((a, b) => (a.prendidos ? 1 : 0) - (b.prendidos ? 1 : 0) || b.gasto - a.gasto);
  const wins = V.filter(v => v.accion === "Escalar").sort((a, b) => b.roas * Math.sqrt(b.compras) - a.roas * Math.sqrt(a.compras));
  box.innerHTML = `
    <div class="em-head"><div class="em-acct">${acct}</div>
      <div class="em-tools"><label><input type="checkbox" id="em-on" ${S.soloOn ? "checked" : ""}> Solo prendidos</label>
        <span>Actualizado ${cuando(R.actualizado)} · últimos 14 días</span>
        <a class="btn" href="${CLAUDE}" target="_blank" rel="noopener">💬 Chat y apagar en Claude</a></div></div>
    <p class="em-take">Los videos que prospectan se llevan el <b>${pct(E.TOF.gasto / tot)}</b> del gasto con ROAS <b>${fmt(E.TOF.roas, 2)}</b>, contra <b>${fmt(E.BOF.roas, 2)}</b> de los que cierran (cuenta: ${fmt(R.roas_cuenta, 2)}).
      <b>${E.TOF.no_apagar}</b> prospectan bien aunque vendan menos y <b>${R.asistidores}</b> son asistidores (${R.asistidores_apagados} ya apagados): esos no conviene apagarlos.</p>
    <div class="em-grid">
      <div class="em-card"><div class="em-legend"><span><i style="--c:#3F8F6B"></i>No apagar: prospecta bien</span><span><i style="--c:#B5523A"></i>Candidato a apagar</span>
        <span><i style="--c:#C9A227"></i>Winner para escalar</span><span><i style="--c:#8a3fd1"></i>Asistidor</span><span>Gris: apagado · más grande = más gasto</span></div>
        <div class="em-funnel" id="em-funnel">${banda("TOF", 100, 11)}${banda("MOF", 78, 14)}${banda("BOF", 56, 19)}<div class="em-tip"></div>
          <details style="margin-top:10px"><summary>Poco gasto todavía (${P.length} videos)</summary><p class="em-note" style="margin-top:6px">Gastaron muy poco: todavía no se puede saber si prospectan o cierran.</p><div class="em-thumbs" style="padding:0;justify-content:flex-start">${P.filter(v => !S.soloOn || v.prendidos).map(th).join("")}</div></details>
        </div>
        <p class="em-note" style="margin-top:10px">Pasá el mouse por un video para ver de qué campaña y conjunto viene, cómo le va en 14, 7 y 3 días. Tocalo para dejar la ficha fija.</p></div>
      <div class="em-card"><h3>🛑 Para apagar hoy (${R.apagar.length})</h3><p class="em-note">Conjuntos prendidos que van muy mal en los últimos 3 <b>y</b> 7 días: más de ${S.cuenta === "usd" ? "US$ 30" : "$ 43.500"} gastados sin carritos o con carritos caros, y sin ventas rentables. No entran los que repuntaron ayer u hoy, las BIDCAP, Día de la Madre ni los que prospectan o asisten. El botón te lleva al conjunto en el Administrador para que lo apagues vos.</p>
        <div class="em-list">${R.apagar.map(a => item(a, false)).join("") || `<p class="em-note">Hoy no hay conjuntos para apagar. 🎉</p>`}</div>
        ${R.protegidos.length ? `<details style="margin-top:10px"><summary>🛡️ Vienen mal en ventas pero NO te los propongo porque prospectan o asisten (${R.protegidos.length})</summary><div class="em-list" style="margin-top:8px">${R.protegidos.map(a => item(a, true)).join("")}</div></details>` : ""}</div>
      <div class="em-card"><h3>🟣 Asistidores (${asis.length})</h3><p class="em-note">Casi no repiten a la misma persona y aun así los miran, hacen clic y agregan al carrito: empujan la venta aunque no la cierren. No los apagues por ROAS; los apagados, fijate si conviene volver a prenderlos.</p><div class="em-wins">${asis.map(tarjeta).join("") || `<p class="em-note">No hay en este período.</p>`}</div></div>
      <div class="em-card"><h3>🏆 Winners para escalar (${wins.length})</h3><p class="em-note">Venden 25% o más por encima del ROAS de la cuenta, con 8 compras o más.</p><div class="em-wins">${wins.map(tarjeta).join("") || `<p class="em-note">No hay en este período.</p>`}</div></div>
      <div class="em-card"><h3>Campañas: qué prospecta y qué cierra</h3><p class="em-note">La barra muestra cómo se reparte el gasto de cada campaña entre videos que prospectan, calientan y cierran.</p>
        <div class="em-tw"><table><thead><tr><th class="l">Campaña</th><th class="l">Qué hacer</th><th>Gasto</th><th>ROAS</th><th class="em-hide">Por compra</th><th class="l">Etapas</th><th class="em-hide">Prendidos</th></tr></thead><tbody>
        ${R.campanas.map(c => `<tr><td class="l">${esc(c.nombre)}</td><td class="l">${esc(c.accion)}</td><td>${plata(c.gasto, 0)}</td><td>${fmt(c.roas, 2)}</td><td class="em-hide">${plata(c.cpa)}</td>
          <td class="l"><div class="em-mix"><i style="width:${c.tof * 100}%;background:${ETAPA.TOF.c}"></i><i style="width:${c.mof * 100}%;background:${ETAPA.MOF.c}"></i><i style="width:${c.bof * 100}%;background:${ETAPA.BOF.c}"></i></div></td>
          <td class="em-hide">${c.prendidos} de ${c.ads}</td></tr>`).join("")}</tbody></table></div></div>
    </div>`;
  if (S.pop) mostrar(S.pop, S.pin);
}

function buscar(k) { const D = S.datos[S.cuenta]; return ((D.videos && D.videos.lista) || []).find(v => v.k === k) || ((D.poca && D.poca.lista) || []).find(v => v.k === k); }

function mostrar(k, pin) {
  const v = buscar(k), f = $("#em-funnel"), b = f && f.querySelector(`.em-t[data-k="${CSS.escape(k)}"]`);
  document.querySelectorAll("#embudo .em-pop").forEach(p => p.remove());
  document.querySelectorAll("#embudo .em-t.sel").forEach(t => t.classList.remove("sel"));
  if (!v || !b) { S.pop = null; return; }
  if (S.pop !== k) S.ventana = "14";
  S.pop = k; S.pin = pin; b.classList.add("sel");
  const fig = S.ventana === "14" ? v : (S.ventana === "7" ? v.d7 : v.d3);
  const p = document.createElement("div"); p.className = "em-pop";
  p.innerHTML = `<div class="top">${v.thumb ? `<img src="${esc(v.thumb)}" alt="" referrerpolicy="no-referrer">` : `<div class="ph"></div>`}
      <div><b>${esc(v.nombre)}</b><div style="color:var(--mut)">${esc(v.tipo)} · ${v.prendidos ? `${v.prendidos} de ${v.nads} anuncios prendidos` : "apagado"}</div></div><button class="x" type="button" aria-label="Cerrar">×</button></div>
    <div><span class="em-pill" style="color:${ETAPA[v.etapa].c}">${ETAPA[v.etapa].n}</span><span class="em-pill" style="color:${ANILLO[v.accion] || "var(--mut)"}">${esc(v.accion)}</span></div>
    ${v.roas == null ? `<p class="em-note">Gastó poco en el período: todavía no lo juzgues.</p>` : `
    <div class="em-tabs">${["14", "7", "3"].map(w => `<button type="button" data-w="${w}" aria-pressed="${S.ventana === w}">${w} días</button>`).join("")}</div>
    ${fig ? `<div class="em-figs"><div><b>${fmt(fig.roas, 2)}</b><span>ROAS</span></div><div><b>${plata(fig.gasto, 0)}</b><span>gasto</span></div><div><b>${fmt(fig.compras)}</b><span>compras</span></div><div><b>${plata(fig.cpa)}</b><span>por compra</span></div></div>` : `<p class="em-note">Sin gasto en esos días.</p>`}
    <div class="em-figs"><div><b>${fmt(v.frec, 2)}</b><span>frecuencia</span></div><div><b>${v.ret == null ? "—" : pct(v.ret)}</b><span>lo miran entero</span></div><div><b>${pct(v.ctr, 1)}</b><span>clics</span></div><div><b>${fmt(v.carritos)}</b><span>carritos</span></div></div>
    <p class="em-note" style="margin:0">${v.accion === "Asistidor" ? `Asistidor: ${esc(v.por.join(", "))}. Empuja ventas aunque no las cierre: no lo apagues por ROAS.` : v.accion === "Escalar" ? "Winner: candidato a subirle presupuesto o duplicarlo." : v.etapa === "TOF" ? "Llega a gente nueva: juzgalo por eso, no solo por ROAS." : v.etapa === "BOF" ? "Le llega a gente caliente: acá sí manda el ROAS." : "Calienta a gente que ya te vio."}</p>
    <div class="em-where">${(v.ads || []).map(a => `<div><i class="${a.on ? "on" : ""}"></i><span>${esc(a.campana)}<small>${esc(a.conjunto)} · ${plata(a.gasto, 0)}</small></span><span>ROAS ${fmt(a.roas, 2)}</span></div>`).join("")}</div>`}
    <div class="em-acts">${/^\d+_\d+$/.test(v.post || "") ? `<a class="btn" href="https://www.facebook.com/${esc(v.post)}" target="_blank" rel="noopener">Ver el video</a>` : ""}
      ${v.ads ? `<a class="btn dark" href="${ads(v.ads.map(a => a.id))}" target="_blank" rel="noopener">Abrir / apagar en el Administrador →</a>` : ""}</div>`;
  f.appendChild(p);
  const fr = f.getBoundingClientRect(), r = b.getBoundingClientRect(), w = p.offsetWidth, h = p.offsetHeight;
  const bl = r.left - fr.left, bt = r.top - fr.top;
  let left, top;
  if (bl + r.width + 10 + w <= fr.width) { left = bl + r.width + 10; top = bt - 10; }
  else if (bl - 10 - w >= 0) { left = bl - 10 - w; top = bt - 10; }
  else { left = Math.max(0, Math.min(fr.width - w, bl + r.width / 2 - w / 2)); top = bt + r.height + 8; }
  p.style.left = left + "px"; p.style.top = Math.max(0, Math.min(top, fr.height - h)) + "px";
  p.querySelector(".x").onclick = () => { S.pop = null; S.pin = false; p.remove(); b.classList.remove("sel"); };
  p.querySelectorAll("[data-w]").forEach(t => t.onclick = () => { S.ventana = t.dataset.w; mostrar(k, true); });
  p.onmouseenter = () => clearTimeout(S.hideT);
  p.onmouseleave = () => { if (!S.pin) S.hideT = setTimeout(() => mostrar(null), 250); };
}

document.addEventListener("click", e => {
  const c = e.target.closest("#embudo [data-cuenta]");
  if (c) { S.cuenta = c.dataset.cuenta; S.pop = null; pintar(); return; }
  const t = e.target.closest("#embudo .em-t, #embudo .em-win");
  if (t) {
    const tb = document.querySelector(`#embudo .em-t[data-k="${CSS.escape(t.dataset.k)}"]`);
    if (t.classList.contains("em-win") && tb) { tb.scrollIntoView({behavior: "smooth", block: "center"}); setTimeout(() => mostrar(t.dataset.k, true), 350); }
    else mostrar(t.dataset.k, true);
  }
});
document.addEventListener("change", e => { if (e.target.id === "em-on") { S.soloOn = e.target.checked; pintar(); } });
document.addEventListener("mouseover", e => { const t = e.target.closest("#embudo .em-t"); if (t && !S.pin) { clearTimeout(S.hideT); if (S.pop !== t.dataset.k || !document.querySelector("#embudo .em-pop")) mostrar(t.dataset.k, false); } });
document.addEventListener("mouseout", e => { const t = e.target.closest("#embudo .em-t"); if (t && !S.pin) S.hideT = setTimeout(() => mostrar(null), 250); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { S.pin = false; mostrar(null); } });

// Arranca cuando la página ya pasó la clave (el panel se muestra).
const arrancar = async () => {
  const [{initializeApp}, {getFirestore, doc, onSnapshot}, {getAuth, signInAnonymously}] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")]);
  const app = initializeApp({apiKey: "AIzaSyCTv4DiRCpbCpGYP6E86TPHlkPvaAZTN3g", authDomain: "cleargy-creators.firebaseapp.com", projectId: "cleargy-creators",
    storageBucket: "cleargy-creators.firebasestorage.app", messagingSenderId: "313543582398", appId: "1:313543582398:web:99fe78991adeea2e7cb4ef"}, "embudo");
  await signInAnonymously(getAuth(app));
  const db = getFirestore(app);
  for (const c of Object.keys(CUENTAS)) for (const parte of ["resumen", "videos", "poca"])
    onSnapshot(doc(db, "embudo_luz", `${c}_${parte}`), x => { S.datos[c][parte] = x.exists() ? x.data() : null; if (c === S.cuenta) pintar(); },
               e => { const b = $("#embudo"); if (b) b.innerHTML = `<div class="em-card"><p class="em-note">No pude leer el embudo (${esc(e.code || e.message)}).</p></div>`; });
};
const espera = setInterval(() => { const a = $("#app"); if (a && !a.hidden) { clearInterval(espera); pintar(); arrancar(); } }, 400);
