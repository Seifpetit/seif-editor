// palettePage/index.js
import { R } from "../../../../core/runtime.js";
import { UIElement } from "../../../../core/ui/UIElement.js";
import { TILE_SIZE, TILE_COLS } from "../../../../core/tileset.js";

export class PalettePage extends UIElement {
  constructor(def) {
    super();
    this.def   = def;
    this.atlas = null;
    this.scale = 1;
  }

  // ─────────────────────────────────────────────
  // GEOMETRY
  // ─────────────────────────────────────────────
  setGeometry(x, y, w, h) {
    super.setGeometry(x, y, w, h);
    if (this.atlas) this.scale = this._computeScale();
  }

  _computeScale() {
    if (!this.atlas) return 1;
    const isWide = this.atlas.width > this.atlas.height;
    const maxMultiple = isWide
      ? Math.floor(this.w / TILE_SIZE)
      : Math.floor(this.h / TILE_SIZE);
    const target = maxMultiple * TILE_SIZE;
    return isWide
      ? target / this.atlas.width
      : target / this.atlas.height;
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  update(atlas) {
    this.atlas = atlas;
    if (this.atlas) this.scale = this._computeScale();
  }

  // ─────────────────────────────────────────────
  // HIT — override to use atlas draw bounds
  // ─────────────────────────────────────────────
  hit(mx, my) {
    if (!this.atlas) return false;
    this.scale = this._computeScale();

    const drawW = this.atlas.width  * this.scale;
    const drawH = this.atlas.height * this.scale;

    const inside =
      mx >= this.x && mx < this.x + drawW &&
      my >= this.y && my < this.y + drawH;

    R.cursor.inPalette = inside;
    return inside;
  }

  // ─────────────────────────────────────────────
  // INPUT
  // ─────────────────────────────────────────────
  onHover(mx, my) {
    if (!this.atlas || !this.hit(mx, my)) return false;
    this._updateHoveredAsset(mx, my);
    return true;
  }

  onClick(mx, my) {
    if (!this.atlas || !this.hit(mx, my)) return false;
    R.ui.selectedAsset = R.ui.hoveredAsset;
    return true;
  }

  _updateHoveredAsset(mx, my) {
    const relX = (mx - this.x) / this.scale;
    const relY = (my - this.y) / this.scale;
    const cx = Math.floor(relX / TILE_SIZE);
    const cy = Math.floor(relY / TILE_SIZE);
    R.ui.hoveredAsset = {
      id:       cy * TILE_COLS + cx + 1,
      atlasRef: R.ui.selectedPage
    };
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  render(g) {
    if (!this.atlas) return;

    g.push();
    g.noStroke();
    g.fill(0, 0, 0, 150);
    g.rect(this.x, this.y, this.w, this.h, 10);

    const drawW = this.atlas.width  * this.scale;
    const drawH = this.atlas.height * this.scale;
    g.image(this.atlas, this.x, this.y, drawW, drawH);

    this._drawCursor(g);
    g.pop();
  }

  _drawCursor(g) {
    // Hover highlight
    if (R.cursor.inPalette && R.ui.hoveredAsset) {
      const z   = R.ui.hoveredAsset.id - 1;
      const col = z % TILE_COLS;
      const row = Math.floor(z / TILE_COLS);
      g.push();
      g.noFill();
      g.stroke("#00ffff");
      g.strokeWeight(2);
      g.rect(
        this.x + col * TILE_SIZE * this.scale,
        this.y + row * TILE_SIZE * this.scale,
        TILE_SIZE * this.scale,
        TILE_SIZE * this.scale
      );
      g.pop();
    }

    // Selection highlight
    const sel = R.ui.selectedAsset;
    if (sel && sel.atlasRef === R.ui.selectedPage) {
      const z   = sel.id - 1;
      const col = z % TILE_COLS;
      const row = Math.floor(z / TILE_COLS);
      g.push();
      g.noFill();
      g.stroke("#ffff00");
      g.strokeWeight(2);
      g.rect(
        this.x + col * TILE_SIZE * this.scale,
        this.y + row * TILE_SIZE * this.scale,
        TILE_SIZE * this.scale,
        TILE_SIZE * this.scale
      );
      g.pop();
    }
  }
}
