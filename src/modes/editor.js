// ─────────────────────────────────────────────────────────────────────────────
// [BUILDER] Editor mode — grid on left, raw tilesheet (1:1) on right
// ─────────────────────────────────────────────────────────────────────────────
import { R } from '../core/runtime.js';
import { exportLevel, importLevel } from '../core/importHandler/import-export.js';
import { RightPanel } from '../editor/rightPanel/index.js'; 
import { updateBottomDock, renderBottomDock } from '../editor/bottomDock/index.js';
import { updateViewport, renderViewport } from '../editor/viewport/index.js';
// ─────────────────────────────────────────────────────────────────────────────
// [LOOP] Builder frame
// Order: world → grid → PALETTE (last, on top) → HUD
// ─────────────────────────────────────────────────────────────────────────────


export function initEditor() {
  R.editor = {
    rightPanel: new RightPanel(),
  };
}

export function updateEditor(p) {

  if(R.editor == null) return;

  const RightPanel = R.editor.rightPanel;
  const rp = R.layout.panels.rightPanel;

  handleEditorShortcuts(p);
  

  if(!RightPanel) return;
  RightPanel.setGeometry(rp.x, rp.y, rp.w, rp.h, R.layout.pad);
  RightPanel.update();

  updateViewport(p);
  updateBottomDock();

}

export function renderEditor(p, { gWorld, gOverlay, gHUD }) {
  gWorld.clear();
  gOverlay.clear();
  gHUD.clear();
  gWorld.pixelDensity(1);

  const RightPanel = R.editor.rightPanel;

  renderViewport(gWorld);

  RightPanel?.render(gWorld);

  renderBottomDock(p);

  
}

export function handleEditorShortcuts(p) {

  const keys = R.input.keyboard;
  const ctrl = keys["control"] || keys["meta"];

  if( p.keyPressed) {

    if (keys["s"] ) {exportLevel(); keys["s"]=false;}
    if (keys["o"] ) {importLevel(); keys["o"]=false;}

  }
  

}