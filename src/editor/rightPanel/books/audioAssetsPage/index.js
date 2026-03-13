// audioAssetsPage/index.js
import { R } from "../../../../core/runtime.js";
import { UIElement } from "../../../../core/ui/UIElement.js";
import { HeaderBar } from "./headerBar.js";

export class AudioAssetsPage extends UIElement {
  constructor() {
    super();
    this.rowHeight   = 32;
    this.mode        = "list";   // "list" | "cards" | "wave"
    this.isRecording = false;
    this.isDragOver  = false;

    this.header = this.addChild(new HeaderBar({
      onMessage: msg => this._receive(msg)
    }));
  }

  // ─────────────────────────────────────────────
  // GEOMETRY
  // ─────────────────────────────────────────────
  setGeometry(x, y, w, h) {
    super.setGeometry(x, y, w, h);
    this.header.setGeometry(x, y, w, this.rowHeight);
  }

  // ─────────────────────────────────────────────
  // MESSAGE BUS
  // ─────────────────────────────────────────────
  _receive(msg) {
    if (msg.role.startsWith("mode:")) {
      this.mode = msg.role.split(":")[1];
      return;
    }
    if (msg.role === "rec") {
      this.isRecording = !this.isRecording;
      return;
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  update() {
    this.isDragOver = R.ui.dragActive;
    super.update(); // header
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  render(g) {
    g.push();
    g.noStroke();
    g.fill(25);
    g.rect(this.x, this.y, this.w, this.h);
    if (this.isDragOver) this._dragHighlight(g);
    g.pop();

    this.header.render(g, this.mode);

    if      (this.mode === "list")  this._renderListView(g);
    else if (this.mode === "cards") this._renderCardsView(g);
    else if (this.mode === "wave")  this._renderWaveView(g);
  }

  // ─────────────────────────────────────────────
  // INPUT — header handled by UIElement tree
  // ─────────────────────────────────────────────
  onHover(mx, my) {
    if (!this.hit(mx, my)) return false;
    return super.onHover(mx, my);
  }

  onClick(mx, my) {
    if (!this.hit(mx, my)) return false;
    return super.onClick(mx, my);
  }

  // ─────────────────────────────────────────────
  // PLACEHOLDER VIEWS — fill these when ready
  // ─────────────────────────────────────────────
  _renderListView(g) {
    g.fill(180);
    g.text("List View", this.x + 20, this.y + 80);
  }

  _renderCardsView(g) {
    g.fill(180);
    g.text("Cards View", this.x + 20, this.y + 80);
  }

  _renderWaveView(g) {
    g.fill(180);
    g.text("Waveform View", this.x + 20, this.y + 80);
  }

  _dragHighlight(g) {
    g.push();
    g.fill(255, 255, 0, 30);
    g.rect(this.x, this.y, this.w, this.h);

    g.noFill();
    g.stroke("#00c8ff");
    g.strokeWeight(3);
    g.rect(this.x + 2, this.y + this.rowHeight + 2, this.w - 4, this.h - this.rowHeight - 4);

    g.noStroke();
    g.fill("#00c8ff");
    g.textAlign(g.CENTER, g.CENTER);
    g.textSize(18);
    g.text("Drop audio files to import", this.x + this.w / 2, this.y + this.h / 2);
    g.pop();
  }
}
