import { NewMapEvent } from "../actions/dualfront";
import { newGameState, UnitType } from "../store/dualfront";

export interface UnitState {
  cost: number;
  speed: number;
  reward: number;
  attackRange?: number;
  attackDamage?: number;
  maxHealth: number;
}

export const unitStats: Record<UnitType, UnitState> = {
  [UnitType.base]: { maxHealth: 100, cost: 1000, reward: 1000, speed: 0 },
  [UnitType.square]: {
    maxHealth: 20,
    cost: 150,
    reward: 10,
    attackDamage: 1,
    speed: 1,
    attackRange: 2
  },
  [UnitType.triangle]: {
    maxHealth: 10,
    cost: 100,
    reward: 10,
    attackDamage: 1.5,
    speed: 1,
    attackRange: 2
  }
};

export function createNewMapEvent(): NewMapEvent {
  return {
    kind: "newMapEvent",
    state: newGameState()
  };
}
