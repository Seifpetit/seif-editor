// ───────────────────────────────────────────────────────────────────────────
// RENAME ZONE
// ───────────────────────────────────────────────────────────────────────────

export class RenameZone {
  constructor() {
    this.x = 0; this.y = 0; this.w = 0; this.h = 0;
    this.editingName = false;
    this.filename = "";
    this.filetype = "";
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

   hit(mx, my){
    return (mx > this.x && mx < this.x + this.w &&
            my > this.y && my < this.y + this.h);
  }

  onHover(mx, my){
    if(!this.hit(mx, my)) return false;
    this.hover = true;
  }

  onClick(mx, my){
    if(!this.hit(mx, my)) return false;
    this.editingName = true;
  }

  onDoubleClick(mx, my){
    if(!this.hit(mx, my)) return false;

  }

  update(nameBuffer) {
    this.filename = nameBuffer;
    this.filetype = this.filename.split('.').pop();
  }

  draw(g) {
    g.fill(this.editingName ? 40 : 100); g.rectMode(g.CORNER);
    g.rect(this.x, this.y, this.w, this.h, 4);
    g.fill(this.editingName ? 255 : 200);
    g.textAlign(g.LEFT, g.BOTTOM);
    g.text(this.filename, this.x*1.01, this.y * 1.1);
  }   

}