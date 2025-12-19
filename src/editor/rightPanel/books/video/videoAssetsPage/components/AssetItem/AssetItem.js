// src/editor/rightPanel/books/video/videoAssetsPage/components/AssetItem.js
import { R } from "../../../../../../../core/runtime.js";
import { ModalUI } from "../../../../../../../services/modalWindow/ModalWindow.js";
import { PreviewTask } from "../../features/PreviewTask.js";
import { RenameZone } from "./renameZone.js";
import { ContextZone } from "./contextZone.js";

// ───────────────────────────────────────────────────────────────────────────
// ASSET ITEM
// ───────────────────────────────────────────────────────────────────────────

export class AssetItem {
  constructor(asset) {
    this.asset = asset; // { id, filename, thumb, duration, ... }
    this.hover = false;
    this.selected = false;

    // Context menu state
    this.contextMenuOpen = false;
    this.contextTasks = [
      { type: "rename", label: "Rename Video"},
      { type: "delete", label: "Delete Video"},
      { type: "preview", label: "Preview Video"}
    ];

    // Rename state
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

  
  setGeometry(x, y, w, h, mode = "cards") {
    this.x = x; this.y = y; this.w = w; this.h = h;
    const pad = 5;

    // hero space for thumbnail rendering
    const thumbH = mode === "cards" ? h - pad * 2 : h - pad * 4;
    const thumbW = w - pad * 2;
    const thumbX = x + pad;
    const thumbY = y + pad;

    this.heroSpace.setGeometry(thumbX, thumbY, thumbW, thumbH);

    // filename click zone
    const renameZoneH = 20;
    const renameZoneY = mode === "cards" ? thumbY + thumbH - pad - renameZoneH : thumbY + thumbH - pad * 2;
    const renameZoneW = thumbW - pad * 2;
    const renameZoneX = thumbX + pad;

    this.renameZone.setGeometry(renameZoneX, renameZoneY, renameZoneW, renameZoneH);  

    // context button (...)
    const contextZoneW = pad * 2;
    const contextZoneH = pad * 4;
    const contextZoneX = x + w - (pad * 2 + contextZoneW);
    const contextZoneY = thumbY + pad;
    

    this.contextZone.setGeometry(contextZoneX, contextZoneY, contextZoneW, contextZoneH);
  }


  update() {
    if(R.ui.modalLock) return;
    if(!this.asset) return;
    
    this.heroSpace.update();
    this.renameZone.update(this.nameBuffer);
    this.contextZone.update(this.contextMenuOpen, this.contextTasks);
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
    this.renameZone.draw(g);

    // 4) context button
    this.contextZone.draw(g);

    g.pop();

  }

  hit(mx, my) {
    return mx > this.x && mx < this.x + this.w &&
           my > this.y && my < this.y + this.h;
  }

  onHover(mx, my) {
    this.hover = false;

    if(this.hit(mx, my)) this.hover = true;

    

    // zones

    this.heroSpace.onHover(mx, my);
    this.renameZone.onHover(mx, my);
    this.contextZone.onHover(mx, my); 
    
  }

  onClick(mx, my) {

    if(!this.hit(mx, my)) return false;

    // Context button
    if(this.contextZone.onClick(mx, my)) return true;
    // Rename zone
    if(this.renameZone.onClick(mx, my)) return true;
    
    //hero space
    if(this.heroSpace.onClick(mx, my)) return true;

    // Select item
    this.selected = true;

    return true;
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
    this.hover = false;
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  hit(mx, my){
    return (mx > this.x && mx < this.x + this.w &&
            my > this.y && my < this.y + this.h);
  }

  onHover(mx, my){
    if(!this.hit(mx, my)) return false;
    this.hover = true;

  }

  onClick(mx, my){
    if(!this.hit(mx, my)) return false;

  }

  onDoubleClick(mx, my){
    if(!this.hit(mx, my)) return false;

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
// EOF
// ───────────────────────────────────────────────────────────────────────────  