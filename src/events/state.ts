import {
  MapEdit,
  MapEditType,
  NewFiniteMap,
  ServerEvent,
  ServerEventKinds,
  WaterChange,
  FrontendEvent,
  EventKinds,
  EditorMode,
  ToggleLogViewer,
  NewUnit,
} from '.';
import _ from 'lodash'
import { FiniteMap } from '../types/SR';

export interface GameState {
  planets: { [key: string]: FiniteMap };
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
};

export function newGameState(): GameState {
  return {
    planets: {},
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
  if (state.planets[event.map.name]) {
    throw new Error(`map ${event.map.name} already exists`);
  }
  state.planets[event.map.name] = _.cloneDeep(event.map);
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
  for (let i = 0; i < tile.length; i++) {
    tile[i] += event.edit[i];
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

export function editorModeChange(state: GameState, event: EditorMode) {

}

export function toggleLogViewerChange(state: GameState, event: ToggleLogViewer) {

}
export function applyNewUnit(state: GameState, event: NewUnit) {

}