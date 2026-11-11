import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  assertWriteAuthorized,
  commitFiles,
  readTextFile,
} from "../lib/sales-store.mjs";
import { loadDataset } from "../lib/site-state.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LEDGER_REL = "data/ledger.json";
const INJECT_PAIRS = [
  ["index.template.html", "index.html"],
  ["certificado.template.html", "certificado.html"],
  ["carta.template.html", "carta.html"],
  ["carta-presentacion.template.html", "carta-presentacion.html"],
  ["tarjeta-exposicion.template.html", "tarjeta-exposicion.html"],
];

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function inject(ledgerText) {
  const out = {};
  for (const [tmpl, dest] of INJECT_PAIRS) {
    const html = fs.readFileSync(path.join(ROOT, tmpl), "utf8");
    out[dest] = html.replace("__LEDGER__", ledgerText);
  }
  return out;
}

export default async function handler(req, res) {
  try {
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Ledger-Token");
      res.end();
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "Method not allowed" });
      return;
    }
    assertWriteAuthorized(req);
    const body = await readJson(req);
    const incoming = body.drafts || body.data || null;
    const loaded = incoming || (await loadDataset("drafts")).data || {};
    const drafts = loaded && typeof loaded === "object" ? loaded : {};

    const ledgerFile = await readTextFile(LEDGER_REL);
    if (!ledgerFile) {
      send(res, 500, { ok: false, error: "ledger.json missing" });
      return;
    }
    const ledger = JSON.parse(ledgerFile.text);
    let addedEvents = 0;
    let addedPeople = 0;
    let addedWorks = 0;
    let issuedDocs = 0;

    if (Array.isArray(drafts.people)) {
      const have = new Set((ledger.people || []).map((p) => p.id));
      drafts.people.forEach((p) => {
        if (!p || !p.id || have.has(p.id)) return;
        ledger.people.push(p);
        have.add(p.id);
        addedPeople++;
      });
    }

    if (Array.isArray(drafts.works)) {
      const have = new Set((ledger.works || []).map((w) => w.id));
      drafts.works.forEach((w) => {
        if (!w || !w.id || have.has(w.id)) return;
        ledger.works.push(w);
        have.add(w.id);
        addedWorks++;
      });
    }

    if (Array.isArray(drafts.events)) {
      ledger.events = ledger.events || [];
      drafts.events.forEach((e) => {
        if (!e || !e.work || !e.type) return;
        const ev = {
          ...e,
          draft: undefined,
          notes: [e.notes, e.draft ? "Publicado desde borrador del sitio." : null]
            .filter(Boolean)
            .join(" "),
          source: e.source || "site-drafts",
        };
        delete ev.draft;
        ledger.events.push(ev);
        addedEvents++;
      });
    }

    if (drafts.issued && typeof drafts.issued === "object") {
      Object.keys(drafts.issued).forEach((docId) => {
        if (!drafts.issued[docId]) return;
        const doc = (ledger.documents || []).find((d) => d.id === docId);
        if (doc && doc.status !== "issued") {
          doc.status = "issued";
          doc.issued = doc.issued || new Date().toISOString().slice(0, 10);
          issuedDocs++;
        }
      });
    }

    if (drafts.verso && typeof drafts.verso === "object") {
      Object.keys(drafts.verso).forEach((workId) => {
        const w = (ledger.works || []).find((x) => x.id === workId);
        if (!w) return;
        w.verso_marked = !!drafts.verso[workId];
      });
    }

    const cleared = {
      version: 1,
      updated: new Date().toISOString(),
      events: [],
      people: [],
      works: [],
      issued: {},
      verso: drafts.verso || {},
      note: "Borradores publicados al libro; eventos/personas/obras vaciados tras publish.",
    };

    const ledgerOut = JSON.stringify(ledger, null, 2) + "\n";
    const draftsOut = JSON.stringify(cleared, null, 2) + "\n";
    const files = {
      [LEDGER_REL]: ledgerOut,
      "data/ledger-drafts.json": draftsOut,
      ...inject(ledgerOut),
    };
    const persist = await commitFiles(
      `chore(ledger): publish site drafts (+${addedEvents} events, +${addedWorks} works, +${addedPeople} people)`,
      files
    );

    send(res, 200, {
      ok: true,
      persist,
      addedEvents,
      addedPeople,
      addedWorks,
      issuedDocs,
      drafts: cleared,
      message:
        "Borradores publicados al libro del estudio. El catálogo se actualiza tras el redespliegue (~1 min).",
    });
  } catch (e) {
    send(res, e.status || 500, { ok: false, error: e.message || String(e) });
  }
}
