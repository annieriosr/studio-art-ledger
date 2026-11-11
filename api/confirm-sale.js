import { assertWriteAuthorized, confirmSale, soldWorkIds } from "../lib/sales-store.mjs";

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
    const bill = body.bill || body;
    if (!bill || typeof bill !== "object") {
      send(res, 400, { ok: false, error: "Missing bill payload" });
      return;
    }
    const result = await confirmSale(bill);
    send(res, 200, {
      ok: true,
      record: result.record,
      store: result.store,
      persist: result.persist,
      personId: result.personId,
      soldWorkIds: soldWorkIds(result.store),
      message:
        "Venta guardada en el sitio. El libro marca la obra como vendida; Vercel redespliega en ~1 min.",
    });
  } catch (e) {
    send(res, e.status || 500, { ok: false, error: e.message || String(e) });
  }
}
