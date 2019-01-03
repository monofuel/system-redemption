import { MapEditType, ServerEvent } from '../../events';
import { testTilesMap } from '../../planet/tiles';

export const planetEditTestLog: ServerEvent[] = [
    {
        kind: 'newFiniteMap',
        map: testTilesMap,
    },
    {
        kind: 'mapEdit',
        mapName: testTilesMap.name,
        edit: MapEditType.raise,
        x: 1,
        y: 1,
    },
    {
        kind: 'mapEdit',
        mapName: testTilesMap.name,
        edit: MapEditType.raise,
        x: 1,
        y: 1,
    },
    {
        kind: 'mapEdit',
        mapName: testTilesMap.name,
        edit: MapEditType.lower,
        x: 1,
        y: 1,
    },
    {
        kind: 'mapEdit',
        mapName: testTilesMap.name,
        edit: MapEditType.lower,
        x: 1,
        y: 1,
    },
    {
        kind: 'mapEdit',
        mapName: testTilesMap.name,
        edit: MapEditType.lower,
        x: 1,
        y: 1,
    },
    {
        kind: 'mapEdit',
        mapName: testTilesMap.name,
        edit: MapEditType.raise,
        x: 0,
        y: 0,
    },
    {
        kind: 'mapEdit',
        mapName: testTilesMap.name,
        edit: [1, 1, 0, 0],
        x: 0,
        y: 1,
    },
    {
        kind: 'mapEdit',
        mapName: testTilesMap.name,
        edit: [1, 0, 1, 0],
        x: 1,
        y: 0,
    },
    {
        kind: 'waterChange',
        mapName: testTilesMap.name,
        amount: -0.5,
    },
    {
        kind: 'waterChange',
        mapName: testTilesMap.name,
        amount: -0.7,
    },
    {
        kind: 'waterChange',
        mapName: testTilesMap.name,
        amount: 2,
    },
];
