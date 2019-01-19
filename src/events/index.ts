import { FiniteMap, TileHeights, Unit, Direction, UnitDefinition, GameColors, UnitType, LocHash } from '../types/SR';
import { GameState } from './state';

// ----------------------
// UI events

export enum EditorSelection {
  raiselower = 'raiselower',
  clear = 'clear',
  lowerWater = 'lowerWater',
  raiseWater = 'raiseWater',
  newUnit = 'newUnit',
  removeUnit = 'removeUnit'
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

export interface HilightUpdate {
  kind: 'hilightUpdate';
  loc?: LocHash;
  color?: number;
  corner?: Array<0 | 1 | 2 | 3>;
}

export interface SelectUnits {
  kind: 'selectUnits',
  uuids: string[],
}

export interface FrontendEvents {
  editorMode: EditorMode;
  toggleLogViewer: ToggleLogViewer;
  hilightUpdate: HilightUpdate;
  selectUnits: SelectUnits;
}
export type FrontendEventKinds = keyof FrontendEvents;
export type FrontendEvent = FrontendEvents[FrontendEventKinds];

export const frontendEventList = ['editorMode', 'toggleLogViewer', 'hilightUpdate', 'selectUnits'];

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
  loc: LocHash;
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

export interface DestroyUnit {
  kind: 'destroyUnit';
  uuid: string;
}

export interface SetDestination {
  kind: 'setDestination';
  uuids: string[];
  dest?: LocHash;
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
// Only for testing
export interface AssertFail {
  kind: 'assertFail';
  event: ServerEvent;
}

export interface DamageUnit {
  kind: 'damageUnit';
  uuid: string;
  amount: number;
  source?: string;
}

export interface SetPath {
  kind: 'setPath';
  uuid: string;
  dest: LocHash;
  path: Direction[];
}

export interface CreateMatchEvent {
  kind: 'createMatch';
  id: string;
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
  assertFail: AssertFail;
  setDestination: SetDestination;
  setPath: SetPath;
  destroyUnit: DestroyUnit;
  createMatch: CreateMatchEvent;
  damageUnit: DamageUnit;
}
export type ServerEventKinds = keyof ServerEvents;
export type ServerEvent = ServerEvents[ServerEventKinds];

export type EventKinds = ServerEventKinds | FrontendEventKinds;
export type Events = ServerEvents & FrontendEvents;
