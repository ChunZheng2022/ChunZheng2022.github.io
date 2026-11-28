"use strict";

// Zoom stays inside the fitted photograph, leaving its caption and controls visible.
window.PhotoZoom = class PhotoZoom {
  constructor(viewport, image, toggle, level) {
    this.viewport = viewport;
    this.image = image;
    this.toggle = toggle;
    this.level = level;
    this.enabled = false;
    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this.pointers = new Map();
    this.pan = null;
    this.pinch = null;
    this.ignoreClick = false;

    toggle.addEventListener("click", () => this.toggleZoom());
    viewport.addEventListener("click", (event) => {
      if (this.ignoreClick) { this.ignoreClick = false; return; }
      const rect = viewport.getBoundingClientRect();
      this.toggleZoom({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    });
    viewport.addEventListener("wheel", (event) => {
      // Preserve the browser's own Ctrl+wheel page-zoom shortcut.
      if (!this.enabled || event.ctrlKey) return;
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1;
      this.zoomTo(this.scale * Math.exp(-event.deltaY * units * .002), {
        x: event.clientX - rect.left, y: event.clientY - rect.top,
      });
    }, { passive: false });
    viewport.addEventListener("pointerdown", (event) => this.pointerDown(event));
    viewport.addEventListener("pointermove", (event) => this.pointerMove(event));
    viewport.addEventListener("pointerup", (event) => this.pointerEnd(event));
    viewport.addEventListener("pointercancel", (event) => {
      this.ignoreClick = true;
      this.pointerEnd(event);
    });
    this.render();
  }

  get zoomed() { return this.scale > 1.001; }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) this.reset();
    this.render();
  }

  reset() {
    for (const id of this.pointers.keys()) {
      try { this.viewport.releasePointerCapture?.(id); } catch { /* Already released. */ }
    }
    this.pointers.clear();
    this.pan = this.pinch = null;
    this.ignoreClick = false;
    this.scale = 1;
    this.x = this.y = 0;
    this.render();
  }

  constrain() {
    const { width, height } = this.viewport.getBoundingClientRect();
    this.x = Math.max(Math.min(0, width * (1 - this.scale)), Math.min(0, this.x));
    this.y = Math.max(Math.min(0, height * (1 - this.scale)), Math.min(0, this.y));
  }

  render() {
    this.constrain();
    this.image.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
    this.viewport.classList.toggle("is-zoomed", this.zoomed);
    this.viewport.classList.toggle("is-dragging", this.zoomed && this.pointers.size > 0);
    this.viewport.title = this.zoomed ? "Drag to explore; click to fit the whole photo" : "Click to zoom into this point";
    this.toggle.disabled = !this.enabled;
    this.toggle.textContent = this.zoomed ? "Fit photo" : "Zoom in";
    this.toggle.setAttribute("aria-pressed", String(this.zoomed));
    this.level.textContent = this.zoomed ? `${Math.round(this.scale * 100)}%` : "Fit";
  }

  zoomTo(value, point) {
    if (!this.enabled) return;
    const rect = this.viewport.getBoundingClientRect();
    const anchor = point || { x: rect.width / 2, y: rect.height / 2 };
    const scale = Math.max(1, Math.min(4, value));
    const ratio = scale / this.scale;
    this.x = anchor.x - (anchor.x - this.x) * ratio;
    this.y = anchor.y - (anchor.y - this.y) * ratio;
    this.scale = scale;
    if (scale === 1) this.x = this.y = 0;
    this.render();
  }

  toggleZoom(point) {
    if (!this.enabled) return;
    if (this.zoomed) this.reset();
    else this.zoomTo(2.5, point);
  }

  pointerDown(event) {
    if (!this.enabled || event.button > 0) return;
    if (!this.pointers.size) this.ignoreClick = false;
    this.viewport.focus({ preventScroll: true });
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    try { this.viewport.setPointerCapture?.(event.pointerId); } catch { /* Capture is optional. */ }
    if (this.pointers.size === 1) {
      this.pan = { clientX: event.clientX, clientY: event.clientY, x: this.x, y: this.y };
    } else if (this.pointers.size === 2) {
      this.startPinch();
      this.ignoreClick = true;
    }
    this.render();
  }

  startPinch() {
    const [a, b] = [...this.pointers.values()];
    const rect = this.viewport.getBoundingClientRect();
    const midpoint = { x: (a.x + b.x) / 2 - rect.left, y: (a.y + b.y) / 2 - rect.top };
    this.pinch = {
      distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), scale: this.scale,
      imageX: (midpoint.x - this.x) / this.scale, imageY: (midpoint.y - this.y) / this.scale,
    };
  }

  pointerMove(event) {
    if (!this.pointers.has(event.pointerId)) return;
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.pointers.size >= 2 && this.pinch) {
      const [a, b] = [...this.pointers.values()];
      const rect = this.viewport.getBoundingClientRect();
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      this.scale = Math.max(1, Math.min(4, this.pinch.scale * distance / this.pinch.distance));
      this.x = (a.x + b.x) / 2 - rect.left - this.pinch.imageX * this.scale;
      this.y = (a.y + b.y) / 2 - rect.top - this.pinch.imageY * this.scale;
      this.ignoreClick = true;
    } else if (this.pan) {
      const dx = event.clientX - this.pan.clientX;
      const dy = event.clientY - this.pan.clientY;
      if (Math.hypot(dx, dy) > 5) this.ignoreClick = true;
      if (this.zoomed) { this.x = this.pan.x + dx; this.y = this.pan.y + dy; }
    }
    this.render();
  }

  pointerEnd(event) {
    this.pointers.delete(event.pointerId);
    try { this.viewport.releasePointerCapture?.(event.pointerId); } catch { /* Already released. */ }
    if (this.pointers.size >= 2) this.startPinch();
    else if (this.pointers.size === 1) {
      const remaining = [...this.pointers.values()][0];
      this.pan = { clientX: remaining.x, clientY: remaining.y, x: this.x, y: this.y };
      this.pinch = null;
    } else if (!this.pointers.size) this.pan = this.pinch = null;
    this.render();
  }

  handleKey(event) {
    if (!this.enabled || event.ctrlKey || event.metaKey || event.altKey) return false;
    if (["+", "="].includes(event.key)) this.zoomTo(this.scale * 1.25);
    else if (event.key === "-") this.zoomTo(this.scale / 1.25);
    else if (event.key === "0") this.reset();
    else if (this.zoomed && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      this.x += event.key === "ArrowLeft" ? 60 : event.key === "ArrowRight" ? -60 : 0;
      this.y += event.key === "ArrowUp" ? 60 : event.key === "ArrowDown" ? -60 : 0;
      this.render();
    } else return false;
    event.preventDefault();
    return true;
  }
};
