// audioAssetsPage/headerBar.js
import { UIElement } from "../../../../core/ui/UIElement.js";
import { UIButton } from "../video/videoAssetsPage/components/UIButton.js";

export class HeaderBar extends UIElement {
  constructor({ onMessage }) {
    super();
    this.onMessage   = onMessage;
    this.currentMode = "list";

    this.btnRecord = this.addChild(new UIButton({
      label:   "REC ●",
      role:    "rec",
      onEvent: msg => this.onMessage(msg)
    }));

    this.btnWave = this.addChild(new UIButton({
      label:   "Wave",
      role:    "mode:wave",
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

  setGeometry(x, y, w, h) {
    super.setGeometry(x, y, w, h);

    const pad  = 4;
    const btnW = 50 + pad * 2;
    const btnH = h - pad * 2;
    const btnY = y + pad;

    this.btnRecord.setGeometry(x + 10,           btnY, btnW, btnH);
    this.btnWave.setGeometry(  x + w - btnW * 4, btnY, btnW, btnH);
    this.btnCards.setGeometry( x + w - btnW * 3, btnY, btnW, btnH);
    this.btnList.setGeometry(  x + w - btnW * 2, btnY, btnW, btnH);
  }

  render(g, currentMode = this.currentMode) {
    this.currentMode = currentMode;

    this.btnWave.active  = currentMode === "wave";
    this.btnCards.active = currentMode === "cards";
    this.btnList.active  = currentMode === "list";

    g.push();
    g.noStroke();
    g.fill("#42331fff");
    g.rect(this.x, this.y, this.w, this.h, 5);
    g.pop();

    super.render(g);
  }
}
