# Tianping Mountain — November 28, 2026

Photographer and copyright owner: **Chunzheng Li**. The user supplied the folder `天平山` and requested that selected photographs be published, with the English name of the location as their title. All published entries use **Tianping Mountain** and display **© Chunzheng Li**.

## Initial selection (15 photographs)

Reviewed all **143 JPG photographs** in six contact sheets and inspected a 24-frame shortlist at larger size. The folder also contains 140 NEF originals and one MOV, which were not uploaded. Fifteen photographs were selected for a mix of autumn color, reflections, architecture, wildlife, and close details. Similar bursts were reduced to individual representatives. Very dark unsuccessful exposures, crowded viewpoints, wayfinding signs, and an unrelated laptop image were not included. Some deliberate architectural and bamboo shadows remain in the selected photographs.

The first photograph opens with the pond and autumn reflections. The sequence alternates wider scenes with architecture and details, ending with a backlit pond scene.

| Order | Source JPG | Subject and selection reason |
| --- | --- | --- |
| 1 | DSC_0684.JPG | Autumn reflections with a natural foliage frame; opening panorama. |
| 2 | DSC_0614.JPG | Curved roof, yellow wall, and blue sky; strong geometry and color contrast. |
| 3 | DSC_0702.JPG | Red maple over a pond; a portrait composition with reflection and fallen leaves. |
| 4 | DSC_0570.JPG | Orange leaves above water; an intimate detail with darker negative space. |
| 5 | DSC_0660.JPG | White geese, water ripples, and fallen leaves; a change of subject and scale. |
| 6 | DSC_0647.JPG | Yellow wall and mossy tiles in warm sunlight beneath autumn branches. |
| 7 | DSC_0641.JPG | Bamboo grove; contrasting greens and a strong vertical rhythm. |
| 8 | DSC_0619.JPG | Close autumn leaves against a softer canopy. |
| 9 | DSC_0611.JPG | Vine-covered rock and receding hills; adds a mountain landscape. |
| 10 | DSC_0581.JPG | Curved pavilion eaves and golden leaves; a more intimate architectural view. |
| 11 | DSC_0654.JPG | A view along the pond with floating leaves and foliage framing the water. |
| 12 | DSC_0700.JPG | Red and gold branches against blue sky; an upward-looking seasonal view. |
| 13 | DSC_0615.JPG | Wooden lattice window framing the garden; graphic detail. |
| 14 | DSC_0706.JPG | Red berries against green foliage; a botanical counterpoint to the maples. |
| 15 | DSC_0704.JPG | Backlit autumn leaves beside the pond; closing scene. |

## Website exports

- Files: `photography/images/tianping-mountain/tianping-mountain-NNNN.jpg`, with matching previews under `thumbnails/`. `NNNN` retains the camera frame number above.
- Full images: maximum longer edge **2560 px**, JPEG quality **90**.
- Thumbnails: maximum longer edge **900 px**, JPEG quality **86**.
- Both use Lanczos downsampling, progressive JPEG, and preserved aspect ratio. EXIF rotation was applied to pixels, including the portrait frame DSC_0702.
- No cropping, exposure adjustments, color grading, retouching, or AI-generated content was applied. Embedded color profiles are retained when present; camera and location EXIF are not republished.
- Original JPG/NEF/MOV files remain in the user's source folder. SHA-256 checks on all 15 selected source JPGs confirmed they were unchanged during export.
- The 15 full images total **18.48 MB**, and the 15 previews total **2.44 MB**. Only previews are loaded in the grid; opening a photo requests its larger image. Width/height fields reserve the correct layout proportions.
- Initial photo data was in `photography/photos.json`; the 25-photo album now uses `photography/tianping-mountain/photos.json`. The original `title`/`copyright` hover and viewer interactions are retained.

## Validation

At initial publication, all 30 exported images reopened successfully. Source hashes, oriented image dimensions, filenames, manifest titles, copyright fields, and removed EXIF were checked. The complete set of website previews was visually inspected. Eight jsdom gallery interaction tests passed, including separate thumbnail/full-image loading and fallback behavior for malformed optional preview paths. Browser visual QA was not performed for that initial release.

## Album expansion (25 photographs)

Later the same day, the user requested ten more selections and a cover-based album structure. All six original contact sheets were reviewed again, followed by a 13-frame larger shortlist. These ten additions broaden the subjects while retaining the original fifteen photographs:

| Source JPG | Subject and selection reason |
| --- | --- |
| DSC_0593.JPG | White garden wall and tiled roofs framed by autumn trees; quieter architecture. |
| DSC_0599.JPG | Rounded boulders above autumn woodland and the distant city; three layers of depth. |
| DSC_0626.JPG | Green pond ripples and softened tree reflections; a minimal water study. |
| DSC_0637.JPG | Pine trunks framing a sunlit wooded hillside; expands the mountain landscape. |
| DSC_0649.JPG | Fallen leaves on a sunlit stone path; a small ground-level detail. |
| DSC_0650.JPG | Stone statue surrounded by autumn trees; a different subject in the garden. |
| DSC_0666.JPG | Dry lotus stems and seed heads; distinct late-autumn texture. |
| DSC_0673.JPG | Golden reflection beside tiled buildings; a closer view along the bank. |
| DSC_0691.JPG | Backlit pavilion roof; deliberate silhouette and sunburst. |
| DSC_0708.JPG | Stone gateway under blue sky and autumn trees; an architectural landmark. |

Final order, retaining camera frame numbers: **0684, 0614, 0593, 0702, 0570, 0626, 0660, 0666, 0647, 0649, 0641, 0637, 0619, 0611, 0599, 0581, 0691, 0654, 0673, 0700, 0650, 0615, 0708, 0706, 0704**. Original photographs retain their relative order. Frame **0684** remains the album cover.

The ten additions use the same export settings above. Existing exports were not changed; SHA-256 checks confirmed that the ten source JPGs and all thirty existing exports remained unchanged. The 25 full images total **32.71 MB**; their previews total **4.17 MB**. Only resized JPGs are published, with orientation applied and without camera/location EXIF.

`photography/index.html` is now a static album-cover index. The album page and its photo manifest are `photography/tianping-mountain/index.html` and `photos.json`; shared assets remain one level above. Photo URLs in the manifest use `../images/tianping-mountain/`. The album retains click-to-open, titles and copyright, 1–4× zoom, click-point magnification, dragging, wheel/touch pinch, and keyboard controls. The previous flat root manifest has been moved into the album.

All fifty exports reopened successfully with their manifest dimensions and without EXIF. All twenty-five source JPG hashes were verified. Sixteen jsdom interaction checks passed, including album-cover routing, relative photo paths from the nested page, and zoom on a newly added photograph. Local HTTP checks passed for both pages, the new manifest, and every referenced stylesheet, script, icon, and cover image.

Source: user request and local file review in Codex chat `01a1f27d-cc70-7393-980d-5a97acf13de4`, November 28, 2026.
