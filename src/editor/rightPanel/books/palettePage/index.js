import { R } from "../../../../core/runtime.js";
import { TILE_SIZE, TILE_COLS } from "../../../../core/tileset.js";

export class PalettePage {
  constructor(def) {
    this.def = def; // store metadata
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    this.atlas = null;
    this.scale = 1;
  }

  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // if atlas exists, recompute scale
    if (this.atlas)
      this.scale = this.computePaletteScale();
  }

  computePaletteScale() {
    if (!this.atlas) return 1;

    let maxMultiple;

    if (this.atlas.height < this.atlas.width) {
      maxMultiple = Math.floor(this.w / TILE_SIZE);
    } else {
      maxMultiple = Math.floor(this.h / TILE_SIZE);
    }

    const target = maxMultiple * TILE_SIZE;

    return (this.atlas.height < this.atlas.width)
      ? target / this.atlas.width
      : target / this.atlas.height;
  }

  getHoveredAsset(mx, my) {
    const relX = (mx - this.x) / this.scale;
    const relY = (my - this.y) / this.scale;

    const cx = Math.floor(relX / TILE_SIZE);
    const cy = Math.floor(relY / TILE_SIZE);

    R.ui.hoveredAsset = {
      id: cy * TILE_COLS + cx + 1,
      atlasRef: R.ui.selectedPage
    };
  } 

  hit(mx, my) {
    // recalc scale because atlas changed
    this.scale = this.computePaletteScale();

    const drawW = this.atlas.width * this.scale;
    const drawH = this.atlas.height * this.scale;

    //this.getHoveredAsset(m.x, m.y);

    const inside =
      mx >= this.x && mx < this.x + drawW &&
      my >= this.y && my < this.y + drawH;

    R.cursor.inPalette = inside;

    return inside;
  }

  onHover(mx, my) {
    if (!this.atlas || !this.hit(mx, my)) return false;
    this.getHoveredAsset(mx, my);
    return true;
  }

  onClick(mx, my) {
    if (!this.atlas) return false;
    if(!this.hit(mx, my)) return false;
    R.ui.selectedAsset = R.ui.hoveredAsset;
    return true;
  }

  update(atlas) {
    this.atlas = atlas;
    if (!this.atlas) return;

  }

  render(g) {
    if (!this.atlas) return;

    g.push();

    g.noStroke();
    g.fill(0, 0, 0, 150);
    g.rect(this.x, this.y, this.w, this.h, 10, 10, 10, 10);

    const drawW = this.atlas.width * this.scale;
    const drawH = this.atlas.height * this.scale;

    g.image(this.atlas, this.x, this.y, drawW, drawH);

    this.drawCursor(g);

    g.pop();
  }

  drawCursor(g) {
    // Hover highlight
    if (R.cursor.inPalette && R.ui.hoveredAsset) {
      const z = R.ui.hoveredAsset.id - 1;
      const col = z % TILE_COLS;
      const row = Math.floor(z / TILE_COLS);

      const hx = this.x + col * TILE_SIZE * this.scale;
      const hy = this.y + row * TILE_SIZE * this.scale;

      g.push();
      g.noFill();
      g.stroke("#00ffff");
      g.strokeWeight(2);
      g.rect(hx, hy, TILE_SIZE * this.scale, TILE_SIZE * this.scale);
      g.pop();
    }

    // Selection highlight
    const selected = R.ui.selectedAsset;
    if (selected && selected.atlasRef === R.ui.selectedPage) {
      const z = selected.id - 1;
      const col = z % TILE_COLS;
      const row = Math.floor(z / TILE_COLS);

      const hx = this.x + col * TILE_SIZE * this.scale;
      const hy = this.y + row * TILE_SIZE * this.scale;

      g.push();
      g.noFill();
      g.stroke("#ffff00");
      g.strokeWeight(2);
      g.rect(hx, hy, TILE_SIZE * this.scale, TILE_SIZE * this.scale);
      g.pop();
    }
  }
}
