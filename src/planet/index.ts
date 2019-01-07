import { FiniteMap } from "../types/SR";

export function getTile(planet: FiniteMap, x: number, y: number) {
    const { grid, chunkSize, size } = planet;
    const max = (chunkSize * size) - 1;
    if (y < 0 || x < 0 || y > max || x > max) {
        throw new Error(`inavlid location ${x}:${y} 0:${max}`)
    }
    const chunkX = Math.floor(x / chunkSize);
    const chunkY = Math.floor(y / chunkSize);
    const chunk = grid[chunkY][chunkX];
    const tileX = x % chunkSize;
    const tileY = y % chunkSize;
    return chunk.grid[tileY][tileX];
}