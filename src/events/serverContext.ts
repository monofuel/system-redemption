import {
  ServerEvent,
  ServerEventKinds,
  ServerEvents,
  GameStage,
  FrontendEvent
} from ".";
import { GameState, newGameState, applyEvent } from "./state";
import { EventQueue } from "./queues";
import { info } from "../logging";
import { pathfind, getTileInDirection, locDistance } from "../services/pathfind";
import { deflateSync } from "zlib";
import { delay } from "../util";
import { unHash } from "../services/hash";
import { LocHash } from "../types/SR";

interface LoggedEvent {
  event: ServerEvent;
  timestamp: number;
  listeners: number;
}

export class UpdateLoop {
  private name: string;
  private fn: (delta: number) => boolean;
  private freq: number;
  private stopFlag: boolean = false;

  constructor(name: string, fn: (delta: number) => boolean, freq: number) {
    this.name = name;
    this.fn = fn;
    this.freq = freq;
  }

  public start() {
    let lastTime = Date.now();
    const loopFn = () => {
      if (this.stopFlag) {
        info("detaching loop", { name: this.name });
        return;
      }
      const startTime = Date.now();
      const end = this.fn(startTime - lastTime);
      if (end) {
        info("detaching loop", { name: this.name });
        return;
      }
      lastTime = Date.now();
      setTimeout(loopFn, 1000 / this.freq - (lastTime - startTime));
    };
    loopFn();
  }

  public stop() {
    this.stopFlag = true;
  }
}

// TODO this class is not tested
// similar to PlayElement and EventContextElement
export class ServerContext {
  public queue: EventQueue<ServerEventKinds, ServerEvents>;

  public events: LoggedEvent[] = [];
  public gameState: GameState;
  private asyncEvents: ServerEvent[] = [];

  private gameTickLoop?: UpdateLoop;
  private flushLoop: UpdateLoop;

  public onGameEvent?: (event: ServerEvent | FrontendEvent) => void;

  constructor() {
    this.gameState = newGameState();
    this.queue = new EventQueue({
      postSyncronous: false,
      preHandler: event => {
        applyEvent(this.gameState, event);
      },
      logger: (event, timestamp, listeners) => {
        this.events.push({ event, timestamp, listeners });
        info("event posted", {
          event: JSON.stringify(event),
          timestamp,
          listeners
        });
        if (this.onGameEvent) {
          this.onGameEvent(event);
        }
      }
    });

    this.queue.addListener("gameTick", () => {
      if (this.gameState.stage.mode === GameStage.running) {
        const events = this.onTick();
        info("handling ontick events", { length: events.length });
        for (const e of events) {
          this.queue.post(e);
        }
      }
    });
    this.queue.addListener("newFiniteMap", e => {
      const { tps } = e.map;
      this.gameTickLoop = new UpdateLoop(
        "gameTick",
        delta => {
          if (this.gameState.stage.mode === GameStage.running) {
            info("game tick", { delta });

            this.queue.post({
              kind: "gameTick"
            });
            this.queue.flushAll();
          }
          return this.gameState.stage.mode === GameStage.done;
        },
        tps
      );
      this.gameTickLoop.start();
    });

    this.flushLoop = new UpdateLoop(
      "queueFlush",
      (delta: number) => {
        this.queue.flushAll();
        return false;
      },
      30
    );
    this.flushLoop.start();
  }

  public dispose() {
    if (this.gameTickLoop) {
      this.gameTickLoop.stop();
    }
  }
  public async loadLog(events: Array<ServerEvent>) {
    this.gameState = newGameState();
    this.events = [];

    for (const event of events) {
      if (event.kind === "assertion") {
        continue;
      }
      this.queue.post(event);
    }
  }

  // onTick should run after every game tick
  // it should not be called when replaying the event log
  // it does game tick work for appending new events
  onTick(): ServerEvent[] {
    const results: ServerEvent[] = [];
    onTick(this.gameState, this.asyncEvents);

    while (this.asyncEvents.length > 0) {
      results.push(this.asyncEvents.shift()!);
    }

    return results;
  }

  addAsyncEvent(event: ServerEvent) {
    this.asyncEvents.push(event);
  }
}

/**
 *
 * @param state READ ONLY game state (may change if read asyncronously)
 * @param asyncEvents array to push to for events (can be done asyncronously)
 */
export function onTick(state: GameState, asyncEvents: ServerEvent[]) {
  for (const uuid in state.units) {
    unitOnTick(state, asyncEvents, uuid);

  }
}

function unitOnTick(state: GameState, asyncEvents: ServerEvent[], uuid: string) {
  const unit = state.units[uuid];
  const def = state.unitDefinitions[unit.type]!;
  if (unit.destination && !unit.path) {
    const path = pathfind(state, uuid, unit.destination);
    if (path.length === 0) {
      // no path found, clear destination
      asyncEvents.push({
        kind: "setDestination",
        uuids: [uuid]
      });
    } else {
      asyncEvents.push({
        kind: "setPath",
        uuid,
        dest: unit.destination,
        path
      });
    }
  }
  if (unit.moveCooldown === 0 && unit.path && unit.path.length > 0) {
    const dir = unit.path[0];
    const nextLoc = getTileInDirection(unit.loc, dir);
    if (!state.cache.unitLocations[nextLoc]) {
      asyncEvents.push({
        kind: "moveUnit",
        uuid,
        dir
      });
      return;
    }
  }
  if (unit.health && def.maxHealth !== 0 && unit.health <= 0) {
    asyncEvents.push({
      kind: "destroyUnit",
      uuid
    });
    return;
  }

  if (def.attack && (!unit.attackCooldown || unit.attackCooldown <= 0)) {
    // TODO check if we have a current target
    // check for enemies in range
    const nearby = unitsInRange(state, unit.loc, def.attack.range);
    console.log(nearby);
    nearby.sort((a, b) => b.dist - a.dist);
    for (const { uuid: nearbyUuid } of nearby) {
      if (unit.uuid === nearbyUuid) {
        continue;
      }
      const nearbyUnit = state.units[nearbyUuid];
      if (nearbyUnit.color !== unit.color) {
        asyncEvents.push({
          kind: 'damageUnit',
          uuid: nearbyUnit.uuid,
          amount: def.attack.damage,
          source: unit.uuid,
        })
        return;
      }
    }
  }
}


function unitsInRange(state: GameState, loc: LocHash, range: number): { uuid: string, dist: number }[] {
  const units: { uuid: string, dist: number }[] = [];
  for (const uuid in state.units) {
    const unit = state.units[uuid];

    const dist = locDistance(loc, unit.loc);
    if (dist < range) {
      units.push({ uuid, dist });
    }
  }
  return units;

}
