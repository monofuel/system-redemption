import { MapEditType, ServerEvent } from '../events';
import { applyServerEvent, newGameState } from '../events/state';
import { testTilesMap } from '../planet/tiles';

export const planetEditTestLog: ServerEvent[] = [
  {
    kind: 'newFiniteMap',
    map: testTilesMap,
  },
  {
    kind: 'mapEdit',
    mapName: testTilesMap.name,
    editType: MapEditType.raise,
    x: 1,
    y: 1,
  },
  {
    kind: 'mapEdit',
    mapName: testTilesMap.name,
    editType: MapEditType.raise,
    x: 1,
    y: 1,
  },
  {
    kind: 'mapEdit',
    mapName: testTilesMap.name,
    editType: MapEditType.lower,
    x: 1,
    y: 1,
  },
  {
    kind: 'waterChange',
    mapName: testTilesMap.name,
    amount: -0.1,
  },
];

describe('planet event log tests', () => {
  it('process event log', () => {
    const state = newGameState();
    for (const event of planetEditTestLog) {
      applyServerEvent(state, event);
    }
  });
});
