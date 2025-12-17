// ─────────────────────────────────────────────────────────────────────────────
// [APP] Bootstrapping & Runtime Orchestration
// - Responsible for: asset preload, canvas setup, main draw loop
// - Owns camera, toggles, and level switching
// - Renders tile layers in order, then entities/effects, then debug overlays
// ─────────────────────────────────────────────────────────────────────────────
import { R, updatePanelLayout} from './core/runtime.js';
import { loadLevel } from './core/levelLoader.js';
import { updateFrame, renderFrame } from './core/orchestrator.js';
import { registerKeyboard } from './core/input.js';
import { handleImportedFiles } from "./core/importHandler/importRouter.js";
import { ToasterUI } from './services/Toaster.js';
import { ModalUI } from './services/modalWindow/ModalWindow.js';
// ─────────────────────────────────────────────────────────────────────────────
// [LIFECYCLE] preload/setup
// preload → load images/assets
// setup   → create canvas, tune pixel mode, load initial data
// ─────────────────────────────────────────────────────────────────────────────
new window.p5(p => {
  let gWorld, gOverlay, gHUD;

  p.preload = () => {
    R.atlas.world_tileset = p.loadImage("src/assets/world_tileset.png");
    R.atlas.coin = p.loadImage("src/assets/coin.png");
    R.atlas.fruits = p.loadImage("src/assets/fruit.png");
    R.atlas.knight = p.loadImage("src/assets/knight.png");
    R.atlas.platforms = p.loadImage("src/assets/platforms.png");
    R.atlas.slime_green = p.loadImage("src/assets/slime_green.png");
    R.atlas.slime_purple = p.loadImage("src/assets/slime_purple.png");

    R.layout.assets.load_icon = p.loadImage("src/assets/load-icon.png");

    R.layout.assets.cursor_k = p.loadImage("src/assets/pointer_k.png");
    R.layout.assets.cursor_j = p.loadImage("src/assets/pointer_j.png");
    R.layout.assets.cursor_b = p.loadImage("src/assets/pointer_b.png");
    R.layout.assets.hand_closed = p.loadImage("src/assets/hand_closed.png");
    R.layout.assets.mark_exlamation_cursor_b = p.loadImage("src/assets/mark_exclamation_pointer_b.png");
  };

  p.setup = async () => { R.p5_instance = p;
    p.createCanvas(window.innerWidth - R.layout.pad, window.innerHeight - R.layout.pad); // "- R.layout.padX" //TEMP
    p.noSmooth(); p.pixelDensity(1); p.canvas.style.cursor = 'none';

    // offscreen layers
    gWorld   = p.createGraphics(p.width, p.height); 
    gOverlay = p.createGraphics(p.width, p.height);
    gHUD     = p.createGraphics(p.width, p.height);

    // Game: initial level
    R.level = await loadLevel('./levels/level2.json');
    R.cursor.currentPng = R.layout.assets.cursor_b;

    // layout: blank map
    const W = 44, H = 24;  //W for nb of grid's columns , H for nb of rows 
    R.layout.level = {
      width: W, height: H,
      layers: {
        ground:     new Array(W*H).fill(0),
        detail:     new Array(W*H).fill(0),
        collision:  new Array(W*H).fill(0),
        decoration: new Array(W*H).fill(0),
      }
    };

    registerKeyboard(p);
    updatePanelLayout(p);

    window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'o')) {
        e.preventDefault();
      }
    });
    
    window.addEventListener('contextmenu', (e) => {
      const { offsetX: x, offsetY: y } = e;
      const insideGrid = x >= R.layout.panels.viewport.x && x < R.layout.panels.viewport.x + R.layout.panels.viewport.w &&
                         y >= R.layout.panels.viewport.y && y < R.layout.panels.viewport.y + R.layout.panels.viewport.h;

      if (insideGrid) e.preventDefault();
    
    });

    setupDragAndDrop();
  
  };

  // ───────────────────────────────────────────────────────────────────────────
  // [LOOP] Frame pipeline
  // clear + composite: world → overlay → HUD
  // ───────────────────────────────────────────────────────────────────────────
  p.draw = () => {
    const m = R.input.mouse;
    p.clear(); // <── first

    // stop viewport updates if modal is open
    updateFrame(p);
    ModalUI.update();
    ToasterUI.update(1/60);

    renderFrame(p, { gWorld, gOverlay, gHUD });
    ModalUI.render(gOverlay);
    ToasterUI.render(gOverlay);
    //if(R.ui.dragActive) ToasterUI.showImportIntent();

    
    p.image(gWorld, 0, 0);
    p.image(gOverlay, 0, 0);
    p.image(gHUD, 0, 0);
   
    if (R.cursor.currentPng) p.image(R.cursor.currentPng, m.x, m.y);

    if(m.pressed) {
      if(!R.ui.modalDrag) {
        ModalUI.onClick(m.x, m.y);
        ToasterUI.onClick(m.x, m.y);
      }
      ModalUI.onDrag(m.x, m.y);  
    }
    if (!m.pressed && ModalUI.active) {
      ModalUI.active.stopDrag();
    }



  };

  // prevent context menu (so right-click erases)
  p.canvas?.addEventListener?.('contextmenu', e => e.preventDefault());

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    updatePanelLayout(p);
    [gWorld, gOverlay, gHUD].forEach(g => g.resizeCanvas(p.width, p.height));
  };
  
});


function setupDragAndDrop() {
  const cnv = document.getElementById("defaultCanvas0");

  cnv.ondragover = e => {
    e.preventDefault();
    R.ui.dragActive = true;
    if(!ModalUI.active) ToasterUI.showHint("You can Drag & Drop Files ...");
  };

  cnv.ondragleave = e => {
    R.ui.dragActive = false;
    ToasterUI.clearHint();
  };

  cnv.ondrop = e => {
    e.preventDefault();
    R.ui.dragActive = false;
    ToasterUI.clearHint();
    
    const files = e.dataTransfer.files;
    handleImportedFiles(files);
  };

}
