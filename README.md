# Chunzheng Li — Academic Homepage

A lightweight academic homepage for **Chunzheng Li**, inspired by [Gaoyue Zhou's homepage](https://gaoyuezhou.github.io/) and the academic homepage layout popularized by [Jon Barron](https://jonbarron.info/). Reference-site code and personal content were not copied.

Website: https://chunzheng2022.github.io/

## Preview locally

No package installation or build step is needed. From this folder:

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080/ . You can also open `index.html` directly; clipboard features require HTTPS or localhost.

## Updating the homepage

- **Biography, papers, links, and BibTeX:** edit `index.html`.
- **Portrait:** replace `images/profile.png` with your preferred photo. Adjust `.portrait img` in `styles.css` to set the crop. The circular crop is applied with CSS; clicking the portrait opens the unchanged full photo.
- **Email / Google Scholar / CV:** add your real links inside `.profile-links` in `index.html`. These links are intentionally omitted until supplied.
- **Colors, spacing, mobile layout:** edit `styles.css`.
- **Paper thumbnails:** replace the corresponding image files and update their alt text and dimensions.
- **Photography:** add photos to `photography/images/` and list them in `photography/photos.json`. See [the photography guide](photography/README.md).
- **Portrait QR:** `images/portrait-qr.svg` scans to the homepage. The night waterfront photograph was first simplified into `images/portrait-line-art.png`; its contours were then woven into QR pixels, with exact QR sampling restored across the entire image. Rebuild the final SVG with `node scripts/build-portrait-qr.mjs`; the source matrix is in `scripts/qr-matrix.json`.

The page works without JavaScript. `script.js` only enhances citation copying. Citations open with the native HTML `details` element, including on mobile and with a keyboard.

## GitHub Pages

Use the `ChunZheng2022/ChunZheng2022.github.io` repository. In **Settings → Pages**, select **Deploy from a branch**, the `main` branch, and `/ (root)`. `.nojekyll` ensures the static files are served directly. Changes pushed to `main` are published by GitHub Pages.

## Content sources and assets

Biography and publication information comes from public profile, repository, and publication sources. The display name and portrait were supplied by Chunzheng Li. No unpublished research from other local projects is included.

| Content | Source |
| --- | --- |
| Ph.D. status, Soochow University, current interests | [GitHub profile](https://github.com/ChunZheng2022) |
| Scope-WM authors, title, year, abstract | [arXiv:2609.33218](https://arxiv.org/abs/2609.33218) |
| FS²D authors, journal, year, pages, ORCID | [Publisher DOI](https://doi.org/10.1109/LRA.2025.3560868), [Crossref metadata](https://api.crossref.org/works/10.1109/LRA.2025.3560868) |
| SGF3D authors, journal, year, article number | [Publisher DOI](https://doi.org/10.1016/j.imavis.2023.104895), [Crossref metadata](https://api.crossref.org/works/10.1016/j.imavis.2023.104895) |
| Code and project descriptions | Public repositories linked on the homepage |

- `images/profile.png`: the original photo supplied by Chunzheng Li for this homepage, preserved without image alterations. The displayed circular crop uses CSS to focus on the face.
- `images/scope-wm.png`: Figure 2 (method overview) from the user's [Scope-WM paper](https://arxiv.org/html/2609.33218v1#Sx3.F2), reproduced as a thumbnail linking to the paper. Rights remain with the original authors.
- `images/fs2d-architecture.png`: Figure 2 on page 3 of the FS²D PDF supplied by the user.
- `images/sgf3d-architecture.png`: Figure 2 on page 3 of the SGF3D PDF supplied by the user.
- `images/portrait-line-art.png`: the standalone simplified line drawing generated from the user's night waterfront photograph with built-in ImageGen.
- `images/portrait-qr-art.png`: the second built-in ImageGen stage, weaving the simplified drawing's contours into the QR pixel texture.
- `images/portrait-qr.svg`: the portrait artwork plus the exact QR sampling and control patterns, generated with `scripts/build-portrait-qr.mjs`.
- [Asset provenance, extraction coordinates, generation prompt, and verification](docs/ASSET_PROVENANCE.md).

Scope-WM is labeled as a preprint. No conference acceptance, advisor, award, unprovided contact address, or CV is assumed. The two paper figures retain their original authors' and publishers' rights. The full supplied PDFs and original selfie are not published in this repository.
