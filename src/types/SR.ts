export enum TileType {
  land,
  water,
  coast,
  cliff,
}

export interface PlanetChunk {
  x: number;
  y: number;

  size: number;

  grid: number[][];
  navGrid: TileType[][];
}

// corner heights: TL TR BL BR
export type TileHeights = [number, number, number, number];

export interface PlanetTiles {
  x: number;
  y: number;

  size: number;

  grid: TileHeights[][];
  // navGrid: TileType[][];
}

export interface FiniteMap {
  name: string;
  version: number;
  size: number; // number of PlanetTiles
  grid: PlanetTiles[][];
}
