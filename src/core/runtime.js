// runtime.js
// Central conductor: state, mode, render pipeline (layers + parallax), and HUD link.

// ----- Imports -----

import { TILE_SIZE } from "./tileset.js";
import { Camera } from "../core/camera.js";

// ----- Runtime state -----
export const R = {

  p5_instance: null,
  audioCtx: new AudioContext(),

  RESET_FRAMES: 0,
  mode: "builder",                  // "game" | "builder"
  camera: Camera, // camera position and boubds
  level: null,                   // { width, height, layers: {ground, detail, decoration, collision, ...} }                
  atlas: {},                   // spritesheet image (p5.Image)

  device: {
  },

  input: {
    mouse:    { x: 0, y: 0, dx: 0, dy: 0, pressed: false, button: null },
    touch:    { active: false, points: [] },
    gamepad:  { connected: false, buttons: [], axes: [] },
    keyboard: { keys: {} },
    actions:  { moveX: 0, moveY: 0, paint: false },
  },

  layout: {
    tileSize: TILE_SIZE,
    width: 0,
    height: 0,
    pad: 32,     // optional HUD/canvas padding if needed it later
    level: null,  // layout’s working level gets assigned in main.js setup()
    panels: {
      viewport: { x: 0, y: 0, w: null, h: null , rows: 24, cols: 44 }, 
      rightPanel: { x: null, y: 0, w: null, h: null }, // palette area (right side)
      bottomDock: { x: 0, y: null, w: null, h: null },
    },
    assets: {},
    
  },

  rightPanel: {
    book: null,
    page: null,

    registry: {
      //EXAMPLE :
      // TILES: { WORLD_TILESET: instance....}
      // AUDIO: { Assets: instance, PATTERN: instance, SEQUENCER: instance }
    }
  },


  cursor: { x: 0, y: 0, tileX: 0, tileY: 0, inGrid: false, 
            inPalette: false, inAudio: false, inBottomDock: false,
            currentPng: null,
  },

  ui: {

    modalLock: false,
    modalDrag: false,

    timelineMode: null,
    brushMode: null,
    
    selectedPage: null,
    selectedBook: null,
    hoveredPage: null,
    hoveredBook: null,

    topBarButtons: [],

    selectedItem: {id: null},  //currently selected media or effects..
    selectedAsset: {},              // currently selected tile id
    hoveredAsset: {},              // tile id under mouse in palette

    selection: {
      startGX: null,
      startGY: null,
      endGX: null,
      endGY: null,
      active: false
    },

    state: {
      timelineOpen: false,
      libraryOpen: false,
      error: false,
    },

    audio: {
      selectedAssetId: null,
    }

  },

  hud: {
    showHelp: true,
    ghlink: null,                  // <a> element (p5 DOM)
    info: {
      layerName: "ground",
      selectedId: 0,
      mapName: "",
      sizeText: "",              // e.g., "64×32"
    },

    dim : {
        w: 0,
        h: 40,
    }
    
  },

  entities: [],                     // e.g., [player]

  // Layer registry (add/remove layers with one row)
  layers: [
    { name: "background", kind: "tile",     parallax: 0.3, order: 10 },
    { name: "ground",     kind: "tile",     parallax: 1.0, order: 20, collision: true },
    { name: "detail",     kind: "tile",     parallax: 1.0, order: 30 },
    { name: "decoration", kind: "tile",     parallax: 0.7, order: 40 },
    { name: "entities",   kind: "entities", parallax: 1.0, order: 50 },
    { name: "hud",        kind: "hud",      parallax: 0.0, order: 90 },
  ],

  assets: {
    audio: [],      // <-- required for importAudio
    video: [],      // <-- required for importVideo
    image: []      // <-- required for importImage
  },

  assetsVersion: 0,




};

// ----- Render pipeline -----

export function updatePanelLayout(p) {

  R.layout.width = p.width;
  R.layout.height = p.height;
  //step 1 fix dimensions
  //step2 store/update values
  //step3 create Rect as stroke fro the panels

  const pad = R.layout.pad;
  

  // GRID FIXED
  const G = R.layout.panels.viewport;
    G.x = 0;
    G.y = 0;
    G.w = G.cols * TILE_SIZE ;
    G.h = G.rows * TILE_SIZE ;

  
  // RIGHT PANEL = remaining width
  const P = R.layout.panels.rightPanel;
  P.x = G.w + pad * 2;
  P.y = 0;
  P.w = p.width - G.w - pad;
  P.h = G.h;
  
  const hudH = p.height - Math.max(P.h, G.h) - pad * 2;

  // BOTTOM DOCK = remaining height
  R.layout.panels.bottomDock = {
    x: 0,
    y: p.height - hudH,
    w: p.width,
    h: hudH,
  };


}


// ----- Setup / teardown -----

// Call once after canvas exists (typically from setup in main.js)
export function initRuntime(p) {
  // Create HUD link once
  if (!R.hud.link) {
    const url = "https://github.com/Seifpetit/seif-platformer";
    R.hud.link = p.createA(url, "GitHub ↗", "_blank");
    // Style to match bottom bar
    R.hud.link.style("font-size", "14px");
    R.hud.link.style("font-family", "monospace");
    R.hud.link.style("color", "#00baff");
    R.hud.link.style("text-decoration", "none");
    R.hud.link.style("background", "rgba(0,0,0,0.35)");
    R.hud.link.style("padding", "4px 8px");
    R.hud.link.style("border-radius", "6px");
    R.hud.link.hide(); // shown only in layout mode
  }
  R.audioCtx = new AudioContext();
}

// Optional cleanup if you ever recreate sketches
export function destroyRuntime() {
  if (R.hud.link) {
    R.hud.link.remove();
    R.hud.link = null;
  }
  R.entities.length = 0;
  R.level = null;
  R.atlas = null;
}

// Provide the atlas image once it’s loaded (from preload/setup)
export function setAtlas(img) {
  R.atlas = img;
}

// Set/replace current level (expects dense arrays per layer)
export function setLevel(levelObj) {
  R.level = levelObj;
  // Update HUD size
  if (levelObj) {
    R.hud.info.sizeText = `${levelObj.width}×${levelObj.height}`;
  } else {
    R.hud.info.sizeText = "";
  }
}

// External scenes can switch mode via this
export function setMode(mode) {
  R.mode = mode;
  if (R.hud.link) {
    if (mode === "layout") R.hud.link.show();
    else R.hud.link.hide();
  }
}

// ----- Camera helpers -----
export function setCam(x, y) {
  R.cam.x = x | 0;
  R.cam.y = y | 0;
}

export function nudgeCam(dx, dy) {
  R.cam.x += dx;
  R.cam.y += dy;
}

