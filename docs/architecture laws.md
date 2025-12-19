### . The Doctrine of the Engine

Eight Laws. One Architecture. Infinite Growth.

These laws weren’t invented upfront.
They emerged naturally from watching the system grow, collide, break, improve, and stabilize.

They are part engineering, part sociology, part psychology.
A system is like a small society:
every module has a role, a boundary, a way it speaks, and a way it stays sane.

These laws describe that society.

### ⭐ Law I — The Update/Render Split

<p align="center">
  <img src="./law1.png" width="100">
</p>


“Thought and appearance must never collide.”

In human terms:
Thinking and performing at the same time causes mistakes.
So the engine separates them.

update() is the mind — decisions, logic, state.
render() is the body — appearance, visuals.

When every object follows this separation,
the whole system becomes calmer, predictable, and bug-resistant.
It’s like giving every component its own prefrontal cortex.


### ⭐ Law II — Russian-Doll Composition

<p align="center">
  <img src="./law2.png" width="100">
</p>


“Big things are built from small things that behave the same.”

The editor is not a monolith.
It is a stack of small societies:

Panels contain containers

Containers contain components

Components contain widgets

Like nested Russian dolls, each has the same contract:
they update themselves, render themselves, and never overstep their role.

This makes scaling effortless — the system grows by adding another doll, not rewriting the old ones.

### ⭐ Law III — The 250-Line Law

<p align="center">
  <img src="./law3.png" width="100">
</p>


“When a file grows too big, it wants to become two things.”

Code, like societies, becomes unstable when a single person has too many jobs.
A file passing ~250 lines is a signal:
it’s not doing one thing anymore.

Splitting the file redistributes responsibility —
and complexity evaporates.

This simple rule keeps the entire engine breathable.

### ⭐ Law IV — Responsibility Zones

<p align="center">
  <img src="./law4.png" width="100">
</p>

“Code that thinks together should live together.”

A society collapses when responsibilities are scattered.

core/ → engine truth

viewport/ → world interaction

rightPanel/ → UI books & pages

bottomDock/ → tools & timeline

Each zone has an identity.
No drifting, no guessing, no random folders doing random jobs.

It’s like a city map where every district has a purpose.

### ⭐ Law V — One-Level Communication

<p align="center">
  <img src="./law5.png" width="100">
</p>

“A child speaks to its parent — not the entire village.”

This is the strongest social law — and the one that keeps the system sane.

A page does not talk to distant modules.
A widget does not reach horizontally into other widgets.

Everything communicates one level up or down:

Widget → Component → Container → Panel → Runtime

This prevents chaos.
No telephone wires crossing every direction.
No code hunting.

It’s social hierarchy as a debugging model.

### ⭐ Law VI — Entry-Point Architecture

<p align="center">
  <img src="./law6.png" width="100">
</p>

“Every domain should speak with one clean voice.”

Each subsystem has an index.js that acts like a spokesperson.

You don’t import deep internals everywhere.
You talk to the entry-point, and it orchestrates the rest.

Domains stay modular.
Refactors stay painless.
And nothing leaks outside its own world.

### ⭐ Law VII — Metadata-Driven Pages

<p align="center">
  <img src="./law7.png" width="100">
</p>

“Describe the system in data, and the system builds itself.”

UI shouldn’t be hardcoded.
Instead, the editor reads a config file and builds its own navigation:

Tiles → Palette
Audio → Assets Page
Entities → etc

One line in PAGES.js instantly creates:

a button

a route

a page instance

layout logic

It’s basically plug-and-play UI.
The engine becomes extendable without touching code.

### ⭐ Law VIII — The Single-State Law

<p align="center">
  <img src="./law8.png" width="100">
</p>

“All truth lives in one place.”

Instead of scattering state across components,
the entire engine observes a unified runtime object: R.

Panels don’t store their own truth.
Pages don’t own reality.
Everything reflects the state — nothing duplicates it.

This makes future systems possible:

undo/redo

timeline scrubbing

deterministic replay

saving/loading editor sessions

One state to rule them all.