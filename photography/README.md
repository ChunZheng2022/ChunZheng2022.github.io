# Photography albums

The photography homepage at https://chunzheng2022.github.io/photography/ lists album covers. Click **Tianping Mountain** to open its 35 photographs at https://chunzheng2022.github.io/photography/tianping-mountain/ . The photographs were selected from the user's November 28, 2026 visit to Suzhou. Selection and export details are in [the collection notes](../docs/photography/tianping-mountain-20261128.md).

## Add photos to Tianping Mountain

1. Put your images in `photography/images/tianping-mountain/`.
2. Add entries to `photography/tianping-mountain/photos.json` in your preferred display order. Paths are relative to the album page:

```json
[
  {
    "src": "../images/tianping-mountain/my-photo.jpg",
    "alt": "A description of what is visible in the photograph",
    "title": "Suzhou at sunset",
    "copyright": "Chunzheng Li"
  }
]
```

3. Update the photo count in the album's `index.html` and its cover in `photography/index.html`.
4. Commit and push to `main`. GitHub Pages publishes the changes automatically.

Use a unique filename for each photo. `src` and descriptive `alt` text are required. `title` is the displayed photo name. `copyright` is the copyright owner, displayed with a single `©`; it defaults to `Chunzheng Li` when omitted. An existing `caption` still works as the title when `title` is omitted. If neither is supplied, `alt` is used as the title.

For faster loading, you can optionally provide `thumbnail` (the preview image's path), plus `width` and `height` (the full image's oriented pixel dimensions). The grid loads the thumbnail and reserves the correct aspect ratio; opening a photo loads its full `src`. Existing entries without these fields continue to work. The Tianping Mountain exports use 900-pixel previews and 2560-pixel full images, measured along the longer edge. Original photographs and RAW files remain in the user's source folder.

On desktop, hovering over a thumbnail reveals its title and copyright in white over a dark gradient; keyboard focus reveals the same information. On touch screens, these labels remain visible. Click a photo to open the viewer: its title and copyright appear at the bottom left, with the photo count at the bottom right.

The viewer starts with the whole photograph fitted to the screen. Click a point in the photo to zoom to 2.5× around that detail; drag to explore, then click again or choose **Fit photo** to restore the whole image. The mouse wheel and touch pinch adjust zoom between 1× and 4×. Keyboard `+`/`-` change zoom, `0` restores the whole image, and arrow keys pan while zoomed or move between photos while fitted. **Previous**/**Next** always change photos and reset zoom. Escape or Close exits. These controls magnify the full web image (`src`), not the thumbnail; they do not synthesize additional detail. No framework or build command is needed.

The screenshots and images of the reference website are design references and are not included as photographs in this collection.

## Add another album

1. Copy `photography/tianping-mountain/index.html` into a new folder, such as `photography/hangzhou/index.html`. Keep the shared `../gallery.css`, `../gallery.js`, and `../photo-zoom.js` references.
2. Change the page title, description, canonical URL, heading, location, date, and photo count. Keep **All albums** pointing to `../`.
3. Put the new album's images in `photography/images/hangzhou/` and create `photography/hangzhou/photos.json` with entries like the example above, using `../images/hangzhou/` paths.
4. Copy the `.album-link` in `photography/index.html`, then update its link (`hangzhou/`), cover image, title, copyright, location, date, photo count, and accessible label. Each album opens its own photograph list and shares the same viewer and zoom controls.
5. Commit and push to `main`.

## Development checks

The production site has no package dependencies. The interaction tests use jsdom only in a Git-ignored local directory:

```powershell
npm install --prefix .preview/qa --no-save --no-audit --no-fund jsdom@26.1.0
node --test tests/gallery.test.cjs
```
