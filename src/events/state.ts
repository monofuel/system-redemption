import {
  MapEdit,
  MapEditType,
  NewFiniteMap,
  ServerEvent,
  ServerEventKinds,
  WaterChange,
} from '.';
import { FiniteMap } from '../types/SR';

export interface GameState {
  planets: { [key: string]: FiniteMap };
}
const serverEventApply: Record<
  ServerEventKinds,
  (state: GameState, event: any) => void
> = {
  newFiniteMap: applyNewMap,
  mapEdit: applyMapEdit,
  waterChange: applyWaterChange,
};

export function newGameState(): GameState {
  return {
    planets: {},
  };
}

export function applyServerEvent(state: GameState, event: ServerEvent) {
  const applyFN = serverEventApply[event.kind];
  if (!applyFN) {
    throw new Error(`missing apply function for event ${event.kind}`);
  }
  applyFN(state, event);
}

export function applyNewMap(state: GameState, event: NewFiniteMap) {
  if (state.planets[event.map.name]) {
    throw new Error(`map ${event.map.name} already exists`);
  }
  state.planets[event.map.name] = event.map;
}

export function applyMapEdit(state: GameState, event: MapEdit) {
  const map = state.planets[event.mapName];
  if (!map) {
    throw new Error(`map ${event.mapName} does not exist`);
  }

  const chunkX = Math.floor(event.x / map.chunkSize);
  const chunkY = Math.floor(event.y / map.chunkSize);
  const chunk = map.grid[chunkY][chunkX];
  const tileX = event.x % map.chunkSize;
  const tileY = event.y % map.chunkSize;
  const tile = chunk.grid[tileY][tileX];
  let delta = [0, 0, 0, 0];
  if (event.editType === MapEditType.raise) {
    delta = [1, 1, 1, 1];
  } else if (event.editType === MapEditType.lower) {
    delta = [-1, -1, -1, -1];
  }
  for (let i = 0; i < tile.length; i++) {
    tile[i] += delta[i];
    if (tile[i] <= 0) {
      tile[i] = 0;
    }
  }
}

export function applyWaterChange(state: GameState, event: WaterChange) {
  const map = state.planets[event.mapName];
  if (!map) {
    throw new Error(`map ${event.mapName} does not exist`);
  }
  map.waterHeight += event.amount;
}
