import { Unit, UnitType } from "../types/SR";
import uuid from 'uuid';
import { randomColor } from "../elements/components/graphical";
import { GameState } from "../events/state";
import { locDistance } from "../services/pathfind";

export function findEnemiesInRange(state: GameState, unit: Unit): string[] {
    const def = state.unitDefinitions[unit.type]!;
    if (!def.attack) {
        return [];
    }
    const user = unit.color;
    const units: string[] = [];
    for (const uuid in state.units) {
        const other = state.units[uuid];
        if (other.color === user) {
            continue;
        }
        const d = locDistance(unit.loc, other.loc);
        if (d < def.attack.range) {
            units.push(uuid);
        }
    }
    return units;
}

export function newTank(): Unit {
    return {
        uuid: uuid.v4(),
        type: UnitType.tank,
        facing: 'E',
        size: 1,
        loc: '0:0',
        color: randomColor(),
        map: 'test',
        moveCooldown: 0,
    }
}