import { testTilesMap } from "../planet/tiles";
import { pathfind } from "../services/pathfind";
import { newGameState, applyEvent } from "../events/state";
import { defaultUnitDefinitions } from "./eventLogs/units";
import { newTank } from "../unit";
import { assert } from 'chai';
import { Direction } from "../types/SR";
import _ from 'lodash';

xdescribe('test pathfinder', () => {
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

    const state = newGameState();
    state.planet = map;
    for (const def of defaultUnitDefinitions) {
        applyEvent(state, def);
    }
    const tank = newTank();
    state.units[tank.uuid] = tank;


    it("calculate path", () => {

        const path = pathfind(state, tank.uuid, 0, 3);
        const expectedPath: Direction[] = ['E', 'E', 'E'];
        assert.deepEqual(path, expectedPath);
    });
    it("empty path if no path", () => {

        // 0,4 is on top of the cliff
        const path = pathfind(state, tank.uuid, 0, 4);
        assert.equal(path.length, 0);
    });
})