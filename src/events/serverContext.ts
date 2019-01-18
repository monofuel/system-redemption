import { ServerEvent, ServerEventKinds, ServerEvents, GameStage, FrontendEvent } from ".";
import { GameState, newGameState, applyEvent } from "./state";
import { EventQueue } from "./queues";
import { info } from "../logging";
import { pathfind } from "../services/pathfind";
import { deflateSync } from "zlib";
import { delay } from "../util";

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
                info('detaching loop', { name: this.name });
                return;
            }
            const startTime = Date.now();
            const end = this.fn(startTime - lastTime);
            if (end) {
                info('detaching loop', { name: this.name });
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

    public onGameEvent?: (event: ServerEvent | FrontendEvent) => void;

    constructor() {
        this.gameState = newGameState();
        this.queue = new EventQueue({
            postSyncronous: true,
            preHandler: (event) => {
                applyEvent(this.gameState, event);
            },
            logger: (event, timestamp, listeners) => {
                this.events.push({ event, timestamp, listeners });
                info('event posted', {
                    event: JSON.stringify(event),
                    timestamp,
                    listeners,
                });
                if (this.onGameEvent) {
                    this.onGameEvent(event);
                }
            },
        });
        this.queue.addListener('gameTick', () => {
            if (this.gameState.stage.mode === GameStage.running) {

                const events = this.onTick();
                for (const e of events) {
                    this.queue.post(e);
                }
            }
        });
        this.queue.addListener('newFiniteMap', (e) => {
            const { tps } = e.map;
            this.gameTickLoop = new UpdateLoop('gameTick', (delta) => {
                if (this.gameState.stage.mode === GameStage.running) {
                    info('game tick', { delta });
                    this.queue.post({
                        kind: 'gameTick'
                    })
                }
                return this.gameState.stage.mode === GameStage.done;
            }, tps);
            this.gameTickLoop.start();

        })
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
            if (event.kind === 'assertion') {
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
        while (this.asyncEvents.length > 0) {
            results.push(this.asyncEvents.shift()!);
        }

        onTick(this.gameState, this.asyncEvents);

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
        const unit = state.units[uuid];
        if (unit.destination && !unit.path) {
            const path = pathfind(state, uuid, unit.destination);
            if (path.length === 0) {
                // no path found, clear destination
                asyncEvents.push({
                    kind: 'setDestination',
                    uuids: [uuid]
                })
            } else {

                asyncEvents.push({
                    kind: 'setPath',
                    uuid,
                    dest: unit.destination,
                    path,
                });
            }
        }
        if (unit.moveCooldown === 0 && unit.path && unit.path.length > 0) {
            asyncEvents.push({
                kind: 'moveUnit',
                uuid,
                dir: unit.path[0]
            })
        }
    }
}