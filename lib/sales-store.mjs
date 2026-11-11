import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SALES_REL = "data/cosas-sales.json";
const LEDGER_REL = "data/ledger.json";
const INJECT_PAIRS = [
  ["libro.template.html", "libro.html"],
  ["certificado.template.html", "certificado.html"],
  ["carta.template.html", "carta.html"],
  ["carta-presentacion.template.html", "carta-presentacion.html"],
  ["tarjeta-exposicion.template.html", "tarjeta-exposicion.html"],
];

const REPO = process.env.GITHUB_REPO || "annieriosr/studio-art-ledger";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const PLACE =
  "Cosas Ecuador — Stillness & Refractions, Guayaquil";

function emptySales() {
  return { version: 1, seq: 1, updated: null, sales: [] };
}

function stamp() {
  return new Date().toISOString();
}

function hasGithub() {
  return !!(process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.LEDGER_GITHUB_TOKEN);
}

function githubToken() {
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.LEDGER_GITHUB_TOKEN || "";
}

function writeToken() {
  return process.env.LEDGER_WRITE_TOKEN || "";
}

export { hasGithub, githubToken, writeToken };

export function assertWriteAuthorized(req) {
  const expected = writeToken();
  // Local/dev: allow when no token configured and not on Vercel
  if (!expected && !process.env.VERCEL) return;
  if (!expected) {
    const err = new Error("LEDGER_WRITE_TOKEN is not configured on the server");
    err.status = 503;
    throw err;
  }
  const got =
    req.headers["x-ledger-token"] ||
    (String(req.headers.authorization || "").match(/^Bearer\s+(.+)$/i) || [])[1] ||
    "";
  if (got !== expected) {
    const err = new Error("Unauthorized — set the studio save key");
    err.status = 401;
    throw err;
  }
}

async function gh(pathname, opts = {}) {
  const token = githubToken();
  if (!token) throw Object.assign(new Error("GITHUB_TOKEN missing"), { status: 503 });
  const res = await fetch(`https://api.github.com/repos/${REPO}${pathname}`, {
    ...opts,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "studio-art-ledger-sales",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw Object.assign(new Error(`GitHub ${res.status}: ${text.slice(0, 300)}`), {
      status: res.status >= 500 ? 502 : res.status,
    });
  }
  if (res.status === 204) return null;
  return res.json();
}

async function readGithubFile(relPath) {
  const data = await gh(`/contents/${relPath}?ref=${encodeURIComponent(BRANCH)}`);
  const text = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
  return { text, sha: data.sha };
}

function readFsFile(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  return { text: fs.readFileSync(abs, "utf8"), sha: null };
}

export async function loadSales() {
  if (hasGithub() && process.env.VERCEL) {
    try {
      const { text } = await readGithubFile(SALES_REL);
      return normalizeSales(JSON.parse(text));
    } catch (e) {
      if (e.status === 404) return emptySales();
      throw e;
    }
  }
  const local = readFsFile(SALES_REL);
  if (!local) return emptySales();
  try {
    return normalizeSales(JSON.parse(local.text));
  } catch {
    return emptySales();
  }
}

function normalizeSales(raw) {
  const s = raw && typeof raw === "object" ? raw : emptySales();
  if (!Array.isArray(s.sales)) s.sales = [];
  if (!s.seq) s.seq = 1;
  s.version = 1;
  return s;
}

function injectFromLedgerText(ledgerText) {
  const out = {};
  for (const [tmpl, dest] of INJECT_PAIRS) {
    const html = fs.readFileSync(path.join(ROOT, tmpl), "utf8");
    if (!html.includes("__LEDGER__")) {
      throw new Error(`missing __LEDGER__ in ${tmpl}`);
    }
    out[dest] = html.replace("__LEDGER__", ledgerText);
  }
  return out;
}

export async function readTextFile(relPath) {
  // On Vercel with a GitHub token, the repo is source of truth (post-save).
  // Fall back to the deployed filesystem seed when GitHub is missing/404.
  if (hasGithub() && process.env.VERCEL) {
    try {
      return await readGithubFile(relPath);
    } catch (e) {
      if (e.status !== 404) throw e;
    }
  }
  return readFsFile(relPath);
}

export async function commitFiles(message, files) {
  // files: { path: stringContent }
  if (hasGithub() && (process.env.VERCEL || process.env.SALES_FORCE_GITHUB === "1")) {
    const ref = await gh(`/git/ref/heads/${BRANCH}`);
    const baseSha = ref.object.sha;
    const baseCommit = await gh(`/git/commits/${baseSha}`);
    const blobs = [];
    for (const [filePath, content] of Object.entries(files)) {
      const blob = await gh("/git/blobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, encoding: "utf-8" }),
      });
      blobs.push({ path: filePath, mode: "100644", type: "blob", sha: blob.sha });
    }
    const tree = await gh("/git/trees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree: blobs }),
    });
    const commit = await gh("/git/commits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        tree: tree.sha,
        parents: [baseSha],
      }),
    });
    await gh(`/git/refs/heads/${BRANCH}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sha: commit.sha }),
    });
    return { mode: "github", sha: commit.sha };
  }

  for (const [filePath, content] of Object.entries(files)) {
    const abs = path.join(ROOT, filePath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, "utf8");
  }
  return { mode: "fs" };
}

function slugPerson(name) {
  return String(name || "buyer")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "buyer";
}

function upsertSaleRecord(store, bill) {
  const id = bill.draftId || bill.id || `d${Date.now()}`;
  const record = {
    ...bill,
    id,
    draftId: id,
    updated: stamp(),
  };
  const idx = store.sales.findIndex((s) => s.id === id);
  if (idx >= 0) store.sales[idx] = { ...store.sales[idx], ...record };
  else store.sales.push(record);

  const m = String(record.invoiceNumber || "").match(/AR-CE-\d{4}-(\d+)/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= (store.seq || 1)) store.seq = n + 1;
  }
  store.updated = stamp();
  return { store, record };
}

export async function saveBill(bill) {
  const store = await loadSales();
  const { store: next, record } = upsertSaleRecord(store, {
    ...bill,
    status: bill.status === "sold" ? "sold" : bill.status || "draft",
  });
  const payload = JSON.stringify(next, null, 2) + "\n";
  const result = await commitFiles(
    `chore(sales): auto-save bill ${record.invoiceNumber || record.id}`,
    { [SALES_REL]: payload }
  );
  return { record, store: next, persist: result };
}

function loadLedgerText() {
  if (hasGithub() && process.env.VERCEL) {
    return readGithubFile(LEDGER_REL).then((r) => r.text);
  }
  return Promise.resolve(readFsFile(LEDGER_REL).text);
}

function applySaleToLedger(ledger, bill) {
  const workId = bill.inventoryId || bill.workId;
  if (!workId) throw Object.assign(new Error("Missing inventory ID"), { status: 400 });
  if (!bill.buyerName || !String(bill.buyerName).trim()) {
    throw Object.assign(new Error("Buyer name required to mark sold"), { status: 400 });
  }

  const personId = bill.personId || `p-ce-${slugPerson(bill.buyerName)}-${workId.toLowerCase()}`;
  let person = (ledger.people || []).find((p) => p.id === personId);
  const personNotes = [
    "Comprador Cosas Ecuador 2026 (Stillness & Refractions).",
    bill.buyerEmail ? `Email: ${bill.buyerEmail}` : null,
    bill.buyerPhone ? `Tel: ${bill.buyerPhone}` : null,
    bill.buyerTaxId ? `ID/tax: ${bill.buyerTaxId}` : null,
    bill.buyerAddress || null,
  ]
    .filter(Boolean)
    .join(" ");

  if (!person) {
    person = {
      id: personId,
      name: String(bill.buyerName).trim(),
      place: bill.buyerCountry || "Ecuador",
      notes: personNotes,
    };
    ledger.people = ledger.people || [];
    ledger.people.push(person);
  } else {
    person.name = String(bill.buyerName).trim();
    person.place = bill.buyerCountry || person.place || "Ecuador";
    person.notes = personNotes;
  }

  const price = Number(String(bill.salePrice || "").replace(/[^0-9.]/g, ""));
  const saleDate = bill.saleDate || stamp().slice(0, 10);
  const invoiceNo = bill.invoiceNumber || "";

  // Remove prior Cosas auto-sale for same work (idempotent reconfirm)
  ledger.events = (ledger.events || []).filter(
    (e) => !(e.work === workId && e.type === "sold" && e.source === "cosas-factura")
  );
  ledger.events.push({
    work: workId,
    date: saleDate,
    type: "sold",
    place: PLACE,
    person: personId,
    price: isFinite(price) ? price : null,
    currency: bill.currency || "USD",
    notes: [
      invoiceNo ? `Factura ${invoiceNo}.` : null,
      bill.paymentMethod ? `Pago: ${bill.paymentMethod}.` : null,
      bill.paymentLink ? `Cuanto: ${bill.paymentLink}.` : null,
      bill.saleNotes || null,
      "Registrado desde factura Cosas (site).",
    ]
      .filter(Boolean)
      .join(" "),
    source: "cosas-factura",
  });

  const invId = `invoice-${workId}`;
  let inv = (ledger.documents || []).find((d) => d.id === invId || (d.work === workId && d.type === "invoice"));
  const invNotes = `Factura ${invoiceNo || "—"}. Cosas Ecuador 2026. Comprador: ${person.name}.`;
  if (inv) {
    inv.status = "issued";
    inv.issued = saleDate;
    inv.notes = invNotes;
  } else {
    ledger.documents = ledger.documents || [];
    ledger.documents.push({
      id: invId,
      work: workId,
      type: "invoice",
      status: "issued",
      issued: saleDate,
      notes: invNotes,
    });
  }

  const work = (ledger.works || []).find((w) => w.id === workId);
  if (work) {
    work.notes = Array.isArray(work.notes) ? work.notes.slice() : work.notes ? [String(work.notes)] : [];
    const marker = `Vendida Cosas Ecuador 2026 (${saleDate}) — ${person.name} — factura ${invoiceNo || "—"}.`;
    work.notes = work.notes.filter((n) => !String(n).startsWith("Vendida Cosas Ecuador 2026"));
    work.notes.push(marker);
  }

  return { ledger, personId };
}

export async function confirmSale(bill) {
  const salesStore = await loadSales();
  const { store, record } = upsertSaleRecord(salesStore, {
    ...bill,
    status: "sold",
    soldAt: stamp(),
  });
  record.personId = record.personId || `p-ce-${slugPerson(record.buyerName)}-${String(record.inventoryId || record.workId || "").toLowerCase()}`;

  const ledgerText = await loadLedgerText();
  const ledger = JSON.parse(ledgerText);
  const { ledger: nextLedger, personId } = applySaleToLedger(ledger, record);
  record.personId = personId;

  const ledgerOut = JSON.stringify(nextLedger, null, 2) + "\n";
  const salesOut = JSON.stringify(store, null, 2) + "\n";
  const injected = injectFromLedgerText(ledgerOut);

  const files = {
    [SALES_REL]: salesOut,
    [LEDGER_REL]: ledgerOut,
    ...injected,
  };

  const persist = await commitFiles(
    `sale: mark ${record.inventoryId || record.workId} sold (${record.invoiceNumber || record.id})`,
    files
  );

  return { record, store, persist, personId };
}

export function soldWorkIds(store) {
  const ids = new Set();
  for (const s of store.sales || []) {
    if (s.status === "sold" && (s.inventoryId || s.workId)) ids.add(s.inventoryId || s.workId);
  }
  return [...ids];
}
