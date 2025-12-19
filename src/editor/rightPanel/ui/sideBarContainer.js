import { R } from "../../../core/runtime.js";
import { BOOKS } from "../ui/pages.js";
import { onBookSelected } from "../index.js";

export class sideBarContainer {

  constructor() {
    this.x = this.y = this.w = this.h = 0;
    this.buttons = [];

    for (let b of BOOKS)
      this.buttons.push(new Button(b.label, b.ref));
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    const count = this.buttons.length;
    const bh = this.h / count;
    this.buttons.forEach((btn, i) => {
      btn.setGeometry(this.x, this.y + i * bh, this.w, bh);
    });
  }

  hit(mx, my) {
    for (let btn of this.buttons) {
      if (btn.hit(mx, my)) return true;
    }
    return false;
  }

  onHover(mx, my) {
    for (let btn of this.buttons) {
      if (btn.onHover(mx, my)) return true;
    }
    return false;
  }

  onClick(mx, my) {
    for (let btn of this.buttons) { 
      if (btn.onClick(mx, my)) return true;
    }
    return false;
  }  

  onDoubleClick(mx, my) {
    for (let btn of this.buttons) {
      if (btn.onDoubleClick?.(mx, my)) return true;
    }
    return false;
  }

  update() {
    

    for(let btn of this.buttons) btn.update();

  }

  render(g) {
    if (!g) return;
    for (let btn of this.buttons) btn.render(g);
  }
}

class Button {

  constructor(label, ref) {
    this.hover = false;
    this.label = label;
    this.ref   = ref;
    this.x = this.y = this.w = this.h = 0;
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  hit(mx, my) {
    const inside =
      mx >= this.x && mx <= this.x + this.w &&
      my >= this.y && my <= this.y + this.h;
    return inside;
  }

  onHover(mx, my) {
    this.hover = false;
    if (!this.hit(mx, my)) return false;
    this.hover = true;
    R.ui.hoveredBook = this.ref;
    return true;
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

  update() {
    
  }

  render(g) {
    const isActive = (R.ui.selectedBook === this.ref);
    const isHover  = (R.ui.hoveredBook  === this.ref);
    g.push();
    g.noStroke();

    if (isActive) {
      g.fill("orange");
    } else if (isHover) {
      g.fill("#43321873");
    } else {
      g.fill("#262626");
    }

    g.rect(this.x, this.y, this.w, this.h, 6);

    g.fill(isActive ? "black" : "orange");
    g.textAlign(g.CENTER, g.CENTER);
    g.text(this.label, this.x + this.w/2, this.y + this.h/2);

    g.pop();
  }

}
