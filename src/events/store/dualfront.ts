import * as uuid from "uuid";

export enum UnitType {
  base = "base",
  triangle = "triangle",
  square = "square"
}

export interface GameUnit {
  id: string;
  x: number;
  y: number;
  factory: boolean;
  type: UnitType;
  owner: string;
  health: number;
  cooldown: number;
}

export interface Player {
  id: string;
  currency: number;
  color: number;
}

export interface GameState {
  worldSize: {
    x: number;
    y: number;
  };
  players: Player[];
  units: GameUnit[];
  backgroundColor: number;
  tick: number;
}

export function newGameState(): GameState {
  const d = 20;

  // add 2 players
  const player1: Player = {
    id: uuid.v4(),
    currency: 500,
    color: 0x33cc33
  };
  const player2: Player = {
    id: uuid.v4(),
    currency: 500,
    color: 0xff6666
  };

  // add a base for each player
  const base1: GameUnit = {
    id: uuid.v4(),
    x: 10,
    y: 54 / 2,
    factory: false,
    type: UnitType.base,
    owner: player1.id,
    health: 100,
    cooldown: 0
  };
  const base2: GameUnit = {
    id: uuid.v4(),
    x: 86,
    y: 54 / 2,
    factory: false,
    type: UnitType.base,
    owner: player2.id,
    health: 100,
    cooldown: 0
  };

  return {
    worldSize: {
      x: 96,
      y: 90
    },
    players: [player1, player2],
    units: [base1, base2],
    backgroundColor: 0x3366ff,
    tick: 0
  };
}
