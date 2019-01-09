import { GameState, getUnitInfo } from "../events/state";
import { Direction } from "../types/SR";

type Loc = [number, number];

// TODO
export function pathfind(state: GameState, uuid: string, x: number, y: number): Direction[] {
    const { planet } = state;
    const { unit, unitDef } = getUnitInfo(state, uuid);
    const start = hash([unit.x, unit.y]);
    const dst = hash([x, y]);

    // TODO improve algorithm to not use so many hash strings as garbage
    const closed: { [key: string]: Loc } = {};
    const open: Loc[] = [[unit.x, unit.y]];
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


function hash(loc: Loc): string {
    const [x, y] = loc;
    return `${x}:${y}`;
}
function unHash(hash: string): Loc {
    const split = hash.split(":");
    return [Number(split[0]), Number(split[1])];
}