const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("../.preview/qa/node_modules/jsdom");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "photography/index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "photography/gallery.js"), "utf8");
const sample = (fields = {}) => ({ src: "images/sunset.jpg", alt: "Sunset over a lake", ...fields });

async function gallery(t, entries, { supported = true, responseOk = true } = {}) {
  const dom = new JSDOM(html, {
    url: "https://chunzheng2022.github.io/photography/",
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
  await window.eval(script);
  const document = window.document;
  const query = (selector) => document.querySelector(selector);
  const click = (selector, init = {}) => {
    const element = typeof selector === "string" ? query(selector) : selector;
    return element.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true, ...init }));
  };
  return { window, document, dialog, warnings, query, click };
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
  assert.equal(link.href, "https://chunzheng2022.github.io/photography/images/sunset.jpg");
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
  assert.equal(image.src, "https://chunzheng2022.github.io/photography/images/thumbnails/full.jpg");
  assert.equal(image.width, 1707);
  assert.equal(image.height, 2560);
  g.click(".gallery-link");
  assert.equal(g.query("#photo-full").src, "https://chunzheng2022.github.io/photography/images/full.jpg");
});

test("an invalid optional thumbnail falls back to the full image", async (t) => {
  const g = await gallery(t, [sample({ thumbnail: "javascript:alert(1)" }), sample({ thumbnail: "http://[" })]);
  const images = g.document.querySelectorAll(".gallery-photo img");
  assert.equal(images.length, 2);
  for (const image of images) {
    assert.equal(image.src, "https://chunzheng2022.github.io/photography/images/sunset.jpg");
    assert.equal(image.hasAttribute("width"), false);
  }
});
