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
    size,
    grid,
  };
}

export function getFlatMap(
  name: string,
  size: number,
  chunkSize: number,
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
    size,
    grid,
  };
}

export const testTiles: PlanetTiles = {
  x: 0,
  y: 0,
  size: 4,
  grid: [
    [[1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[1, 1, 1, 1], [1, 1, 1, 1], [1, 0, 1, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  ],
};
