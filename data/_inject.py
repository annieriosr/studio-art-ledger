# Inject ledger.json into the print templates. Not Fitpass.
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
ledger = (root / 'data' / 'ledger.json').read_text(encoding='utf-8')
pairs = [
    ('index.template.html', 'index.html'),
    ('certificado.template.html', 'certificado.html'),
    ('carta.template.html', 'carta.html'),
    ('carta-presentacion.template.html', 'carta-presentacion.html'),
]
for tmpl, out in pairs:
    html = (root / tmpl).read_text(encoding='utf-8')
    if '__LEDGER__' not in html:
        raise SystemExit(f'missing __LEDGER__ in {tmpl}')
    (root / out).write_text(html.replace('__LEDGER__', ledger), encoding='utf-8')
    print('wrote', out)
