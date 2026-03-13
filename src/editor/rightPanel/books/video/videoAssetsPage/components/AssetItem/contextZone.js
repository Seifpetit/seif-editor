// contextZone.js
import { UIElement } from "../../../../../../../core/ui/UIElement.js";

const DEFAULT_CONTEXT_TASKS = [
  { type: "rename",  label: "Rename Video"  },
  { type: "delete",  label: "Delete Video"  },
  { type: "preview", label: "Preview Video" },
];

// ─────────────────────────────────────────────
// CONTEXT TASK — leaf node
// ─────────────────────────────────────────────
class ContextTask extends UIElement {
  constructor({ type, label, onTask }) {
    super();
    this.type   = type;
    this.label  = label;
    this.onTask = onTask;
    this.hovered = false;
  }

  onHover(mx, my) {
    this.hovered = this.hit(mx, my);
    return this.hovered;
  }

  onClick(mx, my) {
    if (!this.hit(mx, my)) return false;
    this.onTask(this.type);
    return true;
  }

  render(g) {
    g.push();
    g.stroke("#000000ff");
    g.strokeWeight(1);
    g.fill(this.hovered ? "#333333ff" : "#555555ff");
    g.rect(this.x, this.y, this.w, this.h, 2);

    g.noStroke();
    g.fill(255);
    g.textAlign(g.LEFT, g.CENTER);
    g.textSize(12);
    g.text(this.label, this.x + 5, this.y + this.h / 2);
    g.pop();
  }
}

// ─────────────────────────────────────────────
// CONTEXT ZONE — parent node
// ─────────────────────────────────────────────
export class ContextZone extends UIElement {
  constructor({ onMessage }) {
    super();
    this.onMessage = onMessage;
    this.taskH     = 25;
    this.taskW     = 200;
    this.open      = false;
    this.hovered   = false;

    for (const t of DEFAULT_CONTEXT_TASKS) {
      this.addChild(new ContextTask({
        type:   t.type,
        label:  t.label,
        onTask: msg => this.onMessage(msg)
      }));
    }
  }

  setGeometry(x, y, w, h) {
    super.setGeometry(x, y, w, h);
    this.children.forEach((task, i) => {
      task.setGeometry(x + w, y + this.taskH * i, this.taskW, this.taskH);
    });
  }

  onHover(mx, my) {
    this.hovered = this.hit(mx, my);
    if (this.open) super.onHover(mx, my); // propagate to tasks
    return this.hovered;
  }

  onClick(mx, my) {
    // Toggle open/close when clicking the button itself
    if (this.hit(mx, my)) {
      this.open = !this.open;
      return true;
    }
    // Route to tasks if open
    if (this.open) {
      return super.onClick(mx, my);
    }
    return false;
  }

  render(g) {
    g.push();

    // Main button
    g.noStroke();
    g.fill(this.open ? "#f1b152ff" : "#fba700ff");
    g.rect(this.x, this.y, this.w, this.h, 4);

    // Icon
    g.fill(this.open ? "#ff0000ff" : "#151514ff");
    g.textSize(20);
    g.textAlign(g.CENTER, g.CENTER);
    g.text("⁝", this.x + this.w / 2, this.y + this.h / 2 + 1);

    // Dropdown tasks
    if (this.open) {
      g.fill("#e49d8b82");
      g.rect(this.x, this.y, this.taskW, this.children.length * this.taskH);
      g.pop();
      super.render(g); // render tasks
      return;
    }

    g.pop();
  }
}
