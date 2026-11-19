# Adding photographs

The gallery is available at https://chunzheng2022.github.io/photography/ . It currently shows an empty collection, without sample photos.

1. Put your images in `photography/images/`.
2. Add entries to `photography/photos.json` in your preferred display order:

```json
[
  {
    "src": "images/my-photo.jpg",
    "alt": "A description of what is visible in the photograph",
    "caption": "Optional title or location"
  }
]
```

3. Commit and push to `main`. GitHub Pages publishes the changes automatically.

Use a unique filename for each photo. `src` and descriptive `alt` text are required; `caption` is optional. The gallery automatically adapts to image orientation and screen size. Click a photo to enlarge it; Escape closes it, and the arrow keys move between photos. No framework or build command is needed.
