// UIElement.js
// Base class for all right panel UI components.
// Contract: every node has geometry, a hit test, and four event methods.
// Children are optional — leaf nodes just don't add any.

export class UIElement {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.visible = true;
    this.children = [];
  }

  // ─────────────────────────────────────────────
  // GEOMETRY
  // ─────────────────────────────────────────────

  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  // ─────────────────────────────────────────────
  // HIT TEST
  // ─────────────────────────────────────────────

  hit(mx, my) {
    return (
      mx >= this.x &&
      mx <= this.x + this.w &&
      my >= this.y &&
      my <= this.y + this.h
    );
  }

  // ─────────────────────────────────────────────
  // LIFECYCLE — override in subclasses
  // Default behaviour: propagate to children
  // ─────────────────────────────────────────────

  update() {
    if (!this.visible) return;
    for (const child of this.children) child.update?.();
  }

  render(g) {
    if (!this.visible) return;
    for (const child of this.children) child.render?.(g);
  }

  // ─────────────────────────────────────────────
  // INPUT — propagate to first child that hits
  // Return true to consume the event (stop bubbling)
  // ─────────────────────────────────────────────

  onHover(mx, my) {
    if (!this.visible) return false;
    for (const child of this.children) {
      if (child.hit(mx, my)) {
        if (child.onHover?.(mx, my)) return true;
      }
    }
    return false;
  }

  onClick(mx, my) {
    if (!this.visible) return false;
    for (const child of this.children) {
      if (child.hit(mx, my)) {
        if (child.onClick?.(mx, my)) return true;
      }
    }
    return false;
  }

  onDoubleClick(mx, my) {
    if (!this.visible) return false;
    for (const child of this.children) {
      if (child.hit(mx, my)) {
        if (child.onDoubleClick?.(mx, my)) return true;
      }
    }
    return false;
  }

  // ─────────────────────────────────────────────
  // CHILDREN HELPERS
  // ─────────────────────────────────────────────

  addChild(child) {
    this.children.push(child);
    return child; // allows chaining
  }

  removeChild(child) {
    this.children = this.children.filter(c => c !== child);
  }

  clearChildren() {
    this.children = [];
  }
}
