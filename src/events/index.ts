import { FiniteMap, TileHeights, Unit, Direction, UnitDefinition } from '../types/SR';
import { GameState } from './state';

// ----------------------
// UI events

export enum EditorSelection {
  raiselower = 'raiselower',
  clear = 'clear',
  lowerWater = 'lowerWater',
  raiseWater = 'raiseWater',
}
export interface EditorMode {
  kind: 'editorMode';
  selection: EditorSelection;
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
}
export type ServerEventKinds = keyof ServerEvents;
export type ServerEvent = ServerEvents[ServerEventKinds];

export type EventKinds = ServerEventKinds | FrontendEventKinds;
export type Events = ServerEvents & FrontendEvents;
