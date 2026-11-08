# Character System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Data-driven character animation with three skins, plus double jump, hit and appear/disappear actions, in the Overtime.io canvas game.

**Architecture:** A pure `Animator` (owned by `Player`) replaces per-state PNG imports and flips sprites at draw time. A registry (`characters.ts`) holds the sheet data for the three skins and the shared spawn effects. New behaviors are new `State` subclasses; the pure logic that can be unit-tested (animation stepping, air-jump rules, skin storage) lives in small modules without asset or `Game` imports.

**Tech Stack:** TypeScript, React 18, Vite 5, canvas 2D. Unit tests use Node's built-in `node:test` (no new dependencies).

**Spec:** `docs/superpowers/specs/2026-11-07-character-system-design.md`

## Global Constraints

- Branch `feat/character-system` (already pushed with the spec commit). No new dependencies; no test framework beyond built-in `node:test`.
- Existing `states` enum indices do not change. New values: `DOUBLE_JUMPING = 4`, `HIT = 5`, `DISAPPEARING = 6`, `APPEARING = 7`. The array in `Player.createStates()` must stay in enum order.
- Sheet frame counts, all 32x32 frames: idle 11 (loops), run 12 (loops), jump 1, fall 1, doubleJump 6 (one-shot), hit 7 (one-shot). Effects `appearing`/`disappearing`: 7 frames of 96x96 from `src/assets/1 Main Characters/Appearing.png` and `Desappearing.png` (sic), shared by all skins. Skins live in folders `1`, `2`, `3` next to them.
- Animation advances only on the existing Game frame timer: `Game.getState().frameTimer > 1000 / 24`.
- First jump power stays 20; double jump power is 18. One air jump per airtime.
- Skin persistence: `localStorage` key `overtime.skin`, every access in try/catch, anything other than the exact strings `"1"`, `"2"`, `"3"` falls back to skin 1.
- Out of scope: wall jump (sheets stay unused), knockback, health, invulnerability, menus, enemies/traps. Do not delete the unused `_Backward` PNGs.
- Every commit message ends with these two lines, and the PR body ends with the two lines below it:
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` / `Claude-Session: https://claude.ai/code/session_01DwYtNeoLEbTfP7PGssHtwc`
  PR: `🤖 Generated with [Claude Code](https://claude.com/claude-code)` / `https://claude.ai/code/session_01DwYtNeoLEbTfP7PGssHtwc`

## Refinements to the spec (decided while planning)

- Air-jump rule is press-edge detection in a pure `AirJump` class instead of the spec's `jumpReleasedInAir` flag; `Player.tryAirJump()` stays as specified. Edge detection also covers walking off a ledge and releasing mid-air.
- `controlsLocked`, `frozen` and `turnOnCollision` on `Player` are getters derived from properties of the current `State` instead of separately toggled flags, so they cannot get out of sync with the state machine.
- `Animator.play()` accepts both character and effect names. `Animator` preloads every sheet in its constructor.
- Unit tests live in `tests/` (outside `tsconfig.app.json`'s `src` include, so `tsc -b` never needs Node types) and run with `node --experimental-strip-types --test`.

## Verification setup

This workspace cannot install packages, so `npm run build`/`lint`/`dev` are unavailable here. Use:

- Unit tests: `npm test` (script added in Task 1).
- Type-check of `src/scripts/` (not `App.tsx`/`engine.ts`, which need React types; review those by eye). Files already exist at `/tmp/claude-0/-home-claude/e6d905ac-e884-5ba6-aff7-469cf2e3afc1/scratchpad/` (`S` below); recreate if missing:
  - `$S/png.d.ts`: `declare module "*.png" { const src: string; export default src; }` plus `interface ImportMeta { readonly env: { readonly DEV: boolean } }`
  - `$S/tsconfig.check.json`: `extends` `/home/claude/overtime.io/tsconfig.app.json`, `compilerOptions: { types: [], noEmit: true }`, `include: [/home/claude/overtime.io/src/scripts, $S/png.d.ts]`
  - Run: `tsc -p $S/tsconfig.check.json` Expected: no output, exit 0 (baseline is clean).

## Review Focus

1. Holding the jump key through the first jump must not fire the double jump instantly. Pinned in Task 3 (`AirJump` tests).
2. `localStorage` empty, garbage, or throwing must give skin 1, never an exception. Pinned in Task 5 (`skinStorage` tests).
3. Switching skin mid one-shot (hit, double jump) keeps the action and frame. Pinned in Task 1 (`Animator` tests).
4. A one-shot that already finished (second hit, second double jump) must restart, not freeze on its last frame. Pinned in Task 1.
5. Re-spawn clicked repeatedly or during an effect or hit must neither get stuck frozen nor teleport twice. Task 6 code rule (`respawn()` ignores while frozen) plus manual checklist item in Task 7; also a sheet that has not loaded yet must not throw when drawn (Task 1 test).

---

### Task 1: Animation core and unit-test runner

**Files:**
- Create: `src/scripts/characters/skins.ts`, `src/scripts/characters/characters.ts`, `src/scripts/characters/Animator.ts`, `tests/Animator.test.ts`
- Modify: `package.json` (add script `"test": "node --experimental-strip-types --test \"tests/**/*.test.ts\""`)

**Interfaces:**
- Produces (`skins.ts`, no asset imports so Node can load it): `SKIN_IDS = [1, 2, 3] as const`, `type SkinId`, `DEFAULT_SKIN: SkinId = 1`, `isSkinId(value: unknown): value is SkinId`, `type AnimationName = "idle" | "run" | "jump" | "fall" | "doubleJump" | "hit"`, `type EffectName = "appearing" | "disappearing"`, `interface AnimationDef { src: string; frames: number; frameSize: number; loop: boolean }`, `type SkinSheets = Record<AnimationName, AnimationDef>`, `type EffectSheets = Record<EffectName, AnimationDef>`.
- Produces (`characters.ts`, imports the PNGs): `characters: Record<SkinId, SkinSheets>`, `effects: EffectSheets`. Frame data per Global Constraints; jump and fall are `loop: true` (single frame).
- Produces (`Animator.ts`): `new Animator(options: { skins: Record<SkinId, SkinSheets>; effects: EffectSheets; skin: SkinId; boxSize: number; dev?: boolean; loadImage?: (src: string) => HTMLImageElement })`, with members `skin: SkinId` (getter), `current: AnimationName | EffectName` (getter, starts `"idle"`), `frame: number` (getter), `done: boolean` (getter), `setSkin(id: SkinId): void`, `play(name: AnimationName | EffectName): void`, `update(advance: boolean): void`, `draw(ctx: CanvasRenderingContext2D, x: number, y: number, facing: "left" | "right"): void`. Test files import with explicit `.ts` extensions (allowed by `allowImportingTsExtensions`) and only `import type` from `skins.ts`.

- [ ] **Step 1: Write the failing tests in `tests/Animator.test.ts`.** Build a `makeSheets(id)` fixture (srcs `skin${id}/${name}`, frame data from Global Constraints), a `fakeLoader()` returning `{ images: Map<string, FakeImage>, loadImage }` where each fake is `{ src, complete: true, naturalWidth: 0, onload: null, onerror: null }` cast to `HTMLImageElement`, and a recording ctx (a `Proxy` pushing `[method, ...args]` to `calls`). Tests, all with `boxSize: 32`:
  - `starts on idle frame 0, not done`; `update(false) never advances`; `update(true) advances one frame`.
  - `looping animation wraps`: 11 advances on idle give `frame === 0`.
  - `one-shot stops and reports done`: `play("hit")`; after 6 advances `frame === 6 && !done`; the 7th advance gives `done` and `frame === 6`; further updates change nothing.
  - `play of the current animation is a no-op` (frame kept); `play of another resets frame and done`.
  - `finished one-shot restarts when played again` (Review Focus 4): finish `hit`, `play("hit")` → `frame === 0 && !done`.
  - `setSkin keeps action and frame` (Review Focus 3): on skin 1 `play("run")`, advance 3, `setSkin(2)` → `current === "run"`, `frame === 3`, and the next `draw` uses the image for `skin2/run`.
  - `draw facing right`: idle frame 0 at (100, 50) → calls equal `[["drawImage", img, 0, 0, 32, 32, 100, 50, 32, 32]]`.
  - `draw facing left flips about the box center`: same call gives `[["save"], ["translate", 116, 0], ["scale", -1, 1], ["drawImage", img, 0, 0, 32, 32, -16, 50, 32, 32], ["restore"]]`.
  - `effects are centered and never flip`: `play("appearing")`, advance 2, draw at (100, 200) facing left → `[["drawImage", img, 192, 0, 96, 96, 68, 168, 96, 96]]`.
  - `draw skips a sheet that has not loaded` (`complete = false` → no calls, no throw) and `draw skips and logs after onerror` (call `img.onerror()` with `console.error` mocked: logged once naming the src, no draw calls).
  - `preloads every sheet once`: fixture gives `images.size === 20`.
  - `unknown name`: `dev: true` throws; `dev: false` logs via `console.error` and keeps the current animation.
  - `dev width warning`: with `dev: true`, set `naturalWidth = 100` on the idle image and call `onload()` → `console.warn` called once mentioning the src; with `dev: false` no warning.
- [ ] **Step 2: Add the `test` script, run `npm test`.** Expected: FAIL (cannot find `Animator.ts`).
- [ ] **Step 3: Implement `skins.ts`, `characters.ts` and `Animator.ts`.** `update(advance)`: when `advance` is false return; looping defs wrap with modulo; one-shots stop at the last frame and set `done` on the advance that would pass it. `play` is a no-op only when `name === current && !done`. Images are cached by `src`; `onerror` marks the image failed and logs `console.error` with the src; `onload` (dev only) warns when `naturalWidth !== frames * frameSize`. Effect defs are looked up first by name, so character and effect names must not collide.
- [ ] **Step 4: Run `npm test`.** Expected: all Animator tests PASS. Then run the type-check from Verification setup; expected exit 0.
- [ ] **Step 5: Commit** `feat: add Animator and character registry` (with attribution lines).

### Task 2: Move Player and its states onto the Animator

**Files:**
- Modify: `src/scripts/objects/Player.ts`, `src/scripts/states/player/{Idling,Running,Jumping,Falling}.ts`

**Interfaces:**
- Consumes: `Animator`, `characters`, `effects`, `DEFAULT_SKIN` from Task 1.
- Produces: `Player.animator: Animator`. Removed: `model`, `frameX`, `maxFrame`, `animateEnd()`, `DEFAULT_MAX_FRAME`, every PNG import in the four state files.

- [ ] **Step 1: In `Player`, construct `this.animator = new Animator({ skins: characters, effects, skin: DEFAULT_SKIN, boxSize: Player.DEFAULT_WIDTH, dev: import.meta.env.DEV })` before `createStates()`** (states call it from `enter()`). `updateAnimation()` becomes `this.animator.update(Game.getState().frameTimer > this.getFrameInterval())`; `draw()` becomes `this.animator.draw(context, this.x, this.y, this.faceDirection)`.
- [ ] **Step 2: In each state, delete the PNG imports and the per-tick `model.src` assignment; `enter()` calls `this.player.animator.play(...)`** with `"idle"`, `"run"`, `"jump"`, `"fall"` and no longer touches `frameX`/`maxFrame`. All transition logic stays exactly as it is.
- [ ] **Step 3: Verify.** Run: `grep -rn "\.model\|frameX\|maxFrame\|animateEnd\|\.png" src/scripts/objects/Player.ts src/scripts/states` Expected: no output. Run the type-check; expected exit 0. Review `Idling.enter()` is the first `enter()` at construction (animator already exists).
- [ ] **Step 4: Commit** `refactor: drive player sprites through Animator`.

### Task 3: Double jump

**Files:**
- Create: `src/scripts/misc/AirJump.ts`, `tests/AirJump.test.ts`, `src/scripts/states/player/DoubleJumping.ts`
- Modify: `src/scripts/states/State.ts` (add `DOUBLE_JUMPING = 4`), `src/scripts/misc/Input.ts`, `src/scripts/objects/Player.ts`, `Jumping.ts`, `Falling.ts`

**Interfaces:**
- Produces (`AirJump.ts`): `new AirJump(maxAirJumps = 1)`; `airJumpsLeft: number` (getter); `update(jumpHeld: boolean, onGround: boolean): void` (call once per tick; computes the press edge and refills on ground); `tryConsume(): boolean` (true only if airborne this tick, a fresh press happened this tick, and a jump is left; consumes both); `reset(): void` (refill, forget held state).
- Produces: `Input.jumpHeld(): boolean` (static; true when `w`, `" "` or `ArrowUp` is in `Input.keys`); `Player.tryAirJump(): boolean`; `DoubleJumping` state (`jumpPower = 18`).

- [ ] **Step 1: Write failing `tests/AirJump.test.ts`** (each a sequence of `update(held, onGround)` calls then `tryConsume()`):
  - `ground jump press never double jumps` (Review Focus 1): `update(true,true)`, then five `update(true,false)`; `tryConsume()` is false after every call.
  - `fresh press in air consumes the jump`: `update(false,false)`, `update(true,false)` → `true`, then `false` again, `airJumpsLeft === 0`.
  - `release then press again after a ground jump`: `update(true,true)`, `update(false,false)`, `update(true,false)` → `true`.
  - `only one per airtime, refilled on landing`: consume; `update(false,false)`, `update(true,false)` → `false`; `update(false,true)`; `update(false,false)`, `update(true,false)` → `true`.
  - `walking off a ledge keeps the jump`: `update(false,true)`, `update(false,false)`, `update(true,false)` → `true`.
  - `tryConsume on the ground is false` even right after a press.
  - `reset refills`; `maxAirJumps = 2 allows two presses`.
- [ ] **Step 2: Run `npm test`.** Expected: FAIL (module missing).
- [ ] **Step 3: Implement `AirJump`** with fields for remaining count, previous held, press-this-tick and grounded-this-tick; tests determine the rest. Run `npm test`; Expected: PASS.
- [ ] **Step 4: Wire it in.** `Player` owns `airJump = new AirJump()`; `handleMovement()` calls `this.airJump.update(Input.jumpHeld(), this.onGround())` first (before `currentState.handleInput`); `tryAirJump()` consumes and, on success, does `setState(states.DOUBLE_JUMPING)`; `respawn()` calls `airJump.reset()`. Add `DoubleJumping` to the enum and `createStates()` at index 4: `enter()` sets `player.vy = -jumpPower` (absolute, replacing downward speed) and plays `"doubleJump"`; `handleInput()` goes to `FALLING` when `vy > weight`. `Jumping.handleInput` and `Falling.handleInput` call `if (this.player.tryAirJump()) return;` (Falling only after its on-ground check). `Player.onCollision` treats `"DOUBLE_JUMPING"` like `"JUMPING"` for the head-bump → Falling rule.
- [ ] **Step 5: Type-check; Expected exit 0.** `npm test` still PASS.
- [ ] **Step 6: Commit** `feat: add double jump`.

### Task 4: Hit state and debug button

**Files:**
- Create: `src/scripts/states/player/Hit.ts`
- Modify: `State.ts` (add `HIT = 5`; add `locksControls: boolean = false` to `State`), `Player.ts`, `src/engine.ts`, `src/App.tsx`

**Interfaces:**
- Produces: `Player.hit(): void`, `Player.controlsLocked: boolean` (getter → `currentState.locksControls`), `useEngine().hit(): void`.

- [ ] **Step 1: `Hit` state** (index 5): constructor sets `locksControls = true`; `enter()` plays `"hit"`; `handleInput()` waits for `animator.done`, then `setState(player.onGround() ? states.IDLING : states.FALLING)`.
- [ ] **Step 2: `Player.hit()`** returns early when `currentState.state === "HIT"`, otherwise `setState(states.HIT)`. In `handleMovement()`, after `currentState.handleInput`, when `controlsLocked` set `speed = 0` and skip reading keys (facing unchanged); gravity in `updatePhysics()` still runs.
- [ ] **Step 3: `useEngine` returns `hit() { Game.player.hit(); }`; `App.tsx` adds a **Hit** button after Re-spawn.**
- [ ] **Step 4: Type-check scripts; review `engine.ts`/`App.tsx` by eye** (imports used, `type="button"`). Commit `feat: add hit state with debug button`.

### Task 5: Skin selection

**Files:**
- Create: `src/scripts/characters/skinStorage.ts`, `tests/skinStorage.test.ts`
- Modify: `Player.ts`, `src/scripts/engines/Game.ts`, `src/engine.ts`, `src/App.tsx`, `src/App.css`

**Interfaces:**
- Produces: `SKIN_STORAGE_KEY = "overtime.skin"`, `loadSkin(storage?: Pick<Storage, "getItem">): SkinId`, `saveSkin(id: SkinId, storage?: Pick<Storage, "setItem">): void`; `PlayerConfig.skin?: SkinId`; `useEngine()` additionally returns `skin: SkinId` and `setSkin(id: SkinId): void`.

- [ ] **Step 1: Write failing `tests/skinStorage.test.ts`** with fake storages: `null` → 1; `"2"` → 2; `"3"` → 3; each of `"0"`, `"4"`, `"abc"`, `""`, `" 2"`, `"2.5"` → 1 (Review Focus 2); `getItem` throwing → 1; `loadSkin()` with no argument returns a valid `SkinId` in Node where no `localStorage` exists; `saveSkin(3, fake)` calls `setItem("overtime.skin", "3")`; `saveSkin` with a throwing `setItem` does not throw.
- [ ] **Step 2: Run `npm test`; Expected: FAIL. Implement** (default storage resolved inside the try block via `globalThis.localStorage`; match only the exact strings). **Run `npm test`; Expected: PASS.**
- [ ] **Step 3: Wire it.** `Player` passes `config.skin ?? DEFAULT_SKIN` to its `Animator`; `Game` constructs the player with `skin: loadSkin()`. `useEngine` keeps `const [skin, setSkinState] = useState<SkinId>(() => loadSkin())`; `setSkin(id)` calls `Game.player?.animator.setSkin(id)`, `saveSkin(id)`, `setSkinState(id)`. `App.tsx` renders `SKIN_IDS.map` buttons labelled `Skin {id}` with `aria-pressed={skin === id}` and `className="active"` on the selected one; `App.css` adds `#ui-overlay button.active` (bold plus a visible outline).
- [ ] **Step 4: Type-check scripts, `npm test`, review `engine.ts`/`App.tsx` by eye. Commit** `feat: add skin selection with persistence`.

### Task 6: Spawn and respawn flow

**Files:**
- Create: `src/scripts/states/player/Disappearing.ts`, `Appearing.ts`
- Modify: `State.ts` (add `DISAPPEARING = 6`, `APPEARING = 7`; add `frozen: boolean = false` to `State`), `Player.ts`

**Interfaces:**
- Produces: `Player.frozen: boolean` (getter → `currentState.frozen`), `Player.completeRespawn(): void`. `turnOnCollision` changes from a field to `get turnOnCollision(): boolean { return !this.frozen; }` (verified legal against `GameObject`'s abstract property). `Player.respawn(position, boundaries)` keeps its signature.

- [ ] **Step 1: States.** `Disappearing` and `Appearing` set `frozen = true`. `Disappearing.enter()` plays `"disappearing"`; when `animator.done` its `handleInput()` calls `player.completeRespawn()`. `Appearing.enter()` plays `"appearing"`; when done it does `setState(states.IDLING)`. Add both to `createStates()` at indices 6 and 7 (indices 4 and 5 are Task 3 and 4 states).
- [ ] **Step 2: `Player.respawn(position, boundaries)`** returns immediately when `frozen`; otherwise stores `pendingSpawn = { position, boundaries }` and enters `DISAPPEARING` where the player stands (works mid-air, and during `HIT`). `completeRespawn()` applies the pending spawn using the existing reset logic (`initializeBoundaries`, `initializePosition`, `vy = 0`, `speed = 0`, `airJump.reset()`), clears `pendingSpawn`, then `setState(states.APPEARING)`.
- [ ] **Step 3: Frozen ticks.** At the top of `update()`: when `frozen`, run `currentState.handleInput(Input.keys)`, `updateAnimation()`, `draw(context)` and return (no movement, physics or boundary validation). The constructor starts in `states.APPEARING` instead of `states[0]`. `hit()` also returns early when `frozen`.
- [ ] **Step 4: Verify collision handling.** Re-read `Collision.update` and confirm a target or cursor with `turnOnCollision === false` is skipped (it is: both `if (target.turnOnCollision)` and `if (!cursor.turnOnCollision) return false`). Type-check scripts; `npm test`.
- [ ] **Step 5: Commit** `feat: add appear and disappear on spawn and respawn`.

### Task 7: Docs, final checks, pull request

**Files:**
- Modify: `README.md`

- [ ] **Step 1: README.** Document the character system (skins, actions, how to add a skin in `characters.ts`), the new Hit and Skin buttons, the double-jump control (press jump again in the air), `npm test` (needs Node 22.6+), and update the project structure listing for `characters/`, `tests/` and `states/player/`.
- [ ] **Step 2: Final checks.** `npm test` (all PASS); type-check (exit 0); `grep -rn "\.png" src/scripts/states src/scripts/objects/Player.ts` (no output); `git status` clean except intended files; confirm the enum indices and `createStates()` order match.
- [ ] **Step 3: Push and open the PR** against `master` with `gh pr create`. Body: summary, the refinements list above, what could not be verified here (`npm run build`, `npm run lint`, running the game), and this manual checklist: skins 1-3 on idle/run/jump/fall; facing left and right; double jump, including holding Space through the first jump (must not fire) and release-then-press (must fire once per airtime); Hit button on ground and mid-air, controls locked until it ends; Re-spawn on ground, mid-air, spammed, and during a Hit (no stuck frozen state, one teleport); spawn effect on page load; skin choice survives a refresh; effect sprite is centered on the player (adjust the -32 offset in `Animator` if the art is off-center).
- [ ] **Step 4: Commit** `docs: document the character system`, push, and open the PR.
