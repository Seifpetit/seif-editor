


### Seif Editor

**Custom 2D engine with integrated media & gameplay authoring**

---

## Overview

Seif Editor is a custom-built internal tooling platform for authoring interactive 2D experiences.
It combines a lightweight runtime, a modular editor UI, and a deterministic input/render pipeline into a single system designed for clarity, extensibility, and long-term maintainability.

The project focuses on **engineering the tool itself** rather than shipping a single product: custom input routing, panel composition, asset pipelines, and render-order control are all implemented from scratch without external frameworks.

This repository demonstrates how to design and scale an internal editor from first principles.

---

## Live Demo

👉 https://seifpetit.github.io/seif-editor 

🎨 Tile Painting & Grid Interaction
📁 Drag-and-Drop Asset Importing

![Gameplay Demo](./docs/editor.gif)

---

## Core Capabilities

* **Custom runtime loop** (update → route input → render)
* **Centralized input routing** (click / hover / double-click, no ghost events)
* **Modular editor panels** (viewport, right panel, bottom dock)
* **Asset management system** (video, audio, tilesets)
* **Context-aware UI interactions** (predictable state transitions)
* **Deterministic render order** (explicit layering, no DOM magic)
* **Framework-free architecture** (vanilla JavaScript)

---

## Architecture Overview

### Runtime Model

The system is built around a small runtime object that owns:

* Input state
* Active mode (editor / game)
* Registered panels and services

All subsystems are *attached*, not globally assumed.

**Key principle:**

> Nothing handles input or rendering unless explicitly routed.

---

### Update & Render Pipeline

```
Frame Loop
 ├─ updateInput()
 ├─ routeInput()
 │   ├─ routeHover()
 │   ├─ routeClick()
 │   └─ routeDoubleClick()
 ├─ updateEditor() / updateGame()
 └─ renderEditor() / renderGame()
```

This separation ensures:

* No duplicated listeners
* No side effects during render
* Predictable UI behavior under scale

---

### Input Routing

All mouse interaction is centralized in a dedicated input router.

* Components expose **hit(x, y)** → boolean
* Components do **not** decide meaning
* Meaning is resolved at the routing layer
* Panels act as secondary routers for their children

This avoids ghost clicks, overlapping handlers, and hidden coupling.

---

### UI Composition

The editor is composed of independent panel objects:

* **Viewport**
* **Right Panel** (books, pages, content)
* **Bottom Dock**

Each panel:

* Owns its geometry
* Exposes update / render hooks
* Can be paused, replaced, or extended without touching others

---

### Rendering Strategy

Rendering is explicit and layered:

* Primary render pass
* Secondary pass for overlays (e.g. context menus)
* No implicit z-index behavior

This keeps visual order stable even as features grow.

---

## Folder Structure

```
src/
 ├─ core/        # runtime, orchestration
 ├─ services/    # input router, modals, toasts
 ├─ editor/      # panels and editor logic
 ├─ ui/          # reusable UI primitives
 ├─ game/        # gameplay runtime
 └─ assets/
docs/
 └─ architecture.md
```

---

## Design Principles

* Explicit over implicit
* Routing over listeners
* Composition over inheritance
* Refactor only when structure demands it

*(Full doctrine in `/docs/architecture.md`)*

---

## Author Note

This project did not start as an engine.

It began as a simple platformer I built years ago, which I wanted to polish and extend.
To make level creation easier, I started refactoring the codebase into a small tile editor, purely as a practical step to improve gameplay authoring.

From there, the scope expanded naturally.

As the editor grew, I realized that splitting creation across multiple tools (one for levels, one for audio, one for logic, one for media) created unnecessary friction. Instead of exporting and re-importing assets between disconnected systems, I began shaping the project into a single, integrated environment for authoring interactive experiences.

What emerged is a custom engine/editor designed around systems thinking rather than features.

Building this from scratch taught me how to reason about architecture at a structural level: how to identify constraints, design boundaries, and decide what systems should exist before deciding how to implement them. Tutorials tend to focus on adding features inside existing frameworks; this project required designing the framework itself.

Today, this tool is primarily aimed at creatives, people who want to assemble gameplay, visuals, audio, and logic in one place, with minimal friction between ideas and execution.

---

## What i learned

* Designing internal editor infrastructure from scratch

* Building deterministic input and render pipelines

* Structuring large UI systems without framework coupling

* Translating creative workflows into stable engineering abstractions

* Making architectural trade-offs under real complexity

---

## Roadmap (Short)

* Asset export pipeline
* Timeline / sequencing tools
* Serialization & project save/load

---

## What This Demonstrates

* Ability to design internal tools from scratch
* Comfort with large, multi-file systems (50+ files)
* Systems thinking beyond feature implementation
* Engineering judgment under architectural pressure

