import { testTilesMap, getFlatMap } from '../../planet/tiles';
import _ from 'lodash';
import { newTank } from '../../unit';
import { assert } from 'chai';
import { defaultUnitDefinitions } from './units';
import { GameState } from '../../events/store/game';
import { ServerEvent } from '../../events/actions/game';

const map = getFlatMap('foobar', 1, 6, 0);
map.waterHeight = -1;
map.chunkSize = 6;
map.grid = [
  [
    {
      biomes: map.grid[0][0].biomes,
      x: 0,
      y: 0,
      grid: [
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0]],
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      ],
    },
  ],
];

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
      loc: '0:5',
    },
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
      assert.equal(unit.moveCooldown, 1);
      assert.equal(unit.loc, '1:5');
    },
  },
  {
    kind: 'assertFail',
    event: {
      kind: 'moveUnit',
      uuid: tank.uuid,
      dir: 'E',
    },
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
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
      assert.equal(unit.loc, '2:5');
    },
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'moveUnit',
    uuid: tank.uuid,
    dir: 'E',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'moveUnit',
    uuid: tank.uuid,
    dir: 'E',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
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
      assert.equal(unit.loc, '5:5');
    },
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'moveUnit',
    uuid: tank.uuid,
    dir: 'S',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'moveUnit',
    uuid: tank.uuid,
    dir: 'S',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'moveUnit',
    uuid: tank.uuid,
    dir: 'W',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'moveUnit',
    uuid: tank.uuid,
    dir: 'W',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'moveUnit',
    uuid: tank.uuid,
    dir: 'S',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'moveUnit',
    uuid: tank.uuid,
    dir: 'N',
  },
];
