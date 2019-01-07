import { Unit, UnitType } from "../types/SR";
import uuid from 'uuid';

export function newTank(): Unit {
    return {
        uuid: uuid.v4(),
        type: UnitType.tank,
        facing: 'E',
        size: 1,
        x: 0,
        y: 0,
        map: 'test'
    }
}