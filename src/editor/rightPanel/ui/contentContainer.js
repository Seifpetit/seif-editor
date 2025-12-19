// ContentContainer.js
import { R } from "../../../core/runtime.js";
import { PAGES } from "../ui/pages.js";

export class ContentContainer {

  constructor() {
    this.x = this.y = this.w = this.h = 0;
    this.book = null;
    this.page = null;
    this.pageObj = null;
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;

    this.book = R.ui.selectedBook;
    this.page = R.ui.selectedPage;

    if (!this.book || !this.page) {this.book = "TILES"; this.page = "WORLD_TILESET";
      R.ui.selectedBook = this.book;
      R.ui.selectedPage = this.page;
    }

    // get the page instance from registry
    this.pageObj = R.rightPanel.registry[this.book]?.[this.page];
    if (!this.pageObj) return;

    // apply geometry
    this.pageObj.setGeometry(this.x, this.y, this.w, this.h);
    
  }

  onHover(mx, my) {
    if (!this.pageObj) return false;
    return this.pageObj?.onHover(mx, my);
  }

  onClick(mx, my) {
    if (!this.pageObj) return false;
    return this.pageObj?.onClick(mx, my);
  }

  update() {

    // read metadata config for this page
  
    const def = PAGES[this.book].find(p => p.page === this.page); 
    // handle palette atlas automatically
    if (def?.atlas) { 
      const atlas = R.atlas[def.atlas];
      this.pageObj?.update(atlas);
    } else {
      this.pageObj?.update();
    }
  }

  render(g) {
    g.push();
    g.fill(25);
    g.rect(this.x, this.y, this.w, this.h, 10, 10, 10, 10);

    const pageObj = R.rightPanel.registry[this.book]?.[this.page];
    if (pageObj) pageObj.render(g);

    g.pop();
  }

  
}
