import { ModalUI } from "./modalWindow/ModalWindow.js";
import { R } from "../core/runtime.js";

const DOUBLE_CLICK_TIME = 300; // ms

let lastPressed = false;
let lastClickTime = 0;

function getPanels() {
  return R.editor;
}

// ─────────────────────────────────────────────
// INPUT ROUTER SERVICE
// ─────────────────────────────────────────────

export function routeInput(INPUT, MODE) {
  const m = INPUT.mouse;
  
  switch (MODE) {
      case "editor" : 
        if(!R.editor) return;
        e_routeInput(INPUT); 
        break;
      case "game"   : g_routeInput(INPUT);    break;
  }
}

function g_routeInput(INPUT) {
  const m = INPUT.mouse;
}

function e_routeInput(INPUT) {
  const m = INPUT.mouse;
  // ALWAYS ROUTE HOVER
  e_routeHOVER(m);
  

  if(m.pressed && !lastPressed) { 
    const now = Date.now();
    if(now - lastClickTime < DOUBLE_CLICK_TIME) {
      e_routeDoubleClick(m);
      lastClickTime = 0;
    } else {
      e_routeClick(m);    
    }

  }
  lastPressed = m.pressed;
}

function e_routeHOVER(m) {

  const editor = getPanels();
  const RIGHT_PANEL = editor.rightPanel;

  // Check if any modal is open
  ModalUI.onHover(m.x, m.y);
  // Route to right panel
  RIGHT_PANEL?.onHover(m.x, m.y);


}


function e_routeClick(m) {
  const editor = getPanels();
  const RIGHT_PANEL = editor.rightPanel;

  //CLEAR LOGS EACH CLICK
  console.clear();
  console.log("Routing click at:", m.x, m.y);
  //TEMP LOGS

  // Check if any modal is open
  if(ModalUI.onClick(m.x, m.y)) return;
  // Route to right panel
  if(RIGHT_PANEL?.onClick(m.x, m.y)) return;
  
}

function e_routeDoubleClick(m) {

  const editor = getPanels();
  const RIGHT_PANEL = editor.rightPanel;

  // Check if any modal is open
  if(ModalUI.onDoubleClick(m.x, m.y)) return;
  // Route to right panel
  if(RIGHT_PANEL?.onDoubleClick(m.x, m.y)) return;

}