import { UnitType, ModelType, GameColors } from '../../types/SR';
import { ServerEvent } from '../../events/actions/game';
import { FrontendEvent, EditorSelection, frontendEventList } from '../../events/actions/frontend';
import { getFlatMap } from '../../planet/tiles';
import _ from 'lodash';

const log: (ServerEvent | FrontendEvent)[] = [
  {
    kind: 'newFiniteMap',
    map: _.merge(
      {
        name: 'foobar',
        version: 1,
        tps: 2,
        sunColor: 13421772,
        zScale: 0.1,
        size: 1,
        chunkSize: 4,
        waterHeight: 1.8,
        grid: [
          [
            {
              x: 0,
              y: 0,
              grid: [
                [[1, 1, 1, 1], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
              ],
            },
          ],
        ],
      },
      getFlatMap('foobar', 1, 4, 0),
    ),
  },
  {
    kind: 'defineUnit',
    unit: {
      type: UnitType.tank,
      size: 1,
      buildTime: 10,
      cost: 100,
      maxHealth: 200,
      layer: 'ground',
      graphical: {
        model: ModelType.LightTankLvl1,
      },
      move: {
        cooldown: 2,
      },
    },
  },
  {
    kind: 'mapEdit',
    edit: [-1, -1, -1, -1],
    loc: '1:0',
  },
  {
    kind: 'mapEdit',
    edit: [-1, -1, -1, -1],
    loc: '2:0',
  },
  {
    kind: 'mapEdit',
    edit: [-1, 0, -1, 0],
    loc: '3:0',
  },
  {
    kind: 'mapEdit',
    edit: [0, -1, 0, -1],
    loc: '3:0',
  },
  {
    kind: 'mapEdit',
    edit: [-1, -1, 0, 0],
    loc: '0:1',
  },
  {
    kind: 'mapEdit',
    edit: [-1, -1, 0, 0],
    loc: '1:1',
  },
  {
    kind: 'mapEdit',
    edit: [-1, -1, 0, 0],
    loc: '2:1',
  },
  {
    kind: 'mapEdit',
    edit: [-1, -1, 0, 0],
    loc: '3:1',
  },
  {
    kind: 'mapEdit',
    edit: [0, 0, 1, 1],
    loc: '1:2',
  },
  {
    kind: 'mapEdit',
    edit: [0, 1, 0, 1],
    loc: '0:2',
  },
  {
    kind: 'mapEdit',
    edit: [1, 1, 0, 0],
    loc: '0:3',
  },
  {
    kind: 'mapEdit',
    edit: [1, 0, 1, 0],
    loc: '1:3',
  },
  {
    kind: 'mapEdit',
    edit: [0, 1, 0, 1],
    loc: '2:2',
  },
  {
    kind: 'mapEdit',
    edit: [0, 1, 0, 1],
    loc: '2:2',
  },
  {
    kind: 'mapEdit',
    edit: [0, 0, 1, 1],
    loc: '3:2',
  },
  {
    kind: 'mapEdit',
    edit: [0, 0, 1, 1],
    loc: '3:2',
  },
  {
    kind: 'mapEdit',
    edit: [1, 0, 1, 0],
    loc: '3:3',
  },
  {
    kind: 'mapEdit',
    edit: [1, 0, 1, 0],
    loc: '3:3',
  },
  {
    kind: 'mapEdit',
    edit: [1, 1, 0, 0],
    loc: '2:3',
  },
  {
    kind: 'mapEdit',
    edit: [1, 1, 0, 0],
    loc: '2:3',
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: '161f4b26-343c-4f0c-989e-4010f4334c4c',
      type: UnitType.tank,
      facing: 'E',
      size: 1,
      loc: '3:2',
      color: GameColors.blue,
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: 'b01b6189-0df2-431f-9cf6-57f8bfa0080e',
      type: UnitType.tank,
      facing: 'E',
      size: 1,
      loc: '3:3',
      color: GameColors.blue,
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: '8cf61bf2-b565-414e-a058-5ad398a8d0e3',
      type: UnitType.tank,
      facing: 'E',
      size: 1,
      loc: '2:3',
      color: GameColors.green,
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: '45ebe4f9-e771-4a81-a5cb-c140f60c32d0',
      type: UnitType.tank,
      facing: 'E',
      size: 1,
      loc: '2:2',
      color: GameColors.green,
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'editorMode',
    selection: EditorSelection.newUnit,
    user: GameColors.red,
    unitType: UnitType.tank,
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: '38c5122f-98f8-4a9f-ad3e-50afb856de23',
      type: UnitType.tank,
      facing: 'E',
      size: 1,
      loc: '1:2',
      color: GameColors.red,
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: 'c0a9252d-b98d-4c1a-a645-02de2c3a1e58',
      type: UnitType.tank,
      facing: 'E',
      size: 1,
      loc: '1:3',
      color: GameColors.red,
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'editorMode',
    selection: EditorSelection.newUnit,
    user: GameColors.white,
    unitType: UnitType.tank,
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: '812b56de-e51b-4c73-a26c-28c4f487ee8d',
      type: UnitType.tank,
      facing: 'E',
      size: 1,
      loc: '0:2',
      color: GameColors.white,
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'newUnit',
    unit: {
      uuid: 'ce57bd19-5e69-42e2-89a7-f42bce1ada62',
      type: UnitType.tank,
      facing: 'E',
      size: 1,
      loc: '0:3',
      color: GameColors.white,
      map: 'test',
      moveCooldown: 0,
    },
  },
  {
    kind: 'mapEdit',
    edit: [0, 0, 0, 0],
    loc: '0:0',
  },
  {
    kind: 'mapEdit',
    edit: [0, 0, 0, 0],
    loc: '0:0',
  },
  {
    kind: 'mapEdit',
    edit: [0, 0, 0, 0],
    loc: '0:0',
  },
  {
    kind: 'mapEdit',
    edit: [0, 0, 0, 0],
    loc: '0:0',
  },
];
export const slopesTestLog = log.filter((e: FrontendEvent | ServerEvent) => !frontendEventList.includes(e.kind));
