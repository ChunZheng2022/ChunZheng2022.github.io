# Adding photographs

The gallery is available at https://chunzheng2022.github.io/photography/ . It currently shows an empty collection, without sample photos.

1. Put your images in `photography/images/`.
2. Add entries to `photography/photos.json` in your preferred display order:

```json
[
  {
    "src": "images/my-photo.jpg",
    "alt": "A description of what is visible in the photograph",
    "title": "Suzhou at sunset",
    "copyright": "Chunzheng Li"
  }
]
```

3. Commit and push to `main`. GitHub Pages publishes the changes automatically.

Use a unique filename for each photo. `src` and descriptive `alt` text are required. `title` is the displayed photo name. `copyright` is the copyright owner, displayed with a single `©`; it defaults to `Chunzheng Li` when omitted. An existing `caption` still works as the title when `title` is omitted. If neither is supplied, `alt` is used as the title.

On desktop, hovering over a thumbnail reveals its title and copyright in white over a dark gradient; keyboard focus reveals the same information. On touch screens, these labels remain visible. Click a photo to enlarge it: its title and copyright appear at the bottom left, with the photo count at the bottom right. The viewer keeps the whole image visible at its original aspect ratio. Escape or Close exits, and the arrow keys or Previous/Next move between photos. No framework or build command is needed.

The screenshots and images of the reference website are design references and are not included as photographs in this collection.

## Development checks

The production site has no package dependencies. The interaction tests use jsdom only in a Git-ignored local directory:

```powershell
npm install --prefix .preview/qa --no-save --no-audit --no-fund jsdom@26.1.0
node --test tests/gallery.test.cjs
```
