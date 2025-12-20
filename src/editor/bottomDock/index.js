// ─────────────────────────────────────────────
// [EDITOR] HUD System
// - Draws bottom info bar and help overlay
// - Manages GitHub link visibility
// - Uses R.panels.hud for layout
// ─────────────────────────────────────────────
import { R } from "../../core/runtime.js";
import { SectionBar } from "./sectionsBar.js";
import { TimelinePanel } from "./timelinePanel/index.js";


const dock = {
  bar: new SectionBar(),
  panel: new TimelinePanel(),
}

R.bottomDock = dock;

// ─────────────────────────────────────────────
// [UPDATE] HUD logic (hotkeys, toggles, etc.)
// ─────────────────────────────────────────────
export function updateBottomDock() {

    if (R.ui.modalLock) return;  // freeze editor input when popup active

  const P = R.layout.panels.bottomDock;

  const BAR_HEIGHT = 40;

  dock.bar.setGeometry(
    P.x, P.y, 
    P.w, BAR_HEIGHT
  );

  dock.panel.setGeometry(
    P.x, P.y + BAR_HEIGHT,
    P.w, P.h - BAR_HEIGHT
  );

  dock.bar.update();
  dock.panel.update();

  const m = R.input.mouse;
  const insidePanel =
      m.x >= P.x &&
      m.x <= P.x + P.w &&
      m.y >= P.y &&
      m.y <= P.y + P.h;

  R.cursor.inBottomDock = insidePanel;

  
}

// ─────────────────────────────────────────────
// [RENDER] Main HUD render pass
// ─────────────────────────────────────────────

export function renderBottomDock(g) {

  const dockPanel = R.layout.panels.bottomDock;

  g.push(); g.clear(); g.fill("gray"); g.rect(dockPanel.x, dockPanel.y, dockPanel.w, dockPanel.h);

  dock.bar.render(g); 

  if(R.ui.timelineMode === null) showHelpText(g);
  else dock.panel.render(g);

  ensureGitHubLink(g);
  g.pop();

}

export function showHelpText(g) {
  g.fill("orange");
  g.textSize(14);
  g.text("Temp HelpText", dock.bar.x,
          dock.bar.y + dock.bar.h + 25);
  g.text("CONTROL + S: SAVE LEVEL | CONTROL + O: OPEN LEVEL ", 
          dock.bar.x,
          dock.bar.y + dock.bar.h + 50
   );
}

// ─────────────────────────────────────────────
// [LINK] GitHub Source link (DOM overlay)
// ─────────────────────────────────────────────
function ensureGitHubLink(p) {

  
  if (R.mode !== "editor" || !R.hud) return hideGitHubLink();


  if (!R.hud.ghlink) {
    const a = p.createA(
      "https://github.com/Seifpetit/seif-platformer",
      "View Source: GitHub ↗",
      "_blank"
    );

    a.style("font-size", "14px");
    a.style("font-family", "monospace");
    a.style("color", "#00fffbff");
    a.style("text-decoration", "none");
    a.style("background", "rgba(0, 30, 255, 1)");
    a.style("padding", "0px 10px");
    a.style("border-radius", "4px");

    R.hud.ghlink = a;

  }

  const w = R.hud.ghlink.elt.offsetWidth || 0;
  const x = p.width - w + 10;
  const y = R.layout.panels.bottomDock.y + R.layout.panels.bottomDock.h + R.layout.panels.pad;
  
  const link = R.hud.ghlink;
  link.position(x, y);
  link.show();

}

export function hideGitHubLink() {
  R.hud?.ghlink?.hide?.();
}
