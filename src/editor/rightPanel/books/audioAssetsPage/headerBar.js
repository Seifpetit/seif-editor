import { R } from "../../../../core/runtime.js";

export class HeaderBar {
  constructor({ onMessage }) {
    this.onMessage = onMessage;

    this.btnRecord = new UIButton({
      label: "REC ●",
      role: "rec",
      onEvent: msg => this.onMessage(msg)
    });

    this.btnList = new UIButton({
      label: "List",
      role: "mode:list",
      onEvent: msg => this.onMessage(msg)
    });

    this.btnCards = new UIButton({
      label: "Cards",
      role: "mode:cards",
      onEvent: msg => this.onMessage(msg)
    });

    this.btnWave = new UIButton({
      label: "Wave",
      role: "mode:wave",
      onEvent: msg => this.onMessage(msg)
    });
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;

    const pad = 4;
    const btnRec_x = x + 10; const btnRec_y = y + pad; const btnRec_w = 50 + pad *2; const btnRec_h = h - pad*2;
    const btnWave_x = x + w - (btnRec_w * 4 + pad); const btnWave_y = y + pad; const btnWave_w = 50 + pad *2; const btnWave_h = h - pad*2;
    const btnCards_x = btnWave_x + btnWave_w; const btnCards_y = y + pad; const btnCards_w = 50 + pad *2; const btnCards_h = h - pad*2;
    const btnList_x = btnCards_x + btnCards_w; const btnList_y = y + pad; const btnList_w = 50 + pad *2; const btnList_h = h - pad*2;

    // Left side
    this.btnRecord.setGeometry(btnRec_x, btnRec_y, btnRec_w, btnRec_h);

    // Right side
    this.btnWave.setGeometry( btnWave_x, btnWave_y, btnWave_w, btnWave_h );
    this.btnCards.setGeometry(btnCards_x, btnCards_y, btnCards_w, btnCards_h);
    this.btnList.setGeometry( btnList_x, btnList_y, btnList_w, btnList_h );
  }

  update() {
    this.btnRecord.update();
    this.btnList.update();
    this.btnCards.update();
    this.btnWave.update();
  }

  render(g, currentMode) {

    g.push(); g.fill("#42331fff");
    g.rect(this.x, this.y, this.w, this.h, 5, 5, 5, 5);
    this.btnRecord.render(g);

    this.btnList.render(g,  currentMode === "list");
    this.btnCards.render(g, currentMode === "cards");
    this.btnWave.render(g,  currentMode === "wave");
  }

}


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
      this.onEvent({ type: "click", role: this.role });
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
