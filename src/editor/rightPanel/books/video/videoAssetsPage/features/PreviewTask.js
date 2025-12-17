// src/editor/rightPanel/books/video/videoAssetsPage/features/PreviewTask.js
import { R } from "../../../../../../core/runtime.js";

export class PreviewTask {
  constructor(asset) {
    this.asset = asset;

    this.video = null;
    this.ready = false;

    // UI state
    this.scrubPos = 0;        // 0.0 → 1.0
    this.hoverScrub = false;

    // Layout caches
    this.vx = 0; 
    this.vy = 0;
    this.vw = 0; 
    this.vh = 0;

    this.barX = 0;
    this.barY = 0;
    this.barW = 0;
    this.barH = 8;

    this.loadVideo();
    R.ui.modalLock = true;
  }

  // ------------------------------------------------------------
  // LOAD VIDEO (once)
  // ------------------------------------------------------------
  loadVideo() {
    const p = R.p5_instance;

    this.video = p.createVideo([this.asset.url], () => {
      this.video.hide();
      this.video.volume(0); // mute autoplay
      this.ready = true;
    });

    this.video.onended = () => {
      this.video.stop();
    };
  }

  // ------------------------------------------------------------
  // SET GEOMETRY
  // Called every frame by ModalUI
  // ------------------------------------------------------------
  setGeometry(x, y, w, h) {
    // Video area centered
    const padding = 20;

    this.vx = x + padding;
    this.vy = y + 40;
    this.vw = w - padding * 2;
    this.vh = h - 120;

    // Scrub bar under the video
    this.barX = this.vx;
    this.barY = this.vy + this.vh + 20;
    this.barW = this.vw;
  }

  // ------------------------------------------------------------
  // UPDATE LOGIC
  // ------------------------------------------------------------
  update() {
    if (!this.ready) return;

    // Update scrub position as video plays
    if (!this.video.elt.paused && this.video.duration()) {
      this.scrubPos = this.video.time() / this.video.duration();
    }
  }

  // ------------------------------------------------------------
  // DRAW
  // ------------------------------------------------------------
  draw(g, x, y, w, h) {
    this.setGeometry(x, y, w, h);

    g.push();
    g.fill(30);
    g.textSize(16);
    g.text("Preview: " + this.asset.name, x, y + 10);

    // --- DRAW VIDEO FRAME ---
    if (this.ready) {
      g.image(this.video, this.vx, this.vy, this.vw, this.vh);
    } else {
      g.fill(80);
      g.rect(this.vx, this.vy, this.vw, this.vh);
      g.fill(200);
      g.text("Loading...", this.vx + 10, this.vy + 10);
    }

    // ------------------------------------------------------------
    // SCRUB BAR
    // ------------------------------------------------------------
    g.fill(80);
    g.rect(this.barX, this.barY, this.barW, this.barH, 4);

    // Filled portion
    g.fill("#00c8ff");
    g.rect(this.barX, this.barY, this.scrubPos * this.barW, this.barH, 4);

    // ------------------------------------------------------------
    // ADD TO TIMELINE BUTTON
    // ------------------------------------------------------------
    const btnW = 150;
    const btnH = 32;
    const btnX = this.barX;
    const btnY = this.barY + 30;

    g.fill(40);
    g.rect(btnX, btnY, btnW, btnH, 6);

    g.fill(220);
    g.textAlign(g.CENTER, g.CENTER);
    g.text("Add to Timeline", btnX + btnW / 2, btnY + btnH / 2);

    this._cacheButton = { x: btnX, y: btnY, w: btnW, h: btnH };

    g.pop();
  }

  // ------------------------------------------------------------
  // MOUSE INTERACTION
  // ------------------------------------------------------------
  onClick(mx, my) {
    if (!this.ready) return;

    // Scrub bar click
    if (this._inside(mx, my, this.barX, this.barY, this.barW, this.barH)) {
      const rel = (mx - this.barX) / this.barW;
      this.scrubPos = Math.max(0, Math.min(1, rel));
      this.video.time(this.scrubPos * this.video.duration());
      return true;
    }

    // Add to timeline button
    if (this._inside(mx, my, this._cacheButton.x, this._cacheButton.y, this._cacheButton.w, this._cacheButton.h)) {
      console.log("TODO: Add to timeline", this.asset.id);
      return true;
    }
  }

  _inside(mx, my, x, y, w, h) {
    return mx >= x && mx <= x + w && my >= y && my <= y + h;
  }

  // ------------------------------------------------------------
  // CLEANUP
  // ------------------------------------------------------------
  onClose() {
    R.ui.modalLock = false;
    if (this.video) {
      this.video.stop();
      this.video.remove();
      this.video = null;
      this.ready = false;
    }
  }
}
