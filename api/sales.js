import {
  assertWriteAuthorized,
  loadSales,
  saveBill,
  soldWorkIds,
} from "../lib/sales-store.mjs";

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

export default async function handler(req, res) {
  try {
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Ledger-Token");
      res.end();
      return;
    }

    if (req.method === "GET") {
      const store = await loadSales();
      send(res, 200, {
        ok: true,
        store,
        soldWorkIds: soldWorkIds(store),
      });
      return;
    }

    if (req.method === "POST") {
      assertWriteAuthorized(req);
      const body = await readJson(req);
      const bill = body.bill || body;
      if (!bill || typeof bill !== "object") {
        send(res, 400, { ok: false, error: "Missing bill payload" });
        return;
      }
      const result = await saveBill(bill);
      send(res, 200, {
        ok: true,
        record: result.record,
        store: result.store,
        persist: result.persist,
        soldWorkIds: soldWorkIds(result.store),
      });
      return;
    }

    send(res, 405, { ok: false, error: "Method not allowed" });
  } catch (e) {
    send(res, e.status || 500, { ok: false, error: e.message || String(e) });
  }
}
