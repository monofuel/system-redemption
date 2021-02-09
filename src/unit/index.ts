import { Entity, UnitType } from "../types/SR";
import uuid from 'uuid';
import { randomColor } from "../elements/components/graphical";
import { EntityType } from "../types/planefront";

export function newTank(): Entity {
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

export function newTree(): Entity {
    return {
        uuid: uuid.v4(),
        type: EntityType.tree_1,
        facing: 'E',
        size: 1,
        loc: '0:0',
        map: 'test',
        moveCooldown: 0,
    }
}
