
// ─────────────────────────────────────────────
// RENDERING FUNCTIONS FOR VIDEO ASSETS PAGE
// ─────────────────────────────────────────────



export function  renderEmptyState(g, page) {
    g.push();
    g.fill(80);
    g.textAlign(g.CENTER, g.CENTER);
    g.textSize(18);
    g.text("No videos imported yet.\nUse ‘Import’ or drag files here.", 
          page.x + page.w/2, 
          page.y + page.h/2);
    g.pop();
  }


export function renderListView(g, page) {
  const pad = 10;
  const itemH = 60;
  const itemX = page.x + pad; 
  const itemW = page.w - pad * 5; 
  
  let itemY = page.y + page.rowHeight + pad;
  
  let items = page.items;
    for (let item of items) {
      item.setGeometry(itemX, itemY, itemW, itemH, page.mode);
      item.draw(g);

      itemY += (itemH + pad);
    }

  }

export function renderCardsView(g, page) {
    const cols = 3; 
    const pad = 10;
    const cardW = (page.w - pad * 8) / cols;
    const cardH = 140;
    
    let i = 0;

    let items = page.items;
    for (let item of items) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = page.x + pad + col * (cardW + pad);
      const y = page.y + page.rowHeight + pad + row * (cardH + pad);

      item.setGeometry(x, y, cardW, cardH);
      item.draw(g, "cards");

      i++;
    }
    for (let item of items) {
      
      const ctxZone = item.contextZone;
      ctxZone.draw(g);
      
    }
}


export function updateView(page) {
  let items = page.items;
  for (let item of items) {
    item.update?.(); // optional
  }
}
// ─────────────────────────────────────────────