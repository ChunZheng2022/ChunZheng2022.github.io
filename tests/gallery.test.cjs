const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("../.preview/qa/node_modules/jsdom");

const root = path.resolve(__dirname, "..");
const albumPath = "photography/tianping-mountain";
const html = fs.readFileSync(path.join(root, albumPath, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "photography/gallery.js"), "utf8");
const zoomScript = fs.readFileSync(path.join(root, "photography/photo-zoom.js"), "utf8");
const sample = (fields = {}) => ({ src: "images/sunset.jpg", alt: "Sunset over a lake", ...fields });

async function gallery(t, entries, { supported = true, responseOk = true } = {}) {
  const dom = new JSDOM(html, {
    url: "https://chunzheng2022.github.io/photography/tianping-mountain/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  t.after(() => dom.window.close());
  const { window } = dom;
  const warnings = [];
  window.console.warn = (...args) => warnings.push(args);
  window.fetch = async () => ({ ok: responseOk, json: async () => entries });
  const dialog = window.document.getElementById("photo-dialog");
  // jsdom does not implement the browser's native dialog lifecycle.
  if (supported) dialog.showModal = () => { dialog.open = true; };
  dialog.close = () => {
    dialog.open = false;
    dialog.dispatchEvent(new window.Event("close"));
  };
  window.eval(zoomScript);
  await window.eval(script);
  const document = window.document;
  const query = (selector) => document.querySelector(selector);
  const click = (selector, init = {}) => {
    const element = typeof selector === "string" ? query(selector) : selector;
    return element.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true, ...init }));
  };
  return { window, document, dialog, warnings, query, click };
}

function loadPhoto(g) {
  g.query("#photo-full").dispatchEvent(new g.window.Event("load"));
}

function zoomSurface(g) {
  const viewport = g.query("#photo-viewport");
  viewport.getBoundingClientRect = () => ({ left: 20, top: 30, width: 600, height: 400 });
  const pointer = (type, id, x, y) => {
    const event = new g.window.MouseEvent(type, { bubbles: true, button: 0, clientX: x, clientY: y });
    Object.defineProperty(event, "pointerId", { value: id });
    viewport.dispatchEvent(event);
  };
  const transform = () => g.query("#photo-full").style.transform;
  return { viewport, pointer, transform };
}

test("thumbnail and viewer share the title and default copyright", async (t) => {
  const g = await gallery(t, [sample({ title: "Suzhou", caption: "Older caption" })]);
  assert.equal(g.query(".photo-title").textContent, "Suzhou");
  assert.equal(g.query(".photo-credit").textContent, "© Chunzheng Li");
  assert.match(g.query(".gallery-link").getAttribute("aria-label"), /Suzhou.*© Chunzheng Li/);
  assert.equal(g.query("#gallery-empty").hidden, true);
  assert.equal(g.click(".gallery-link"), false);
  assert.equal(g.dialog.open, true);
  assert.equal(g.query("#photo-title").textContent, "Suzhou");
  assert.equal(g.query("#photo-copyright").textContent, "© Chunzheng Li");
  assert.equal(g.query("#photo-counter").textContent, "1 of 1");
  assert.equal(g.query(".photo-controls").hidden, true);
  assert.equal(g.document.documentElement.classList.contains("photo-viewer-open"), true);
  g.click("#photo-close");
  assert.equal(g.dialog.open, false);
  assert.equal(g.document.documentElement.classList.contains("photo-viewer-open"), false);
  assert.equal(g.document.activeElement, g.query(".gallery-link"));
});

test("navigation updates credits, wraps, and preserves each photo's owner", async (t) => {
  const g = await gallery(t, [
    sample({ caption: "Legacy caption" }),
    sample({ src: "images/second.jpg", title: "Second photo", copyright: "© Guest Photographer" }),
    sample({ src: "images/third.jpg", copyright: "Another Photographer" }),
  ]);
  g.click(".gallery-link");
  assert.equal(g.query("#photo-title").textContent, "Legacy caption");
  assert.equal(g.query(".photo-controls").hidden, false);
  g.click("#photo-next");
  assert.equal(g.query("#photo-title").textContent, "Second photo");
  assert.equal(g.query("#photo-copyright").textContent, "© Guest Photographer");
  assert.equal(g.query("#photo-counter").textContent, "2 of 3");
  g.dialog.dispatchEvent(new g.window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  assert.equal(g.query("#photo-title").textContent, "Sunset over a lake");
  assert.equal(g.query("#photo-copyright").textContent, "© Another Photographer");
  g.click("#photo-next");
  assert.equal(g.query("#photo-counter").textContent, "1 of 3");
  g.dialog.dispatchEvent(new g.window.KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
  assert.equal(g.query("#photo-counter").textContent, "3 of 3");
  g.click("#photo-full");
  assert.equal(g.dialog.open, true, "clicking the picture should not close it");
  g.click(g.dialog);
  assert.equal(g.dialog.open, false, "clicking the surrounding dialog area closes it");
});

test("bad records do not hide valid photographs and metadata stays plain text", async (t) => {
  const title = '<img src=x onerror="alert(1)">';
  const g = await gallery(t, [
    null, {}, sample({ src: "javascript:alert(1)" }), sample({ src: "http://[" }),
    sample({ alt: " " }), sample({ title, copyright: "<b>Owner</b>" }),
  ]);
  assert.equal(g.document.querySelectorAll(".gallery-link").length, 1);
  assert.equal(g.query(".photo-title").textContent, title);
  assert.equal(g.query(".photo-title img"), null);
  assert.equal(g.query(".photo-credit").textContent, "© <b>Owner</b>");
  g.click(".gallery-link");
  assert.equal(g.query("#photo-title").textContent, title);
  assert.equal(g.query("#photo-title img"), null);
});

test("empty collections and failed manifests keep the empty state", async (t) => {
  for (const [entries, options] of [[[], {}], [{}, {}], [[sample()], { responseOk: false }]]) {
    const g = await gallery(t, entries, options);
    assert.equal(g.query("#gallery-empty").hidden, false);
    assert.equal(g.query("#gallery-grid").hidden, true);
    assert.equal(g.dialog.open, false);
  }
});

test("unsupported dialog browsers retain direct links to the image", async (t) => {
  const g = await gallery(t, [sample()], { supported: false });
  const link = g.query(".gallery-link");
  assert.equal(link.href, "https://chunzheng2022.github.io/photography/tianping-mountain/images/sunset.jpg");
  // Capture the event before the browser would navigate, so jsdom need not do so.
  let prevented;
  link.addEventListener("click", (event) => { prevented = event.defaultPrevented; event.preventDefault(); });
  g.click(link);
  assert.equal(prevented, false);
  assert.equal(g.dialog.open, false);
});

test("image fitting keeps portrait and landscape images inside the viewport", async (t) => {
  const g = await gallery(t, [sample()]);
  const image = g.query("#photo-full");
  Object.defineProperties(image, {
    naturalWidth: { value: 800, configurable: true },
    naturalHeight: { value: 1600, configurable: true },
  });
  for (const [selector, height] of [[".dialog-top", 44], [".photo-meta-row", 48]]) {
    Object.defineProperty(g.query(selector), "offsetHeight", { value: height });
  }
  g.click(".gallery-link");
  image.dispatchEvent(new g.window.Event("load"));
  const portraitWidth = parseFloat(g.dialog.style.getPropertyValue("--photo-width"));
  assert.ok(portraitWidth > 0 && portraitWidth * 2 <= g.window.innerHeight - 124);
  Object.defineProperties(g.window, {
    innerWidth: { value: 375, configurable: true },
    innerHeight: { value: 667, configurable: true },
  });
  Object.defineProperties(image, {
    naturalWidth: { value: 2400, configurable: true },
    naturalHeight: { value: 1600, configurable: true },
  });
  g.window.dispatchEvent(new g.window.Event("resize"));
  const mobileWidth = parseFloat(g.dialog.style.getPropertyValue("--photo-width"));
  assert.ok(mobileWidth > 0 && mobileWidth <= 343);
  assert.ok(mobileWidth * 2 / 3 <= 667 - 124);
});

test("the grid loads small previews while the viewer opens the full photograph", async (t) => {
  const g = await gallery(t, [sample({
    src: "images/full.jpg", thumbnail: "images/thumbnails/full.jpg", width: 1707, height: 2560,
  })]);
  const image = g.query(".gallery-photo img");
  assert.equal(image.src, "https://chunzheng2022.github.io/photography/tianping-mountain/images/thumbnails/full.jpg");
  assert.equal(image.width, 1707);
  assert.equal(image.height, 2560);
  g.click(".gallery-link");
  assert.equal(g.query("#photo-full").src, "https://chunzheng2022.github.io/photography/tianping-mountain/images/full.jpg");
});

test("an invalid optional thumbnail falls back to the full image", async (t) => {
  const g = await gallery(t, [sample({ thumbnail: "javascript:alert(1)" }), sample({ thumbnail: "http://[" })]);
  const images = g.document.querySelectorAll(".gallery-photo img");
  assert.equal(images.length, 2);
  for (const image of images) {
    assert.equal(image.src, "https://chunzheng2022.github.io/photography/tianping-mountain/images/sunset.jpg");
    assert.equal(image.hasAttribute("width"), false);
  }
});

test("click zoom preserves the chosen detail and toggles back to the whole photo", async (t) => {
  const g = await gallery(t, [sample({ width: 2400, height: 1600 })]);
  const z = zoomSurface(g);
  g.click(".gallery-link");
  const toggle = g.query("#photo-zoom-toggle");
  assert.equal(toggle.disabled, true, "zoom waits for the full image");
  loadPhoto(g);
  assert.equal(toggle.disabled, false);
  g.click(z.viewport, { clientX: 220, clientY: 130 });
  // (200, 100) remains fixed: -300 + 200 * 2.5 = 200.
  assert.equal(z.transform(), "translate(-300px, -150px) scale(2.5)");
  assert.equal(g.query("#photo-zoom-level").textContent, "250%");
  assert.equal(toggle.getAttribute("aria-pressed"), "true");
  assert.equal(g.query("#photo-title").textContent, sample().alt);
  g.click(z.viewport);
  assert.equal(z.transform(), "translate(0px, 0px) scale(1)");
  assert.equal(toggle.getAttribute("aria-pressed"), "false");
  g.click(toggle);
  assert.equal(z.transform(), "translate(-450px, -300px) scale(2.5)");
  g.click(toggle);
  assert.equal(g.query("#photo-zoom-level").textContent, "Fit");
});

test("dragging explores enlarged photos, clamps edges, and does not trigger click-to-reset", async (t) => {
  const g = await gallery(t, [sample()]);
  const z = zoomSurface(g);
  g.click(".gallery-link");
  loadPhoto(g);
  g.click("#photo-zoom-toggle");
  z.pointer("pointerdown", 1, 300, 200);
  z.pointer("pointermove", 1, 400, 250);
  assert.equal(z.transform(), "translate(-350px, -250px) scale(2.5)");
  assert.equal(z.viewport.classList.contains("is-dragging"), true);
  z.pointer("pointermove", 1, -10000, -10000);
  assert.equal(z.transform(), "translate(-900px, -600px) scale(2.5)");
  z.pointer("pointerup", 1, -10000, -10000);
  g.click(z.viewport); // The click synthesized after releasing a drag.
  assert.match(z.transform(), /scale\(2.5\)/);
  assert.equal(z.viewport.classList.contains("is-dragging"), false);
  z.pointer("pointerdown", 1, 200, 200);
  z.pointer("pointerup", 1, 200, 200);
  g.click(z.viewport);
  assert.match(z.transform(), /scale\(1\)/);
});

test("wheel zoom stays within 1–4x and preserves Ctrl+wheel browser zoom", async (t) => {
  const g = await gallery(t, [sample()]);
  const z = zoomSurface(g);
  g.click(".gallery-link");
  loadPhoto(g);
  const wheel = (deltaY, init = {}) => z.viewport.dispatchEvent(new g.window.WheelEvent("wheel", {
    bubbles: true, cancelable: true, deltaY, clientX: 320, clientY: 230, ...init,
  }));
  assert.equal(wheel(-10000), false);
  assert.equal(z.transform(), "translate(-900px, -600px) scale(4)");
  assert.equal(wheel(10000, { ctrlKey: true }), true);
  assert.match(z.transform(), /scale\(4\)/);
  wheel(10000);
  assert.equal(z.transform(), "translate(0px, 0px) scale(1)");
});

test("two-finger pinch retains its image anchor and continues as a one-finger pan", async (t) => {
  const g = await gallery(t, [sample()]);
  const z = zoomSurface(g);
  g.click(".gallery-link");
  loadPhoto(g);
  z.pointer("pointerdown", 1, 220, 230);
  z.pointer("pointerdown", 2, 420, 230);
  z.pointer("pointermove", 1, 120, 230);
  z.pointer("pointermove", 2, 520, 230);
  assert.equal(z.transform(), "translate(-300px, -200px) scale(2)");
  z.pointer("pointerup", 2, 520, 230);
  z.pointer("pointermove", 1, 170, 250);
  assert.equal(z.transform(), "translate(-250px, -180px) scale(2)");
  z.pointer("pointercancel", 1, 170, 250);
  assert.equal(z.viewport.classList.contains("is-dragging"), false);
  g.click(z.viewport);
  assert.match(z.transform(), /scale\(2\)/, "the touch gesture must not reset the zoom");
});

test("keyboard pans details, resets on navigation and close, and ignores late image loads", async (t) => {
  const g = await gallery(t, [sample(), sample({ src: "images/second.jpg", title: "Second" })]);
  const z = zoomSurface(g);
  const key = (value) => g.dialog.dispatchEvent(new g.window.KeyboardEvent("keydown", {
    bubbles: true, cancelable: true, key: value,
  }));
  g.click(".gallery-link");
  loadPhoto(g);
  key("+");
  assert.match(z.transform(), /scale\(1.25\)/);
  key("ArrowRight");
  assert.equal(g.query("#photo-counter").textContent, "1 of 2", "arrows pan while zoomed");
  assert.equal(z.transform(), "translate(-135px, -50px) scale(1.25)");
  key("0");
  key("ArrowRight");
  assert.equal(g.query("#photo-counter").textContent, "2 of 2", "arrows navigate when fitted");
  loadPhoto(g);
  g.click("#photo-zoom-toggle");
  g.click("#photo-next");
  assert.equal(g.query("#photo-zoom-level").textContent, "Fit");
  loadPhoto(g);
  g.click("#photo-zoom-toggle");
  g.click("#photo-close");
  assert.equal(z.transform(), "translate(0px, 0px) scale(1)");
  loadPhoto(g);
  assert.equal(g.query("#photo-zoom-toggle").disabled, true);
});

test("failed full images disable zoom and display a readable status", async (t) => {
  const g = await gallery(t, [sample()]);
  g.click(".gallery-link");
  g.query("#photo-full").dispatchEvent(new g.window.Event("error"));
  assert.equal(g.query("#photo-zoom-toggle").disabled, true);
  assert.equal(g.query("#photo-load-status").hidden, false);
  assert.match(g.query("#photo-load-status").textContent, /could not be loaded/);
});

test("the photography cover opens a separate album with matching photo count and navigation", (t) => {
  const index = new JSDOM(fs.readFileSync(path.join(root, "photography/index.html"), "utf8"), {
    url: "https://chunzheng2022.github.io/photography/",
  });
  t.after(() => index.window.close());
  const link = index.window.document.querySelector(".album-link");
  assert.equal(link.href, "https://chunzheng2022.github.io/photography/tianping-mountain/");
  assert.equal(index.window.document.querySelector("dialog"), null, "cover navigation opens the album, not an image modal");
  const photos = JSON.parse(fs.readFileSync(path.join(root, albumPath, "photos.json"), "utf8"));
  assert.equal(photos.length, 25);
  assert.match(link.textContent, /25 photographs/);
  const album = new JSDOM(html, { url: link.href });
  t.after(() => album.window.close());
  assert.equal(album.window.document.querySelector("h1").textContent, "Tianping Mountain");
  assert.equal(album.window.document.querySelector(".gallery-nav-links a").href,
    "https://chunzheng2022.github.io/photography/");
  assert.equal(new Set(photos.map(p => p.src)).size, 25);
  for (const file of [link.querySelector("img").src, ...photos.flatMap(p => [
    new URL(p.src, link.href).href, new URL(p.thumbnail, link.href).href,
  ])]) {
    const local = path.join(root, new URL(file).pathname);
    assert.ok(fs.existsSync(local), `Published image exists: ${local}`);
  }
});

test("real album data resolves all images from the nested page and keeps detail zoom", async (t) => {
  const photos = JSON.parse(fs.readFileSync(path.join(root, albumPath, "photos.json"), "utf8"));
  const g = await gallery(t, photos);
  const z = zoomSurface(g);
  const links = g.document.querySelectorAll(".gallery-link");
  assert.equal(links.length, 25);
  g.click(links[2]); // A newly added photo, not one of the original 15.
  assert.equal(g.query("#photo-full").src,
    "https://chunzheng2022.github.io/photography/images/tianping-mountain/tianping-mountain-0593.jpg");
  assert.equal(g.query("#photo-counter").textContent, "3 of 25");
  loadPhoto(g);
  g.click(z.viewport, { clientX: 220, clientY: 130 });
  assert.equal(g.query("#photo-zoom-level").textContent, "250%");
  g.click("#photo-next");
  assert.equal(g.query("#photo-counter").textContent, "4 of 25");
  assert.equal(g.query("#photo-zoom-level").textContent, "Fit");
});
