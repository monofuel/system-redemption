import { FiniteMap, PlanetTiles, TileHeights } from '../types/SR';

export function getFlatTiles(x: number, y: number, size: number): PlanetTiles {
  const grid: TileHeights[][] = [];
  for (let i = 0; i < size; i++) {
    const row: TileHeights[] = [];
    grid.push(row);
    for (let j = 0; j < size; j++) {
      row.push([2, 2, 2, 2]);
    }
  }
  return {
    x,
    y,
    grid,
  };
}

export function getFlatMap(
  name: string,
  size: number,
  chunkSize: number,
  waterHeight: number,
): FiniteMap {
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
    landColor: 0x405136,
    edgeColor: 0x6f9240,
    cliffColor: 0x362e26,
    waterColor: 0x53b0e2,
    sunColor: 0xcccccc,
    size,
    chunkSize,
    waterHeight,
    grid,
  };
}

export const testTiles: PlanetTiles = {
  x: 0,
  y: 0,
  grid: [
    [[1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[1, 1, 1, 1], [1, 1, 1, 1], [1, 0, 1, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  ],
};

export const testTilesMap: FiniteMap = {
  name: 'testTilesMap',
  version: 1,
  size: 1,
  landColor: 0x405136,
  edgeColor: 0x6f9240,
  cliffColor: 0x362e26,
  waterColor: 0x53b0e2,
  sunColor: 0xcccccc,
  chunkSize: 4,
  waterHeight: 0.8,
  grid: [[testTiles]],
};
