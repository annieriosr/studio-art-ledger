import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const ledger = fs.readFileSync(path.join(root, 'data', 'ledger.json'), 'utf-8');
const pairs = [
  ['index.template.html', 'index.html'],
  ['certificado.template.html', 'certificado.html'],
  ['carta.template.html', 'carta.html'],
  ['carta-presentacion.template.html', 'carta-presentacion.html'],
  ['tarjeta-exposicion.template.html', 'tarjeta-exposicion.html'],
];

for (const [tmpl, out] of pairs) {
  const html = fs.readFileSync(path.join(root, tmpl), 'utf-8');
  if (!html.includes('__LEDGER__')) {
    console.error(`missing __LEDGER__ in ${tmpl}`);
    process.exit(1);
  }
  fs.writeFileSync(path.join(root, out), html.replace('__LEDGER__', ledger), 'utf-8');
  console.log('wrote', out);
}
