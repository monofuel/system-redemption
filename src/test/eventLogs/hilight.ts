import { defaultUnitDefinitions } from './units';
import { ServerEvent } from '../../events/actions/game';
import { FrontendEvent } from '../../events/actions/frontend';
import { getFlatMap } from '../../planet/tiles';
import _ from 'lodash';

export const hilightTestLog: (ServerEvent | FrontendEvent)[] = [
  {
    kind: 'newFiniteMap',

    map: _.merge(
      {
        version: 1,
        tps: 2,
        sunColor: 13421772,
        zScale: 0.4,
        size: 2,
        chunkSize: 4,
        waterHeight: 1.8,
        grid: [
          [
            {
              x: 0,
              y: 0,
              grid: [
                [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 2, 2], [2, 2, 2, 2]],
                [[3, 2, 3, 2], [2, 2, 2, 2], [2, 2, 3, 3], [2, 3, 2, 3]],
                [[2, 2, 2, 2], [3, 2, 3, 3], [3, 3, 3, 3], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
              ],
            },
            {
              x: 0,
              y: 1,
              grid: [
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
              ],
            },
          ],
          [
            {
              x: 1,
              y: 0,
              grid: [
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
              ],
            },
            {
              x: 1,
              y: 1,
              grid: [
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
              ],
            },
          ],
        ],
      },
      getFlatMap('foobar', 2, 4, 0),
    ),
  },
  ...defaultUnitDefinitions,

  {
    kind: 'hilightUpdate',
    loc: '1:1',
  },
  {
    kind: 'hilightUpdate',
    loc: '2:2',
  },
  {
    kind: 'hilightUpdate',
    loc: '2:2',
    corner: [0],
  },
  {
    kind: 'hilightUpdate',
    loc: '2:2',
    corner: [1],
  },
  {
    kind: 'hilightUpdate',
    loc: '2:2',
    corner: [2],
  },
  {
    kind: 'hilightUpdate',
    loc: '2:2',
    corner: [3],
  },
  {
    kind: 'hilightUpdate',
    loc: '2:2',
    corner: [0, 3],
  },
  {
    kind: 'hilightUpdate',
    loc: '2:2',
    corner: [0, 1, 3],
  },

  {
    kind: 'hilightUpdate',
    loc: '2:2',
    corner: [0, 1, 2, 3],
  },
  {
    kind: 'hilightUpdate',
    loc: '2:1',
    corner: [0, 1],
  },
  {
    kind: 'hilightUpdate',
    loc: '2:0',
    corner: [2, 3],
  },
  {
    kind: 'hilightUpdate',
    loc: '3:1',
    corner: [1, 2],
  },
  {
    kind: 'hilightUpdate',
    loc: '0:1',
    corner: [2, 1],
  },
  {
    kind: 'hilightUpdate',
    loc: '1:2',
    corner: [0, 1, 3],
  },
];
