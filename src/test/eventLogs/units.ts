import { DefineUnit } from "../../events";
import { UnitType, ModelType } from "../../types/SR";

export const defaultUnitDefinitions: DefineUnit[] = [
    {
        kind: 'defineUnit',
        unit: {
            type: UnitType.tank,
            size: 1,
            buildTime: 10,
            cost: 100,
            maxHealth: 200,
            layer: 'ground',
            attack: {
                layers: ['ground'],
                damage: 5,
                range: 3,
                cooldown: 5
            },
            graphical: {
                model: ModelType.LightTankLvl1,
            },
            move: {
                cooldown: 1
            }
        }
    },
    {
        kind: 'defineUnit',
        unit: {
            type: UnitType.ltank2,
            size: 1,
            buildTime: 10,
            cost: 100,
            maxHealth: 200,
            layer: 'ground',
            attack: {
                layers: ['ground'],
                damage: 8,
                range: 4,
                cooldown: 5
            },
            graphical: {
                model: ModelType.LightTankLvl2,
            },
            move: {
                cooldown: 2
            }
        }
    },
    {
        kind: 'defineUnit',
        unit: {
            type: UnitType.ltank3,
            size: 1,
            buildTime: 10,
            cost: 100,
            maxHealth: 200,
            layer: 'ground',
            attack: {
                layers: ['ground'],
                damage: 15,
                range: 3,
                cooldown: 7,
            },
            graphical: {
                model: ModelType.LightTankLvl3,
            },
            move: {
                cooldown: 3
            }
        }
    },
    {
        kind: 'defineUnit',
        unit: {
            type: UnitType.htank3,
            size: 1,
            buildTime: 10,
            cost: 100,
            maxHealth: 200,
            layer: 'ground',
            attack: {
                layers: ['ground'],
                damage: 15,
                range: 5,
                cooldown: 5
            },
            graphical: {
                model: ModelType.HeavyTankLvl3,
            },
            move: {
                cooldown: 3
            }
        }
    }
];
