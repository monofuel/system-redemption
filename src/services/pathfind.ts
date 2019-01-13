import { GameState, getUnitInfo } from "../events/state";
import { Direction, Loc } from "../types/SR";
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