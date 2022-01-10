import { Unit, UnitType } from "../types/SR";
import * as  uuid from 'uuid';
import { randomColor } from "../elements/components/graphical";

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
