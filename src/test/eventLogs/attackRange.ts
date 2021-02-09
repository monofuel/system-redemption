import { ServerEvent } from '../../events/actions/game';
import { FrontendEvent } from '../../events/actions/frontend';
import { getFlatMap } from '../../planet/tiles';

export const attackRangeTestLog: (ServerEvent | FrontendEvent)[] = [
  {
    kind: 'newFiniteMap',
    map: {
      ...getFlatMap('foobar', 1, 8, 0),
      version: 1,
      tps: 2,
      sunColor: 13421772,
      zScale: 0.2,
      size: 1,
      chunkSize: 8,
      waterHeight: 1.8,
      grid: [
        [
          {
            biomes: getFlatMap('foobar', 1, 8, 0).grid[0][0].biomes,
            x: 0,
            y: 0,
            grid: [
              [
                [1, 1, 1, 1],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
              ],
              [
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
              ],
              [
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
              ],
              [
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
              ],
              [
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
              ],
              [
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
              ],
              [
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
              ],
              [
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
                [2, 2, 2, 2],
              ],
            ],
          },
        ],
      ],
    },
  },
  {
    kind: 'defineUnit',
    unit: {
      type: 'tank',
      size: 1,
      buildTime: 10,
      cost: 100,
      maxHealth: 200,
      layer: 'ground',
      attack: {
        range: 3,
        layers: ['ground'],
      },
      graphical: {
        model: 'LightTankLvl1',
      },
      move: {
        cooldown: 1,
      },
    },
  },
  {
    kind: 'newEntity',
    unit: {
      uuid: 'd0f49e80-84d5-4da8-85a4-7d350fb8399a',
      type: 'tank',
      facing: 'E',
      size: 1,
      loc: '7:3',
      color: 'blue',
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'newEntity',
    unit: {
      uuid: 'd8f70167-74fe-401a-bfc0-c3275dafcbd7',
      type: 'tank',
      facing: 'E',
      size: 1,
      loc: '4:3',
      color: 'green',
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'newEntity',
    unit: {
      uuid: '5a626e3f-f4d2-4fff-a5fe-b6be470ffde3',
      type: 'tank',
      facing: 'E',
      size: 1,
      loc: '3:3',
      color: 'red',
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'damageUnit',
    uuid: 'd0f49e80-84d5-4da8-85a4-7d350fb8399a',
    amount: 5,
    source: 'd8f70167-74fe-401a-bfc0-c3275dafcbd7',
  },
  {
    kind: 'assertFail',
    reason: 'unit should be too far away',
    event: {
      kind: 'damageUnit',
      uuid: 'd0f49e80-84d5-4da8-85a4-7d350fb8399a',
      amount: 5,
      source: '5a626e3f-f4d2-4fff-a5fe-b6be470ffde3',
    },
  },
] as any;
