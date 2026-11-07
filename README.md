# Overtime.io

A 2D platformer game built with React, TypeScript and Vite. The game is drawn on an HTML canvas; React only hosts the canvas and a small UI overlay.

The project is in an early stage. There is one test level (`Practice`) with a player, ground, gems and boxes.

## Getting started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Other scripts:

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the Vite dev server                      |
| `npm run build`   | Type-check with `tsc -b`, then build with Vite |
| `npm run lint`    | Run ESLint                                     |
| `npm run preview` | Serve the production build locally             |

The app is configured with the base path `/overtime.io` (see `vite.config.ts`).

## Controls

| Action | Keys                              |
| ------ | --------------------------------- |
| Move   | `A` / `D` or `ArrowLeft` / `ArrowRight` |
| Jump   | `W`, `Space` or `ArrowUp`         |

The overlay has two debug buttons: **Re-spawn** and **Toggle Collision Box**.

## Project structure

```
src/
  App.tsx, engine.ts        React entry and the `useEngine` hook (starts the game loop)
  scripts/
    engines/                Game loop and the base Engine class
    levels/                 Level base class and the Practice level
    layers/                 Background and ground layers
    objects/                Player, Box, Gem, Checkpoint
    states/player/          Player state machine (idle, run, jump, fall)
    misc/                   Collision, input and helpers
  assets/                   Sprites, tiles and Tiled maps
```

## Assets

Art assets come from a free Craftpix pack. `src/assets/License.txt` links to its license terms.
