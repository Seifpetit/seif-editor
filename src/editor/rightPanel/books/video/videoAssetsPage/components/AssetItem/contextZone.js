const DEFAULT_CONTEXT_TASKS = [
  { type: "rename", label: "Rename Video" },
  { type: "delete", label: "Delete Video" },
  { type: "preview", label: "Preview Video" }
];
// ───────────────────────────────────────────────────────────────────────────
// CONTEXT ZONE
// ───────────────────────────────────────────────────────────────────────────  

export class ContextZone {
  constructor( {onMessage} ) {
    this.onMessage = onMessage;

    this.x = 0; this.y = 0; this.w = 0; this.h = 0;
    this.taskH = 25; this.taskW = 200;
    
    this.tasks = [];
    this.initTasks(DEFAULT_CONTEXT_TASKS);

    this.hover = false;
    this.open = false;

    this.ContextZoneRect = null;
  }   

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    let i = 0;
    for(let task of this.tasks) { 
      task.setGeometry(this.x + this.w, this.y + this.taskH * i, this.taskW, this.taskH);
      i++;
    }
  } 

  initTasks(tasks = DEFAULT_CONTEXT_TASKS) {
    for(let t of tasks) this.tasks.push( new ContextTask({
      type:  t.type, 
      label: t.label, 
      onTask: msg => this.onMessage(msg)
    }) );
  }

  hit(mx, my){
    return (mx > this.x && mx < this.x + this.w &&
            my > this.y && my < this.y + this.h);
  }

  onHover(mx, my){
    if(this.hit(mx, my)) this.hover = true;
    
    for(let task of this.tasks) task.onHover(mx, my);
  }

  onClick(mx, my){

    if(!this.hit(mx, my) && !this.open) return false;
    if(this.hit(mx, my)) this.open = !this.open;

    if(this.open) { 
      for(let task of this.tasks) {
        if(task.onClick(mx, my)) return true;
      }
    }
    

    return true;
   
    
  }

  onDoubleClick(mx, my){
    if(!this.hit(mx, my)) return false;
    for(let task of this.tasks) task.onDoubleClick(mx, my);
  }

  update(state, tasks) {
    // future: handle button hover/click  

    if(!this.open) return;

    

  }

  draw(g) {
    g.push();

    // main button
    g.fill(this.open?"#f1b152ff":"#fba700ff"); g.rectMode(g.CORNER); 
    g.rect(this.x, this.y, this.w, this.h, 4);

    
    if(this.open && g) {
      
      // draw tasks
      g.fill(this.open?"#e49d8b82":"#fba700ff"); g.rect(this.x, this.y, this.taskW, this.tasks.length * this.taskH);
      for(let task of this.tasks) task.draw(g);

    }
    
    g.fill(this.open?"#ff0000ff":"#151514ff"); g.textSize(20); g.textAlign(g.CENTER, g.CENTER);
    g.text("⁝", this.x + this.w / 2, this.y + this.h / 2 + 1); 
    //if(this.open) console.log("Drawing context zone:", this.x, this.y, this.w, this.h);

    g.pop();

  }


}

class ContextTask {
  constructor( {type, label, onTask} ) {
    this.onTask = onTask;
    this.type = type;
    this.label = label;
    this.hover = false;
    this.x = 0; this.y = 0; this.w = 0; this.h = 0;
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  update(){
    
  }

  hit(mx, my){
    return (mx > this.x && mx < this.x + this.w &&
            my > this.y && my < this.y + this.h);
  }

  onHover(mx, my){
    this.hover = false;
    if(!this.hit(mx, my)) return false;
    this.hover = true;
  }

  onClick(mx, my){console.log('context click', this.type);
    if(!this.hit(mx, my)) {
      console.log("TYPE: ", this.type , " => ",!this.hit(mx, my));
      return false;}
    
    this.onTask(this.type);
    // further action handling can be implemented here
    return true;
  }


  draw(g){

    g.push();

    g.fill(this.hover?"#333333ff":"#555555ff"); g.strokeWeight(1); g.stroke("#000000ff");
    g.rect(this.x, this.y, this.w, this.h, 2);

    g.fill(255);
    g.textAlign(g.LEFT, g.CENTER); g.textSize(12);
    g.text(this.label, this.x + 5, this.y + this.h / 2);

    g.pop();
    
  }


}