import { create } from 'zustand';
import type {
  TileInstance,
  CanvasDocument,
  ViewportState,
  GridSettings,
  ToolType,
} from './types';

export interface CanvasState {
  // Document metadata
  canvasId: string;
  title: string;
  isDirty: boolean;
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSavedAt: Date | null;

  // Canvas objects
  tiles: Record<string, TileInstance>;
  tileOrder: string[]; // Order of z-indexes from back to front
  selectedIds: string[];

  // Viewport & Environment
  viewport: ViewportState;
  grid: GridSettings;
  tool: ToolType;

  // History for Undo/Redo
  history: Array<{ tiles: Record<string, TileInstance>; tileOrder: string[] }>;
  historyIndex: number;

  // Actions
  setCanvasId: (id: string) => void;
  setTitle: (title: string) => void;
  setSaveStatus: (status: 'saved' | 'saving' | 'unsaved' | 'error') => void;

  // Tile CRUD
  addTile: (tile: Partial<TileInstance> & { type: TileInstance['type'] }) => string;
  updateTile: (id: string, patch: Partial<TileInstance>, recordHistory?: boolean) => void;
  updateTileProps: (id: string, propPatch: Record<string, any>, recordHistory?: boolean) => void;
  removeTile: (id: string) => void;
  removeSelected: () => void;
  duplicateSelected: () => void;
  clearCanvas: () => void;

  // Selection
  setSelection: (ids: string[]) => void;
  toggleSelection: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Layer ordering
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;

  // Viewport & Tools
  setViewport: (patch: Partial<ViewportState>) => void;
  resetViewport: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setGrid: (patch: Partial<GridSettings>) => void;
  setTool: (tool: ToolType) => void;

  // Document load & export
  loadCanvas: (doc: CanvasDocument) => void;
  getCanvasDocument: () => CanvasDocument;

  // Undo / Redo
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const DEFAULT_GRID: GridSettings = {
  enabled: true,
  size: 30,
  snapToGrid: true,
  snapToTiles: true,
  type: 'square',
};

const DEFAULT_VIEWPORT: ViewportState = {
  x: 0,
  y: 0,
  scale: 1,
};

const MAX_HISTORY = 40;

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvasId: 'new',
  title: 'Untitled PolyLab Canvas',
  isDirty: false,
  saveStatus: 'saved',
  lastSavedAt: null,

  tiles: {},
  tileOrder: [],
  selectedIds: [],

  viewport: DEFAULT_VIEWPORT,
  grid: DEFAULT_GRID,
  tool: 'select',

  history: [{ tiles: {}, tileOrder: [] }],
  historyIndex: 0,

  setCanvasId: (id) => set({ canvasId: id }),
  setTitle: (title) => set({ title, isDirty: true, saveStatus: 'unsaved' }),
  setSaveStatus: (status) => set({
    saveStatus: status,
    lastSavedAt: status === 'saved' ? new Date() : get().lastSavedAt,
    isDirty: status !== 'saved',
  }),

  pushHistory: () => {
    const { tiles, tileOrder, history, historyIndex } = get();
    // Clone tiles state
    const currentSnapshot = {
      tiles: JSON.parse(JSON.stringify(tiles)),
      tileOrder: [...tileOrder],
    };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentSnapshot);

    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  addTile: (tileData) => {
    const id = tileData.id || `tile_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newTile: TileInstance = {
      id,
      type: tileData.type,
      x: tileData.x ?? 100,
      y: tileData.y ?? 100,
      rotation: tileData.rotation ?? 0,
      zIndex: tileData.zIndex ?? get().tileOrder.length,
      width: tileData.width ?? 120,
      height: tileData.height ?? 80,
      isLocked: tileData.isLocked ?? false,
      isFlipped: tileData.isFlipped ?? false,
      props: tileData.props ?? {},
    };

    set((state) => ({
      tiles: { ...state.tiles, [id]: newTile },
      tileOrder: [...state.tileOrder, id],
      selectedIds: [id],
    }));

    get().pushHistory();
    return id;
  },

  updateTile: (id, patch, recordHistory = true) => {
    const currentTile = get().tiles[id];
    if (!currentTile) return;

    set((state) => ({
      tiles: {
        ...state.tiles,
        [id]: { ...currentTile, ...patch },
      },
    }));

    if (recordHistory) {
      get().pushHistory();
    } else {
      set({ isDirty: true, saveStatus: 'unsaved' });
    }
  },

  updateTileProps: (id, propPatch, recordHistory = true) => {
    const currentTile = get().tiles[id];
    if (!currentTile) return;

    set((state) => ({
      tiles: {
        ...state.tiles,
        [id]: {
          ...currentTile,
          props: { ...currentTile.props, ...propPatch },
        },
      },
    }));

    if (recordHistory) {
      get().pushHistory();
    } else {
      set({ isDirty: true, saveStatus: 'unsaved' });
    }
  },

  removeTile: (id) => {
    set((state) => {
      const nextTiles = { ...state.tiles };
      delete nextTiles[id];
      return {
        tiles: nextTiles,
        tileOrder: state.tileOrder.filter((tId) => tId !== id),
        selectedIds: state.selectedIds.filter((sId) => sId !== id),
      };
    });
    get().pushHistory();
  },

  removeSelected: () => {
    const { selectedIds, tiles, tileOrder } = get();
    if (selectedIds.length === 0) return;

    const nextTiles = { ...tiles };
    selectedIds.forEach((id) => {
      delete nextTiles[id];
    });

    set({
      tiles: nextTiles,
      tileOrder: tileOrder.filter((id) => !selectedIds.includes(id)),
      selectedIds: [],
    });
    get().pushHistory();
  },

  duplicateSelected: () => {
    const { selectedIds, tiles, tileOrder } = get();
    if (selectedIds.length === 0) return;

    const newTiles: Record<string, TileInstance> = {};
    const newIds: string[] = [];

    selectedIds.forEach((id) => {
      const source = tiles[id];
      if (!source) return;
      const newId = `tile_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      newTiles[newId] = {
        ...JSON.parse(JSON.stringify(source)),
        id: newId,
        x: source.x + 30,
        y: source.y + 30,
      };
      newIds.push(newId);
    });

    set((state) => ({
      tiles: { ...state.tiles, ...newTiles },
      tileOrder: [...state.tileOrder, ...newIds],
      selectedIds: newIds,
    }));
    get().pushHistory();
  },

  clearCanvas: () => {
    set({
      tiles: {},
      tileOrder: [],
      selectedIds: [],
    });
    get().pushHistory();
  },

  setSelection: (ids) => set({ selectedIds: ids }),

  toggleSelection: (id, multi = false) => {
    set((state) => {
      if (!multi) {
        return { selectedIds: [id] };
      }
      if (state.selectedIds.includes(id)) {
        return { selectedIds: state.selectedIds.filter((i) => i !== id) };
      }
      return { selectedIds: [...state.selectedIds, id] };
    });
  },

  clearSelection: () => set({ selectedIds: [] }),

  selectAll: () => set((state) => ({ selectedIds: [...state.tileOrder] })),

  bringToFront: (id) => {
    set((state) => ({
      tileOrder: [...state.tileOrder.filter((i) => i !== id), id],
    }));
    get().pushHistory();
  },

  sendToBack: (id) => {
    set((state) => ({
      tileOrder: [id, ...state.tileOrder.filter((i) => i !== id)],
    }));
    get().pushHistory();
  },

  bringForward: (id) => {
    set((state) => {
      const idx = state.tileOrder.indexOf(id);
      if (idx === -1 || idx === state.tileOrder.length - 1) return state;
      const nextOrder = [...state.tileOrder];
      const temp = nextOrder[idx];
      nextOrder[idx] = nextOrder[idx + 1];
      nextOrder[idx + 1] = temp;
      return { tileOrder: nextOrder };
    });
    get().pushHistory();
  },

  sendBackward: (id) => {
    set((state) => {
      const idx = state.tileOrder.indexOf(id);
      if (idx <= 0) return state;
      const nextOrder = [...state.tileOrder];
      const temp = nextOrder[idx];
      nextOrder[idx] = nextOrder[idx - 1];
      nextOrder[idx - 1] = temp;
      return { tileOrder: nextOrder };
    });
    get().pushHistory();
  },

  setViewport: (patch) =>
    set((state) => ({
      viewport: { ...state.viewport, ...patch },
    })),

  resetViewport: () => set({ viewport: DEFAULT_VIEWPORT }),

  zoomIn: () =>
    set((state) => ({
      viewport: {
        ...state.viewport,
        scale: Math.min(3.5, Number((state.viewport.scale + 0.15).toFixed(2))),
      },
    })),

  zoomOut: () =>
    set((state) => ({
      viewport: {
        ...state.viewport,
        scale: Math.max(0.25, Number((state.viewport.scale - 0.15).toFixed(2))),
      },
    })),

  setGrid: (patch) =>
    set((state) => ({
      grid: { ...state.grid, ...patch },
    })),

  setTool: (tool) => set({ tool }),

  loadCanvas: (doc) => {
    const tilesMap: Record<string, TileInstance> = {};
    const order: string[] = [];

    (doc.tiles || []).forEach((t) => {
      tilesMap[t.id] = t;
      order.push(t.id);
    });

    set({
      canvasId: doc.id || 'canvas_loaded',
      title: doc.title || 'PolyLab Canvas',
      tiles: tilesMap,
      tileOrder: order,
      selectedIds: [],
      viewport: doc.viewport || DEFAULT_VIEWPORT,
      grid: doc.grid || DEFAULT_GRID,
      isDirty: false,
      saveStatus: 'saved',
      history: [{ tiles: tilesMap, tileOrder: order }],
      historyIndex: 0,
    });
  },

  getCanvasDocument: (): CanvasDocument => {
    const { canvasId, title, tiles, tileOrder, viewport, grid } = get();
    const orderedTiles = tileOrder.map((id) => tiles[id]).filter(Boolean);
    return {
      id: canvasId,
      title,
      version: 1,
      tiles: orderedTiles,
      viewport,
      grid,
      updatedAt: new Date().toISOString(),
    };
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    const snapshot = history[nextIndex];
    set({
      historyIndex: nextIndex,
      tiles: JSON.parse(JSON.stringify(snapshot.tiles)),
      tileOrder: [...snapshot.tileOrder],
      selectedIds: [],
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    const snapshot = history[nextIndex];
    set({
      historyIndex: nextIndex,
      tiles: JSON.parse(JSON.stringify(snapshot.tiles)),
      tileOrder: [...snapshot.tileOrder],
      selectedIds: [],
      isDirty: true,
      saveStatus: 'unsaved',
    });
  },
}));
