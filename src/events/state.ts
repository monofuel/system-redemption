import {
  MapEdit,
  NewFiniteMap,
  ServerEvent,
  WaterChange,
  FrontendEvent,
  EventKinds,
  EditorMode,
  ToggleLogViewer,
  NewUnit,
  MoveUnit,
  Assertion,
  DefineUnit,
  GameStage,
  GameStageChange,
  GameTick,
  AssertFail,
} from '.';
import _ from 'lodash'
import { FiniteMap, Unit, UnitType, UnitDefinition } from '../types/SR';
import { getTile } from '../planet';

export interface GameState {
  planet?: FiniteMap;
  units: { [key: string]: Unit };
  unitDefinitions: Partial<Record<UnitType, UnitDefinition>>;
  editorMode?: EditorMode;
  stage: {
    tick: number;
    mode: GameStage;
  }
}
const eventApply: Record<
  EventKinds,
  (state: GameState, event: any) => void
> = {
  newFiniteMap: applyNewMap,
  mapEdit: applyMapEdit,
  waterChange: applyWaterChange,
  editorMode: editorModeChange,
  toggleLogViewer: toggleLogViewerChange,
  newUnit: applyNewUnit,
  moveUnit: applyMoveUnit,
  defineUnit: applyUnitDefinition,
  gameStageChange: applyGameStageChange,
  gameTick: applyGameTick,
  assertion: applyAssertion,
  assertFail: applyAssertFail,
};

export function newGameState(): GameState {
  return {
    units: {},
    unitDefinitions: {},
    stage: {
      tick: 0,
      mode: GameStage.init,
    }
  };
}

/**
 * applyEvent applies the given event to the game state
 * event applicators must not append events!
 * 
 * onTick() may be used for on-tick async work that will append new events
 * 
 * @param state game state (mutable)
 * @param event to process
 */

export function applyEvent(state: GameState, event: ServerEvent | FrontendEvent) {
  const applyFN = eventApply[event.kind];
  if (!applyFN) {
    throw new Error(`missing apply function for event ${event.kind}`);
  }
  applyFN(state, event);
}

export function applyNewMap(state: GameState, event: NewFiniteMap) {
  if (state.planet) {
    throw new Error(`map ${state.planet.name} already exists`);
  }
  state.planet = _.cloneDeep(event.map);
}

export function applyMapEdit(state: GameState, event: MapEdit) {
  const map = state.planet
  if (!map) {
    throw new Error(`map does not exist`);
  }

  const chunkX = Math.floor(event.x / map.chunkSize);
  const chunkY = Math.floor(event.y / map.chunkSize);
  const chunk = map.grid[chunkY][chunkX];
  const tileX = event.x % map.chunkSize;
  const tileY = event.y % map.chunkSize;
  const tile = chunk.grid[tileY][tileX];
  for (let i = 0; i < tile.length; i++) {
    tile[i] += event.edit[i];
    if (tile[i] <= 0) {
      tile[i] = 0;
    }
  }
}

export function applyWaterChange(state: GameState, event: WaterChange) {
  const map = state.planet;
  if (!map) {
    throw new Error(`map does not exist`);
  }
  map.waterHeight += event.amount;
}

export function editorModeChange(state: GameState, event: EditorMode) {
  state.editorMode = event;
}

export function toggleLogViewerChange(state: GameState, event: ToggleLogViewer) {

}
export function applyNewUnit(state: GameState, event: NewUnit) {
  // check if there is a unit already there
  let { x, y } = event.unit;
  for (const unit of Object.values(state.units)) {
    if (unit.x === x && unit.y === y) {
      throw new Error('unit already at location');
    }
  }

  state.units[event.unit.uuid] = _.cloneDeep(event.unit);
}
export function applyMoveUnit(state: GameState, event: MoveUnit) {
  const { unit, unitDef } = getUnitInfo(state, event.uuid);
  if (!(unitDef.move)) {
    throw new Error(`unit can't move`);
  }
  if (unit.moveCooldown !== 0) {
    throw new Error('unit movement still cooling down');
  }
  let nextX = unit.x;
  let nextY = unit.y;
  switch (event.dir) {
    case 'N':
      nextY = unit.y + 1;
      break;
    case 'S':
      nextY = unit.y - 1;
      break;
    case 'E':
      nextX = unit.x + 1;
      break;
    case 'W':
      nextX = unit.x - 1;
      break;
    default:
      throw new Error(`invalid direction ${event.dir}`)
  }

  // TODO assert that the movement is valid
  const prev = getTile(state.planet!, unit.x, unit.y);
  const next = getTile(state.planet!, nextX, nextY);

  unit.x = nextX;
  unit.y = nextY;
  unit.facing = event.dir;

  unit.moveCooldown = unitDef.move.cooldown;
}
export function applyAssertion(state: GameState, event: Assertion) {
  event.fn(state);
}

export function applyAssertFail(state: GameState, event: AssertFail) {
  let e: Error | undefined;
  try {
    applyEvent(state, event.event);
  } catch (err) {
    e = err;
  }
  if (!e) {
    console.error(JSON.stringify(event.event));
    throw new Error('AssertFail event did not fail');
  }
}

export function applyUnitDefinition(state: GameState, event: DefineUnit) {
  state.unitDefinitions[event.unit.type] = event.unit;
}
export function applyGameStageChange(state: GameState, event: GameStageChange) {
  state.stage.mode = event.mode;
}

export function applyGameTick(state: GameState, event: GameTick) {
  state.stage.tick++;

  // any work that has to happen once per tick happens here

  for (const unit of Object.values(state.units)) {
    if (unit.moveCooldown > 0) {
      unit.moveCooldown--;
    }
  }
}

export function getUnitInfo(state: GameState, uuid: string) {
  const unit = state.units[uuid];
  const unitDef = state.unitDefinitions[unit.type];
  if (!unit) {
    throw new Error(`missing unit ${uuid}`);
  }
  if (!unitDef) {
    throw new Error(`missing unit definition ${unitDef}`);
  }
  return { unit, unitDef };
}