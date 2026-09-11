export type TileType =
  | 'fraction-bar'
  | 'fraction-circle'
  | 'number-card'
  | 'number-bar'
  | 'number-line'
  | 'ten-frame'
  | 'base10-cube'
  | 'prime-circles'
  | 'dot-arrangement'
  | 'number-grid'
  | 'polygon'
  | 'tangram'
  | 'polyomino'
  | 'solid-3d'
  | 'aperiodic-tile'
  | 'pentagon-tile'
  | 'linkage'
  | 'utensil'
  | 'pattern-art'
  | 'algebra-tile'
  | 'balance-scale'
  | 'function-machine'
  | 'coordinate-axes'
  | 'variable-slider'
  | 'dice'
  | 'polyhedral-dice'
  | 'spinner'
  | 'coin'
  | 'playing-card'
  | 'chart'
  | 'clock';

export type CategoryType =
  | 'fractions'
  | 'numbers'
  | 'geometry'
  | 'algebra'
  | 'probability'
  | 'applications';

export type ToolType = 'select' | 'pan' | 'pen' | 'eraser';

export type GridType = 'square' | 'dot' | 'isometric' | 'none';

export interface GridSettings {
  enabled: boolean;
  size: number;
  snapToGrid: boolean;
  snapToTiles: boolean;
  type: GridType;
}

export interface ViewportState {
  x: number;
  y: number;
  scale: number;
}

export interface TileInstance {
  id: string;
  type: TileType;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  width?: number;
  height?: number;
  isLocked?: boolean;
  isFlipped?: boolean;
  props: Record<string, any>;
}

export interface CanvasDocument {
  id: string;
  title: string;
  version: number;
  tiles: TileInstance[];
  viewport: ViewportState;
  grid?: GridSettings;
  updatedAt?: string;
}

export interface SelectionBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TileDefinition {
  type: TileType;
  name: string;
  category: CategoryType;
  icon: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultProps: Record<string, any>;
}
