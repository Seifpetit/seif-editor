// topBarContainer.js
import { R } from "../../../core/runtime.js";
import { UIElement } from "../../../core/ui/UIElement.js";

// ─────────────────────────────────────────────
// PAGE BUTTON — leaf node
// ─────────────────────────────────────────────
class PageButton extends UIElement {
  constructor(label, page) {
    super();
    this.label = label;
    this.page  = page;
    this.hovered = false;
  }

  onHover(mx, my) {
    this.hovered = this.hit(mx, my);
    if (this.hovered) R.ui.hoveredPage = this.page;
    return this.hovered;
  }

  onClick(mx, my) {
    if (!this.hit(mx, my)) return false;
    R.ui.selectedPage = this.page;
    return true;
  }

  render(g) {
    const isActive  = R.ui.selectedPage === this.page;
    const isHovered = R.ui.hoveredPage  === this.page;

    g.push();
    g.noStroke();

    if (isActive)       g.fill("#ffaa00");
    else if (isHovered) g.fill("#433218ff");
    else                g.fill("#262626");

    g.rect(this.x, this.y, this.w, this.h, 10, 10, 0, 0);

    g.fill(isActive ? "black" : "orange");
    g.textAlign(g.CENTER, g.CENTER);
    g.text(this.label, this.x + this.w / 2, this.y + this.h / 2);
    g.pop();
  }
}

// ─────────────────────────────────────────────
// TOP BAR CONTAINER — parent node
// ─────────────────────────────────────────────
export class topBarContainer extends UIElement {
  constructor() {
    super();
  }

  setButtons(list) {
    this.clearChildren();
    for (const p of list) {
      this.addChild(new PageButton(p.label, p.page));
    }
    this._layoutButtons();
  }

  setGeometry(x, y, w, h) {
    super.setGeometry(x, y, w, h);
    this._layoutButtons();
  }

  _layoutButtons() {
    const count = this.children.length;
    if (count === 0) return;
    const bw = this.w / count;
    this.children.forEach((btn, i) => {
      btn.setGeometry(this.x + i * bw, this.y, bw, this.h);
    });
  }

  render(g) {
    g.push();
    // Background bar
    g.noStroke();
    g.fill("#75725cff");
    g.rect(this.x, this.y, this.w, this.h, 10, 10, 0, 0);

    // Placeholder text when no book selected
    if (this.children.length === 0) {
      g.textAlign(g.CENTER, g.CENTER);
      g.textSize(20);
      g.fill("#eca233ff");
      g.text("SELECT A BOOK", this.x + this.w / 2, this.y + this.h / 2);
    }
    g.pop();

    // Render buttons via base class
    super.render(g);
  }
}
