import { R } from "../../../core/runtime.js";

export class topBarContainer {

  constructor() {
    this.x = this.y = this.w = this.h = 0;
    this.buttons = [];
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.updateButtonGeometry();
  }

  setButtons(list) {
    this.buttons = list.map(p => new Button(p.label, p.page));
    this.updateButtonGeometry();
  }

  updateButtonGeometry() {
    const count = this.buttons.length;
    if (count === 0) return;

    const bw = this.w / count;
    this.buttons.forEach((btn, i) => {
      btn.x = this.x + i * bw;
      btn.y = this.y;
      btn.w = bw;
      btn.h = this.h;
    });
  }

  onHover(mx, my) {
    for (let btn of this.buttons) {
      if (btn.onHover(mx, my)) return true;
    }
    return false;
  }

  onClick(mx, my) {
    for (let btn of this.buttons) {
        if(btn.onClick(mx, my))return true;
      }
    return false;
  }

  update() {
    this.buttons.forEach(btn => btn.update());
  }

  render(g) {
    g.push();

    g.fill("#75725cff"); g.rect(this.x, this.y, this.w, this.h, 10, 10, 0, 0);

    g.textAlign(g.CENTER, g.CENTER); g.textSize(20); g.fill("#eca233ff");
    g.text("SELECT A BOOK", this.x + this.w / 2, this.y + this.h / 2);

    this.buttons.forEach(btn => btn.render(g));

    g.pop();
  }
}

class Button {

  constructor(label, page) {
    this.label = label;
    this.page  = page;
    this.x = this.y = this.w = this.h = 0;
  }

  hit(mx, my) {
    const inside =
      mx >= this.x && mx <= this.x + this.w &&
      my >= this.y && my <= this.y + this.h;
    return inside;
  }
  
  onHover(mx, my) {
    if (!this.hit(mx, my)) return false;
    R.ui.hoveredPage = this.page;
    return true;
  }

  onClick(mx, my) {
    if (!this.hit(mx, my)) return false;
    R.ui.selectedPage = this.page;
    return true;
  }

  update() {

  }

  render(g) {
    const isActive = (R.ui.selectedPage === this.page);
    const isHovered = (R.ui.hoveredPage === this.page);

    g.push();

    if (isActive) {
      g.fill("#ffaa00");
    } else if (isHovered) {
      g.fill("#433218ff");
    } else {
      g.fill("#262626");
    }

    g.rect(this.x, this.y, this.w, this.h, 10, 10, 0, 0);

    g.fill(isActive ? "black" : "orange");
    g.textAlign(g.CENTER, g.CENTER);
    g.text(this.label, this.x + this.w/2, this.y + this.h/2);

    g.pop();
  }
}
