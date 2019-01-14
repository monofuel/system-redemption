import { GameState, getUnitInfo } from "../events/state";
import { Direction, Loc, TileHeights } from "../types/SR";
import { getHash } from "./hash";



// TODO
export function pathfind(state: GameState, uuid: string, x: number, y: number): Direction[] {
    const { planet } = state;
    const { unit, unitDef } = getUnitInfo(state, uuid);
    const start = getHash(unit.loc);
    const dst = getHash([x, y]);

    const closed: { [key: string]: Loc } = {};
    const open: Loc[] = [unit.loc];
    const prevMap: { [key: string]: { prev: string, dir: Direction } } = {};
    const scoreMap: { [key: string]: number } = {};

    while (open.length > 0) {
        // TODO
    }

    if (prevMap[dst]) {
        // generate the result array
        const results: Direction[] = [];
        let loc = dst;
        while (prevMap[loc]) {
            const { prev, dir } = prevMap[loc];
            loc = prev;
            results.push(dir);
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