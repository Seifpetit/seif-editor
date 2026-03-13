// sideBarContainer.js
import { R } from "../../../core/runtime.js";
import { UIElement } from "../../../core/ui/UIElement.js";
import { BOOKS } from "../ui/pages.js";
import { onBookSelected } from "../index.js";

// ─────────────────────────────────────────────
// BOOK BUTTON — leaf node
// ─────────────────────────────────────────────
class BookButton extends UIElement {
  constructor(label, ref) {
    super();
    this.label = label;
    this.ref   = ref;
    this.hovered = false;
  }

  onHover(mx, my) {
    this.hovered = this.hit(mx, my);
    if (this.hovered) R.ui.hoveredBook = this.ref;
    return this.hovered;
  }

  onClick(mx, my) {
    if (!this.hit(mx, my)) return false;
    onBookSelected(this.ref);
    return true;
  }

  onDoubleClick(mx, my) {
    if (!this.hit(mx, my)) return false;
    onBookSelected(this.ref);
    return true;
  }

  render(g) {
    const isActive = R.ui.selectedBook === this.ref;
    const isHover  = R.ui.hoveredBook  === this.ref;

    g.push();
    g.noStroke();

    if (isActive)     g.fill("orange");
    else if (isHover) g.fill("#43321873");
    else              g.fill("#262626");

    g.rect(this.x, this.y, this.w, this.h, 6);

    g.fill(isActive ? "black" : "orange");
    g.textAlign(g.CENTER, g.CENTER);
    g.text(this.label, this.x + this.w / 2, this.y + this.h / 2);
    g.pop();
  }
}

// ─────────────────────────────────────────────
// SIDEBAR CONTAINER — parent node
// ─────────────────────────────────────────────
export class sideBarContainer extends UIElement {
  constructor() {
    super();
    for (const b of BOOKS) {
      this.addChild(new BookButton(b.label, b.ref));
    }
  }

  setGeometry(x, y, w, h) {
    super.setGeometry(x, y, w, h);
    const bh = h / this.children.length;
    this.children.forEach((btn, i) => {
      btn.setGeometry(x, y + i * bh, w, bh);
    });
  }

  // UIElement base handles propagation to children automatically
  // Only override if you need custom behaviour beyond that
}
