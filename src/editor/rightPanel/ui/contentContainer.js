// ContentContainer.js
import { R } from "../../../core/runtime.js";
import { PAGES } from "../ui/pages.js";

export class ContentContainer {

  constructor() {
    this.x = this.y = this.w = this.h = 0;
  }

  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  update() {

    const book = R.ui.selectedBook;
    const page = R.ui.selectedPage;

    if (!book || !page) return;

    // get the page instance from registry
    const pageObj = R.rightPanel.registry[book]?.[page];
    if (!pageObj) return;

    // apply geometry
    pageObj.setGeometry(this.x, this.y, this.w, this.h);

    // read metadata config for this page
    const def = PAGES[book].find(p => p.page === page);

    // handle palette atlas automatically
    if (def?.atlas) {
      const atlas = R.atlas[def.atlas];
      pageObj.update(atlas);
    } else {
      pageObj.update();
    }
  }

  render(g) {
    g.push();
    g.fill(25);
    g.rect(this.x, this.y, this.w, this.h, 10, 10, 10, 10);

    const book = R.ui.selectedBook;
    const page = R.ui.selectedPage;

    const pageObj = R.rightPanel.registry[book]?.[page];
    if (pageObj) pageObj.render(g);

    g.pop();
  }

  
}
