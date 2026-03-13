// rightPanel/index.js
import { R } from "../../core/runtime.js";
import { UIElement } from "../../core/ui/UIElement.js";
import { topBarContainer } from "./ui/topBarContainer.js";
import { sideBarContainer } from "./ui/sideBarContainer.js";
import { ContentContainer } from "./ui/contentContainer.js";
import { PAGES, PAGE_TYPES } from "./ui/pages.js";

// ─────────────────────────────────────────────
// RIGHT PANEL — root of the right panel tree
// Children: booksBar | pagesBar | pageContent
// ─────────────────────────────────────────────
export class RightPanel extends UIElement {
  constructor() {
    super();
    this.booksBar    = this.addChild(new sideBarContainer());
    this.pagesBar    = this.addChild(new topBarContainer());
    this.pageContent = this.addChild(new ContentContainer());
  }

  setGeometry(x, y, w, h, PAD = R.layout.pad) {
    super.setGeometry(x, y, w, h);

    const SIDE_BAR_W = PAD;
    this.booksBar.setGeometry(x - SIDE_BAR_W, y, SIDE_BAR_W, h);
    this.pagesBar.setGeometry(x, y, w, PAD);
    this.pageContent.setGeometry(x, PAD, w, h - PAD);
  }

  update() {
    if (R.ui.modalLock) return;
    super.update();
  }

  // render, onHover, onClick, onDoubleClick
  // all handled by UIElement base — no code needed here
}

// ─────────────────────────────────────────────
// REGISTRY — build page instances from metadata
// ─────────────────────────────────────────────
export function buildRightPanelRegistry() {
  const rightPanel = R.rightPanel;
  rightPanel.registry = {};

  for (const bookName in PAGES) {
    rightPanel.registry[bookName] = {};
    for (const def of PAGES[bookName]) {
      const Cls = PAGE_TYPES[def.type];
      if (!Cls) continue;
      rightPanel.registry[bookName][def.page] = new Cls(def);
    }
  }
}

// ─────────────────────────────────────────────
// BOOK SELECTION — called by sideBarContainer
// ─────────────────────────────────────────────
export function onBookSelected(bookRef) {
  const rightPanel = R.editor.rightPanel;
  R.ui.selectedBook = bookRef;

  const pageList = PAGES[bookRef] || [];
  R.ui.topBarButtons = pageList;

  if (pageList.length > 0)
    R.ui.selectedPage = pageList[0].page;

  rightPanel.pagesBar.setButtons(pageList);
}

buildRightPanelRegistry();
