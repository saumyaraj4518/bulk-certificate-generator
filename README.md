# Bulk Certificate Generator

A browser-only tool that turns a certificate template image and a list of names into finished certificates. Built with plain HTML, CSS, and JavaScript — **no backend, no build step, and nothing is uploaded anywhere.**

## Features

- **Upload template** – any PNG/JPG/WebP background image (or use the built-in sample).
- **Import names** – `.xlsx`, `.xls` or `.csv` (first column is read; a header such as "Name" is skipped automatically), or paste one name per line.
- **Live preview** – change font, size, color and style; flip through names with ◀ ▶.
- **Drag & drop positioning** – drag the name directly on the preview, or fine-tune with X/Y percentage fields.
- **Download** – combined PDF (one page per name), ZIP of PNG images, or the current preview as a single PNG.

## Quick start

1. Download `certificate-generator.html`.
2. Open it in a modern browser (Chrome, Edge, Firefox, Safari). No server needed.
3. Follow the four numbered panels:
   1. Choose your template image.
   2. Upload your names file or paste names.
   3. Adjust text style, then drag the name to the right spot.
   4. Click **Combined PDF** or **Images (ZIP)**.

## Names file format

| Name |
|---|
| Aarav Sharma |
| Priya Verma |
| Rohan Mehta |

Only the first column of the first sheet is used. Empty rows are ignored.

## How it works

- The template is drawn on an HTML `<canvas>` at its **original resolution**; the name is drawn on top, centered on the chosen point.
- Position is stored as a percentage of image width/height, so it stays correct for any template size.
- Font size is in **template pixels**, so large templates need larger values (a starting size is set automatically from the image width).
- PDF pages match the template's dimensions exactly (images embedded as JPEG, quality 0.92).

## Libraries

| Library | Version | Purpose |
|---|---|---|
| [SheetJS](https://sheetjs.com/) | 0.18.5 | Read `.xlsx` / `.csv` |
| [jsPDF](https://github.com/parallax/jsPDF) | 2.5.1 | Build the combined PDF |
| [JSZip](https://stuk.github.io/jszip/) | 3.10.1 | Bundle PNGs into a ZIP |

An internet connection is needed the first time to fetch these. For fully offline use, download the three scripts and change the `<script src>` tags to point to local copies.

## Tips

- Use a template with an empty area (or a blank line) where the name should go.
- Only standard system fonts are offered.
- To use a custom font, add a Google Fonts `<link>` and an `<option>` for it in the font dropdown.
- Very large batches (hundreds of names on high-resolution templates) can use a lot of memory; if the browser struggles, generate in smaller batches.
- File names in the ZIP are numbered (`001_Name.png`) so they stay in list order.

## Customizing

All logic lives in the `<script>` block at the bottom of the HTML file:

- `paint()` – draws the template and the name (add more text fields such as date or title here).
- `getNames()` / names import handler – change how names are parsed.
- `dlPdf`, `dlZip`, `dlOne` – export handlers.

## Browser support

Any recent version of Chrome, Edge, Firefox or Safari.
