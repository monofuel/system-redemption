export type Direction = 'N' | 'S' | 'E' | 'W';

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
  landColor: number;
  edgeColor: number;
  waterColor: number;
  cliffColor: number;
  sunColor: number;
  size: number; // number of PlanetTile chunks
  chunkSize: number; // size of each PlanetTiles chunk
  grid: PlanetTiles[][];
}
