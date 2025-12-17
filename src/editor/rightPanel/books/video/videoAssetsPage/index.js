import { R } from "../../../../../core/runtime.js";
import { HeaderBar } from "./components/headerBar.js";
import { ModalUI } from "../../../../../services/modalWindow/ModalWindow.js";
import { CamRecTask } from "./features/camRec.js";
import { AssetItem } from "./components/AssetItem.js";
import { PreviewTask } from "./features/PreviewTask.js";
import { ImportTask } from "./features/ImportTask.js";
import { renderCardsView, renderListView, renderEmptyState, updateView } from "./view.js";

export class VideoAssetsPage {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0; 

    this.rowHeight = 32;
    
    this.assets = [];     // array of asset metadata
    this.items = [];     // UI objects linked to assets


    // Local UI state (NOT global)
    this.mode = "list";       // "list" | "cards" 
    this.hoveredId = null;
    this.isDragOver = false;
    this.assetsVersion = R.assetsVersion;
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
      
      //this.createVideo();
      
      const task = new CamRecTask(this);

      ModalUI.show({
        title: "recording",
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

    // 1. Sync newly imported assets
    this.syncAssetsIfNeeded();

    updateView(this);
  }

  // ─────────────────────────────────────────────
  // RENDER LOOP
  // ─────────────────────────────────────────────
  render(g) {
    g.push();

    this.header.render(g, this.mode);
    if (this.assetsVersion === 0) {
      renderEmptyState(g, this);
      g.pop();
      return;
    }

    g.fill(25);
    g.rect(this.x, this.y, this.w, this.h);
    
    if(this.isDragOver) this.dragHighlight(g);
    // Render header
    
    // Render mode-specific content
    if (this.mode === "list") {this.header.render(g, this.mode);
      renderListView(g, this);
    } else if (this.mode === "cards") {this.header.render(g, this.mode);
      renderCardsView(g, this);
    } 
    
    g.pop();
  }



  syncAssetsIfNeeded() {

    // If no change → do nothing
    if (this.assetsVersion !== R.assetsVersion) { 
      this.assetsVersion = R.assetsVersion;
      this.assets = [...R.assets.video];
      this.items = this.assets.map(asset => new AssetItem(asset)); 
    }


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
        g.text("Drop video files to import", this.x + this.w / 2, this.y + this.h / 2);

        g.pop();
  

  }

  // ─────────────────────────────────────────────
  // INPUT EVENTS
  // ─────────────────────────────────────────────

  onHover(mx, my) {
    for (let item of this.items) item.onHover(mx, my);
  }

  onClick(mx, my) {
    for (let item of this.items) {
      if (item.onClick(mx, my)) return true;
    }
  }

  onDoubleClick(mx, my) {
    for (let item of this.items) {
      if (item.onDoubleClick?.(mx, my)) return true;
    }
  }

  onKeyPress(key) {
    for (let item of this.items) {
      if (item.editingName) item.onKeyPress(key);
    }
  }


}













