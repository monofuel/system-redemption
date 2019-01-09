import { FiniteMap, TileHeights, Unit, Direction, UnitDefinition, GameColors, UnitType } from '../types/SR';
import { GameState } from './state';

// ----------------------
// UI events

export enum EditorSelection {
  raiselower = 'raiselower',
  clear = 'clear',
  lowerWater = 'lowerWater',
  raiseWater = 'raiseWater',
  newUnit = 'newUnit'
}
export interface EditorMode {
  kind: 'editorMode';
  selection: EditorSelection;
  user?: GameColors;
  unitType?: UnitType;
}

export interface ToggleLogViewer {
  kind: 'toggleLogViewer';
  state: 'open' | 'closed';
}

export interface FrontendEvents {
  editorMode: EditorMode;
  toggleLogViewer: ToggleLogViewer;
}
export type FrontendEventKinds = keyof FrontendEvents;
export type FrontendEvent = FrontendEvents[FrontendEventKinds];

// ----------------------
// server events

export interface NewFiniteMap {
  kind: 'newFiniteMap';
  map: FiniteMap;
}

export const MapEditType = {
  raise: [1, 1, 1, 1] as TileHeights,
  lower: [-1, -1, -1, -1] as TileHeights,
}

export interface MapEdit {
  kind: 'mapEdit';
  // added to the existing tile
  edit: TileHeights;
  x: number;
  y: number;
}

export interface WaterChange {
  kind: 'waterChange';
  amount: number;
}

export interface NewUnit {
  kind: 'newUnit';
  unit: Unit;
}

export interface DefineUnit {
  kind: 'defineUnit';
  unit: UnitDefinition;
}

export interface MoveUnit {
  kind: 'moveUnit';
  uuid: string;
  dir: Direction;
}

export enum GameStage {
  init = 'init', // default state, map still loading
  ready = 'ready', // map ready for players
  running = 'running', // ticking
  done = 'done'
}

export interface GameStageChange {
  kind: 'gameStageChange';
  mode: GameStage;
}

export interface GameTick {
  kind: 'gameTick';
}

// Only for testing
export interface Assertion {
  kind: 'assertion';
  fn: (gameState: GameState) => void;
}

export interface ServerEvents {
  newFiniteMap: NewFiniteMap;
  mapEdit: MapEdit;
  waterChange: WaterChange;
  newUnit: NewUnit;
  moveUnit: MoveUnit;
  assertion: Assertion;
  defineUnit: DefineUnit;
  gameStageChange: GameStageChange;
  gameTick: GameTick;
}
export type ServerEventKinds = keyof ServerEvents;
export type ServerEvent = ServerEvents[ServerEventKinds];

export type EventKinds = ServerEventKinds | FrontendEventKinds;
export type Events = ServerEvents & FrontendEvents;
