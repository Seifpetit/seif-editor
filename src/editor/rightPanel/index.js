// rightPanel/index.js

import { R } from "../../core/runtime.js";

import { topBarContainer } from "./ui/topBarContainer.js";
import { sideBarContainer } from "./ui/sideBarContainer.js";
import { ContentContainer } from "./ui/contentContainer.js";

import { PAGES, PAGE_TYPES, BOOKS } from "./ui/pages.js";

// -----------------------------------------------
// Base right panel object
// -----------------------------------------------

export class RightPanel {
  constructor() {
    this.booksBar = new sideBarContainer();
    this.pagesBar = new topBarContainer();
    this.pageContent = new ContentContainer();
  }

  setGeometry(x, y, w, h, PAD = R.layout.pad) {
    const PANEL = { x, y, w, h };

    const TOP_BAR_X = PANEL.x;
    const TOP_BAR_Y = PANEL.y;
    const TOP_BAR_W = PANEL.w;
    const TOP_BAR_H = PAD;

    const SIDE_BAR_W = PAD;
    const SIDE_BAR_Y = PANEL.y;
    const SIDE_BAR_X = PANEL.x - SIDE_BAR_W;
    const SIDE_BAR_H = PANEL.h;

    this.booksBar.setGeometry(SIDE_BAR_X, SIDE_BAR_Y, SIDE_BAR_W, SIDE_BAR_H);
    this.pagesBar.setGeometry(TOP_BAR_X, TOP_BAR_Y, TOP_BAR_W, TOP_BAR_H);
    this.pageContent.setGeometry(PANEL.x, TOP_BAR_H, PANEL.w, PANEL.h - TOP_BAR_H);

  }

  // -----------------------------------------------
  // Update + Render
  // -----------------------------------------------

  update(){
    if (R.ui.modalLock) return;  // freeze editor input when popup active

    this.booksBar.update();
    this.pagesBar.update();
    this.pageContent.update();
  }

  render(g) {
    this.booksBar.render(g);
    this.pagesBar.render(g);
    this.pageContent.render(g);
  }

  // -----------------------------------------------
  // Input events
  // -----------------------------------------------

  onHover(mx, my) {
 
    if (this.booksBar.onHover(mx, my)) 
      return true;
    
    if(this.pagesBar.onHover(mx, my))
      return true;

    if(this.pageContent.onHover(mx, my))
      return true;
    
    // Hover was inside the right panel, but not on any interactive element
    return false;
  }

  onClick(mx, my) {

    if(this.booksBar.onClick(mx, my)) 
      return true;

    if(this.pagesBar.onClick(mx, my))
      return true;
    
    if(this.pageContent.onClick(mx, my))
      return true;
    
    // Click was inside the right panel, but not on any interactive element
    return false;
  }

  onDoubleClick(mx, my) {
    if(!this.booksBar.hit(mx, my)) return false;

    if(this.booksBar.onDoubleClick(mx, my)) 
      return true;
    if(this.pagesBar.onDoubleClick(mx, my)) 
      return true;
    if(this.pageContent.onDoubleClick(mx, my)) 
      return true;

    // Double click was inside the right panel, but not on any interactive element
    return true;
    
  }


}




// -----------------------------------------------
// Build registry dynamically from metadata
// -----------------------------------------------
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


// -----------------------------------------------
// Book selection logic
// -----------------------------------------------
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
