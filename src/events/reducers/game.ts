import { GameState } from '../store/game';
import _ from 'lodash';
import {
  NewFiniteMap,
  ServerEventKinds,
  ServerEvents,
  MapEdit,
  WaterChange,
  NewUnit,
  MoveUnit,
  Assertion,
  AssertFail,
  DefineUnit,
  GameStageChange,
  GameTick,
  SetDestination,
  CreateMatchEvent,
  SetPath,
  DamageUnit,
  DestroyUnit,
} from '../actions/game';
import { unHash } from '../../services/hash';
import { getTileInDirection, isMoveValid, locDistance } from '../../services/pathfind';
import { getTile } from '../../planet';

// TODO need to make more of these functions pure
export type GameReducer = (state: GameState, event: any) => GameState;
export type GameReducerMap = Record<ServerEventKinds, GameReducer>;
export const gameReducer: GameReducerMap = {
  newFiniteMap: applyNewMap,
  mapEdit: applyMapEdit,
  waterChange: applyWaterChange,
  newUnit: applyNewUnit,
  moveUnit: applyMoveUnit,
  defineUnit: applyUnitDefinition,
  gameStageChange: applyGameStageChange,
  gameTick: applyGameTick,
  assertion: applyAssertion,
  assertFail: applyAssertFail,
  setDestination: applySetDestination,
  setPath: applySetPath,
  createMatch: applyCreateMatch,
  destroyUnit: applyDestroyUnit,
  damageUnit: applyDamageUnit,
};

export function applyNewMap(state: GameState, event: NewFiniteMap): GameState {
  if (state.planet) {
    // only initialize the planet once for a given state
    throw new Error(`map ${state.planet.name} already initialized`);
  }
  return {
    ...state,
    planet: _.cloneDeep(event.map),
  };
}

// TODO refactor this to be pure
export function applyMapEdit(state: GameState, event: MapEdit): GameState {
  const map = state.planet;
  if (!map) {
    throw new Error(`map does not exist`);
  }
  const [x, y] = unHash(event.loc);

  const chunkX = Math.floor(x / map.chunkSize);
  const chunkY = Math.floor(y / map.chunkSize);
  const chunk = map.grid[chunkY][chunkX];
  const tileX = x % map.chunkSize;
  const tileY = y % map.chunkSize;
  const newTile = chunk.grid[tileY][tileX];
  if (event.biome) {
    chunk.biomes[tileX][tileY] = event.biome;
  }
  for (let i = 0; i < newTile.length; i++) {
    newTile[i] += event.edit[i];
    if (newTile[i] <= 0) {
      newTile[i] = 0;
    }
  }

  return state;
}

export function applyWaterChange(state: GameState, event: WaterChange) {
  const map = state.planet;
  if (!map) {
    throw new Error(`map does not exist`);
  }
  map.waterHeight += event.amount;
  return state;
}

export function applyNewUnit(state: GameState, event: NewUnit) {
  const unitDef = state.unitDefinitions[event.unit.type];
  if (!unitDef) {
    throw new Error(`missing unit definition ${unitDef}`);
  }
  // check if there is a unit already there
  if (state.cache.unitLocations[event.unit.loc]) {
    throw new Error(`unit already at location ${event.unit.loc}`);
  }
  state.cache.unitLocations[event.unit.loc] = event.unit.uuid;

  state.units[event.unit.uuid] = _.cloneDeep(event.unit);
  state.units[event.unit.uuid].health = unitDef.maxHealth;
  return state;
}
export function applyMoveUnit(state: GameState, event: MoveUnit) {
  const { unit, unitDef } = getUnitInfo(state, event.uuid);
  if (!unitDef.move) {
    throw new Error(`unit can't move`);
  }
  if (unit.moveCooldown !== 0) {
    throw new Error('unit movement still cooling down');
  }

  const nextLoc = getTileInDirection(unit.loc, event.dir);

  const prev = getTile(state.planet!, unit.loc);
  const next = getTile(state.planet!, nextLoc);

  if (state.cache.unitLocations[nextLoc]) {
    throw new Error(`unit already at location ${nextLoc}`);
  }

  const valid = isMoveValid(state.planet!, prev, next, event.dir);
  if (!valid) {
    throw new Error('movement is not valid');
  }

  delete state.cache.unitLocations[unit.loc];
  state.cache.unitLocations[nextLoc] = unit.uuid;

  unit.loc = nextLoc;
  unit.facing = event.dir;

  unit.moveCooldown = unitDef.move.cooldown;
  if (unit.path) {
    unit.path.shift();
  }
  return state;
}
export function applyAssertion(state: GameState, event: Assertion) {
  event.fn(state);
  return state;
}

export function applyAssertFail(state: GameState, event: AssertFail) {
  let e: unknown;
  try {
    const reducer: GameReducer = gameReducer[event.event.kind];
    reducer(state, event.event);
  } catch (err) {
    e = err;
  }
  if (!e) {
    console.error(JSON.stringify(event.event));
    throw new Error('AssertFail event did not fail');
  }
  return state;
}

export function applyUnitDefinition(state: GameState, event: DefineUnit) {
  state.unitDefinitions[event.unit.type] = event.unit;
  return state;
}
export function applyGameStageChange(state: GameState, event: GameStageChange) {
  state.stage.mode = event.mode;
  return state;
}

export function applyGameTick(state: GameState, event: GameTick) {
  state.stage.tick++;

  // any work that has to happen once per tick happens here

  for (const unit of Object.values(state.units)) {
    if (unit.moveCooldown > 0) {
      unit.moveCooldown--;
    }
    if (unit.attackCooldown && unit.attackCooldown > 0) {
      unit.attackCooldown--;
    }
  }
  return state;
}

// TODO should move this function
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
  return state;
}

export function applySetPath(state: GameState, event: SetPath) {
  const { unit, unitDef } = getUnitInfo(state, event.uuid);
  if (unit.destination !== event.dest) {
    throw new Error(`destination does not match for unit ${event.uuid}, ${unit.destination}, ${event.dest}`);
  }
  unit.path = event.path;
  return state;
}
export function applyCreateMatch(state: GameState, event: CreateMatchEvent) {
  state.match = {
    id: event.id,
  };
  return state;
}
export function applyDestroyUnit(state: GameState, event: DestroyUnit) {
  const { unit, unitDef } = getUnitInfo(state, event.uuid);
  delete state.units[event.uuid];
  delete state.cache.unitLocations[unit.loc];
  return state;
}

export function applyDamageUnit(state: GameState, event: DamageUnit) {
  const { unit, unitDef } = getUnitInfo(state, event.uuid);
  unit.health! -= event.amount;

  if (event.source) {
    const { unit: attacker, unitDef: attackerDef } = getUnitInfo(state, event.source);
    if (!attackerDef.attack) {
      throw new Error(`unit cannot attack ${event.source}`);
    }
    const dist = locDistance(unit.loc, attacker.loc);
    if (attackerDef.attack.range < dist) {
      throw new Error(`attacking unit not in range ${event.source}, ${event.uuid}`);
    }
    if (attacker.attackCooldown && attacker.attackCooldown > 0) {
      throw new Error(`attacking unit still on cooldown ${event.source}`);
    }
    attacker.attackCooldown = attackerDef.attack.cooldown;
  }
  return state;
}
