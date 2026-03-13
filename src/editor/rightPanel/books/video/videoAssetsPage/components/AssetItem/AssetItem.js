// AssetItem.js
import { R } from "../../../../../../../core/runtime.js";
import { UIElement } from "../../../../../../../core/ui/UIElement.js";
import { ModalUI } from "../../../../../../../services/modalWindow/ModalWindow.js";
import { PreviewTask } from "../../features/PreviewTask.js";
import { RenameZone } from "./renameZone.js";
import { ContextZone } from "./contextZone.js";

// ─────────────────────────────────────────────
// HERO SPACE — thumbnail leaf node
// ─────────────────────────────────────────────
class HeroSpace extends UIElement {
  constructor() {
    super();
    this.hovered = false;
  }

  onHover(mx, my) {
    this.hovered = this.hit(mx, my);
    return this.hovered;
  }

  render(g, mode, thumbImg) {
    if (mode === "cards" && thumbImg) {
      g.imageMode(g.CORNER);
      g.image(thumbImg, this.x, this.y, this.w, this.h);
    }
  }
}

// ─────────────────────────────────────────────
// ASSET ITEM — composite node
// Children: heroSpace | renameZone | contextZone
// ─────────────────────────────────────────────
export class AssetItem extends UIElement {
  constructor(asset) {
    super();
    this.asset      = asset;
    this.hovered    = false;
    this.selected   = false;
    this.nameBuffer = asset.name;

    this.heroSpace   = this.addChild(new HeroSpace());
    this.renameZone  = this.addChild(new RenameZone());
    this.contextZone = this.addChild(new ContextZone({
      onMessage: msg => this._receive(msg)
    }));
  }

  // ─────────────────────────────────────────────
  // GEOMETRY
  // ─────────────────────────────────────────────
  setGeometry(x, y, w, h, mode = "cards") {
    super.setGeometry(x, y, w, h);
    const pad = 5;

    const thumbH = mode === "cards" ? h - pad * 2 : h - pad * 4;
    const thumbW = w - pad * 2;
    const thumbX = x + pad;
    const thumbY = y + pad;
    this.heroSpace.setGeometry(thumbX, thumbY, thumbW, thumbH);

    const renameH = 20;
    const renameY = mode === "cards"
      ? thumbY + thumbH - pad - renameH
      : thumbY + thumbH - pad * 2;
    this.renameZone.setGeometry(thumbX + pad, renameY, thumbW - pad * 2, renameH);

    const ctxW = pad * 2;
    const ctxH = pad * 4;
    this.contextZone.setGeometry(x + w - (pad * 2 + ctxW), thumbY + pad, ctxW, ctxH);
  }

  // ─────────────────────────────────────────────
  // MESSAGE BUS
  // ─────────────────────────────────────────────
  _receive(msg) {
    if (msg === "preview") {
      const task = new PreviewTask(this.asset);
      ModalUI.show({
        title:    this.asset.name,
        size:     "large",
        blocking: true,
        content:  task
      });
    }
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  update() {
    if (R.ui.modalLock || !this.asset) return;
    this.renameZone.update(this.nameBuffer);
    this.contextZone.update?.();
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  render(g, mode) {
    g.push();
    g.noStroke();
    g.fill(this.hovered ? 80 : 50);
    g.rect(this.x, this.y, this.w, this.h, 6);
    g.pop();

    this.heroSpace.render(g, mode, this.asset.thumbnailImage);
    this.renameZone.render(g);
    this.contextZone.render(g);
  }

  // ─────────────────────────────────────────────
  // INPUT
  // ─────────────────────────────────────────────
  onHover(mx, my) {
    this.hovered = this.hit(mx, my);
    super.onHover(mx, my); // propagate to children
    return this.hovered;
  }

  onClick(mx, my) {
    // Always let context zone handle click even outside item bounds
    // (dropdown can extend outside item rect)
    if (this.contextZone.open) {
      if (this.contextZone.onClick(mx, my)) return true;
    }
    if (!this.hit(mx, my)) return false;

    // Propagate to children via UIElement
    if (super.onClick(mx, my)) return true;

    // Default: select item
    this.selected = true;
    return true;
  }

  onDoubleClick(mx, my) {
    return super.onDoubleClick(mx, my);
  }
}
