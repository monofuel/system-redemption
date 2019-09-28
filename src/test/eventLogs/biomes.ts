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
];
