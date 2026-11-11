import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import salesHandler from "./api/sales.js";
import confirmSaleHandler from "./api/confirm-sale.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "2mb" }));

function adapt(handler) {
  return (req, res) => handler(req, res);
}

app.all("/api/sales", adapt(salesHandler));
app.all("/api/confirm-sale", adapt(confirmSaleHandler));

// Serve all static files from root directory
app.use(express.static(__dirname));

// Route fallback for client navigation (skip API)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({ ok: false, error: "Not found" });
    return;
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
