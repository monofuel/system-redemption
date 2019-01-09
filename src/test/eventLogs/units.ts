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
            graphical: {
                model: ModelType.LightTankLvl1,
            },
            move: {
                cooldown: 2
            }
        }
    }
];