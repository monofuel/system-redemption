import { FiniteMap, Unit, UnitType, UnitDefinition, LocHash, GameStage } from "../../types/SR";

export interface GameState {
  planet?: FiniteMap;
  units: { [key: string]: Unit };
  unitDefinitions: Partial<Record<UnitType, UnitDefinition>>;
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