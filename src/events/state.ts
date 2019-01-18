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
  HilightUpdate,
  SetDestination,
  SelectUnits,
  SetPath,
  CreateMatchEvent,
  DestroyUnit,
} from '.';
import _ from 'lodash'
import { FiniteMap, Unit, UnitType, UnitDefinition, LocHash } from '../types/SR';
import { getTile } from '../planet';
import { isMoveValid } from '../services/pathfind';
import { unHash, getHash } from '../services/hash';

export interface GameState {
  planet?: FiniteMap;
  units: { [key: string]: Unit };
  unitDefinitions: Partial<Record<UnitType, UnitDefinition>>;
  editorMode?: EditorMode;
  stage: {
    tick: number;
    mode: GameStage;
  }
  hilight?: HilightUpdate;
  selectedUnits: string[];
  match?: {
    id: string;
  },
  cache: {
    unitLocations: Record<LocHash, string>
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
  hilightUpdate: applyHilightUpdate,
  setDestination: applySetDestination,
  selectUnits: applySelectUnits,
  setPath: applySetPath,
  createMatch: applyCreateMatch,
  destroyUnit: applyDestroyUnit
};

export function newGameState(): GameState {
  return {
    units: {},
    unitDefinitions: {},
    stage: {
      tick: 0,
      mode: GameStage.init,
    },
    selectedUnits: [],
    cache: {
      unitLocations: {}
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
  const [x, y] = unHash(event.loc);

  const chunkX = Math.floor(x / map.chunkSize);
  const chunkY = Math.floor(y / map.chunkSize);
  const chunk = map.grid[chunkY][chunkX];
  const tileX = x % map.chunkSize;
  const tileY = y % map.chunkSize;
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
  for (const unit of Object.values(state.units)) {
    if (unit.loc === event.unit.loc) {
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
  const [x, y] = unHash(unit.loc);
  let nextX = x;
  let nextY = y;
  switch (event.dir) {
    case 'N':
      nextY = y + 1;
      break;
    case 'S':
      nextY = y - 1;
      break;
    case 'E':
      nextX = x + 1;
      break;
    case 'W':
      nextX = x - 1;
      break;
    default:
      throw new Error(`invalid direction ${event.dir}`)
  }

  const nextLoc = getHash(nextX, nextY);

  const prev = getTile(state.planet!, unit.loc);
  const next = getTile(state.planet!, nextLoc);

  // TODO need to check if a unit is already there

  const valid = isMoveValid(state.planet!, prev, next, event.dir);
  if (!valid) {
    throw new Error("movement is not valid");
  }

  unit.loc = nextLoc;
  unit.facing = event.dir;

  unit.moveCooldown = unitDef.move.cooldown;
  if (unit.path) {
    unit.path.shift()
  }
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

export function applyHilightUpdate(state: GameState, event: HilightUpdate) {
  state.hilight = event;
}

export function getUnitInfo(state: GameState, uuid: string) {
  const unit = state.units[uuid];
  if (!unit) {
    throw new Error(`missing unit ${uuid}`);
  }
  const unitDef = state.unitDefinitions[unit.type];
  if (!unitDef) {
    throw new Error(`missing unit definition ${unitDef}`);
  }
  return { unit, unitDef };
}

export function applySetDestination(state: GameState, event: SetDestination) {
  for (const uuid of event.uuids) {

    const { unit, unitDef } = getUnitInfo(state, uuid);
    if (!unitDef.move) {
      throw new Error(`unit cannot move: ${unit.type}`);
    }
    delete unit.path;
    unit.destination = event.dest;
  }
}
export function applySelectUnits(state: GameState, event: SelectUnits) {
  state.selectedUnits = event.uuids;
}

export function applySetPath(state: GameState, event: SetPath) {
  const { unit, unitDef } = getUnitInfo(state, event.uuid);
  if (unit.destination !== event.dest) {
    throw new Error(`destination does not match for unit ${event.uuid}, ${unit.destination}, ${event.dest}`);
  }
  unit.path = event.path;

}
export function applyCreateMatch(state: GameState, event: CreateMatchEvent) {
  state.match = {
    id: event.id
  }
}
export function applyDestroyUnit(state: GameState, event: DestroyUnit) {
  const { unit, unitDef } = getUnitInfo(state, event.uuid);
  delete state.units[event.uuid];
}