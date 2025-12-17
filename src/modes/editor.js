// ─────────────────────────────────────────────────────────────────────────────
// [BUILDER] Editor mode — grid on left, raw tilesheet (1:1) on right
// ─────────────────────────────────────────────────────────────────────────────
import { R } from '../core/runtime.js';
import { exportLevel, importLevel } from '../core/importHandler/import-export.js';
import { updateRightPanel, renderRightPanel } from '../editor/rightPanel/index.js'; 
import { updateBottomDock, renderBottomDock } from '../editor/bottomDock/index.js';
import { updateViewport, renderViewport } from '../editor/viewport/index.js';
// ─────────────────────────────────────────────────────────────────────────────
// [LOOP] Builder frame
// Order: world → grid → PALETTE (last, on top) → HUD
// ─────────────────────────────────────────────────────────────────────────────

export function updateBuilder(p) {

  handleBuilderShortcuts(p);
  updateViewport(p);
  updateRightPanel(p);
  updateBottomDock();

}

export function renderBuilder(p, { gWorld, gOverlay, gHUD }) {
  gWorld.clear();
  gOverlay.clear();
  gHUD.clear();
  gWorld.pixelDensity(1);

  renderViewport(gWorld);
  renderRightPanel(gWorld);
  renderBottomDock(p);

  
}

export function handleBuilderShortcuts(p) {

  const keys = R.input.keyboard;
  const ctrl = keys["control"] || keys["meta"];

  if( p.keyPressed) {

    if (keys["s"] ) {exportLevel(); keys["s"]=false;}
    if (keys["o"] ) {importLevel(); keys["o"]=false;}

  }
  

}