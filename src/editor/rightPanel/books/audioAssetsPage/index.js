import { R } from "../../../../core/runtime.js";
import { HeaderBar } from "./headerBar.js";

export class AudioAssetsPage {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0; 

    this.rowHeight = 32;
    

    // Local UI state (NOT global)
    this.mode = "list";       // "list" | "cards" | "wave"
    this.isRecording = false; // later used for audio recording
    this.hoveredId = null;
    this.isDragOver = false;

    // Header bar (event router)
    this.header = new HeaderBar({
      onMessage: msg => this.receive(msg)
    });
  }

  // ─────────────────────────────────────────────
  // EVENT RECEIVER — The "controller" layer
  // ─────────────────────────────────────────────
  receive(msg) {
    // Handle view mode changes
    if (msg.role.startsWith("mode:")) {
      this.mode = msg.role.split(":")[1];
      return;
    }

    // Handle recording toggle
    if (msg.role === "rec") {
      this.isRecording = !this.isRecording;
      return;
    }

    // Future actions:
    // if (msg.role === "sort:name") { ... }
    // if (msg.role === "play") { ... }
    // if (msg.role === "menu:more") { ... }
  }

  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    const BAR_X = this.x; const BAR_Y = this.y; const BAR_W = this.w; const BAR_H = this.rowHeight;

    this.header.setGeometry(BAR_X, BAR_Y, BAR_W, BAR_H);

  }

  // ─────────────────────────────────────────────
  // UPDATE LOOP
  // ─────────────────────────────────────────────
  update() {

    this.header.update();
    this.isDragOver = R.ui.dragActive;

    // Mode-specific updating
    if (this.mode === "list") {
      this.updateListView();
    } else if (this.mode === "cards") {
      this.updateCardsView();
    } else if (this.mode === "wave") {
      this.updateWaveView();
    }
  }
  onClick(mx, my) {
  }
  onHover(mx, my) {
  }
  onDoubleClick(mx, my) {
  }
  // ─────────────────────────────────────────────
  // RENDER LOOP
  // ─────────────────────────────────────────────
  render(g) {
    g.push();
    g.fill(25);
    g.rect(this.x, this.y, this.w, this.h);
    if(this.isDragOver) this.dragHighlight(g);
    // Render header
    this.header.render(g, this.mode);

    // Render mode-specific content
    if (this.mode === "list") {
      this.renderListView(g);
    } else if (this.mode === "cards") {
      this.renderCardsView(g);
    } else if (this.mode === "wave") {
      this.renderWaveView(g);
    }

    g.pop();
  }

  // ─────────────────────────────────────────────
  // PLACEHOLDER RENDERERS (you fill these next)
  // ─────────────────────────────────────────────
  updateListView() {}
  updateCardsView() {}
  updateWaveView() {}

  renderListView(g) {
    g.fill(180);
    g.text("List View", this.x + 20, this.y + 80);
  }

  renderCardsView(g) {
    g.fill(180);
    g.text("Cards View", this.x + 20, this.y + 80);
  }

  renderWaveView(g) {
    g.fill(180);
    g.text("Waveform View", this.x + 20, this.y + 80);
  }

  dragHighlight(g) {
    g.push();

        // semi-transparent overlay
        g.fill(255, 255, 0, 30);
        g.rect(this.x, this.y, this.w, this.h);

        // glowing border
        g.noFill();
        g.stroke("#00c8ff");
        g.strokeWeight(3);
        g.rect(this.x + 2, this.y + this.rowHeight + 2, this.w - 4, this.h - this.rowHeight - 4);

        // text
        g.noStroke();
        g.fill("#00c8ff");
        g.textAlign(g.CENTER, g.CENTER);
        g.textSize(18);
        g.text("Drop audio files to import", this.x + this.w / 2, this.y + this.h / 2);

        g.pop();
  

  }
}











