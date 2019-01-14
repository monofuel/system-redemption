import { ServerEvent } from "../../events";
import { testTilesMap } from "../../planet/tiles";
import _ from 'lodash';
import { newTank } from "../../unit";
import { GameState } from "../../events/state";
import { assert } from 'chai';
import { defaultUnitDefinitions } from "./units";

const map = _.cloneDeep(testTilesMap);
map.waterHeight = -1;
map.chunkSize = 6;
map.grid = [[{
    x: 0,
    y: 0,
    grid: [
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 1, 1], [0, 0, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 0, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    ],
}]]

const tank = newTank();

export const slopeMoveTestLog: ServerEvent[] = [
    {
        kind: 'newFiniteMap',
        map,
    },
    ...defaultUnitDefinitions,
    {
        kind: 'newUnit',
        unit: {
            ...tank,
            loc: '0:5'
        }
    },
    {
        kind: 'moveUnit',
        uuid: tank.uuid,
        dir: 'E',
    },
    {
        kind: 'gameTick'
    },
    {
        kind: 'gameTick'
    },
    {
        kind: 'moveUnit',
        uuid: tank.uuid,
        dir: 'E',
    },
    {
        kind: 'gameTick'
    },
    {
        kind: 'gameTick'
    },
    {
        kind: 'moveUnit',
        uuid: tank.uuid,
        dir: 'S',
    },
    {
        kind: 'gameTick'
    },
    {
        kind: 'gameTick'
    },
    {
        kind: 'moveUnit',
        uuid: tank.uuid,
        dir: 'S',
    },
    {
        kind: 'gameTick'
    },
    {
        kind: 'gameTick'
    },
    {
        kind: 'moveUnit',
        uuid: tank.uuid,
        dir: 'E',
    },
    {
        kind: 'gameTick'
    },
    {
        kind: 'gameTick'
    },
    // TODO should assert move N fails
    {
        kind: 'moveUnit',
        uuid: tank.uuid,
        dir: 'E',
    },
    {
        kind: 'gameTick'
    },
    {
        kind: 'gameTick'
    },
    // TODO should assert move N fails
];