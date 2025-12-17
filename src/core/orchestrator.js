//[CORE] Orchestrator Module
import { R } from './runtime.js';
import { updateInput } from './input.js';
import { updateBuilder, renderBuilder } from '../modes/editor.js';
import { updateGame, renderGame } from '../modes/game.js';
import { updatePhysicsAll } from './physics.js';

export function updateFrame(p) {

  updateInput(p);
  if(R.ui.state.error) {
    R.cursor.currentPng = R.layout.assets.mark_exlamation_cursor_b;
    return;
  }
  if(R.ui.modalLock) return; console.log("modal lock :", R.ui.modalLock);
  R.cursor.currentPng = R.layout.assets.cursor_b;
  if(R.ui.modalDrag) {R.cursor.currentPng = R.layout.assets.hand_closed; return;}

  updatePhysicsAll();
  
  switch (R.mode) {
    case "builder": updateBuilder(p); break;
    case "game"   : updateGame(p);    break;
  }

}

export function renderFrame(p, {gWorld, gOverlay,gHUD }) {

  switch (R.mode) {
    case "builder": renderBuilder( p, {gWorld, gOverlay,gHUD }); break;
    case "game"   : renderGame( p, {gWorld, gOverlay,gHUD });    break;
  }
}