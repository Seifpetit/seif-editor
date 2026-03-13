// UIButton.js
// Leaf node — no children.
// Receives hover/click via events from parent, does NOT poll R.input directly.

import { UIElement } from "../../../../../../core/ui/UIElement.js";

export class UIButton extends UIElement {
  constructor({ label, role, onEvent }) {
    super();
    this.label   = label;
    this.role    = role;
    this.onEvent = onEvent;
    this.hovered = false;
    this.active  = false;
  }

  // ─────────────────────────────────────────────
  // INPUT
  // ─────────────────────────────────────────────

  onHover(mx, my) {
    this.hovered = this.hit(mx, my);
    return this.hovered;
  }

  onClick(mx, my) {
    if (!this.hit(mx, my)) return false;
    this.onEvent?.({ type: "click", role: this.role });
    return true;
  }

  // Clear hover when parent stops routing to this button
  onHoverExit() {
    this.hovered = false;
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  render(g) {
    if (!this.visible) return;
    g.push();

    // Background
    if (this.active)       g.fill("#ffaa00");
    else if (this.hovered) g.fill("#f7ae1b94");
    else                   g.fill("#333");

    g.noStroke();
    g.rect(this.x, this.y, this.w, this.h);

    // Label
    g.fill(this.active ? "black" : "orange");
    g.textAlign(g.CENTER, g.CENTER);
    g.text(this.label, this.x + this.w / 2, this.y + this.h / 2);

    g.pop();
  }
}
