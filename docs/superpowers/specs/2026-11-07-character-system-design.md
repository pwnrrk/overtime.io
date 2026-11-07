# Character system design

Date: 2026-11-07
Status: approved in conversation, awaiting written-spec review

## Goal

Finish the character system for Overtime.io using the sprite sets in `src/assets/1 Main Characters`:

- Data-driven animation with runtime left/right flipping.
- Three selectable character skins.
- New actions: double jump, hit, and appear/disappear on spawn and respawn.

Out of scope: wall jump (sheets stay unused), knockback, health or invulnerability frames, a menu or character-select screen, enemies and traps.

## Current state

- `Player` has four states (Idling, Running, Jumping, Falling). Each state imports character 1's PNGs directly and reassigns `player.model.src` on every tick.
- Frame counts are magic numbers (`maxFrame`), and `Player` owns `model`, `frameX`, `maxFrame`, `animateEnd()` and `draw()`.
- Only character 1 has `_Backward` sheets, and only for Idle, Run, Jump and Fall. `Double_Jump`, `Hit` and `Wall_Jump` have no backward sheet for any character, so flipping must happen at draw time.
- Horizontal movement is read from the held keys in `Player.handleMovement`, independent of state.
- The player is constructed at the spawn point and starts idle, falling in from mid-air.

## Sprite sheet facts

| Sheet | Frame size | Frames |
| --- | --- | --- |
| Idle | 32x32 | 11 |
| Run | 32x32 | 12 |
| Jump, Fall | 32x32 | 1 |
| Double_Jump | 32x32 | 6 |
| Hit | 32x32 | 7 |
| Wall_Jump (unused) | 32x32 | 5 |
| Appearing, Desappearing (shared by all skins) | 96x96 | 7 |

## 1. Animation layer

New files:

- `src/scripts/characters/characters.ts`: registry of the three skins. Each skin defines the animations `idle`, `run`, `jump`, `fall`, `doubleJump` and `hit` with sheet URL, frame count, loop flag and frame size. A separate `effects` entry defines `appearing` and `disappearing` (96x96).
- `src/scripts/characters/Animator.ts`: owned by `Player`.

Animator behavior:

- Loads each image once and caches it; no per-tick `src` reassignment.
- `play(name)` is a no-op if that animation is already playing. Non-looping animations run once and set `done`.
- `update()` advances frames at the existing 24 fps timer from `Game`.
- `draw(ctx, x, y, facing)` flips horizontally with `scale(-1, 1)` when facing left. The `_Backward` sheets become unused.
- `setSkin(id)` swaps the skin and keeps the current animation name.
- Effects are drawn centered on the player's 32x32 box (offset -32 on each axis, to be checked against the art during implementation) and do not flip.
- In development, a sheet whose width is not `frames x frame size` logs a warning. A failed image load logs `console.error` naming the sheet and skips the frame. An unknown animation name in `play()` throws in development.

Changes in `Player`:

- Remove `model`, `frameX`, `maxFrame`, `animateEnd()` and the draw code in favor of `animator`. First confirm nothing else (e.g. `Collision`) reads those fields.
- `Idling`, `Running`, `Jumping` and `Falling` drop their PNG imports and call `animator.play(...)` once in `enter()`.

## 2. New states

Append `DOUBLE_JUMPING = 4` and `HIT = 5` to the `states` enum. Existing indices do not change.

Double jump:

- One extra jump while airborne, from Jumping or Falling. Resets on landing.
- `Player` gains `airJumpsLeft` (set to 1 on landing) and `jumpReleasedInAir`. The air jump only fires after the jump key has been released and pressed again, so holding the key through the first jump does not trigger it.
- Shared helper `player.tryAirJump()`, called from `Jumping.handleInput` and `Falling.handleInput`; on success the player enters `DoubleJumping`.
- `DoubleJumping.enter()` sets `vy = -doubleJumpPower` (constant, starting at 18 versus 20 for the first jump) and plays the non-looping `doubleJump` animation. When `vy` passes `weight` it goes to Falling.
- It does not reset boundaries; collisions already update them each tick.
- `Player.onCollision` currently checks `state === "JUMPING"` to turn a head bump into Falling. Extend it to also cover `DOUBLE_JUMPING`.

Hit:

- `player.hit()` is triggered by a new **Hit** debug button in the overlay (no enemies or traps exist yet).
- `HIT` plays the non-looping `hit` animation (about 0.3 s) and sets `player.controlsLocked = true`. `handleMovement` skips key input while locked; gravity keeps applying.
- When the animation reports `done`, return to Falling if airborne, otherwise Idling, and unlock controls.
- `player.hit()` is ignored while the player is frozen (`DISAPPEARING` or `APPEARING`) or already in `HIT`.

## 3. Skin selection

- Overlay gets **Skin 1**, **Skin 2** and **Skin 3** buttons styled like the existing debug buttons; the active one is highlighted.
- `useEngine` exposes `setSkin(id)`, which calls `Game.player.animator.setSkin(id)`. The change is immediate and keeps the current action and facing.
- Default is skin 1.
- The choice persists in `localStorage` under a single key. It is read when `Game` creates the player. All access is wrapped in try/catch, and an unknown stored id falls back to skin 1.
- Adding a fourth skin later is one new entry in `characters.ts`.

## 4. Spawn and respawn flow

Append `DISAPPEARING = 6` and `APPEARING = 7` to the `states` enum. In both states the player is frozen:

- Physics and movement are skipped, input is locked, and `turnOnCollision` is off so an invisible player cannot collect gems or hit boxes.
- The character sprite is hidden and the effect sheet is drawn instead.
- The states only wait for `animator.done`.

Flow:

- Game start: the player is constructed in `APPEARING` at the spawn point. When the effect finishes: `IDLING`, controls unlocked, collision re-enabled.
- Re-spawn button: `Game.respawn()` calls `Player.respawn(position, boundaries)`, which stores them as a pending spawn and enters `DISAPPEARING` at the current position. When done, the player teleports to the spawn point (reusing the existing reset of boundaries, `vy`, speed, and `airJumpsLeft`), then enters `APPEARING`, then `IDLING` with everything unlocked.
- A Re-spawn request while either effect is playing is ignored. A request during `HIT` is allowed and takes over.
- Read `Collision` during implementation to confirm that turning `turnOnCollision` off cleanly skips the player.

The `createStates()` array order must match the enum: Idling, Running, Jumping, Falling, DoubleJumping, Hit, Disappearing, Appearing.

## 5. Verification and delivery

- The repo has no test framework and no CI, and this workspace cannot install packages. Verification available here: type-check `src/scripts/` with the global `tsc` and a stub for `*.png` imports, plus manual review of `App.tsx` and `engine.ts`. `npm run build`, `npm run lint` and playing the game must be done by the repo owner (or by a later session with package installs allowed).
- No new test dependency is added. The PR description carries a manual test checklist: skins 1-3 on every action, facing left and right, double jump including the hold-Space case, hit and its input lock, respawn mid-air and during an effect, and skin persistence across refresh.
- Work happens on branch `feat/character-system` in a few commits (animator and registry, new states, skin selection, spawn flow), then a pull request against the default branch. The README gets a short section on the character system and the new debug buttons.
