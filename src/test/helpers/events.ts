import { NewFiniteMap, MapEdit } from '../../events/actions/game';
import { FiniteMap, Biomes } from '../../types/SR';
import { getFlatMap } from '../../planet/tiles';

export function buildFiniteMap(map: FiniteMap = getFlatMap('buildFiniteMap', 6, 1, 0)): NewFiniteMap {
  return {
    kind: 'newFiniteMap',
    map,
  };
}

export function buildMapEdit(mapEdit: Partial<MapEdit>): MapEdit {
  return {
    kind: 'mapEdit',
    edit: [0, 0, 0, 0],
    biomes: [Biomes.grass, Biomes.grass, Biomes.grass, Biomes.grass, Biomes.grass],
    loc: '0:0',
    ...mapEdit,
  };
}
