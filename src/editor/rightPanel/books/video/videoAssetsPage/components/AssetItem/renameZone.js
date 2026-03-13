// renameZone.js
import { UIElement } from "../../../../../../../core/ui/UIElement.js";

export class RenameZone extends UIElement {
  constructor() {
    super();
    this.editingName = false;
    this.filename    = "";
    this.filetype    = "";
    this.hovered     = false;
  }

  onHover(mx, my) {
    this.hovered = this.hit(mx, my);
    return this.hovered;
  }

  onClick(mx, my) {
    if (!this.hit(mx, my)) return false;
    this.editingName = true;
    return true;
  }

  update(nameBuffer) {
    this.filename = nameBuffer;
    this.filetype = this.filename.split(".").pop();
  }

  render(g) {
    g.push();
    g.noStroke();
    g.fill(this.editingName ? 40 : 100);
    g.rectMode(g.CORNER);
    g.rect(this.x, this.y, this.w, this.h, 4);

    g.fill(this.editingName ? 255 : 200);
    g.textAlign(g.LEFT, g.BOTTOM);
    g.text(this.filename, this.x * 1.01, this.y * 1.1);
    g.pop();
  }
}
