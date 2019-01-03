import { Unit } from "../types/SR";
import uuid from 'uuid';

export function newTank(): Unit {
    return {
        uuid: uuid.v4(),
        type: 'tank',
        size: 1,
        x: 0,
        y: 0,
        map: 'test'
    }
}