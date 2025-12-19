//[CORE] Orchestrator Module
import { R } from './runtime.js';
import { updateInput } from './input.js';
import { routeInput } from '../services/InputRouter.js';
import { updateEditor, renderEditor, initEditor} from '../modes/editor.js';
import { updateGame, renderGame } from '../modes/game.js';
import { updatePhysicsAll } from './physics.js';


export function updateFrame(p) {

  if(!R.editor) initEditor();

  updateInput(p);
  routeInput(R.input, R.mode);
  
  if(R.ui.state.error) {
    R.cursor.currentPng = R.layout.assets.mark_exlamation_cursor_b;
    return;
  }
  if(R.ui.modalLock) return;
  R.cursor.currentPng = R.layout.assets.cursor_b;
  if(R.ui.modalDrag) {R.cursor.currentPng = R.layout.assets.hand_closed; return;}

  updatePhysicsAll();
  
  switch (R.mode) {
    case "editor" : updateEditor(p);  break;
    case "game"   : updateGame(p);    break;
  }

}

export function renderFrame(p, {gWorld, gOverlay,gHUD }) {

  switch (R.mode) {
    case "editor" : renderEditor( p, {gWorld, gOverlay,gHUD }); break;
    case "game"   : renderGame( p, {gWorld, gOverlay,gHUD });    break;
  }
}