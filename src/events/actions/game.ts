import { FiniteMap, TileHeights, LocHash, Entity, EntityDefinition, GameStage, Direction, Biomes } from '../../types/SR';
import { GameState } from '../store/game';

export interface NewFiniteMap {
  kind: 'newFiniteMap';
  map: FiniteMap;
}

export const MapEditType = {
  raise: [1, 1, 1, 1] as TileHeights,
  lower: [-1, -1, -1, -1] as TileHeights,
};

export interface MapEdit {
  kind: 'mapEdit';
  // added to the existing tile
  edit: TileHeights;
  biome?: Biomes;
  loc: LocHash;
}

export interface WaterChange {
  kind: 'waterChange';
  amount: number;
}

export interface newEntity {
  kind: 'newEntity';
  unit: Entity;
}

export interface DefineUnit {
  kind: 'defineUnit';
  unit: EntityDefinition;
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
  reason?: string;
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
  newEntity: newEntity;
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
