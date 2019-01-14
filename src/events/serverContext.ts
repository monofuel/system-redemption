import { ServerEvent, ServerEventKinds, ServerEvents, GameStage } from ".";
import { GameState, newGameState, applyEvent } from "./state";
import { EventQueue } from "./queues";
import { info } from "../logging";
import { UpdateLoop } from "../elements/threeScene";
import { pathfind } from "../services/pathfind";

interface LoggedEvent {
    event: ServerEvent;
    timestamp: number;
    listeners: number;
}

// TODO this class is not tested
// similar to PlayElement and EventContextElement
export class ServerContext {
    public queue: EventQueue<ServerEventKinds, ServerEvents>;


    public events: LoggedEvent[] = [];
    public gameState: GameState;
    private asyncEvents: ServerEvent[] = [];
    private loaded: boolean = false;

    private gameTickLoop?: UpdateLoop;

    // TODO send game events to clients
    public onGameEvent?: (event: LoggedEvent) => void;

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
            if (this.loaded) {
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

    public async loadLog(events: Array<ServerEvent>) {
        this.loaded = false;
        this.gameState = newGameState();
        this.events = [];

        for (const event of events) {
            if (event.kind === 'assertion') {
                continue;
            }
            this.queue.post(event);
        }
        this.loaded = true;
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
            asyncEvents.push({
                kind: 'setPath',
                uuid,
                dest: unit.destination,
                path,
            });
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