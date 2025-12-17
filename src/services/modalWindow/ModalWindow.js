// /src/ui/windows/ModalWindow.js
import { R } from "../../core/runtime.js";
import { ModalHeader } from "./ModalHeader.js";   // your new header class

export class ModalWindow {
  constructor() {
    this.active = null;   // ModalInstance
  }

  show({ title, content, size = "medium", blocking = false }) {
    R.ui.modalLock = this.blocking;
    this.active = new ModalInstance({
      title,
      content,
      size,
      blocking,
      onClose: () => this.close(),
      drag: () => this.drag()
    });
  }

  onDrag(mx, my){
    if(this.active) this.active.onDrag(mx, my);
  }

  drag() {
    if (this.active) {
      this.active.drag();
    }
  }

  close() {
    if (this.active.content && typeof this.active.content.onClose === "function") {
      //R.ui.modalLock = this.blocking;
      this.active.content.onClose();
    }
    if (this.active) {
      //R.ui.modalLock = this.blocking;
      this.active.startClosing();
    }
    
  }

  update() {
    if (!this.active) return;

    this.active.update();

    if (this.active.isFullyClosed()) {
      this.active = null;
      R.ui.modalLock = false;
    }
  }

  render(g) {
    if (!this.active) return;

    // block the editor beneath
    this.active.render(g);
  }

  onClick(mx, my) {
    if (!this.active) return false;
    return this.active.onClick(mx, my);
  }
}


/*──────────────────────────────────────────*/
/* MODAL INSTANCE — the real window         */
/*──────────────────────────────────────────*/
class ModalInstance {
  constructor({ title, content, size, blocking, onClose, onDrag }) {
    this.title = title;
    this.content = content;   // callback(g, x, y, w, h)
    this.size = size;
    this.blocking = blocking;
    this.onClose = onClose;

    this.drag = onDrag;
    this.dragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.alpha = 0;
    this.fadeSpeed = 8;
    this.closing = false;

    // Geometry will be computed each render
    this.w = this.getWidth(size);
    this.h = this.getHeight(size);

    this.x = 0;
    this.y = 0;

    // Header
    this.header = new ModalHeader(
      title,
      () => this.onClose(),
      (mx, my) => this.startDrag(mx, my)
    );


    // Precompute once
     setTimeout(() => this.computeDefaultPosition(), 0);

  }

/*──────────────────────────────────────────*/
/* GEOMETRY                                 */
/*──────────────────────────────────────────*/
  getWidth(size) {
    return size === "small" ? 320 :
           size === "large" ? 720 :
           480; // medium default
  }

  getHeight(size) {
    return size === "small" ? 220 :
           size === "large" ? 520 :
           340;
  }

  computeDefaultPosition() {
    const pad = 20;
    this.x = (R.layout.width - this.w) / 2;
    this.y = (R.layout.height - this.h) / 2;

    this.header.setGeometry(this.x, this.y, this.w);
  }

  updatePosition(nx, ny) {

    this.x = nx;
    this.y = ny;
    this.header.setGeometry(this.x, this.y, this.w);
  }
  
  showDragHint(g) {
    g.push();
    g.noFill();
    g.stroke("#00c8ff");
    g.strokeWeight(3);
    g.rect(this.x, this.y, this.w, this.h);
    g.pop();
  }

  /*──────────────────────────────────────────*/
  /* UPDATE                                   */
  /*──────────────────────────────────────────*/
  update() {
    
    if (!this.closing) {
      // fade in
      this.alpha = Math.min(255, this.alpha + this.fadeSpeed);
    } else {
      // fade out
      this.alpha = Math.max(0, this.alpha - this.fadeSpeed);
    }
  }

  startClosing() {
    this.closing = true;
  }

  isFullyClosed() {
    return this.closing && this.alpha <= 0;
  }

  /*──────────────────────────────────────────*/
  /* RENDER                                   */
  /*──────────────────────────────────────────*/
  render(g) {
    const A = this.alpha;
   

    // Dim background
    g.push();
    g.noStroke();
    g.fill(0, 150 * (A / 255));
    g.rect(0, 0, R.layout.width, R.layout.height);
    g.pop();

    // Window
    g.push();
    g.fill(30, A);
    g.rect(this.x, this.y, this.w, this.h, 12);
    g.pop();

    // Header
    this.header.render(g, A);

    // Content region
    const cx = this.x + 20;
    const cy = this.y + this.header.h + 10;
    const cw = this.w - 40;
    const ch = this.h - this.header.h - 30;

    if (this.content) {
      g.push();
      if (typeof this.content === "function") {
        this.content(g, cx, cy, cw, ch);
      } else if (this.content && typeof this.content.draw === "function") {
        this.content.draw(g, cx, cy, cw, ch);
      }
      g.pop();
    }
  }

  /*──────────────────────────────────────────*/
  /* DRAG HANDLING                            */
  /*──────────────────────────────────────────*/

  startDrag(mx, my) {
    this.dragging = true;
    R.ui.modalDrag = this.dragging;
    this.dragOffsetX = mx - this.x;
    this.dragOffsetY = my - this.y;
  }

  dragTo(mx, my) {
    if (!this.dragging) return;

    const newX = mx - this.dragOffsetX;
    const newY = my - this.dragOffsetY;

    this.updatePosition(newX, newY);
  }

  stopDrag() {
    this.dragging = false;
    R.ui.modalDrag = this.dragging;
  }


  onDrag(mx, my) {

    // if header handled drag start
    if (this.header.onDrag(mx, my)) return true;

    // if dragging, continue moving
    if (this.dragging) {
      this.dragTo(mx, my);
      return true;
    }

    return false;
  }

  /*──────────────────────────────────────────*/
  /* CLICK HANDLING                           */
  /*──────────────────────────────────────────*/
  onClick(mx, my) {
    // Header close button
    if (this.header.onClick(mx, my)) return true;

    // Content click
    if (this.content && typeof this.content.onClick === "function") {
      this.content.onClick(mx, my);
      return true;
    }

    // If blocking → consume all clicks
    return this.blocking;
  }
}


/*──────────────────────────────────────────*/
/* SINGLETON                                 */
/*──────────────────────────────────────────*/
export const ModalUI = new ModalWindow();
