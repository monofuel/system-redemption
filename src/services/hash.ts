import { Loc } from "../types/SR";

interface HashMeta {
    hash: string,
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
export function getHash(loc: Loc) {
    const [x, y] = loc;
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

export function unHash(hash: string): Loc {
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
    hashCache[x][y] = meta;
    mapOfHashes[meta.hash] = meta;
    return [x, y];
}