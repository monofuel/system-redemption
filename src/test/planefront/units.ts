import { DefineUnit } from "../../events/actions/game";
import { EntityType } from "../../types/planefront";
import { ModelType } from "../../types/SR";

export const defaultEntityDefinitions: DefineUnit[] = [
  {
    kind: "defineUnit",
    unit: {
      type: EntityType.tree_1,
      size: 1,
      buildTime: 0,
      cost: 0,
      maxHealth: 20,
      layer: "ground",
      graphical: {
        model: ModelType.tree_1
      },
    }
  },
  {
    kind: "defineUnit",
    unit: {
      type: EntityType.berry_bush,
      size: 1,
      buildTime: 0,
      cost: 0,
      maxHealth: 20,
      layer: "ground",
      graphical: {
        model: ModelType.berry_bush
      },
    }
  },
  {
    kind: "defineUnit",
    unit: {
      type: EntityType.gold_rock,
      size: 1,
      buildTime: 0,
      cost: 0,
      maxHealth: 20,
      layer: "ground",
      graphical: {
        model: ModelType.gold_rock
      },
    }
  },
  {
    kind: "defineUnit",
    unit: {
      type: EntityType.grass,
      size: 1,
      buildTime: 0,
      cost: 0,
      maxHealth: 20,
      layer: "ground",
      graphical: {
        model: ModelType.grass
      },
    }
  },
  {
    kind: "defineUnit",
    unit: {
      type: EntityType.green_guy,
      size: 1,
      buildTime: 0,
      cost: 0,
      maxHealth: 20,
      layer: "ground",
      graphical: {
        model: ModelType.green_guy
      },
    }
  },
  {
    kind: "defineUnit",
    unit: {
      type: EntityType.iron_rock,
      size: 1,
      buildTime: 0,
      cost: 0,
      maxHealth: 20,
      layer: "ground",
      graphical: {
        model: ModelType.iron_rock
      },
    }
  },
  {
    kind: "defineUnit",
    unit: {
      type: EntityType.rock,
      size: 1,
      buildTime: 0,
      cost: 0,
      maxHealth: 20,
      layer: "ground",
      graphical: {
        model: ModelType.rock
      },
    }
  }
]
