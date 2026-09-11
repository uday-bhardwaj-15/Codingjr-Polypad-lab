export type FractionDisplayMode = 'fraction' | 'percentage' | 'decimal' | 'hidden';

export interface FractionTileProps {
  id: string;
  denominator: number;
  count: number;
  mode: FractionDisplayMode;
  color: string;
  adjustable?: boolean;
  width?: number;
  height?: number;
  radius?: number;
  showLabels?: boolean;
  onChange?: (count: number, denominator: number) => void;
  onModeChange?: (mode: FractionDisplayMode) => void;
}

export interface SliceAngleInfo {
  index: number;
  startAngleDeg: number;
  endAngleDeg: number;
  startAngleRad: number;
  endAngleRad: number;
  sweepAngleDeg: number;
  midAngleRad: number;
}
