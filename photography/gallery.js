"use strict";

(async () => {
  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  const dialog = document.getElementById("photo-dialog");
  const full = document.getElementById("photo-full");
  const caption = document.getElementById("photo-caption");
  const controls = document.querySelector(".photo-controls");
  let photos = [];
  let current = 0;

  function show(index) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    full.src = photo.src;
    full.alt = photo.alt;
    caption.textContent = photo.caption || "";
    document.getElementById("photo-counter").textContent = `${current + 1} / ${photos.length}`;
    controls.hidden = photos.length < 2;
    if (!dialog.open) dialog.showModal();
  }

  document.getElementById("photo-close").addEventListener("click", () => dialog.close());
  document.getElementById("photo-previous").addEventListener("click", () => show(current - 1));
  document.getElementById("photo-next").addEventListener("click", () => show(current + 1));
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
    photos = entries.filter((entry) => {
      if (!entry || typeof entry.src !== "string" || !entry.src.trim()) return false;
      const url = new URL(entry.src, document.baseURI);
      return (url.protocol === "https:" || url.protocol === "http:")
        && typeof entry.alt === "string" && entry.alt.trim();
    });
    if (!photos.length) return;

    const fragment = document.createDocumentFragment();
    photos.forEach((photo, index) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-photo";
      const link = document.createElement("a");
      link.href = photo.src;
      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.alt;
      image.loading = "lazy";
      image.decoding = "async";
      link.append(image);
      if (typeof dialog.showModal === "function") {
        link.addEventListener("click", (event) => { event.preventDefault(); show(index); });
      }
      figure.append(link);
      if (photo.caption) {
        const text = document.createElement("figcaption");
        text.textContent = photo.caption;
        figure.append(text);
      }
      fragment.append(figure);
    });
    grid.append(fragment);
    grid.hidden = false;
    empty.hidden = true;
  } catch (error) {
    console.warn("Photography collection could not be loaded:", error.message);
  }
})();
