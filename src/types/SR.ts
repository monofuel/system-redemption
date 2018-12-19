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
type TileHeights = [number, number, number, number];

export interface PlanetTiles {
    x: number;
    y: number;

    size: number;

    grid: TileHeights[][];
    // navGrid: TileType[][];

}
