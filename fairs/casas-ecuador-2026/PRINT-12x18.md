# Print shop notes — Cosas Ecuador price lists

**File to print:** [`price-list-print-12x18.html`](./price-list-print-12x18.html)  
(Optional PDF export of the same layout: [`price-list-print-12x18.pdf`](./price-list-print-12x18.pdf))

## Spec

| Item | Value |
|---|---|
| Paper | **Papel satinado** (satin), **12 × 18 inches** |
| Sides | **Double-sided (duplex)** |
| Pages in file | **2** — clearly labeled **FRONT** and **BACK** |
| Cut size | **297 × 95 mm** per strip |
| Strips per side | **4** (stacked along the 18″ edge; 297 mm along the 12″ edge) |
| Complete lists per sheet | **4** |

Each finished cut piece is one complete price list: **FRONT = Strip A** (booth works) · **BACK = Strip B** (additional works) · all 8 works.

## How to print

1. Open the HTML in Chrome (or use the PDF).
2. Print / Export PDF at **100% scale / Actual size** — **do not** “Fit to page” or “Shrink to fit”.
3. Page size: **12 × 18 in** (custom / tabloid-extra as your RIP allows). Margins: **none / 0**.
4. Duplex: **flip on the short edge** (the 12″ edge) so strip 1 on FRONT registers with strip 1 on BACK.
5. Color, high quality. Preserve background graphics if the driver asks.

## Cut & trim

- Cut marks sit at each strip corner (hairline crosses).
- Live strip is exactly **297 × 95 mm**.
- Horizontal spare on 12″ stock is only **~3.9 mm per side** (12″ − 297 mm = 7.8 mm total). **Center the form on the 12″ edge**; do not scale to invent margin.
- Vertical spare along 18″ (~77 mm total) is used for top/bottom pad, gaps between strips, and the FRONT/BACK page labels (outside the cut area).

## Yield math

- 1 sheet × 4 strips × duplex (A/B) = **4 complete double-sided price lists**.
- Example: 20 lists → print **5 sheets**.

## Source design

Visual design and artwork thumbnails match [`price-list.html`](./price-list.html). Do not substitute the A4 single-sided voucher file for this 12×18 duplex form.

## Regenerating the PDF (optional)

From this folder, with Google Chrome installed:

```bash
google-chrome --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=price-list-print-12x18.pdf \
  --virtual-time-budget=15000 \
  "file://$PWD/price-list-print-12x18.html"
```

Confirm the PDF is **2 pages**, each **864 × 1296 pt** (12×18 in).
