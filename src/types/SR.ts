import { EntityType } from "./planefront";

export type LocHash = string;
export enum ModelType {
  LightTankLvl1 = 'LightTankLvl1',
  LightTankLvl2 = 'LightTankLvl2',
  LightTankLvl3 = 'LightTankLvl3',
  HeavyTankLvl3 = 'HeavyTankLvl3',

  // planefront model types
  tree_1 = 'tree_1',
  berry_bush = 'berry_bush',
  gold_rock = 'gold_rock',
  grass = 'grass',
  green_guy = 'green_guy',
  iron_rock = 'iron_rock',
  rock = 'rock',
}

export enum GameStage {
  init = 'init', // default state, map still loading
  ready = 'ready', // map ready for players
  running = 'running', // ticking
  done = 'done',
}

export enum GameColors {
  blue = 'blue',
  green = 'green',
  grey = 'grey',
  red = 'red',
  white = 'white',
  yellow = 'yellow',
}

export enum Biomes {
  grass = 'grass',
  tech = 'tech',
  concrete = 'concrete',
  snow = 'snow',
  desert = 'desert',
  swamp = 'swamp',
}

export type Direction = 'N' | 'S' | 'E' | 'W';

export type Layer = 'ground' | 'air' | 'water';

// corner heights: TL TR BL BR
export type TileHeights = [number, number, number, number];

export enum UnitType {
  tank = 'tank',
  ltank2 = 'ltank2',
  ltank3 = 'ltank3',
  htank3 = 'htank3',
}

export interface PlanetTiles {
  x: number;
  y: number;

  grid: TileHeights[][];
  biomes: Biomes[][];
}

export interface BiomeColors {
  landColor: number;
  edgeColor: number;
  waterColor: number;
  cliffColor: number;
}

export interface FiniteMap {
  name: string;
  version: number;
  tps: number;
  waterHeight: number;
  biomeColors: Record<Biomes, BiomeColors>;
  sunColor: number;
  zScale: number;
  size: number; // number of PlanetTile chunks
  chunkSize: number; // size of each PlanetTiles chunk
  grid: PlanetTiles[][];
}

export interface EntityDefinition {
  type: UnitType | EntityType;
  size: 1 | 2 | 3;
  buildTime: number;
  cost: number;
  maxHealth: number;
  layer: Layer;
  // vision: number;
  // fuelBurnLength: number;
  move?: {
    cooldown: number;
  };
  attack?: {
    layers: Layer[];
    range: number;
    damage: number;
    cooldown: number;
  };
  storage?: {
    maxIron?: number;
    maxFuel?: number;
  };
  graphical?: {
    model: ModelType;
  };
}

export interface Entity {
  uuid: string;
  color?: GameColors;
  type: UnitType | EntityType;
  facing: Direction;
  size: 1 | 2 | 3;
  loc: LocHash;
  health?: number;
  destination?: LocHash;
  map: string;
  moveCooldown: number;
  attackCooldown?: number;
  path?: Direction[];
}

/*
// old stuff

movable: null | UnitMovable;
        attack: null | UnitAttack;
        storage: null | UnitStorage;
        graphical: null | UnitGraphical;
        stationary: null | UnitStationary;
        construct: null | UnitConstruct;

interface UnitDetails {
        type: UnitType,
        size: number,
        buildTime: number,
        vision: number,
        cost: number,
        health: number,
        maxHealth: number,
        lastTick: number,
        ghosting: boolean,
        owner: string,
        unfueled: boolean,
        ironRate: number,
        fuelRate: number,
        fuelBurn: number,
        fuelBurnLength: number, // ticks to use 1 unit of fuel
}

interface UnitLocation {
        hash: TileHash[],
        x: number,
        y: number,
        chunkHash: ChunkHash[],
        chunkX: number,
        chunkY: number,
        map: string,
}

interface UnitMovable {
        layer: MovementLayer,
        speed: number,
        movementCooldown: number,
        path: Array<Dir>,
        movementAttempt: number,
        pathAttempt: number,
        isPathing: boolean,
        pathUpdate: number,
        destination: null | TileHash,
        transferGoal: null | {
                uuid: string,
                iron?: number,
                fuel?: number,
        }
}

interface UnitAttack {
        layers: Array<MovementLayer>,
        range: number,
        damage: number,
        fireRate: number,
        fireCooldown: number,
}
interface UnitStorage {
        iron: number,
        fuel: number,
        maxIron: number,
        maxFuel: number,
        transferRange: number,
        resourceCooldown: number,
        receive?: boolean,
        desired?: {
                iron: number,
                fuel: number
        }
}

interface UnitGraphical {
        model: string,
        scale: number,
}

interface UnitStationary {
        layer: MovementLayer,
}

interface UnitConstruct {
        types: Array<string>,
        constructing?: {
                remaining: number,
                type: string,
        }
        // HACK is separately loaded from the factoryQueue table
        queue?: FactoryOrder[],
}


*/
