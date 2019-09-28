import { FiniteMap, PlanetTiles, TileHeights, Biomes } from '../types/SR';

export function getFlatTiles(x: number, y: number, size: number): PlanetTiles {
  const grid: TileHeights[][] = [];
  const biomes: Biomes[][] = [];
  for (let i = 0; i < size; i++) {
    const row: TileHeights[] = [];
    const biomeRow: Biomes[] = [];
    grid.push(row);
    biomes.push(biomeRow);
    for (let j = 0; j < size; j++) {
      row.push([2, 2, 2, 2]);
      biomeRow.push(Biomes.grass);
    }
  }
  return {
    x,
    y,
    grid,
    biomes,
  };
}

export function getFlatMap(name: string, size: number, chunkSize: number, waterHeight: number): FiniteMap {
  const grid: PlanetTiles[][] = [];
  for (let i = 0; i < size; i++) {
    const row: PlanetTiles[] = [];
    grid.push(row);
    for (let j = 0; j < size; j++) {
      row.push(getFlatTiles(i, j, chunkSize));
    }
  }
  return {
    name,
    version: 1,
    tps: 2,
    biomeColors: {
      [Biomes.grass]: {
        landColor: 0x405136,
        edgeColor: 0x6f9240,
        cliffColor: 0x362e26,
        waterColor: 0x53b0e2,
      },
      [Biomes.tech]: {
        landColor: 0x0a0908,
        edgeColor: 0x22333b,
        cliffColor: 0x0a0908,
        waterColor: 0x53b0e2,
      },
      [Biomes.concrete]: {
        landColor: 0x474747,
        edgeColor: 0xe0e0ce,
        cliffColor: 0x000000,
        waterColor: 0x53b0e2,
      },
      [Biomes.snow]: {
        landColor: 0xe1faf9,
        edgeColor: 0x78ffd6,
        cliffColor: 0x023c40,
        waterColor: 0x0ad3ff,
      },
      [Biomes.desert]: {
        landColor: 0xffc857,
        edgeColor: 0xe9724c,
        cliffColor: 0x481d24,
        waterColor: 0x255f85,
      },
      [Biomes.swamp]: {
        landColor: 0x137547,
        edgeColor: 0x2a9134,
        cliffColor: 0x054a29,
        waterColor: 0x5bba6f,
      },
    },
    sunColor: 0xcccccc,
    zScale: 0.2,
    size,
    chunkSize,
    waterHeight,
    grid,
  };
}

export const testTiles: PlanetTiles = {
  ...getFlatTiles(0, 0, 4),
  grid: [
    [[1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[1, 1, 1, 1], [1, 1, 1, 1], [1, 0, 1, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  ],
};

export const testTilesMap: FiniteMap = {
  ...getFlatMap('', 4, 1, 0),
  name: 'testTilesMap',
  version: 1,
  size: 1,
  tps: 2,
  sunColor: 0xcccccc,
  chunkSize: 4,
  zScale: 0.4,
  waterHeight: 0.8,
  grid: [[testTiles]],
};
