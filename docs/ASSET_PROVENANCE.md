# Homepage asset provenance

Updated 2026-11-19 at the user's request. The homepage now lists Scope-WM, FS²D, and SGF3D. The former placeholder illustrations have been replaced by actual paper architecture figures. The user's existing night portrait is displayed on the left; the new portrait QR is on the right.

## Paper figures

Both figures were rendered directly from the supplied PDF page with PyMuPDF at 3 pixels per PDF point (216 dpi). Only whitespace, headers, surrounding body text, and captions were excluded. The figure content was not redrawn or AI-generated. Original rights remain with the authors and publishers.

| Asset | Source PDF | Page / figure | Clip rectangle in PDF points | Output pixels |
| --- | --- | --- | --- | --- |
| `images/fs2d-architecture.png` | `FS2D_Fully_Sparse_Few-Shot_3D_Object_Detection.pdf` | 3 / Figure 2 | `[82, 65, 507, 335]` | 1275 × 810 |
| `images/sgf3d-architecture.png` | `SGF3D.pdf` | 3 / Figure 2 | `[108, 54, 487, 288]` | 1137 × 702 |

Source PDF SHA-256:

```text
FS2D_Fully_Sparse_Few-Shot_3D_Object_Detection.pdf
3011623cb916a2ae24da13c80b37db8bfe9b15d60a6127a878ded66088e83775

SGF3D.pdf
c0d3a5b62e7bffa53039676dd2ddb52bedcf62d4836556d74216b5a43d8ac55d
```

The extracted figures were visually inspected against complete rendered source pages. No full PDF is included in the published site.

## Portrait QR

- Image generation mode: **built-in ImageGen**, no API/CLI fallback.
- Identity input: the user's supplied outdoor selfie.
- Style input: the user's supplied monochrome portrait QR reference; its subject was not used as the identity.
- Structure input: a real QR template encoding `https://chunzheng2022.github.io/`.
- Artwork output: `images/portrait-qr-art.png`, 1254 × 1254 pixels.
- Final website asset: `images/portrait-qr.svg`.

The raw ImageGen artwork did not decode reliably, so it is not presented as a working code on its own. The final SVG preserves that artwork and adds deterministic QR sampling centers and control patterns. The exact matrix was generated with qrcode 8.2, QR version 6, error correction H, and a 4-module quiet zone; it is retained in `scripts/qr-matrix.json`. Data modules have a square core of 0.36 module width, and function modules and the quiet zone are restored in full. The artwork is embedded directly, so the final SVG has no remote dependencies.

Rebuild without installing packages:

```text
node scripts/build-portrait-qr.mjs
```

The final SVG was rasterized for verification and decoded with ZXing-C++ 3.1.1 at multiple sizes, including the desktop display size. Successful decoding demonstrates a valid encoded link; individual camera, screen, and lighting conditions can still affect scanning. Clicking the displayed QR opens its full-size asset.

### Initial ImageGen prompt

```text
Use case: style-transfer / identity-preserve. Asset: square black-and-white portrait QR artwork for a personal academic homepage. Image 1 is the actual QR code encoding https://chunzheng2022.github.io/ and is the structure target; Image 2 is the exact person whose face must be recognizably preserved; Image 3 is ONLY the desired dense stippled portrait QR aesthetic, do NOT copy that person's identity. Create one finished square QR portrait with the young man from image 2, recognizable full face and short hair, looking forward, friendly natural expression, no beautification or new identity. Closely match the rich monochrome halftone, pixel stippling and face-formed-by-code aesthetic of image 3. Use a white background and pure black/white marks with a clear quiet white margin all around. Integrate the face across the central code area, preserve the three sharp square corner finder patterns and their white separators from image 1. Critically preserve the exact black/white polarity at the center of EVERY QR module in image 1, plus all timing and alignment modules, so a scanner still reads the original homepage URL; use smaller stippling and portrait detail BETWEEN module sampling centers to form facial features. The goal is a real scannable code fused with a portrait, not a photo pasted over a code. No words, no logos, no colored pixels, no landscape background, no border, no extra QR codes.
```

## Sparse pixel revision — 2026-11-19

The user requested less density, a lower-resolution appearance, and a lower head position. The built-in ImageGen tool edited the previous artwork using the same selfie as the identity reference and the exact QR template as a geometry reference. The revision uses coarse black-and-white pixel clusters with a smaller head in the lower part of the square; the dense realistic halftone has been removed. The left-side original photograph is unchanged.

The replacement artwork is saved at `images/portrait-qr-art.png` (1254 × 1254). The final saved asset remains `images/portrait-qr.svg`; the previous image is preserved in Git history. The SVG generator now leaves a portrait ellipse clear of extra sampling dots, centered at normalized coordinates `(0.50, 0.71)` with radii `(0.16, 0.23)`. Function patterns remain intact, and QR error correction H handles the data covered by the face. ZXing-C++ decoded the final asset at 156, 176, 196, and 640 pixels. With a 3 × 3 Gaussian blur at sigma 0.45, 176, 196, and 640 pixels decoded; 156 pixels did not. Clicking the displayed code opens the full-size SVG. Earlier full-overlay validation above refers to the previous version.

### Revision prompt (built-in ImageGen)

```text
Use case: style-transfer, identity-preserve. Edit Image 1, the existing portrait QR artwork, using Image 2 only as the man's identity reference and Image 3 as the unchanged underlying QR geometry. The user finds the current dense realistic face uncanny. Make this a friendly, sparse, low-resolution monochrome PIXEL portrait QR, with visibly larger square pixels on an approximately 80-by-80 virtual pixel grid, much more white space, and about 70% less stippling and facial texture. Keep the same recognizable man, short hair and a subtle relaxed smile, but simplify the face into a handful of clean pixel clusters: minimal eyes, eyebrows, nose and mouth, clean white cheeks, no realistic skin shading or pores, no sharp staring eyes. Keep the gaze level and naturally forward. CRITICAL COMPOSITION: make the entire head smaller and place it LOWER within the fixed QR square: hair begins about 40% down the canvas, eyes around 65% down, mouth around 78%, chin around 87%; leave plenty of quiet code-and-white space above the hair. Face width about 42% of the canvas. The original high forehead and high-positioned head must not remain. Do not move the square QR finder marks, do not shift or resize the whole QR border: reposition only the head. The three corner finder marks and white quiet margin remain crisp, square, and in their exact original positions. Keep QR modules at the original scale; only the portrait art becomes sparse and coarse. Pure black and white, flat pixel art, warm approachable expression, no gray gradients, no scattered tiny noisy dots, no extra people, no text or watermark.
```

## Photography

The `/photography/` page currently contains an empty collection, with no invented photographs. Additions are driven by the static `photography/photos.json` file. The gallery supports portrait and landscape images, captions, an enlarged view, keyboard navigation, and an empty state. The homepage links to it from the profile navigation.
