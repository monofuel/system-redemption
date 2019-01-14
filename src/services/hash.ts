import { LocHash } from "../types/SR";

interface HashMeta {
    hash: LocHash,
    x: number,
    y: number
}

const hashCache: {
    [key: number]: {
        [key: number]: HashMeta
    }
} = {};

const mapOfHashes: { [key: string]: HashMeta } = {};

/**
 * Re-use hash strings to avoid garbage
 * @param x 
 * @param y 
 */
export function getHash(x: number, y: number): LocHash {
    if (!hashCache[x]) {
        hashCache[x] = {};
    }
    if (!hashCache[x][y]) {
        const meta: HashMeta = {
            hash: `${x}:${y}`,
            x,
            y
        }
        hashCache[x][y] = meta;
        mapOfHashes[meta.hash] = meta;
    }

    return hashCache[x][y].hash;
}

export function unHash(hash: string): [number, number] {
    if (mapOfHashes[hash]) {
        const { x, y } = mapOfHashes[hash];
        return [x, y];
    }
    const split = hash.split(':');
    const x = Number(split[0]);
    const y = Number(split[1]);
    const meta = {
        hash,
        x,
        y
    }
    if (!hashCache[x]) {
        hashCache[x] = {};
    }
    hashCache[x][y] = meta;
    mapOfHashes[meta.hash] = meta;
    return [x, y];
}