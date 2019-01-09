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
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    ],
}]]

const tank = newTank();

export const unitMoveTestLog: ServerEvent[] = [
    {
        kind: 'newFiniteMap',
        map,
    },
    ...defaultUnitDefinitions,
    {
        kind: 'newUnit',
        unit: {
            ...tank,
            x: 0,
            y: 5,
        }
    },
    {
        kind: 'moveUnit',
        uuid: tank.uuid,
        dir: 'E',
    },
    {
        kind: 'assertion',
        fn: (state: GameState) => {
            const unit = state.units[tank.uuid];
            assert.equal(unit.moveCooldown, 2);
            assert.equal(unit.x, 1);
            assert.equal(unit.y, 5);
        }
    },
    {
        kind: 'assertFail',
        event: {
            kind: 'moveUnit',
            uuid: tank.uuid,
            dir: 'E',
        }
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
        kind: 'assertion',
        fn: (state: GameState) => {
            const unit = state.units[tank.uuid];
            assert.equal(unit.x, 2);
            assert.equal(unit.y, 5);
        }
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
        kind: 'assertion',
        fn: (state: GameState) => {
            const unit = state.units[tank.uuid];
            assert.equal(unit.x, 5);
            assert.equal(unit.y, 5);
        }
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
        dir: 'W',
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
        dir: 'W',
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
        dir: 'N',
    },
];