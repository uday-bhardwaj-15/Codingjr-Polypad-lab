import type { CanvasDocument } from '@/components/labs/polylab/canvas/types';

export const STORAGE_INDEX_KEY = 'polylab:index';
export const STORAGE_DOC_PREFIX = 'polylab:canvas:';

export interface CanvasIndexEntry {
  id: string;
  title: string;
  updatedAt: string;
}

// Built-in starter seeds
export const DEFAULT_STARTER_SEEDS: CanvasDocument[] = [
  {
    id: 'fraction_discovery',
    title: 'Fraction Equivalence Explorer',
    version: 1,
    tiles: [
      {
        id: 'f1',
        type: 'fraction-bar',
        x: 100,
        y: 80,
        rotation: 0,
        zIndex: 0,
        width: 320,
        height: 56,
        props: { denominator: 1, count: 1, mode: 'fraction', color: '#E11D48', adjustable: true },
      },
      {
        id: 'f2',
        type: 'fraction-bar',
        x: 100,
        y: 160,
        rotation: 0,
        zIndex: 1,
        width: 320,
        height: 56,
        props: { denominator: 2, count: 1, mode: 'fraction', color: '#EA580C', adjustable: true },
      },
      {
        id: 'f4',
        type: 'fraction-bar',
        x: 100,
        y: 240,
        rotation: 0,
        zIndex: 2,
        width: 320,
        height: 56,
        props: { denominator: 4, count: 2, mode: 'fraction', color: '#0284C7', adjustable: true },
      },
      {
        id: 'fc1',
        type: 'fraction-circle',
        x: 480,
        y: 110,
        rotation: 0,
        zIndex: 3,
        width: 140,
        height: 140,
        props: { denominator: 4, count: 2, mode: 'percentage', radius: 70, color: '#0284C7', adjustable: true },
      },
    ],
    viewport: { x: 0, y: 0, scale: 1 },
    grid: { enabled: true, size: 30, snapToGrid: true, snapToTiles: true, type: 'square' },
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'algebra_balance_starter',
    title: 'Equation Balance Lab',
    version: 1,
    tiles: [
      {
        id: 'scale1',
        type: 'balance-scale',
        x: 120,
        y: 90,
        rotation: 0,
        zIndex: 0,
        width: 300,
        height: 190,
        props: { leftWeight: 6, rightWeight: 6 },
      },
      {
        id: 'alg_x',
        type: 'algebra-tile',
        x: 480,
        y: 110,
        rotation: 0,
        zIndex: 1,
        width: 34,
        height: 96,
        props: { variant: 'x' },
      },
      {
        id: 'alg_x2',
        type: 'algebra-tile',
        x: 540,
        y: 110,
        rotation: 0,
        zIndex: 2,
        width: 96,
        height: 96,
        props: { variant: 'x2' },
      },
    ],
    viewport: { x: 0, y: 0, scale: 1 },
    grid: { enabled: true, size: 30, snapToGrid: true, snapToTiles: true, type: 'square' },
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Initialize starter index and documents in localStorage if first visit.
 */
function ensureStorageInitialized(): void {
  if (typeof window === 'undefined') return;

  const rawIndex = localStorage.getItem(STORAGE_INDEX_KEY);
  if (!rawIndex) {
    const initialIndex: CanvasIndexEntry[] = [];
    DEFAULT_STARTER_SEEDS.forEach((seed) => {
      localStorage.setItem(`${STORAGE_DOC_PREFIX}${seed.id}`, JSON.stringify(seed));
      initialIndex.push({
        id: seed.id,
        title: seed.title,
        updatedAt: seed.updatedAt || new Date().toISOString(),
      });
    });
    localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(initialIndex));
  }
}

/**
 * List all canvases from localStorage index.
 */
export function listCanvases(): CanvasIndexEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    ensureStorageInitialized();
    const raw = localStorage.getItem(STORAGE_INDEX_KEY);
    if (!raw) return [];
    const index: CanvasIndexEntry[] = JSON.parse(raw);
    return index.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (err) {
    console.error('Failed to list canvases from localStorage', err);
    return [];
  }
}

/**
 * Load a canvas document by ID directly from localStorage.
 */
export function loadCanvas(canvasId: string): CanvasDocument | null {
  if (typeof window === 'undefined') return null;

  try {
    ensureStorageInitialized();
    const raw = localStorage.getItem(`${STORAGE_DOC_PREFIX}${canvasId}`);
    if (raw) {
      return JSON.parse(raw);
    }
    // Fallback check against starter seeds
    const seed = DEFAULT_STARTER_SEEDS.find((s) => s.id === canvasId);
    if (seed) {
      localStorage.setItem(`${STORAGE_DOC_PREFIX}${canvasId}`, JSON.stringify(seed));
      return seed;
    }
  } catch (err) {
    console.error(`Failed to load canvas ${canvasId} from localStorage`, err);
  }
  return null;
}

/**
 * Save / autosave a canvas document directly into localStorage.
 */
export function saveCanvas(canvasId: string, doc: CanvasDocument): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const timestamp = new Date().toISOString();
    const updatedDoc: CanvasDocument = {
      ...doc,
      id: canvasId,
      updatedAt: timestamp,
    };

    localStorage.setItem(
      `${STORAGE_DOC_PREFIX}${canvasId}`,
      JSON.stringify(updatedDoc)
    );

    // Update polylab:index
    const rawIndex = localStorage.getItem(STORAGE_INDEX_KEY);
    let index: CanvasIndexEntry[] = rawIndex ? JSON.parse(rawIndex) : [];

    const existingIdx = index.findIndex((item) => item.id === canvasId);
    const entry: CanvasIndexEntry = {
      id: canvasId,
      title: updatedDoc.title || 'Untitled PolyLab Canvas',
      updatedAt: timestamp,
    };

    if (existingIdx >= 0) {
      index[existingIdx] = entry;
    } else {
      index.unshift(entry);
    }

    localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
    return true;
  } catch (err) {
    console.error(`Failed to save canvas ${canvasId} to localStorage`, err);
    return false;
  }
}

/**
 * Create a new canvas in localStorage.
 */
export function createCanvas(
  title: string = 'Untitled PolyLab Canvas',
  initialDoc?: Partial<CanvasDocument>
): string {
  const canvasId = `canvas_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const timestamp = new Date().toISOString();

  const newDoc: CanvasDocument = {
    id: canvasId,
    title,
    version: 1,
    tiles: initialDoc?.tiles || [],
    viewport: initialDoc?.viewport || { x: 0, y: 0, scale: 1 },
    grid: initialDoc?.grid || {
      enabled: true,
      size: 30,
      snapToGrid: true,
      snapToTiles: true,
      type: 'square',
    },
    updatedAt: timestamp,
  };

  saveCanvas(canvasId, newDoc);
  return canvasId;
}

/**
 * Duplicate an existing canvas in localStorage.
 */
export function duplicateCanvas(canvasId: string): string | null {
  const original = loadCanvas(canvasId);
  if (!original) return null;

  const newTitle = `${original.title} (Copy)`;
  return createCanvas(newTitle, original);
}

/**
 * Delete a canvas from localStorage and index.
 */
export function deleteCanvas(canvasId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(`${STORAGE_DOC_PREFIX}${canvasId}`);
    const rawIndex = localStorage.getItem(STORAGE_INDEX_KEY);
    if (rawIndex) {
      const index: CanvasIndexEntry[] = JSON.parse(rawIndex);
      const filtered = index.filter((item) => item.id !== canvasId);
      localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(filtered));
    }
    return true;
  } catch (err) {
    console.error(`Failed to delete canvas ${canvasId} from localStorage`, err);
    return false;
  }
}
