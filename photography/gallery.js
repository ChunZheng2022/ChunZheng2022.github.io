"use strict";

(async () => {
  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  const dialog = document.getElementById("photo-dialog");
  const full = document.getElementById("photo-full");
  const title = document.getElementById("photo-title");
  const copyright = document.getElementById("photo-copyright");
  const controls = document.querySelector(".photo-controls");
  let photos = [];
  let current = 0;
  let activeTrigger = null;

  function fitPhoto() {
    if (!dialog.open || !full.naturalWidth || !full.naturalHeight) return;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const maxWidth = Math.max(1, window.innerWidth - 2 * rem);
    let width = Math.min(full.naturalWidth, maxWidth);
    // Match the caption's left edge to the actual image, including portrait shots.
    // Remeasure wrapped text at the resulting width before the final fit.
    for (let pass = 0; pass < 3; pass++) {
      dialog.style.setProperty("--photo-width", `${width}px`);
      const chrome = document.querySelector(".dialog-top").offsetHeight
        + document.querySelector(".photo-meta-row").offsetHeight
        + (controls.hidden ? 0 : controls.offsetHeight) + 2 * rem;
      const height = Math.max(1, window.innerHeight - chrome);
      width = Math.min(width, height * full.naturalWidth / full.naturalHeight);
    }
    dialog.style.setProperty("--photo-width", `${width}px`);
  }

  function text(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function normalizePhoto(entry) {
    if (!entry || !text(entry.src) || !text(entry.alt)) return null;
    let url;
    try {
      url = new URL(entry.src, document.baseURI);
    } catch {
      return null;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const owner = text(entry.copyright) || "Chunzheng Li";
    return {
      src: url.href,
      alt: text(entry.alt),
      title: text(entry.title) || text(entry.caption) || text(entry.alt),
      copyright: owner.startsWith("©") ? owner : `© ${owner}`,
    };
  }

  function show(index, trigger) {
    if (!photos.length) return;
    if (trigger) activeTrigger = trigger;
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    full.src = photo.src;
    full.alt = photo.alt;
    title.textContent = photo.title;
    copyright.textContent = photo.copyright;
    document.getElementById("photo-counter").textContent = `${current + 1} of ${photos.length}`;
    controls.hidden = photos.length < 2;
    if (!dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("photo-viewer-open");
    }
    if (full.complete) fitPhoto();
  }

  full.addEventListener("load", fitPhoto);
  window.addEventListener("resize", fitPhoto);
  document.getElementById("photo-close").addEventListener("click", () => dialog.close());
  document.getElementById("photo-previous").addEventListener("click", () => show(current - 1));
  document.getElementById("photo-next").addEventListener("click", () => show(current + 1));
  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("photo-viewer-open");
    activeTrigger?.focus({ preventScroll: true });
    activeTrigger = null;
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); show(current - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); show(current + 1); }
  });

  try {
    const response = await fetch("photos.json");
    if (!response.ok) throw new Error("Photo list is unavailable");
    const entries = await response.json();
    if (!Array.isArray(entries)) throw new Error("Photo list must be an array");
    photos = entries.map(normalizePhoto).filter(Boolean);
    if (!photos.length) return;

    const fragment = document.createDocumentFragment();
    photos.forEach((photo, index) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-photo";
      const link = document.createElement("a");
      link.className = "gallery-link";
      link.href = photo.src;
      link.setAttribute("aria-label", `View ${photo.title}. ${photo.copyright}`);
      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.alt;
      image.loading = "lazy";
      image.decoding = "async";
      link.append(image);
      const overlay = document.createElement("span");
      overlay.className = "photo-overlay";
      overlay.setAttribute("aria-hidden", "true");
      const photoTitle = document.createElement("span");
      photoTitle.className = "photo-title";
      photoTitle.textContent = photo.title;
      const credit = document.createElement("span");
      credit.className = "photo-credit";
      credit.textContent = photo.copyright;
      overlay.append(photoTitle, credit);
      link.append(overlay);
      if (typeof dialog.showModal === "function") {
        link.addEventListener("click", (event) => {
          if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          show(index, link);
        });
      }
      figure.append(link);
      fragment.append(figure);
    });
    grid.append(fragment);
    grid.hidden = false;
    empty.hidden = true;
  } catch (error) {
    console.warn("Photography collection could not be loaded:", error.message);
  }
})();
