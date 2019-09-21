import { assert } from 'chai';
import { AssertionError, deepEqual } from 'assert';
import { GameColors, UnitType, ModelType } from '../../types/SR';
import { ServerEvent } from '../../events/actions/game';
import { FrontendEvent, EditorSelection, frontendEventList } from '../../events/actions/frontend';
import { GameState } from '../../events/store/game';

const tankUUID = 'e3798619-9d8b-422e-b61c-ed84a1272577';

const log: (ServerEvent | FrontendEvent)[] = [
  {
    kind: 'newFiniteMap',
    map: {
      name: 'foobar',
      version: 1,
      tps: 2,
      landColor: 4215094,
      edgeColor: 7311936,
      cliffColor: 3550758,
      waterColor: 5484770,
      sunColor: 13421772,
      zScale: 0.2,
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
      ] as any,
    },
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
    kind: 'editorMode',
    selection: EditorSelection.raiselower,
    user: GameColors.blue,
    unitType: UnitType.tank,
  },

  {
    kind: 'mapEdit',
    edit: [1, 1, 1, 1],
    loc: '0:0',
  },

  {
    kind: 'editorMode',
    selection: EditorSelection.newUnit,
    user: GameColors.blue,
    unitType: UnitType.tank,
  },

  {
    kind: 'newUnit',
    unit: {
      uuid: 'e3798619-9d8b-422e-b61c-ed84a1272577',
      type: UnitType.tank,
      facing: 'E',
      size: 1,
      loc: '0:0',
      color: GameColors.blue,
      map: 'test',
      moveCooldown: 0,
    },
  },

  {
    kind: 'editorMode',
    selection: EditorSelection.raiselower,
  },

  {
    kind: 'mapEdit',
    edit: [1, 1, 1, 1],
    loc: '1:1',
  },

  {
    kind: 'hilightUpdate',
  },
  {
    kind: 'assertion',
    fn: (state: GameState) => {
      assert.deepEqual('0:0', state.units[tankUUID].loc);
    },
  },
  {
    kind: 'moveUnit',
    uuid: tankUUID,
    dir: 'E',
  },
  {
    kind: 'assertion',
    fn: (state: GameState) => {
      assert.deepEqual('1:0', state.units[tankUUID].loc);
    },
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },

  {
    kind: 'assertFail',
    event: {
      kind: 'moveUnit',
      uuid: tankUUID,
      dir: 'N',
    },
  },

  {
    kind: 'moveUnit',
    uuid: tankUUID,
    dir: 'E',
  },
  {
    kind: 'assertion',
    fn: (state: GameState) => {
      assert.deepEqual('2:0', state.units[tankUUID].loc);
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
    uuid: tankUUID,
    dir: 'N',
  },
  {
    kind: 'assertion',
    fn: (state: GameState) => {
      assert.deepEqual('2:1', state.units[tankUUID].loc);
    },
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'assertFail',
    event: {
      kind: 'moveUnit',
      uuid: tankUUID,
      dir: 'W',
    },
  },
  {
    kind: 'moveUnit',
    uuid: tankUUID,
    dir: 'N',
  },
  {
    kind: 'assertion',
    fn: (state: GameState) => {
      assert.deepEqual('2:2', state.units[tankUUID].loc);
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
    uuid: tankUUID,
    dir: 'W',
  },
  {
    kind: 'assertion',
    fn: (state: GameState) => {
      assert.deepEqual('1:2', state.units[tankUUID].loc);
    },
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'assertFail',
    event: {
      kind: 'moveUnit',
      uuid: tankUUID,
      dir: 'S',
    },
  },
  {
    kind: 'moveUnit',
    uuid: tankUUID,
    dir: 'W',
  },
  {
    kind: 'assertion',
    fn: (state: GameState) => {
      assert.deepEqual('0:2', state.units[tankUUID].loc);
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
    uuid: tankUUID,
    dir: 'S',
  },
  {
    kind: 'assertion',
    fn: (state: GameState) => {
      assert.deepEqual('0:1', state.units[tankUUID].loc);
    },
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'gameTick',
  },
  {
    kind: 'assertFail',
    event: {
      kind: 'moveUnit',
      uuid: tankUUID,
      dir: 'E',
    },
  },
];

export const moveBlockTestLog = log.filter((e: FrontendEvent | ServerEvent) => !frontendEventList.includes(e.kind));
