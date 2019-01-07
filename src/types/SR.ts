export type Direction = 'N' | 'S' | 'E' | 'W';

// corner heights: TL TR BL BR
export type TileHeights = [number, number, number, number];
export enum UnitType {
        tank = 'tank'
}

export interface PlanetTiles {
        x: number;
        y: number;

        grid: TileHeights[][];
        // navGrid: TileType[][];
}

export interface FiniteMap {
        name: string;
        version: number;
        waterHeight: number;
        landColor: number;
        edgeColor: number;
        waterColor: number;
        cliffColor: number;
        sunColor: number;
        size: number; // number of PlanetTile chunks
        chunkSize: number; // size of each PlanetTiles chunk
        grid: PlanetTiles[][];
}

export interface Unit {
        uuid: string;
        type: UnitType;
        facing: Direction;
        size: 1 | 2 | 3;
        x: number;
        y: number;
        map: string;
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
