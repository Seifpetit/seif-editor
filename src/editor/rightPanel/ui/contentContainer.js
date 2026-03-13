// contentContainer.js
import { R } from "../../../core/runtime.js";
import { UIElement } from "../../../core/ui/UIElement.js";
import { PAGES } from "../ui/pages.js";

export class ContentContainer extends UIElement {
  constructor() {
    super();
    this.book    = null;
    this.page    = null;
    this.pageObj = null;
  }

  setGeometry(x, y, w, h) {
    super.setGeometry(x, y, w, h);
    this._resolvePageObj();
  }

  // ─────────────────────────────────────────────
  // Resolve current page object from registry
  // Called every setGeometry so it stays in sync
  // with R.ui.selectedBook / selectedPage
  // ─────────────────────────────────────────────
  _resolvePageObj() {
    this.book = R.ui.selectedBook;
    this.page = R.ui.selectedPage;

    // Default to TILES if nothing selected yet
    if (!this.book || !this.page) {
      this.book = "TILES";
      this.page = "WORLD_TILESET";
      R.ui.selectedBook = this.book;
      R.ui.selectedPage = this.page;
    }

    this.pageObj = R.rightPanel.registry[this.book]?.[this.page];
    if (!this.pageObj) return;

    this.pageObj.setGeometry(this.x, this.y, this.w, this.h);
  }

  // ─────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────
  update() {
    // Re-resolve in case book/page changed since last frame
    this._resolvePageObj();
    if (!this.pageObj) return;

    const def = PAGES[this.book]?.find(p => p.page === this.page);
    if (def?.atlas) {
      this.pageObj.update(R.atlas[def.atlas]);
    } else {
      this.pageObj.update();
    }
  }

  render(g) {
    g.push();
    g.noStroke();
    g.fill(25);
    g.rect(this.x, this.y, this.w, this.h, 10);
    g.pop();

    this.pageObj?.render(g);
  }

  // ─────────────────────────────────────────────
  // INPUT — delegate to active page object
  // ─────────────────────────────────────────────
  onHover(mx, my) {
    return this.pageObj?.onHover(mx, my) ?? false;
  }

  onClick(mx, my) {
    return this.pageObj?.onClick(mx, my) ?? false;
  }

  onDoubleClick(mx, my) {
    return this.pageObj?.onDoubleClick?.(mx, my) ?? false;
  }
}
