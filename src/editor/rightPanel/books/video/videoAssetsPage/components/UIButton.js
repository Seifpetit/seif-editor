import { R } from "../../../../../../core/runtime.js";

export class UIButton {
  constructor({ label, role, onEvent }) {
    this.label = label;
    this.role  = role;
    this.onEvent = onEvent;
    this.hovered = false;

    this.x = this.y = this.w = this.h = 0;
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
  }

  update() {
    const m = R.input.mouse;

    const inside =
      m.x >= this.x &&
      m.x <= this.x + this.w &&
      m.y >= this.y &&
      m.y <= this.y + this.h;
     this.hovered = inside;

    if (inside && m.pressed && m.button === "left") {
      const message = { type: "click", role: this.role };
      this.onEvent(message);
    }
  }

  render(g, isActive = false) {
    g.push();
    g.fill("#333");
    if(this.hovered) {
      g.fill("#f7ae1b94");
      
    }if(isActive) g.fill("#ffaa00");
    g.rect(this.x, this.y, this.w, this.h);

    g.fill(isActive ? "black" : "orange");
    g.textAlign(g.CENTER, g.CENTER);
    g.text(this.label, this.x + this.w/2, this.y + this.h/2);

    g.pop();
  }
}

