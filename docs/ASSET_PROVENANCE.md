# Homepage asset provenance

Updated 2026-11-24 at the user's request. The homepage lists Scope-WM, FS²D, and SGF3D, with actual paper architecture figures. The user's existing night portrait is displayed on the left; the two-stage line-drawing QR is on the right.

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
- Current identity and composition input: the user's supplied night waterfront photograph, including the raised-arm pose. Earlier selfie-based revisions are recorded below.
- Current intermediate: `images/portrait-line-art.png`, a standalone simplified drawing generated before the QR fusion stage.
- Style input: the user's supplied monochrome portrait QR reference; its subject was not used as the identity.
- Structure input: a real QR template encoding `https://chunzheng2022.github.io/`.
- Artwork output: `images/portrait-qr-art.png`, 1254 × 1254 pixels.
- Final website asset: `images/portrait-qr.svg`.

The raw ImageGen artwork is not used as a standalone working code. The current final SVG preserves the artwork and adds deterministic QR sampling centers throughout the complete image, plus control patterns. The exact matrix was generated with qrcode 8.2, QR version 6, error correction H, and a 4-module quiet zone; it is retained in `scripts/qr-matrix.json`. Data modules now have a square core of 0.50 module width, function modules are restored in full, and solid white border strips define the quiet zone. The artwork is embedded directly, so the final SVG has no remote dependencies. The revisions below record the previous styles and their validation separately.

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

## Integrated mosaic revision — 2026-11-19

The user clarified that the face should emerge faintly from the QR pixels themselves, following a new supplied reference, with no separate portrait area. The selected built-in ImageGen output uses the new reference's square-pixel density treatment and the original selfie for identity. Pixel texture crosses the forehead, eyes, nose, cheeks, mouth, hair, and shoulders. The head is slightly below center, and its edges dissolve into the surrounding field.

The first draft in this revision still separated the face from a coarser QR background and was discarded. The selected second draft was generated without the coarse QR template as a style input. The final artwork replaces `images/portrait-qr-art.png` (1254 × 1254); the final website file remains `images/portrait-qr.svg`. Previous published variants remain in Git history.

The generator's portrait exclusion ellipse has been removed. Exact sampling cores of width 0.50 module are applied across all data modules, including those over the face. Function patterns use crisp edges, and four solid border strips keep the quiet zone clear. This retains one continuous mosaic rather than a cleared face-shaped region. A trial at the earlier 0.36 sampling width failed at 156 pixels and under mild blur at 196 pixels; the final 0.50 width decoded successfully at **156, 176, 196, and 640 pixels**, both normally and with a 3 × 3 Gaussian blur at sigma 0.45, using ZXing-C++ 3.1.1. The decoded value was always `https://chunzheng2022.github.io/`.

### Selected prompt (built-in ImageGen)

```text
Use case: style-transfer / identity-preserve. Image 1 is the exact artistic reference and Image 2 is the identity reference. Recreate the SAME uniform square-pixel QR halftone technique as Image 1, using the man in Image 2 instead. Make one square black-and-white QR art image on white. It should FIRST read as a field of QR-code pixels, with the man's face only faintly discoverable inside it, like a soft low-contrast watermark. All regions of the central data field, including the entire face, must use the SAME small square pixel units and similar busy pixel density. Break up the forehead, eyes, cheeks, nose, mouth, hairline and head silhouette completely into disconnected QR-like black-and-white square clusters. White cheek areas should still contain substantial black pixel coverage, about 35-45%; dark hair should contain many white pixel holes. Let only subtle variations in black/white proportion suggest broad facial planes. Blur and reduce the contrast of the underlying face before interpreting it as square pixels. Do not draw a recognizable clean face on top of a QR code. No white face-shaped cutout, no outlined head, no long continuous feature strokes, no comic portrait, no isolated portrait zone, no photo panel, no skin stippling. The texture across the background and face must blend seamlessly without a visible boundary, just like Image 1. At close range the face is difficult to see; at thumbnail size a faint likeness emerges. Approximately 100 square micro-pixel cells across the image, coarse enough to see individually but fine enough that no area becomes a cartoon. Keep the real man's short hairstyle and gentle expression, but subordinate detail to the QR texture. Position the hidden head slightly below the image center, eyes around 60-63% down the canvas, chin around 88%, not at the very bottom. Three solid square QR corner finders and one smaller bottom-right alignment marker, clean white quiet margin, square composition, pure black/white only, no text or watermark lettering.
```

## Night waterfront photograph revision — 2026-11-19

The user supplied the night waterfront photograph as the new QR source. Built-in ImageGen used this image for identity and composition, with the user's square-pixel QR reference for style. The resulting mosaic preserves the person on the right, the raised arm and bottle extending left, and subtle skyline and water shapes. The face remains near its original photographic scale and position rather than being enlarged into a close-up. Pixel texture continues across the person and background.

The selected artwork replaces `images/portrait-qr-art.png` (1254 × 1254). The final asset remains `images/portrait-qr.svg`, rebuilt with the same full-field 0.50-module sampling cores and solid quiet-zone borders. ZXing-C++ 3.1.1 decoded the final SVG rendered at **156, 176, 196, and 640 pixels**, both normally and after a 3 × 3 Gaussian blur at sigma 0.45. Every decoded value was `https://chunzheng2022.github.io/`. Prior published versions remain in Git history. The left-hand original photograph is unchanged.

### Selected prompt (built-in ImageGen)

```text
Use case: style-transfer / identity-preserve. Create a square black-and-white QR pixel artwork using Image 1, the man's nighttime waterfront photograph, as the source image, and Image 2 ONLY as the drawing-technique reference. Preserve Image 1's relaxed natural face, short hairstyle, upper body on the right, and raised arm reaching toward the upper left holding a bottle. Keep the source composition approximately: head centered around 65% across and 56% down, arm diagonally crossing toward the left, torso extending toward the bottom. Do not enlarge the face into a close-up. Let the skyline and water appear only as very faint broad shapes. Render the ENTIRE scene solely through one continuous field of moderately coarse BLACK AND WHITE SQUARE QR PIXELS, matching the halftone mosaic method of Image 2. The source photograph must look softly blurred and hidden UNDER the QR texture, with the person and gesture emerging only from subtle variations in pixel density. Square black and white pixels must cross the entire face, eyes, forehead, cheeks, shirt, arm and background uniformly; no separate portrait panel, no clean white face oval, no cutout, no clear facial outline, no cartoon, no pasted photo. Favor the natural pose and recognizable silhouette over fine facial details. Keep low facial contrast and quiet eyes, friendly and understated, not a sharply detailed staring face. Lift the dark night scene before translating to halftone so the result has balanced black and white pixels everywhere, not large solid black areas. Approximately 100-120 micro-pixel cells across the QR field, all regions use similar pixel scale, no microscopic skin stippling. Three large crisp square corner finder patterns and one small bottom-right alignment marker, even white quiet margin, no text, no watermark, no color. This is a unified QR mosaic with a faint photograph concealed within it.
```

## Two-stage line drawing revision — 2026-11-24

The user requested an explicit sequence: first simplify the night photograph into a line drawing, then bury that drawing's contours in QR pixels. Both stages used the built-in ImageGen tool, with no CLI/API fallback.

1. `images/profile.png` was converted to `images/portrait-line-art.png` (1254 × 1254). The drawing retains the person on the right, raised arm and bottle, a few skyline contours, and the waterfront railing. Photographic tones, dark sky, and shirt graphics were removed in favor of simple black contours on white.
2. That saved drawing was then supplied to a second ImageGen call, together with the user's QR style reference. Its contours were broken into chains and clusters within a continuous QR-like texture. This stage did not receive the original photograph as an input. The result replaces `images/portrait-qr-art.png` (1254 × 1254).
3. The existing deterministic QR builder produced `images/portrait-qr.svg`, retaining its full-field 0.50-module sampling cores and solid quiet-zone borders. No separate face area is cleared.

The standalone drawing and the final artwork were visually inspected. ZXing-C++ 3.1.1 decoded the final SVG rendered at **156, 176, 196, and 640 pixels**, both normally and after a 3 × 3 Gaussian blur at sigma 0.45. All decoded values were `https://chunzheng2022.github.io/`. Prior website revisions remain in Git history. The left-side original photograph and photography gallery are unchanged.

### Stage 1 prompt — built-in ImageGen

```text
Use case: style-transfer / identity-preserve. Convert the supplied night waterfront photograph into a clean minimalist black line drawing (Chinese jianbihua / 简笔画) on a plain WHITE square canvas. This is stage one only: NO QR code, NO halftone, NO pixels. Preserve the original photograph's composition and identity: the same relaxed young man on the right, short hair, natural gentle smile, head around 65% across and 55% down, torso extending to the bottom, one arm raised diagonally left holding the bottle. Use a small number of smooth confident black contour strokes to describe his face, hair outline, shoulders, T-shirt, arm, hand and bottle. Simplify the facial features into a few subtle short lines while retaining his actual face shape; no exaggerated staring eyes, no caricature or emoji. Hair should be a light outline with only a few short strokes, not a large solid black mass. Simplify the shirt to its outline and a few folds, omit the printed graphic and lettering. Indicate the distant skyline, water and railing with only a few thin unobtrusive lines; remove the photographic night darkness completely. Plenty of white negative space, no filled black backgrounds, no hatching, no gray shading, no photoreal texture. Consistent fine-to-medium line weight, calm friendly editorial sketch, no extra people, no words, no watermark. Keep the face at the source photograph's natural small scale, do not crop or enlarge it into a close-up.
```

### Stage 2 prompt — built-in ImageGen

```text
Use case: compositing / style-transfer. This is stage two of a requested two-stage process. Image 1 is the finished minimalist LINE DRAWING made from the user's photograph; preserve its actual line geometry, the man on the right, his raised arm and bottle on the left, and the few skyline and railing lines. Image 2 supplies ONLY the continuous QR square-pixel texture technique. Transform Image 1 into one square black-and-white QR artwork by BURYING THE SKETCH'S LINES INSIDE THE QR MODULE PATTERN. The sketch must not sit visibly on top of the code, and there must be no separate portrait area. Convert each sketch contour into partially interrupted and occluded chains of QR-like square pixels: let 60-75% of the original continuous lines disappear into the pixel field, so the pose is discovered subtly by following slightly denser aligned pixel clusters. Keep the interior of the face, arm and shirt filled with the SAME QR-style noise as the surrounding background; do not cut out white skin or a white shirt-shaped hole. Use the simplified sketch's contours only, no photographic skin tone, no realistic face shading, no dense halftone photograph, no cartoon sticker. At close range this is a fairly uniform field of square black and white pixels; at thumbnail size the simple line drawing's outline and raised-arm pose emerge softly. Keep a moderate pixel density and approximately 100-120 micro-pixel cells across the field, rather than microscopic dots. Give the hidden contour clusters enough structure to recognize the head, bottle and arm without making the face sharp or intense. Preserve the drawing's natural placement and small face size in the lower-right part of the image. A few broken skyline contours may remain behind the raised arm. Three large crisp square QR corner finders, one smaller bottom-right alignment marker, a clean even white quiet margin. Pure black and white only, no text, no visible separate frame, no watermark. The desired technique is simplified linework woven into QR pixels, with one uninterrupted texture across the entire scene.
```

## Stronger contour revision — 2026-11-24

The user requested more visible contours in the actual displayed QR. Built-in ImageGen edited the previous QR artwork, using the standalone simplified drawing as the contour reference. The head, bottle, raised arm, shoulders, torso, skyline, and railing were reinforced, while the original composition, pose, QR layout, and white border were retained. The standalone drawing remains unchanged.

The selected edit replaces `images/portrait-qr-art.png` (1254 × 1254). The same deterministic builder produced `images/portrait-qr.svg`. The final 196-pixel render was visually inspected to check that the stronger figure and skyline remain visible after restoring the exact QR sampling pattern. ZXing-C++ 3.1.1 decoded the final SVG at **156, 176, 196, and 640 pixels**, both normally and after a 3 × 3 Gaussian blur at sigma 0.45. Every decoded value was `https://chunzheng2022.github.io/`.

### Edit prompt — built-in ImageGen

```text
Use case: precise-object-edit. Edit Image 1, the current QR artwork, using Image 2 ONLY to locate the existing sketch contours. The user likes this exact concept but the figure's outlines disappear when the final QR is displayed at 196 by 196 pixels. Make those contours substantially BOLDER while keeping all geometry and composition unchanged. Increase the effective thickness and black density of the head outline, raised arm, hand, bottle, shoulders and torso contours to approximately THREE TIMES the current weight: around 16-22 pixels wide on a 1254-pixel canvas. Strengthen the skyline and railing contours about two times. Keep facial features gentler, only 1.5 times their existing weight, so the eyes stay relaxed. Build the stronger strokes from dense adjacent black QR-like square pixel clusters with occasional small white interruptions, maintaining the woven-in effect. The person, raised-arm gesture and skyline should be readily recognizable at a small thumbnail size. Preserve the SAME QR pixel field, same corner finder squares, quiet white border, small alignment marker, head position, face size, pose and background. Do not thicken every random QR pixel or change the code finders; ONLY reinforce the sketch contours. Do not clear a face-shaped or body-shaped white area, do not add a pasted portrait or separate panel, no photographic shading, no solid black filled face or shirt. The sketch stays integrated inside the QR texture, but with much stronger broad contour bands. Pure black and white, no text, no new objects, no watermark.
```

## Photography

The `/photography/` page lists album covers. Its first album, **Tianping Mountain**, contains 35 photographs taken and supplied by Chunzheng Li from the November 28, 2026 visit to Suzhou. Its page and static manifest live under `photography/tianping-mountain/`; published image files and thumbnails remain under `photography/images/tianping-mountain/`. The fifteen initial selections were expanded in two batches of ten at the user's request. The last batch was previewed before publishing; the user replaced candidate DSC_0616 with the supplied bright autumn-leaf photograph, confirmed by SHA-256 to match DSC_0699. Full images have a maximum long edge of 2560 pixels and thumbnails 900 pixels; only orientation, resizing, and JPEG encoding were applied. Originals and RAW files remain in the source folder. See [the selection and export notes](photography/tianping-mountain-20261128.md).

Shared gallery code supports portrait and landscape images, title/copyright overlays, an enlarged view, detail zoom and panning, touch pinch, keyboard navigation, and an empty state. Reference-site screenshots are not included as user photographs. The homepage links to the album index from the profile navigation.
