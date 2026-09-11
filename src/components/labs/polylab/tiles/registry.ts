import React from 'react';
import type { TileType, CategoryType } from '../canvas/types';
import { FractionBar } from './fraction/FractionBar';
import { FractionCircle } from './fraction/FractionCircle';
import { NumberCard } from './numbers/NumberCard';
import { NumberBar } from './numbers/NumberBar';
import { NumberLine } from './numbers/NumberLine';
import { TenFrame } from './numbers/TenFrame';
import { Base10Cube } from './numbers/Base10Cube';
import { PrimeFactorCircles } from './numbers/PrimeFactorCircles';
import { DotArrangement } from './numbers/DotArrangement';
import { NumberGrid } from './numbers/NumberGrid';
import { Polygon } from './geometry/Polygon';
import { Tangram } from './geometry/Tangram';
import { Polyomino } from './geometry/Polyomino';
import { Solid3D } from './geometry/Solid3D';
import { AperiodicTile } from './geometry/AperiodicTile';
import { PentagonTile } from './geometry/PentagonTile';
import { Linkage } from './geometry/Linkage';
import { Utensil } from './geometry/Utensil';
import { PatternArt } from './geometry/PatternArt';
import { AlgebraTile } from './algebra/AlgebraTile';
import { BalanceScale } from './algebra/BalanceScale';
import { FunctionMachine } from './algebra/FunctionMachine';
import { CoordinateAxes } from './algebra/CoordinateAxes';
import { VariableSlider } from './algebra/VariableSlider';
import { Dice } from './probability/Dice';
import { PolyhedralDice } from './probability/PolyhedralDice';
import { Spinner } from './probability/Spinner';
import { Coin } from './probability/Coin';
import { PlayingCard } from './probability/PlayingCard';
import { ChartTile } from './probability/ChartTile';
import { Clock } from './applications/Clock';
import { Chess } from './applications/Chess';

export interface TileRegistryEntry {
  type: TileType;
  name: string;
  category: CategoryType;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultProps: Record<string, any>;
  component: React.ComponentType<any>;
}

export const TILE_REGISTRY: Record<TileType, TileRegistryEntry> = {
  'fraction-bar': {
    type: 'fraction-bar',
    name: 'Fraction Bar',
    category: 'fractions',
    description: 'Rectangular strip divided into equal segments with click shading',
    defaultWidth: 240,
    defaultHeight: 56,
    defaultProps: {
      denominator: 4,
      count: 1,
      mode: 'fraction',
      adjustable: true,
    },
    component: FractionBar,
  },
  'fraction-circle': {
    type: 'fraction-circle',
    name: 'Fraction Circle',
    category: 'fractions',
    description: 'Radial pie chart fraction with trigonometric slice wedges',
    defaultWidth: 128,
    defaultHeight: 128,
    defaultProps: {
      denominator: 4,
      count: 1,
      mode: 'fraction',
      radius: 64,
      adjustable: true,
    },
    component: FractionCircle,
  },
  'number-card': {
    type: 'number-card',
    name: 'Number Card',
    category: 'numbers',
    description: 'Digit, operator (+, -, ×, ÷, =) or variable tile',
    defaultWidth: 54,
    defaultHeight: 64,
    defaultProps: {
      value: 1,
      variant: 'digit',
    },
    component: NumberCard,
  },
  'number-bar': {
    type: 'number-bar',
    name: 'Cuisenaire Rod',
    category: 'numbers',
    description: 'Color-coded arithmetic number rod from 1 to 10',
    defaultWidth: 150,
    defaultHeight: 36,
    defaultProps: {
      value: 5,
      unitWidth: 30,
      showNumbers: true,
      showTicks: true,
    },
    component: NumberBar,
  },
  'number-line': {
    type: 'number-line',
    name: 'Number Line',
    category: 'numbers',
    description: 'Interactive axis line with customizable min, max, and step ticks',
    defaultWidth: 360,
    defaultHeight: 80,
    defaultProps: {
      min: 0,
      max: 10,
      step: 1,
    },
    component: NumberLine,
  },
  'ten-frame': {
    type: 'ten-frame',
    name: 'Ten-Frame',
    category: 'numbers',
    description: '2x5 grid counter frame for subitizing and early addition',
    defaultWidth: 180,
    defaultHeight: 72,
    defaultProps: {
      count: 3,
      cellSize: 36,
      counterColor: '#E11D48',
    },
    component: TenFrame,
  },
  'base10-cube': {
    type: 'base10-cube',
    name: 'Base 10 3D Blocks',
    category: 'numbers',
    description: '3D Isometric Thousand Cube (1000), Hundred Flat (100), Ten Rod, Unit Cube & Connecting Cubes',
    defaultWidth: 140,
    defaultHeight: 140,
    defaultProps: {
      blockType: 'thousand-cube',
      color: '#7C3AED',
      size: 140,
    },
    component: Base10Cube,
  },
  'prime-circles': {
    type: 'prime-circles',
    name: 'Prime Factor Circles',
    category: 'numbers',
    description: 'Interactive factor decomposition rings and prime factorization nodes',
    defaultWidth: 160,
    defaultHeight: 160,
    defaultProps: {
      value: 12,
    },
    component: PrimeFactorCircles,
  },
  'dot-arrangement': {
    type: 'dot-arrangement',
    name: 'Dot Arrangements',
    category: 'numbers',
    description: 'Subitizing patterns, arrays, and triangular number dot grids',
    defaultWidth: 160,
    defaultHeight: 130,
    defaultProps: {
      pattern: 'array',
      rows: 3,
      cols: 4,
    },
    component: DotArrangement,
  },
  'number-grid': {
    type: 'number-grid',
    name: '100 Number Chart',
    category: 'numbers',
    description: 'Interactive 1-100 chart with multiple highlights and prime filters',
    defaultWidth: 240,
    defaultHeight: 260,
    defaultProps: {
      maxNumber: 100,
      filter: 'none',
    },
    component: NumberGrid,
  },
  'polygon': {
    type: 'polygon',
    name: 'Polygon',
    category: 'geometry',
    description: 'Regular geometric polygon (triangle, square, pentagon, hexagon, octagon)',
    defaultWidth: 100,
    defaultHeight: 100,
    defaultProps: {
      sides: 6,
      radius: 50,
      fillColor: '#10B981',
      strokeColor: '#047857',
    },
    component: Polygon,
  },
  'tangram': {
    type: 'tangram',
    name: 'Tangram',
    category: 'geometry',
    description: '7-piece classic dissection geometric puzzle piece',
    defaultWidth: 128,
    defaultHeight: 64,
    defaultProps: {
      pieceType: 'large-triangle-1',
      unitSize: 32,
    },
    component: Tangram,
  },
  'polyomino': {
    type: 'polyomino',
    name: 'Polyomino & Tetromino',
    category: 'geometry',
    description: 'Multi-color Pentominoes & Tetrominoes dissection puzzles',
    defaultWidth: 240,
    defaultHeight: 120,
    defaultProps: {
      variant: 'pentominoes-set',
    },
    component: Polyomino,
  },
  'solid-3d': {
    type: 'solid-3d',
    name: '3D Solid Geometry',
    category: 'geometry',
    description: 'True 3D isometric Cube, Cylinder, Cone, Sphere, Pyramid & Prisms',
    defaultWidth: 120,
    defaultHeight: 120,
    defaultProps: {
      solidType: 'cube',
      color: '#8B5CF6',
      size: 120,
    },
    component: Solid3D,
  },
  'aperiodic-tile': {
    type: 'aperiodic-tile',
    name: 'Aperiodic Tiles',
    category: 'geometry',
    description: 'Penrose Kites, Darts, Rhombi & Einstein Hat Monotile',
    defaultWidth: 90,
    defaultHeight: 90,
    defaultProps: {
      variant: 'penrose-kite',
    },
    component: AperiodicTile,
  },
  'pentagon-tile': {
    type: 'pentagon-tile',
    name: 'Pentagonal Tessellations',
    category: 'geometry',
    description: 'Cairo pentagons and Hirschhorn pentagonal tiling tiles',
    defaultWidth: 90,
    defaultHeight: 90,
    defaultProps: {
      variant: 'cairo-pentagon',
    },
    component: PentagonTile,
  },
  'linkage': {
    type: 'linkage',
    name: 'Linkages & Mechanisms',
    category: 'geometry',
    description: '4-bar linkage and mechanical hinge joint linkages',
    defaultWidth: 180,
    defaultHeight: 140,
    defaultProps: {
      linkageType: 'four-bar',
      angle: 45,
    },
    component: Linkage,
  },
  'utensil': {
    type: 'utensil',
    name: 'Geometry Utensils',
    category: 'geometry',
    description: '180° Protractor, Drafting Compass, and Precision Ruler',
    defaultWidth: 200,
    defaultHeight: 110,
    defaultProps: {
      utensilType: 'protractor',
    },
    component: Utensil,
  },
  'pattern-art': {
    type: 'pattern-art',
    name: 'Patterns & Geometric Art',
    category: 'geometry',
    description: 'Mandala stars, Islamic rosettes, and generative art inside shapes',
    defaultWidth: 130,
    defaultHeight: 130,
    defaultProps: {
      artType: 'mandala-star',
      seed: 0,
    },
    component: PatternArt,
  },
  'algebra-tile': {
    type: 'algebra-tile',
    name: 'Algebra Tile',
    category: 'algebra',
    description: 'Standard algebra manipulatives for 1, x, x², y, y², and xy',
    defaultWidth: 34,
    defaultHeight: 96,
    defaultProps: {
      variant: 'x',
    },
    component: AlgebraTile,
  },
  'balance-scale': {
    type: 'balance-scale',
    name: 'Balance Scale',
    category: 'algebra',
    description: 'Interactive two-pan balance scale with live equation equilibrium tilt',
    defaultWidth: 280,
    defaultHeight: 180,
    defaultProps: {
      leftWeight: 5,
      rightWeight: 5,
    },
    component: BalanceScale,
  },
  'function-machine': {
    type: 'function-machine',
    name: 'Function Machine',
    category: 'algebra',
    description: 'Interactive Input -> Rule -> Output function processing machine',
    defaultWidth: 220,
    defaultHeight: 140,
    defaultProps: {
      inputVal: 4,
      rule: '× 3 + 2',
    },
    component: FunctionMachine,
  },
  'coordinate-axes': {
    type: 'coordinate-axes',
    name: 'Coordinate Axes & Tables',
    category: 'algebra',
    description: 'Cartesian coordinate grid with plotted points and function table',
    defaultWidth: 340,
    defaultHeight: 240,
    defaultProps: {
      showTable: true,
      showLine: true,
    },
    component: CoordinateAxes,
  },
  'variable-slider': {
    type: 'variable-slider',
    name: 'Variable Slider',
    category: 'algebra',
    description: 'Dynamic variable parameter slider (a, b, c, x, y)',
    defaultWidth: 240,
    defaultHeight: 70,
    defaultProps: {
      variableName: 'a',
      value: 5,
      min: 0,
      max: 10,
      step: 1,
    },
    component: VariableSlider,
  },
  'dice': {
    type: 'dice',
    name: 'Standard Dice',
    category: 'probability',
    description: 'Rolling 6-sided dice with animated roll physics',
    defaultWidth: 64,
    defaultHeight: 64,
    defaultProps: {
      value: 1,
      sides: 6,
      color: '#E11D48',
    },
    component: Dice,
  },
  'polyhedral-dice': {
    type: 'polyhedral-dice',
    name: 'Polyhedral & Non-Transitive Dice',
    category: 'probability',
    description: 'D4, D8, D10, D12, D20 and Efron Non-transitive Dice (A, B, C, D)',
    defaultWidth: 70,
    defaultHeight: 70,
    defaultProps: {
      diceType: 'D20',
      value: 20,
      size: 70,
    },
    component: PolyhedralDice,
  },
  'spinner': {
    type: 'spinner',
    name: 'Probability Spinner',
    category: 'probability',
    description: 'Customizable sector spinner with physics spin action',
    defaultWidth: 128,
    defaultHeight: 128,
    defaultProps: {
      sectors: 4,
      needleAngle: 0,
      radius: 64,
    },
    component: Spinner,
  },
  'coin': {
    type: 'coin',
    name: 'Coin Flip',
    category: 'probability',
    description: 'Gold coin with animated heads/tails flip',
    defaultWidth: 64,
    defaultHeight: 64,
    defaultProps: {
      side: 'heads',
      radius: 32,
    },
    component: Coin,
  },
  'playing-card': {
    type: 'playing-card',
    name: 'Playing Card',
    category: 'probability',
    description: 'Full 52-card deck (Spades, Hearts, Diamonds, Clubs) with flip animation',
    defaultWidth: 64,
    defaultHeight: 90,
    defaultProps: {
      suit: '♠',
      rank: 'A',
      isFaceUp: true,
    },
    component: PlayingCard,
  },
  'chart': {
    type: 'chart',
    name: 'Charts & Statistics',
    category: 'probability',
    description: 'Interactive Bar Charts, Line Charts, Frequency & Tally Tables, and Box Plots',
    defaultWidth: 280,
    defaultHeight: 200,
    defaultProps: {
      variant: 'bar-chart',
      title: 'Bar Chart',
    },
    component: ChartTile,
  },
  'clock': {
    type: 'clock',
    name: 'Analog Clock',
    category: 'applications',
    description: 'Interactive gear-synchronized clock with digital display',
    defaultWidth: 140,
    defaultHeight: 170,
    defaultProps: {
      hours: 10,
      minutes: 10,
      radius: 70,
      showDigital: true,
    },
    component: Clock,
  },
  'chess': {
    type: 'chess',
    name: 'Chess',
    category: 'applications',
    description: 'Full 8×8 chessboard with all pieces in starting position, or individual chess pieces',
    defaultWidth: 328,
    defaultHeight: 328,
    defaultProps: {
      variant: 'board',
    },
    component: Chess,
  },
};

export const CATEGORIES: Array<{
  id: CategoryType;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    id: 'fractions',
    label: 'Fractions',
    description: 'Bars, circles, percentages & decimals',
    icon: 'PieChart',
  },
  {
    id: 'numbers',
    label: 'Numbers',
    description: 'Cards, Lines, Primes, Dots, 100-Chart & 3D Blocks',
    icon: 'Hash',
  },
  {
    id: 'geometry',
    label: 'Geometry',
    description: 'Polygons, Aperiodic, Pentagons, Linkages, Utensils & Patterns/Art',
    icon: 'Shapes',
  },
  {
    id: 'algebra',
    label: 'Algebra',
    description: 'Tiles, Function Machines, Coordinate Axes & Variable Sliders',
    icon: 'Scale',
  },
  {
    id: 'probability',
    label: 'Probability',
    description: 'Charts, Cards, Polyhedral & Non-transitive Dice, Spinners',
    icon: 'Dices',
  },
  {
    id: 'applications',
    label: 'Applications',
    description: 'Clocks, coordinates & real-world tools',
    icon: 'Clock',
  },
];

export function getTilesByCategory(category: CategoryType): TileRegistryEntry[] {
  return Object.values(TILE_REGISTRY).filter((entry) => entry.category === category);
}
