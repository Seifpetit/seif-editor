/*──────────────────────────────────────────*/
/* MODAL HEADER COMPONENT                    */
/*──────────────────────────────────────────*/
export class ModalHeader {
  constructor(title, onClose, drag) {
    this.title = title;
    this.onClose = onClose;
    this.dragStart = drag;
    this.hover = false;


    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 34; // fixed header height
    this.closeHit = null;
  }

  setGeometry(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
  }

  update() {
    // nothing yet — later we can add drag logic here
  }

  render(g, alpha) {
    const A = alpha;
    const x = this.x;
    const y = this.y;
    const w = this.w;
    const h = this.h;
    g.push();
    /* Draw header bar */
    g.fill(40, A);
    g.noStroke();
    g.rect(x, y, w, h, 10, 10, 0, 0);

    /* Title */
    g.fill(230, A);
    g.textAlign(g.LEFT, g.CENTER);
    g.textSize(15);
    g.text(this.title, x + 12, y + h / 2);

    /* Close button (red dot) */
    const cx = x + w - 22;
    const cy = y + h / 2;
    const r = 7;

    g.fill(255, 90, 90, A);
    g.circle(cx, cy, r * 2);
    g.pop();
    // store hit area for click detection
    this.closeHit = { cx, cy, r };
  }

  hit(mx, my) {
    return mx >= this.x &&
      mx <= this.x + this.w &&
      my >= this.y &&
      my <= this.y + this.h;
  }

  onDrag(mx, my) {
    if (this.hit(mx, my)) {
      this.dragStart(mx, my);
      return true;
    }
    return false;
  }

  onHover(mx, my) { 
    if (!this.hit(mx, my)) return false;
    this.hover = true;
    return true;
  }

  onClick(mx, my) {
    if (!this.closeHit) return false;
    if (!this.hit(mx, my)) return false;
    
    const { cx, cy, r } = this.closeHit;
    const dx = mx - cx;
    const dy = my - cy;

    if (dx * dx + dy * dy <= r * r) {
      this.onClose();
      return true;
    }
    return false;
  }
}
