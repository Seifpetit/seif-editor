import { handleImportedFiles } from "../../../../../../core/importHandler/importRouter.js";
import { R } from "../../../../../../core/runtime.js";

export class ImportTask {
  constructor() {
    this.dragging = false;
  }

  draw(g, x, y, w, h) {
    // Detect drag state from global R.ui
    this.dragging = R.ui.dragActive;

    // Background Panel
    g.push();
    g.fill(40);
    g.rect(x, y, w, h, 8);

    // Drop Zone Highlight
    if (this.dragging) {
      g.stroke("#00c8ff");
      g.strokeWeight(3);
      g.noFill();
      g.rect(x + 5, y + 5, w - 10, h - 10, 8);
    }

    // Text
    g.noStroke();
    g.fill(200);
    g.textAlign(g.CENTER, g.CENTER);
    g.textSize(18);

    g.text(
      this.dragging
        ? "Drop files to import…"
        : "Click here or drag files onto the editor to import.\nSupports video, image, and audio.",
      x + w / 2,
      y + h / 2
    );

    g.pop();
  }

  onClick(mx, my, x, y, w, h) {
    // Click to open file picker
    const inside = mx > x && mx < x + w && my > y && my < y + h;
    if (!inside) return false;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*,image/*,audio/*";
    input.multiple = true;

    input.onchange = e => {
      handleImportedFiles(e.target.files);
    };

    input.click();
    return true;
  }
}
