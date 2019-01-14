import { GameState, getUnitInfo } from "../events/state";
import { Direction, TileHeights, LocHash, FiniteMap } from "../types/SR";
import { unHash, getHash } from "./hash";
import { getTile } from "../planet";


interface LocCost {
    loc: string,
    cost: number,
}

// TODO
export function pathfind(state: GameState, uuid: string, dst: string): Direction[] {
    const { planet } = state;
    const { unit, unitDef } = getUnitInfo(state, uuid);
    const start = unit.loc;

    const closed: { [key: string]: LocCost } = {};
    const open: LocCost[] = [{ loc: unit.loc, cost: locDistance(unit.loc, dst) }];
    const prevMap: { [key: string]: { prev: string, dir: Direction, cost: number } } = {};
    const scoreMap: { [key: string]: number } = {};

    while (open.length > 0) {
        open.sort((a: LocCost, b: LocCost): number => {
            return a.cost - b.cost;
        });
        const current = open.shift()!;
        closed[current.loc] = current;
        const neighbors = getValidMoveNeighbors(planet!, current.loc);
        for (const neighbor of neighbors) {
            const next = neighbor.loc;
            if (closed[next]) {
                continue;
            }
            const nextDir = neighbor.dir;
            const nextCost = current.cost + locDistance(next, dst);
            if (open.findIndex((e: LocCost) => e.loc === next) === -1) {
                open.push({ loc: next, cost: nextCost });
            }
            prevMap[next] = {
                cost: nextCost,
                prev: current.loc,
                dir: nextDir
            }
        }

    }

    if (prevMap[dst]) {
        // generate the result array
        const results: Direction[] = [];
        let loc = dst;
        while (prevMap[loc]) {
            const { prev, dir } = prevMap[loc];
            loc = prev;
            results.unshift(dir);
            if (loc === start) {
                break;
            }
        }

        return results;
    } else {
        return [];
    }
}

// TODO this should probably return 'why' the movement is not valid
// TODO consider different movement layers (ground/water/air)
export function isMoveValid(src: TileHeights, dst: TileHeights, dir: Direction): boolean {
    // tile corners:
    // 0 1
    // 2 3

    switch (dir) {
        case 'N':
            return src[2] === dst[0] && src[3] === dst[1];
        case 'S':
            return src[0] === dst[2] && src[1] === dst[3];
        case 'E':
            return src[1] === dst[0] && src[3] === dst[2];
        case 'W':
            return src[0] === dst[1] && src[2] === dst[3];
    }
}

export function getValidMoveNeighbors(planet: FiniteMap, src: LocHash): { loc: LocHash, dir: Direction }[] {
    return getNeighbors(planet, src).filter(({ loc, dir }) => isMoveValid(getTile(planet, src), getTile(planet, loc), dir));
}

export function getNeighbors(planet: FiniteMap, loc: LocHash): { loc: LocHash, dir: Direction }[] {
    const results: { loc: LocHash, dir: Direction }[] = [];
    const { size, chunkSize } = planet;
    const maxSize = size * chunkSize;

    const [x, y] = unHash(loc);
    if (x > 0) {
        results.push({
            loc: getHash(x - 1, y),
            dir: 'W'
        });
    }
    if (y > 0) {
        results.push({
            loc: getHash(x, y - 1),
            dir: 'S'
        });
    }
    if (x < maxSize - 1) {
        results.push({
            loc: getHash(x + 1, y),
            dir: 'E'
        });
    }
    if (y < maxSize - 1) {
        results.push({
            loc: getHash(x, y + 1),
            dir: 'N'
        });
    }

    return results;
}

export function locDistance(src: LocHash, dst: LocHash): number {
    const [x1, y1] = unHash(src);
    const [x2, y2] = unHash(dst);
    const x = x2 - x1;
    const y = y2 - y1;
    return Math.sqrt(x * x + y * y);
}