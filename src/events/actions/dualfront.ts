import { GameState, GameUnit } from "../store/dualfront";

export interface NewMapEvent {
  kind: "newMapEvent";
  state: GameState;
}

export interface CurrencyChangeEvent {
  kind: "currencyChangeEvent";
  amount: number;
  player: string;
}

export interface BuildEvent {
  kind: "buildEvent";
  unit: GameUnit;
  factory?: string;
}

export interface AttackEvent {
  kind: "attackEvent";
  attacker: string;
  defender: string;
  damage: number;
}

export interface DestroyUnitEvent {
  kind: "destroyUnitEvent";
  unit: string;
}

export interface MoveEvent {
  kind: "moveEvent";
  unit: string;
  x: number;
  y: number;
}
export interface TickEvent {
  kind: "tickEvent";
  id: number;
}

export interface Events {
  newMapEvent: NewMapEvent;
  currencyChangeEvent: CurrencyChangeEvent;
  buildEvent: BuildEvent;
  moveEvent: MoveEvent;
  attackEvent: AttackEvent;
  destroyUnitEvent: DestroyUnitEvent;
  tickEvent: TickEvent;
}
export type EventKinds = keyof Events;
export type GameEvent = Events[EventKinds];
