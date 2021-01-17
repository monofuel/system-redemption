import { GameState } from "../store/dualfront";
import {
  NewMapEvent,
  CurrencyChangeEvent,
  BuildEvent,
  MoveEvent,
  TickEvent,
  AttackEvent,
  DestroyUnitEvent
} from "../actions/dualfront";
import * as _ from "lodash";
import { unitStats } from "../util/dualfront";

export const gameReducer = {
  newMapEvent: applyNewMapEvent,
  currencyChangeEvent: applyCurrencyChangeEvent,
  buildEvent: applyBuildEvent,
  moveEvent: applyMoveEvent,
  tickEvent: applyTickEvent,
  attackEvent: applyAttackEvent,
  destroyUnitEvent: applyDestroyUnitEvent
};

export function applyNewMapEvent(
  state: GameState,
  event: NewMapEvent
): GameState {
  return _.cloneDeep(event.state);
}

export function applyTickEvent(state: GameState, event: TickEvent): GameState {
  return {
    ...state,
    tick: event.id,
    units: state.units.map(unit => {
      return {
        ...unit,
        cooldown: unit.cooldown === 0 ? 0 : unit.cooldown - 1
      };
    })
  };
}

export function applyCurrencyChangeEvent(
  state: GameState,
  event: CurrencyChangeEvent
): GameState {
  return {
    ...state,
    players: state.players.map(player => {
      return {
        ...player,
        currency:
          event.player === player.id
            ? (player.currency += event.amount)
            : player.currency
      };
    })
  };
}

export function applyBuildEvent(
  state: GameState,
  event: BuildEvent
): GameState {
  const stats = unitStats[event.unit.type];
  return {
    ...state,
    players: state.players.map(player => {
      if (!event.unit.factory || event.unit.owner !== player.id) {
        return player;
      }
      return {
        ...player,
        currency: player.currency -= stats.cost
      };
    }),
    units: [
      ...state.units.map(unit => {
        if (unit.id !== event.factory) {
          return unit;
        }
        return {
          ...unit,
          cooldown: 10
        };
      }),
      {
        ...event.unit,
        health: event.unit.factory ? stats.maxHealth : 100
      }
    ]
  };
}

export function applyMoveEvent(state: GameState, event: MoveEvent): GameState {
  return {
    ...state,
    units: state.units.map(unit => {
      if (event.unit !== unit.id) {
        return unit;
      }
      return {
        ...unit,
        x: event.x,
        y: event.y
      };
    })
  };
}

export function applyAttackEvent(
  state: GameState,
  event: AttackEvent
): GameState {
  return {
    ...state,
    units: state.units.map(unit => {
      if (event.defender !== unit.id) {
        return unit;
      }
      return {
        ...unit,
        health: unit.health -= event.damage
      };
    })
  };
}
export function applyDestroyUnitEvent(
  state: GameState,
  event: DestroyUnitEvent
): GameState {
  return {
    ...state,
    units: state.units.filter(unit => {
      return event.unit !== unit.id;
    })
  };
}
