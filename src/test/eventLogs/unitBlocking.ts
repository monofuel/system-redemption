import { ServerEvent } from '../../events/actions/game';
import { FrontendEvent } from '../../events/actions/frontend';
import { getFlatMap } from '../../planet/tiles';
import _ from 'lodash';

export const unitBlockingTestLog: (ServerEvent | FrontendEvent)[] = [
  {
    kind: 'newFiniteMap',
    map: _.merge(
      {
        name: 'foobar',
        version: 1,
        tps: 2,
        sunColor: 13421772,
        zScale: 0.2,
        size: 1,
        chunkSize: 3,
        waterHeight: 1.8,
        grid: [
          [
            {
              x: 0,
              y: 0,
              grid: [
                [[1, 1, 1, 1], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
              ],
            },
          ],
        ],
      },
      getFlatMap('foobar', 1, 3, 0),
    ),
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
      graphical: {
        model: 'LightTankLvl1',
      },
      move: {
        cooldown: 1,
      },
    },
  },
  {
    kind: 'defineUnit',
    unit: {
      type: 'ltank2',
      size: 1,
      buildTime: 10,
      cost: 100,
      maxHealth: 200,
      layer: 'ground',
      graphical: {
        model: 'LightTankLvl2',
      },
      move: {
        cooldown: 2,
      },
    },
  },
  {
    kind: 'defineUnit',
    unit: {
      type: 'ltank3',
      size: 1,
      buildTime: 10,
      cost: 100,
      maxHealth: 200,
      layer: 'ground',
      graphical: {
        model: 'LightTankLvl3',
      },
      move: {
        cooldown: 3,
      },
    },
  },
  {
    kind: 'defineUnit',
    unit: {
      type: 'htank3',
      size: 1,
      buildTime: 10,
      cost: 100,
      maxHealth: 200,
      layer: 'ground',
      graphical: {
        model: 'HeavyTankLvl3',
      },
      move: {
        cooldown: 3,
      },
    },
  },
  {
    kind: 'editorMode',
    selection: 'newUnit',
    user: 'blue',
    unitType: 'tank',
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: '0caa58ac-bc75-4c09-a58a-861ec8e3a8af',
      type: 'tank',
      facing: 'E',
      size: 1,
      loc: '0:1',
      color: 'blue',
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: '68d28c38-867f-4fda-90a9-5d810b20887e',
      type: 'tank',
      facing: 'E',
      size: 1,
      loc: '1:1',
      color: 'blue',
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: 'b4e87182-8711-448b-bb69-34125c924f97',
      type: 'tank',
      facing: 'E',
      size: 1,
      loc: '2:1',
      color: 'blue',
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: '8f1d6919-ad36-47f9-ba5c-134e89506c7e',
      type: 'tank',
      facing: 'E',
      size: 1,
      loc: '1:2',
      color: 'blue',
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'assertFail',
    event: {
      kind: 'moveUnit',
      uuid: '8f1d6919-ad36-47f9-ba5c-134e89506c7e',
      dir: 'S',
    },
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
] as any;
