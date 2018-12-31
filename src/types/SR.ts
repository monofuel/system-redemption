export enum TileType {
  land,
  water,
  coast,
  cliff,
}

export type Direction = 'N' | 'S' | 'E' | 'W';

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

  grid: TileHeights[][];
  // navGrid: TileType[][];
}

export interface FiniteMap {
  name: string;
  version: number;
  waterHeight: number;
  size: number; // number of PlanetTile chunks
  chunkSize: number; // size of each PlanetTiles chunk
  grid: PlanetTiles[][];
}
