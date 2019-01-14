import { FiniteMap, LocHash } from "../types/SR";
import { getHash, unHash } from "../services/hash";

export function getTile(planet: FiniteMap, loc: LocHash) {
    const [x, y] = unHash(loc);
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

export function getChunkForTile(planet: FiniteMap, loc: LocHash): LocHash {
    const [x, y] = unHash(loc);
    const { chunkSize, size } = planet;
    const max = (chunkSize * size) - 1;
    if (y < 0 || x < 0 || y > max || x > max) {
        throw new Error(`inavlid location ${x}:${y} 0:${max}`)
    }
    const chunkX = Math.floor(x / chunkSize);
    const chunkY = Math.floor(y / chunkSize);
    return getHash(chunkX, chunkY);
}