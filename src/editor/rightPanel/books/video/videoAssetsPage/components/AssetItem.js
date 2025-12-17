// src/editor/rightPanel/books/video/videoAssetsPage/components/AssetItem.js
import { R } from "../../../../../../core/runtime.js";
import { ModalUI } from "../../../../../../services/modalWindow/ModalWindow.js";
import { PreviewTask } from "../features/PreviewTask.js";

export class AssetItem {
  constructor(asset) {
    this.asset = asset; // { id, filename, thumb, duration, ... }
    this.hover = false;
    this.selected = false;
    this.editingName = false;
    this.nameBuffer = asset.name;
    // UI geometry (set by page)
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    //thumbnail image
    this.heroSpace = new HeroSpace();

    // Hit zones
    this.renameZone = new RenameZone(); 
    this.contextZone = new ContextZone();
  }

  
  setGeometry(x, y, w, h, mode = "list") {
    this.x = x; this.y = y; this.w = w; this.h = h;

    // hero space for thumbnail rendering
    const thumbH = mode === "cards" ? h - 30 : h - 10;

    const pad = 5;
    const thumbW = w - pad * 2;
    const thumbX = x + pad;
    const thumbY = y + pad;

    this.heroSpace.setGeometry(thumbX, thumbY, thumbW, thumbH);

    // filename click zone
    const renameZoneH = 20;
    const renameZoneY = thumbY + thumbH - pad - renameZoneH;
    const renameZoneW = w - pad * 2;
    const renameZoneX = x + pad;

    this.renameZone.setGeometry(renameZoneX, renameZoneY, renameZoneW, renameZoneH);  

    // context button (...)
    this.contextZone.setGeometry(x + w - 30, y + 5, 20, 20  );
  }


  update() {
    if(!this.asset) return;
    const m = R.input.mouse;
    this.updateInput(m);

    this.renameZone.update();
    this.contextZone.update();
  }
  
  updateInput(m) {
    if(R.ui.modalLock) return;

    this.onHover(m.x, m.y);

    // Click detection
    if(this.hover && m.pressed && m.button === "left") {
      this.onClick(m.x, m.y);
    }

    
  
  }


  draw(g, mode) {

    g.push();

    // 1) background
    g.noStroke();
    g.fill(this.hover ? 80 : 50);
    g.rect(this.x, this.y, this.w, this.h, 6);

    // 2) thumbnail INSIDE the same graphics buffer
    this.heroSpace.draw(g, mode, this.asset.thumbnailImage);

    // 3) rename text field
    g.fill(this.editingName ? 40 : 100);g.rectMode(g.CORNER);
    g.rect(this.renameZone.x, this.renameZone.y, this.renameZone.w, this.renameZone.h, 4);
    g.fill(this.editingName ? 255 : 200);
    g.textAlign(g.LEFT, g.BOTTOM);
    g.text(this.asset.name, this.renameZone.x*1.01, this.renameZone.y * 1.1);

    // 4) context button
    g.textAlign(g.CENTER, g.CENTER);
    g.text("⋮", this.contextZone.x, this.contextZone.y);

    g.pop();
  }


  onHover(mx, my) {
    this.hover = (mx > this.x && mx < this.x + this.w &&
                  my > this.y && my < this.y + this.h);
  }

  onClick(mx, my) {

    // Double click detection (simple)
    
    const now = Date.now();
    if(this.lastClickTime && (now - this.lastClickTime) < 600) {
      //this.onDoubleClick(mx, my);
      this.lastClickTime = null;
    } else {
      this.lastClickTime = now;
    }

    // Context button
    if(this.contextZone) {
       if (mx > this.contextZone.x && mx < this.contextZone.x + this.contextZone.w &&
           my > this.contextZone.y && my < this.contextZone.y + this.contextZone.h) {
      // Open context menu modal (later) 
        console.log("context menu"); 
      }
    }
   
    if(this.renameZone) {
    // Rename zone
      if (mx > this.renameZone.x && mx < this.renameZone.x + this.renameZone.w &&
          my > this.renameZone.y && my < this.renameZone.y + this.renameZone.h) {
        this.editingName = true; console.log("editing name");
      }
    }

    // Select item
    this.selected = true;
  }

  onDoubleClick(mx, my) {
    // open preview modal
    const task = new PreviewTask(this.asset);

    ModalUI.show({
      title: this.asset.name,
      size: "large",
      blocking: true,
      content: task
    });
  }

}

// ───────────────────────────────────────────────────────────────────────────
// Hero Space for thumbnail rendering
// ───────────────────────────────────────────────────────────────────────────

class HeroSpace { 
  constructor() {
    this.x = 0; this.y = 0; this.w = 0; this.h = 0;
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  update() {
    // future: update thumbnail rendering logic
  }
  draw(g, mode, thumbImg) {
    if(mode === "cards" &&  thumbImg) this.renderThumbnail(g, thumbImg);
  }

  renderThumbnail(g, img) {
    g.imageMode(g.CORNER);
    g.image(img, this.x, this.y, this.w, this.h);   
  }

} 



// ───────────────────────────────────────────────────────────────────────────
// RENAME ZONE
// ───────────────────────────────────────────────────────────────────────────

class RenameZone {
  constructor() {
    this.x = 0; this.y = 0; this.w = 0; this.h = 0;
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  update() {
    // future: handle text input
  }

  draw(g) {
    // future: draw text input box
  }   

}

// ───────────────────────────────────────────────────────────────────────────
// CONTEXT ZONE
// ───────────────────────────────────────────────────────────────────────────  

class ContextZone {
  constructor() {
    this.x = 0; this.y = 0; this.w = 0; this.h = 0;
  }   

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  } 

  update() {
    // future: handle button hover/click    

  }

  draw(g) {
    // future: draw context button
  }

}

// ───────────────────────────────────────────────────────────────────────────
// EOF
// ───────────────────────────────────────────────────────────────────────────  