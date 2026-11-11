import {
  assertWriteAuthorized,
  listDatasets,
  loadDataset,
  saveDataset,
} from "../lib/site-state.mjs";

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function queryKey(req) {
  try {
    const u = new URL(req.url, "http://localhost");
    return u.searchParams.get("key") || "";
  } catch {
    return "";
  }
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

export default async function handler(req, res) {
  try {
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Ledger-Token");
      res.end();
      return;
    }

    if (req.method === "GET") {
      const key = queryKey(req);
      if (!key) {
        send(res, 200, { ok: true, datasets: listDatasets() });
        return;
      }
      const loaded = await loadDataset(key);
      send(res, 200, { ok: true, ...loaded });
      return;
    }

    if (req.method === "POST" || req.method === "PUT") {
      assertWriteAuthorized(req);
      const body = await readJson(req);
      const key = body.key || queryKey(req);
      if (!key) {
        send(res, 400, { ok: false, error: "Missing key (outreach|booth|drafts|sales)" });
        return;
      }
      const result = await saveDataset(key, body.data);
      send(res, 200, { ok: true, ...result });
      return;
    }

    send(res, 405, { ok: false, error: "Method not allowed" });
  } catch (e) {
    send(res, e.status || 500, { ok: false, error: e.message || String(e) });
  }
}
