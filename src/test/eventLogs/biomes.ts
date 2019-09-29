import { ServerEvent } from '../../events/actions/game';
import { getFlatMap } from '../../planet/tiles';
import { Biomes } from '../../types/SR';
import { buildMapEdit, buildFiniteMap } from '../helpers/events';

export const biomesTestLog: ServerEvent[] = [
  buildFiniteMap(getFlatMap('biomeTest', 6, 1, 0)),
  buildMapEdit({
    edit: [4, 4, 4, 4],
    biome: Biomes.snow,
    loc: '1:1',
  }),
  buildMapEdit({
    edit: [4, 4, 4, 4],
    biome: Biomes.tech,
    loc: '3:3',
  }),
  buildMapEdit({
    edit: [4, 4, 4, 4],
    biome: Biomes.concrete,
    loc: '1:3',
  }),
  buildMapEdit({
    edit: [4, 4, 4, 4],
    biome: Biomes.desert,
    loc: '3:1',
  }),
  buildMapEdit({
    edit: [4, 4, 4, 4],
    biome: Biomes.swamp,
    loc: '1:5',
  }),
  buildMapEdit({
    edit: [-1, -1, -1, -1],
    biome: Biomes.grass,
    loc: '2:2',
  }),
];
