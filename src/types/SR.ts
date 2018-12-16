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
