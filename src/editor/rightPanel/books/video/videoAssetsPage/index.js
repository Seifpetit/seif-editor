// videoAssetsPage/index.js
import { R } from "../../../../../core/runtime.js";
import { UIElement } from "../../../../../core/ui/UIElement.js";
import { HeaderBar } from "./components/headerBar.js";
import { AssetItem } from "./components/AssetItem/AssetItem.js";
import { ModalUI } from "../../../../../services/modalWindow/ModalWindow.js";
import { CamRecTask } from "./features/camRec.js";
import { ImportTask } from "./features/ImportTask.js";
import { renderCardsView, renderListView, renderEmptyState, updateView } from "./view.js";

export class VideoAssetsPage extends UIElement {
  constructor() {
    super();
    this.rowHeight     = 32;
    this.mode          = "cards";   // "list" | "cards"
    this.hoveredId     = null;
    this.isDragOver    = false;
    this.assetsVersion = -1;        // force sync on first update
    this.assets        = [];
    this.items         = [];

    // Header is a child node — receives events via UIElement tree
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
  // EVENT RECEIVER — internal message bus
  // ─────────────────────────────────────────────
  _receive(msg) {
    if (msg.role.startsWith("mode:")) {
      this.mode = msg.role.split(":")[1];
      return;
    }

    if (msg.role === "rec") {
      const task = new CamRecTask(this);
      ModalUI.show({
        title: "Recording",
        size: "small",
        blocking: true,
        content: (g, x, y, w, h) => task.draw(g, x, y, w, h)
      });
      return;
    }

    if (msg.role === "import") {
      const task = new ImportTask(this);
      ModalUI.show({
        title: "Import Media",
        size: "medium",
        blocking: true,
        content: (g, x, y, w, h) => task.draw(g, x, y, w, h)
      });
      return;
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  update() {
    this.isDragOver = R.ui.dragActive;
    this._syncAssets();
    updateView(this);
    super.update(); // propagate to header
  }

  _syncAssets() {
    if (this.assetsVersion === R.assetsVersion) return;
    this.assetsVersion = R.assetsVersion;
    this.assets = [...R.assets.video];
    this.items  = this.assets.map(asset => new AssetItem(asset));
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  render(g) {
    g.push();

    if (this.assetsVersion === 0) {
      this.header.render(g, this.mode);
      renderEmptyState(g, this);
      g.pop();
      return;
    }

    g.noStroke();
    g.fill(25);
    g.rect(this.x, this.y, this.w, this.h);

    if (this.isDragOver) this._dragHighlight(g);

    this.header.render(g, this.mode);

    if (this.mode === "list")        renderListView(g, this);
    else if (this.mode === "cards")  renderCardsView(g, this);

    g.pop();
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
    g.text("Drop video files to import", this.x + this.w / 2, this.y + this.h / 2);
    g.pop();
  }

  // ─────────────────────────────────────────────
  // INPUT — header handled by UIElement tree
  // items are not UIElement yet so handled manually
  // ─────────────────────────────────────────────
  onHover(mx, my) {
    if (!this.hit(mx, my)) return false;
    super.onHover(mx, my);               // routes to header
    for (const item of this.items) item.onHover(mx, my);
    return true;
  }

  onClick(mx, my) {
    if (!this.hit(mx, my)) return false;
    if (super.onClick(mx, my)) return true; // header first
    for (const item of this.items) {
      if (item.onClick(mx, my)) return true;
    }
    return false;
  }

  onDoubleClick(mx, my) {
    if (super.onDoubleClick(mx, my)) return true;
    for (const item of this.items) {
      if (item.onDoubleClick?.(mx, my)) return true;
    }
    return false;
  }
}
