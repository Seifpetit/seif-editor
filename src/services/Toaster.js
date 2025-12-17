// ─────────────────────────────────────────────
//  Toaster.js  — lightweight notification system
// ─────────────────────────────────────────────
import { R } from "../core/runtime.js";
import { ModalUI } from "./modalWindow/ModalWindow.js";
export class Toaster {
  constructor() {
    this.toast = null;   // active toast object
    this.dragHint = null;
    
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API
  // ─────────────────────────────────────────────

  show({ text, status = "info", autoCloseMs = 1500, block = false }) {
    this.toast = {
      text,
      status,
      autoCloseMs,
      block,
      willFade: !block || status !== "error",
      age: 0,
      alpha: 0,
    };

    // A toast overrides any drag hint
    this.dragHint = null;
  }

  showLoading(text) {
    this.show({ text, status: "loading", autoclose: 300 });
  }

  showSuccess(text) { 
    this.show({ text, status: "success", autoCloseMs: 3000 });
  }

  showWarning(text) {
    this.show({ text, status: "warning", autoCloseMs: 1600 });
  }

  showError(text) { R.ui.state.error = text;
    this.show({ text, status: "error", block: true, autoCloseMs: null });
  }

  showHint(text) {
    // Only show hint if no toast active
    if (!this.toast) {
      this.dragHint = { text, alpha: 1.0 };
    }
  } 

  clearHint() {
    this.dragHint = null;
  }

  clear() {
    this.toast = null;
    R.ui.state.error = false;
    R.ui.modalLock = false;
  }
  // ─────────────────────────────────────────────
  //  UPDATE
  // ─────────────────────────────────────────────
  update(dt) {
    // update toast
    if (this.toast) {
      const t = this.toast;
      t.age += dt;

      // fade in (0→1)
      if (t.alpha < 1) t.alpha += dt * 4;

      // auto close
      if (t.autoCloseMs && t.age >= t.autoCloseMs / 1000) {
        t.alpha -= dt * 4;
        if (t.alpha <= 0) this.toast = null;
      }
    }

    // update hint fade-out smoothly if needed
    if (this.dragHint && !this.toast) {
      // no fade here—hint is instant unless turned off
    }
  }

  // ─────────────────────────────────────────────
  //  INPUT BLOCKING LOGIC
  // ─────────────────────────────────────────────
  isBlocking() {
    return !!(this.toast && this.toast.block);
  }

  // Called from main mousePressed()
  onClick(mx, my) {
    if (!this.toast) return;
    
    if (this.toast.willFade) return;
    
    const rect = this.getToastRect();
    this.closeBtn = this.getCloseBtn(rect);

    const dx = mx - (this.closeBtn.x); const dy = my - (this.closeBtn.y);
    const d =  Math.sqrt(dx*dx + dy*dy);
    const inside = d <= this.closeBtn.r; 
    
    if (inside) this.clear();

  }

  // ─────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────
  render(g) {
    // Drag hint overlay
    if (ModalUI.active) {
      ModalUI.active.showDragHint(g);
    } if(this.dragHint) {
      this.renderHint(g);  // current yellow overlay
    }


    // Toast overlay
    if (this.toast) {
      this.renderToast(g);

      //delay of X ms time then clear toast
      new Promise(resolve => setTimeout(resolve, this.toast.autoCloseMs)).then(() => {
        if(!this.toast) return;
        if(this.toast.willFade) {this.clear(); return;}
        else R.ui.modalLock = true;

        
      });
      
    }
  }

  // helpers
  getToastRect() {
    const w = 380;
    const h = 110;
    const x = (R.layout.width - w) / 2;
    const y = R.layout.height * 0.15;
    return { x, y, w, h };
  }

  getCloseBtn(rect) {
    const x = rect.x + 20; 
    const y = rect.y + 20;
    const d = 12;
    const r = d / 2;
    return {x, y, d, r}
  }

  renderToast(g) {
    const t = this.toast;
    const rect = this.getToastRect();
    this.closeBtn = this.getCloseBtn(rect);

    g.push();
    g.noStroke();
    g.fill(0, 0, 0, 180 * t.alpha);
    g.rect(rect.x, rect.y, rect.w, rect.h, 12);

    // status color
    let color = "#ffaa00"; // info
    if (t.status === "loading") color = "#3c67e7ff";
    if (t.status === "success") color = "#00ff99";
    if (t.status === "warning") color = "#ffcc00";
    if (t.status === "error")   color = "#ff4444";

    // status dot
    g.fill(color);
    g.circle(this.closeBtn.x, this.closeBtn.y, this.closeBtn.d);

    // text
    g.fill(255);
    g.textSize(16);
    g.textAlign(g.LEFT, g.CENTER);
    g.text(t.text, rect.x + 40, rect.y + rect.h / 2);

    g.pop();
  }

  renderHint(g) {if(!this.dragHint) return;
    const text = this.dragHint.text;
    
    g.push();
    g.fill("#eaff004d"); g.rect(0, 0, g.width, g.height);

    g.fill("#ba4a4aff");
    g.rect(g.width/2 - 200, g.height/2 - 15, 400, 30, 
           8              , 8              ,   8,  8);
   
    g.fill("#beff28ff");  g.textSize(22); g.textAlign(g.CENTER, g.CENTER);
    g.text(text, g.width / 2, g.height / 2);

    g.pop();
  }
}

export const ToasterUI = new Toaster();
