
import { Grid } from "./grid.js";
import { BrushBar } from "./brushBar.js";
import { TILE_SIZE } from "../../core/tileset.js";
import { R } from "../../core/runtime.js";

const viewportPanel = {
  grid: new Grid(),
  brushBar: new BrushBar(),
}

// attach to R runtime
R.viewportPanel = viewportPanel;

// ─────────────────────────────────────────────
// [UPDATE] HUD logic (hotkeys, toggles, etc.)
// ─────────────────────────────────────────────
export function updateViewport(p) {
  if (R.ui.modalLock) return;  // freeze editor input when popup active
  const G = R.layout.panels.viewport;
  const PAD = R.layout.pad;

  const GRID_X = 0;
  const GRID_Y = 0;
  const GRID_W = G.cols * TILE_SIZE;
  const GRID_H =  G.rows * TILE_SIZE;

  const BRUSHBAR_X = GRID_X;
  const BRUSHBAR_Y = GRID_Y + GRID_H;
  const BRUSHBAR_W = GRID_W;
  const BRUSHBAR_H = PAD;

  viewportPanel.grid.setGeometry(GRID_X, GRID_Y, GRID_W, GRID_H, G.rows, G.cols);
  viewportPanel.brushBar.setGeometry(BRUSHBAR_X, BRUSHBAR_Y, BRUSHBAR_W, BRUSHBAR_H);


  viewportPanel.grid.update(p);
  viewportPanel.brushBar.update(p);
  
}

// ─────────────────────────────────────────────
// [RENDER] Main HUD render pass
// ─────────────────────────────────────────────

export function renderViewport(g) {

  g.push(); g.clear(); 

  viewportPanel.grid.render(g); 
  viewportPanel.brushBar.render(g);


  g.pop();

}



