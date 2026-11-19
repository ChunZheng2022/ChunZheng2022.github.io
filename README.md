# Chunzheng Li — Academic Homepage

A lightweight academic homepage for **Chunzheng Li**, inspired by [Gaoyue Zhou's homepage](https://gaoyuezhou.github.io/) and the academic homepage layout popularized by [Jon Barron](https://jonbarron.info/). The HTML, CSS, JavaScript, and conceptual SVG thumbnails were written for this website; reference-site code and personal content were not copied.

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
| MB3D preprint metadata | [SSRN DOI](https://doi.org/10.2139/ssrn.4988978), [Crossref metadata](https://api.crossref.org/works/10.2139/ssrn.4988978) |
| SGF3D authors, journal, year, article number | [Publisher DOI](https://doi.org/10.1016/j.imavis.2023.104895), [Crossref metadata](https://api.crossref.org/works/10.1016/j.imavis.2023.104895) |
| Code and project descriptions | Public repositories linked on the homepage |

- `images/profile.png`: the original photo supplied by Chunzheng Li for this homepage, preserved without image alterations. The displayed circular crop uses CSS to focus on the face.
- `images/scope-wm.png`: Figure 2 (method overview) from the user's [Scope-WM paper](https://arxiv.org/html/2609.33218v1#Sx3.F2), reproduced as a thumbnail linking to the paper. Rights remain with the original authors.
- `images/fs2d.svg`, `images/mb3d.svg`, and `images/sgf3d.svg`: original **conceptual illustrations**, not experimental visualizations or reproductions of paper figures.

Scope-WM and MB3D are labeled as preprints. No conference acceptance, advisor, award, unprovided contact address, or CV is assumed. MB3D uses the verified SSRN record; update it if a newer published record is available.
