// headerBar.js
import { UIElement } from "../../../../../../core/ui/UIElement.js";
import { UIButton } from "./UIButton.js";

export class HeaderBar extends UIElement {
  constructor({ onMessage }) {
    super();
    this.onMessage  = onMessage;
    this.currentMode = "cards";

    this.btnRecord = this.addChild(new UIButton({
      label:   "REC ●",
      role:    "rec",
      onEvent: msg => this.onMessage(msg)
    }));

    this.btnImport = this.addChild(new UIButton({
      label:   "IMPORT",
      role:    "import",
      onEvent: msg => this.onMessage(msg)
    }));

    this.btnCards = this.addChild(new UIButton({
      label:   "Cards",
      role:    "mode:cards",
      onEvent: msg => this.onMessage(msg)
    }));

    this.btnList = this.addChild(new UIButton({
      label:   "List",
      role:    "mode:list",
      onEvent: msg => this.onMessage(msg)
    }));
  }

  // ─────────────────────────────────────────────
  // GEOMETRY
  // ─────────────────────────────────────────────
  setGeometry(x, y, w, h) {
    super.setGeometry(x, y, w, h);

    const pad    = 4;
    const btnW   = 50 + pad * 2;
    const btnH   = h - pad * 2;
    const btnY   = y + pad;

    this.btnRecord.setGeometry(x + 10,                  btnY, btnW, btnH);
    this.btnImport.setGeometry(x + 10 + btnW + 10,      btnY, btnW, btnH);
    this.btnCards.setGeometry( x + w - btnW * 3,        btnY, btnW, btnH);
    this.btnList.setGeometry(  x + w - btnW * 2,        btnY, btnW, btnH);
  }

  // ─────────────────────────────────────────────
  // RENDER
  // currentMode passed from VideoAssetsPage.render()
  // ─────────────────────────────────────────────
  render(g, currentMode = this.currentMode) {
    this.currentMode = currentMode;

    // sync active state on mode buttons
    this.btnCards.active = currentMode === "cards";
    this.btnList.active  = currentMode === "list";

    g.push();
    g.noStroke();
    g.fill("#42331fff");
    g.rect(this.x, this.y, this.w, this.h, 5);
    g.pop();

    super.render(g); // render all four buttons
  }
}
