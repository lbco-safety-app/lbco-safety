// LBCO Digital Safety App - original implementation.
// Data is stored in this browser (localStorage). Swap the storage functions for a real backend later.
const $app = document.getElementById("app");
const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { alert("Could not save: " + e.message); } },
};
const sites = () => store.get("lbco.sites", []);
const submissions = () => store.get("lbco.submissions", []);
const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const today = () => new Date().toISOString().slice(0, 10);

function header() {
  return `<div class="brand"><img src="1795717419849_LBCO%20Contracting%20Ltd.jpg" alt="LBCO Contracting Ltd."></div><h1>Digital Safety App</h1>`;
}

function home() {
  $app.innerHTML = header() + `
    <p class="sub">Use the buttons below to complete your safety documents</p>
    <p class="sub">FOR SUPPORT please use the <b>Technical Support Request</b> button under the <b>APP ADMIN</b> section below</p>`;
  MENU.top.forEach((i) => $app.append(btn(i)));
  const grid = el(`<div class="grid"></div>`);
  MENU.columns.forEach((col) => {
    const p = el(`<section class="panel"><h2>${esc(col.title)}</h2></section>`);
    col.items.forEach((i) => p.append(btn(i)));
    grid.append(p);
  });
  $app.append(grid);
  $app.append(el(`<div class="row"><button class="btn secondary" id="export">Export all submissions (CSV)</button></div>`));
  document.getElementById("export").onclick = exportCsv;
}

function btn(item) {
  if (item.heading) return el(`<h3 class="subhead">${esc(item.heading)}</h3>`);
  const b = el(`<button class="btn">${esc(item.label)}</button>`);
  b.onclick = () => { if (item.doc && window.DOC_URLS && window.DOC_URLS[item.doc]) { window.open(window.DOC_URLS[item.doc], "_blank", "noopener"); return; } if (item.url) { window.open(item.url, "_blank", "noopener"); return; } location.hash = item.report ? `#report/${item.report}` : item.form ? `#form/${item.form}` : item.doc ? `#doc/${item.doc}` : `#admin/${item.admin}`; };
  return b;
}

function backRow() {
  const r = el(`<div class="row"><button class="btn secondary">← Home</button></div>`);
  r.firstChild.onclick = () => (location.hash = "");
  return r;
}

// Embed a Jotform form. Jotform's embed handler resizes the iframe to the form's height,
// so the page scrolls normally on desktop and phone (no scroll-inside-a-scroll).
function jotformFrame(jf, title) {
  const f = el(`<iframe id="JotFormIFrame-${jf}" title="${esc(title)}" src="https://form.jotform.com/${jf}" allow="geolocation; microphone; camera; fullscreen" scrolling="no" style="width:1px;min-width:100%;height:700px;border:none"></iframe>`);
  const go = () => window.jotformEmbedHandler && window.jotformEmbedHandler(`iframe[id='JotFormIFrame-${jf}']`, "https://form.jotform.com/");
  if (window.jotformEmbedHandler) setTimeout(go);
  else {
    const s = document.createElement("script");
    s.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js";
    s.onload = go;
    document.head.append(s);
  }
  return f;
}

function renderForm(id) {
  const def = FORMS[id];
  if (!def) return home();
  $app.innerHTML = header() + `<h2>${esc(def.title)}</h2>`;
  // If this form also exists in Jotform, show the Jotform form (embedded) instead of the local one.
  const jf = window.JOTFORM && window.JOTFORM[id];
  if (jf) {
    $app.append(backRow());
    $app.append(jotformFrame(jf, def.title));
    return;
  }
  const form = el(`<form></form>`);
  def.fields.forEach((f) => {
    const wrap = el(`<div class="field"></div>`);
    if (f.type === "checklist") {
      wrap.append(el(`<label>${esc(f.label)}</label>`));
      f.items.forEach((it, n) => wrap.append(el(
        `<label class="check"><input type="checkbox" name="${f.id}" value="${esc(it)}"> ${esc(it)}</label>`)));
    } else {
      wrap.append(el(`<label for="${f.id}">${esc(f.label)}</label>`));
      let input;
      if (f.type === "textarea") input = el(`<textarea id="${f.id}" name="${f.id}"></textarea>`);
      else if (f.type === "select") {
        const opts = f.source === "sites" ? sites().map((s) => s.name) : f.options;
        input = el(`<select id="${f.id}" name="${f.id}"><option value="">Select…</option>${opts.map((o) => `<option>${esc(o)}</option>`).join("")}</select>`);
      } else if (f.type === "yesno") {
        input = el(`<select id="${f.id}" name="${f.id}"><option value="">Select…</option><option>Yes</option><option>No</option></select>`);
      } else {
        const t = f.type === "signature" ? "text" : f.type;
        input = el(`<input id="${f.id}" name="${f.id}" type="${t}">`);
        if (f.auto === "today") input.value = today();
      }
      wrap.append(input);
    }
    form.append(wrap);
  });
  if (def.fields.some((f) => f.source === "sites") && !sites().length)
    form.prepend(el(`<div class="notice">No work sites yet. Add one under App Admin → Add New Work Site.</div>`));
  form.append(el(`<div class="row"><button class="btn" type="submit" style="width:auto">Submit</button></div>`));
  form.onsubmit = (e) => {
    e.preventDefault();
    const data = {};
    def.fields.forEach((f) => {
      if (f.type === "checklist") data[f.id] = [...form.querySelectorAll(`input[name="${f.id}"]:checked`)].map((c) => c.value).join("; ");
      else data[f.id] = form.elements[f.id].value;
    });
    const all = submissions();
    all.push({ form: id, title: def.title, submitted: new Date().toISOString(), data });
    store.set("lbco.submissions", all);
    $app.innerHTML = header() + `<div class="notice">${esc(def.title)} submitted. Thank you.</div>`;
    $app.append(backRow());
  };
  $app.append(form, backRow());
}

const DOCS = {
  sjp: "Safe Job Procedures", manual: "Health & Safety Manual", ohs: "OHS Legislation",
};
function renderDoc(id) {
  const key = `lbco.doc.${id}`;
  const url = (window.DOC_URLS && window.DOC_URLS[id]) || store.get(key, "") || "";
  $app.innerHTML = header() + `<h2>${esc(DOCS[id])}</h2>`;
  if (url) $app.append(el(`<a class="btn" href="${esc(url)}" target="_blank" rel="noopener">Open ${esc(DOCS[id])}</a>`));
  else $app.append(el(`<div class="notice">No document linked yet. Paste a link (SharePoint, PDF, website) below.</div>`));
  const f = el(`<form><label>Document link</label><input type="text" value="${esc(url)}" placeholder="https://"><div class="row"><button class="btn secondary" type="submit">Save link</button></div></form>`);
  f.onsubmit = (e) => { e.preventDefault(); store.set(key, f.querySelector("input").value.trim()); renderDoc(id); };
  $app.append(f, backRow());
}

function renderAdmin(which) {
  $app.innerHTML = header();
  // If this admin screen also exists as an LBCO Jotform form, show it (embedded) instead of the built-in screen.
  const jf = window.ADMIN_JOTFORM && window.ADMIN_JOTFORM[which];
  if (jf) {
    $app.append(backRow());
    $app.append(jotformFrame(jf, which));
    return;
  }
  if (which === "addsite") {
    $app.append(el(`<h2>Add New Work Site</h2>`));
    const f = el(`<form><label>Site name</label><input type="text" name="name" required><label>Address / location</label><input type="text" name="addr"><label>Site contact</label><input type="text" name="contact"><div class="row"><button class="btn" style="width:auto" type="submit">Add site</button></div></form>`);
    f.onsubmit = (e) => {
      e.preventDefault();
      const s = sites(); s.push({ name: f.name.value.trim(), addr: f.addr.value.trim(), contact: f.contact.value.trim() });
      store.set("lbco.sites", s); location.hash = "#admin/sites";
    };
    $app.append(f);
  } else {
    $app.append(el(`<h2>Update / Delete Existing Work Sites</h2>`));
    const s = sites();
    if (!s.length) $app.append(el(`<div class="notice">No work sites yet.</div>`));
    else {
      const t = el(`<table><tr><th>Name</th><th>Address</th><th>Contact</th><th></th></tr></table>`);
      s.forEach((x, i) => {
        const r = el(`<tr><td><input type="text" value="${esc(x.name)}"></td><td><input type="text" value="${esc(x.addr)}"></td><td><input type="text" value="${esc(x.contact)}"></td><td></td></tr>`);
        const save = el(`<button class="btn secondary">Save</button>`);
        const del = el(`<button class="btn danger">Delete</button>`);
        save.onclick = () => { const [n, a, c] = r.querySelectorAll("input"); s[i] = { name: n.value, addr: a.value, contact: c.value }; store.set("lbco.sites", s); save.textContent = "Saved"; };
        del.onclick = () => { if (confirm(`Delete ${x.name}?`)) { s.splice(i, 1); store.set("lbco.sites", s); renderAdmin("sites"); } };
        r.lastChild.append(save, del); t.append(r);
      });
      $app.append(t);
    }
  }
  $app.append(backRow());
}

function exportCsv() {
  const rows = submissions();
  if (!rows.length) return alert("No submissions yet.");
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r.data)))];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [["form", "submitted", ...cols].map(q).join(",")]
    .concat(rows.map((r) => [r.title, r.submitted, ...cols.map((c) => r.data[c])].map(q).join(","))).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `lbco-submissions-${today()}.csv`; a.click();
}

function renderReport(id) {
  const r = window.REPORTS && window.REPORTS[id];
  $app.innerHTML = header();
  $app.append(backRow());
  if (!r) { $app.append(el(`<div class="notice">Report not found.</div>`)); return; }
  $app.append(el(`<h2>${esc(r.title)}</h2>`));
  $app.append(el(`<iframe title="${esc(r.title)}" src="${esc(r.src)}" style="width:100%;height:85vh;min-height:600px;border:0"></iframe>`));
  $app.append(el(`<div class="row"><a class="btn secondary" href="${esc(r.src)}" target="_blank" rel="noopener">Open in new tab</a></div>`));
}

function route() {
  const [kind, id] = location.hash.slice(1).split("/");
  if (kind === "form") renderForm(id);
  else if (kind === "doc") renderDoc(id);
  else if (kind === "admin") renderAdmin(id);
  else if (kind === "report") renderReport(id);
  else home();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
route();
