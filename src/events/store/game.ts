import { EntityType } from "../../types/planefront";
import { FiniteMap, Entity, UnitType, EntityDefinition, LocHash, GameStage } from "../../types/SR";

export interface GameState {
  planet?: FiniteMap;
  units: { [key: string]: Entity };
  unitDefinitions: Partial<Record<UnitType | EntityType, EntityDefinition>>;
  stage: {
    tick: number;
    mode: GameStage;
  };
  match?: {
    id: string;
  };
  cache: {
    unitLocations: Record<LocHash, string>;
  };
}

export function newGameState(): GameState {
  return {
    units: {},
    unitDefinitions: {},
    stage: {
      tick: 0,
      mode: GameStage.init
    },
    cache: {
      unitLocations: {}
    }
  };
}
