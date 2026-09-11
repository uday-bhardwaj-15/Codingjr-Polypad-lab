# PRD: Math Manipulatives Lab ("PolyLab") — CodingJr

## 1. Goal

Build an in-house, Next.js-native clone of the *manipulatives* half of Polypad (drag-and-drop
math tiles: fractions, numbers, algebra, geometry, probability) as a reusable **Lab** module
inside CodingJr, following the same pattern as `AngleOfElevationLab`.

We are **not** copying Mathigon/Amplify's Polypad source (their `textbooks` repo is source-visible,
copyright "all rights reserved", no OSS license — do not port their `functions.ts` or assets).
We use only their permissively-licensed utility libs where useful (`@mathigon/euclid` — MIT-style,
verify per-package before adding) and otherwise build tiles from scratch.

## 2. Non-negotiable constraints

- **No Redis, no external cache/session infra.** Each student's canvas is an isolated,
  client-owned document. State lives in the browser (Zustand) and is persisted to our own DB
  (Postgres via Prisma) via a debounced autosave API call. No real-time multi-user sync in v1.
- **Canvas rendering must use a proven library, not a hand-rolled SVG drag engine.**
  Use **Konva.js + react-konva** (MIT licensed, no license key, used in production by
  Meta/Microsoft/Labelbox — verified free for commercial use). Rationale: canvas (bitmap) rendering
  stays fast with hundreds of interactive shapes on screen; a large SVG/DOM tree does not, and that's
  what will hurt with concurrent classroom usage on low-end student laptops/Chromebooks.
- **100 concurrent students is a client-rendering problem, not a server-scaling problem** — the
  canvas itself never touches the server. Server only needs to: serve static Next.js pages/assets,
  and handle lightweight save/load REST calls. Design accordingly — don't over-engineer backend
  infra for this.
- Strict TypeScript, no `any`. Every tile component is pure/props-driven. All math logic
  (fraction arithmetic, decimal/percent conversion, geometry) lives in isolated `*.utils.ts` files
  with unit tests — zero DOM/canvas code inside them.

## 3. Tech stack

- Next.js (App Router), TypeScript strict
- Canvas: `konva` + `react-konva`
- State: `zustand` (sliced stores, no single giant global store)
- Styling: Tailwind (match existing CodingJr design tokens)
- Persistence: Prisma + PostgreSQL (existing stack), JSON column for canvas document
- Testing: Vitest/Jest for `*.utils.ts`, Playwright for one smoke test per tile category later

## 4. Folder structure

```
src/
  app/
    labs/
      polylab/
        page.tsx                    # list/create canvases
        [canvasId]/
          page.tsx                  # loads a saved canvas, renders <PolyLabCanvas/>
    api/
      labs/
        polylab/
          [canvasId]/route.ts       # GET/PUT canvas JSON (debounced client autosave hits this)

  components/
    labs/
      polylab/
        canvas/
          PolyLabStage.tsx          # <Stage>/<Layer> wrapper: pan, zoom, background grid
          SelectionLayer.tsx        # selection box, multi-select, rotate/resize handles
          useCanvasStore.ts         # zustand: tiles[], selectedIds, addTile/updateTile/removeTile
          useUndoRedo.ts            # command-pattern undo/redo stack
          snap.ts                   # grid + point snapping helpers (pure functions)
          types.ts                  # TileInstance, CanvasDocument, etc.

        tiles/
          registry.ts               # TILE_TYPE -> { component, defaultProps, category } map
                                     # single source of truth — sidebar + canvas both read this
          shared/
            TileShell.tsx           # common drag/select/rotate chrome around every tile
            useTileDrag.ts
            palette.ts              # shared color tokens per category

          fraction/                 # <-- MILESTONE 1, build first
            FractionBar.tsx
            FractionCircle.tsx
            FractionModeToggle.tsx  # fraction / percentage / decimal / hidden
            fraction.utils.ts       # pure math: toPercent, toDecimal, sliceAngles, gcd
            fraction.types.ts
            fraction.test.ts
            index.ts

          numbers/
            NumberCard.tsx
            NumberTile.tsx
            NumberBar.tsx
            NumberLine.tsx
            TenFrame.tsx
            ...
          geometry/
            Polygon.tsx
            Tangram.tsx
            Polyomino.tsx
            ...
          algebra/
            AlgebraTile.tsx
            BalanceScale.tsx
            FunctionMachine.tsx
            ...
          probability/
            Dice.tsx
            Spinner.tsx
            Chart.tsx
            ...
          applications/
            Chessboard.tsx
            Clock.tsx
            Domino.tsx
            ...

        sidebar/
          TileSidebar.tsx           # reads registry.ts, groups by category, lazy-loads categories
          TileSidebarItem.tsx

        toolbar/
          Toolbar.tsx                # undo/redo, zoom %, export PNG, clear

      lib/
        persistence/
          useAutosave.ts             # debounce(save, 2000ms) on store change
          polylab.api.ts             # typed fetch wrappers for the API route

  server/
    labs/
      polylab.repository.ts          # Prisma queries, isolated from route handlers

prisma/
  schema.prisma                      # model PolyLabCanvas { id, userId, title, data Json, updatedAt }
```

**Rule:** a new tile = one folder under `tiles/<category>/`, registered in `registry.ts`. Nothing
else needs to change — sidebar and canvas both read the registry, so adding tile #47 never touches
canvas/sidebar code.

## 5. Coding standards

- No `any`; no implicit props — every tile component has an explicit `Props` interface.
- Tile components are **pure** — given the same props they render the same thing. All mutation
  goes through store actions (`updateTile(id, patch)`), never local component state mutating shared data.
- Wrap tile components in `React.memo`; canvas store selectors must be scoped
  (`useCanvasStore(s => s.tiles[id])`, never `useCanvasStore(s => s.tiles)` inside a tile) to avoid
  re-rendering every tile on every drag frame.
- Split Konva layers: one static/background layer (`listening={false}`), one interactive layer.
  Don't put 80 tiles in a single layer if only 1 is being dragged — batch-draw only what changed.
- Math/geometry logic has zero Konva/React imports — 100% unit-testable pure functions.
- Lazy-load tile categories in the sidebar (`next/dynamic`) — a student opening "Fractions" should
  not pay the bundle cost of Chess pieces and Tangram SVGs.
- Every PR/component: accessibility pass — draggable tiles need a keyboard-operable fallback
  (arrow keys to move selected tile) since not all classroom devices are touch/mouse-first.

## 6. Milestone 1 — Fraction Module (build first)

Three pieces, as specced from the reference sidebar:

1. **`FractionBar`** — rectangle divided into `denominator` equal segments, `count` of them shaded.
   Props: `denominator: number`, `count: number`, `mode: 'fraction' | 'percentage' | 'decimal' | 'hidden'`,
   `color: string`, `adjustable?: boolean`, `onChange?: (count, denominator) => void`.
   Behavior: click a segment to toggle shaded/unshaded (updates `count`); drag onto canvas creates
   a `TileInstance`; adjustable bars show a denominator stepper.

2. **`FractionCircle`** — same concept, pie-slice segments instead of a rectangle strip.
   Same props shape as `FractionBar` (reuse `fraction.types.ts`), slice angles computed via
   `sliceAngles(denominator)` pure function using basic trig (no geometry library needed for this).

3. **`FractionModeToggle`** — shared 4-button control (Fraction / % / Decimal / Hidden) that both
   `FractionBar` and `FractionCircle` mount; changing mode just changes the label renderer, not the
   underlying shape geometry. Pure function `formatValue(count, denominator, mode): string`.

Acceptance for Milestone 1: drag a fraction bar and a fraction circle onto the canvas, resize
denominator 1–12, toggle display mode, multiple instances render independently, canvas
autosaves and reloads correctly. This validates the whole tile architecture (registry → sidebar →
drag → store → persistence) end-to-end before scaling out to the other ~80 tiles.

## 7. Full roadmap after Milestone 1 (priority order)

**Tier 1 (fast, static/no-snap-canvas needed):** Number cards/tiles/bars, ten-frame, number line,
dot arrangements, number grid, static polygons, playing cards, dice/coin/spinner, dominoes,
currency notes, clocks, polyhedral/non-transitive dice.

**Tier 2 (formula-driven, light state):** variable sliders, balance scale, function machines,
charts (wrap `recharts`), abacus, coordinate axes/graphing.

**Tier 3 (needs real drag+snap+rotate, do after canvas engine is validated):** tangram, algebra
tiles, pentominoes/tetrominoes, chess (pair with `chess.js` for legal moves), simple logic
circuits.

**Explicitly out of scope for v1:** infinite pan/zoom canvas with full undo/redo + multi-select,
Penrose/aperiodic tiling generation, 3D solid net folding (needs three.js), exploding-dots
simulation, live compass/protractor geometry construction.

## 8. Persistence contract

```ts
model PolyLabCanvas {
  id        String   @id @default(cuid())
  userId    String
  title     String
  data      Json     // { tiles: TileInstance[], version: number }
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Client debounces store changes (2s idle) → `PUT /api/labs/polylab/[canvasId]` with the full
`tiles[]` JSON. No websockets, no Redis, no server-side canvas state — server is a dumb JSON store.
