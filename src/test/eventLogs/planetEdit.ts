import { MapEditType, ServerEvent } from '../../events';
import { testTilesMap } from '../../planet/tiles';
import { defaultUnitDefinitions } from './units';

export const planetEditTestLog: ServerEvent[] = [
    {
        kind: 'newFiniteMap',
        map: testTilesMap,
    },
    ...defaultUnitDefinitions,
    {
        kind: 'mapEdit',
        edit: MapEditType.raise,
        loc: '1:1'
    },
    {
        kind: 'mapEdit',
        edit: MapEditType.raise,
        loc: '1:1'
    },
    {
        kind: 'mapEdit',
        edit: MapEditType.lower,
        loc: '1:1'
    },
    {
        kind: 'mapEdit',
        edit: MapEditType.lower,
        loc: '1:1'
    },
    {
        kind: 'mapEdit',
        edit: MapEditType.lower,
        loc: '1:1'
    },
    {
        kind: 'mapEdit',
        edit: MapEditType.raise,
        loc: '0:0'
    },
    {
        kind: 'mapEdit',
        edit: [1, 1, 0, 0],
        loc: '0:1'
    },
    {
        kind: 'mapEdit',
        edit: [1, 0, 1, 0],
        loc: '1:0'
    },
    {
        kind: 'waterChange',
        amount: -0.5,
    },
    {
        kind: 'waterChange',
        amount: -0.7,
    },
    {
        kind: 'waterChange',
        amount: 2,
    },
];
