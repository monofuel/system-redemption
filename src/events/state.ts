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
} from '.';
import _ from 'lodash'
import { FiniteMap, Unit, UnitType, UnitDefinition } from '../types/SR';
import { getTile } from '../planet';

export interface GameState {
  planet?: FiniteMap;
  units: { [key: string]: Unit };
  unitDefinitions: Partial<Record<UnitType, UnitDefinition>>;
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
  assertion: applyAssertion,
  defineUnit: applyUnitDefinition,
};

export function newGameState(): GameState {
  return {
    units: {},
    unitDefinitions: {}
  };
}

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

}

export function toggleLogViewerChange(state: GameState, event: ToggleLogViewer) {

}
export function applyNewUnit(state: GameState, event: NewUnit) {
  state.units[event.unit.uuid] = _.cloneDeep(event.unit);
}
export function applyMoveUnit(state: GameState, event: MoveUnit) {
  const unit = state.units[event.uuid];
  if (!unit) {
    throw new Error(`missing unit ${event.uuid}`);
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

  const prev = getTile(state.planet!, unit.x, unit.y);
  const next = getTile(state.planet!, nextX, nextY);


  unit.x = nextX;
  unit.y = nextY;
  unit.facing = event.dir;
}
export function applyAssertion(state: GameState, event: Assertion) {
  event.fn(state);
}

export function applyUnitDefinition(state: GameState, event: DefineUnit) {
  state.unitDefinitions[event.unit.type] = event.unit;
}