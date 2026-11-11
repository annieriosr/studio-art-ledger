import {
  assertWriteAuthorized,
  commitFiles,
  readTextFile,
} from "./sales-store.mjs";

/** Named datasets Annie edits on the live site (shared across devices). */
export const DATASETS = {
  outreach: {
    path: "fairs/casas-ecuador-2026/invitados-inauguracion.json",
    label: "outreach invitados",
  },
  booth: {
    path: "fairs/casas-ecuador-2026/booth-tracker-state.json",
    label: "booth tracker",
  },
  drafts: {
    path: "data/ledger-drafts.json",
    label: "catalogue drafts",
  },
  sales: {
    path: "data/cosas-sales.json",
    label: "sale bills",
  },
};

export { assertWriteAuthorized };

export function listDatasets() {
  return Object.keys(DATASETS).map((key) => ({
    key,
    path: DATASETS[key].path,
    label: DATASETS[key].label,
  }));
}

export async function loadDataset(key) {
  const meta = DATASETS[key];
  if (!meta) {
    throw Object.assign(new Error("Unknown dataset: " + key), { status: 400 });
  }
  const file = await readTextFile(meta.path);
  if (!file) return { key, path: meta.path, data: null, exists: false };
  try {
    return { key, path: meta.path, data: JSON.parse(file.text), exists: true };
  } catch {
    throw Object.assign(new Error("Corrupt JSON at " + meta.path), { status: 500 });
  }
}

export async function saveDataset(key, data) {
  const meta = DATASETS[key];
  if (!meta) {
    throw Object.assign(new Error("Unknown dataset: " + key), { status: 400 });
  }
  if (data == null || typeof data !== "object") {
    throw Object.assign(new Error("data must be a JSON object"), { status: 400 });
  }
  const stamped =
    Array.isArray(data)
      ? data
      : { ...data, updated: data.updated || new Date().toISOString() };
  const text = JSON.stringify(stamped, null, 2) + "\n";
  const persist = await commitFiles(`chore(site): save ${meta.label}`, {
    [meta.path]: text,
  });
  return { key, path: meta.path, data: stamped, persist };
}
