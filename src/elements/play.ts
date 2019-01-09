import { PlanetElement } from "./planet";
import { OrbitControls, MOUSE } from "three";
import { ServerEvent, GameStage } from "../events";
import { onTick } from "../events/serverContext";
import { UpdateLoop } from "./threeScene";
import { info } from "../logging";

export class PlayELement extends PlanetElement {
    private asyncEvents: ServerEvent[] = [];
    uiWrapper: HTMLSpanElement;

    private singlePlayer: boolean = false;
    private gameTickLoop?: UpdateLoop;

    constructor() {
        super();

        this.uiWrapper = document.createElement('span');
        this.uiWrapper.classList.add('ui-wrapper');
        this.appendChild(this.uiWrapper);

        const localLogStr = localStorage.getItem('default-eventlog');

        if (localLogStr) {
            try {
                const start = Date.now();
                const localLog = JSON.parse(localLogStr);
                this.ctx.loadLog(localLog);
                this.ctx.queue.post({
                    kind: 'gameStageChange',
                    mode: GameStage.ready
                })
                console.log(`LOADED FROM STORAGE ${Date.now() - start}ms`);
            } catch (err) {
                console.error(err);
                this.directToEditor('failed to load map, please reset map from the editor');
                return;
            }
        } else {
            this.directToEditor();
            return;
        }

        this.camera.position.set(-20, 20, -20);
        this.camera.lookAt(0, 0, 0);

        const controls = new OrbitControls(this.camera, this);

        // leave left mouse button free for the game
        controls.mouseButtons = {
            LEFT: MOUSE.RIGHT,
            RIGHT: MOUSE.MIDDLE,
        } as any;


        controls.target.set(0, 0, 0);
        controls.update();
        controls.maxPolarAngle = (10 * Math.PI) / 21;

        this.ctx.queue.addListener('gameTick', () => {
            if (this.singlePlayer) {
                const events = this.onTick();
                for (const e of events) {
                    this.ctx.queue.post(e);
                }
            }
        });

        const { tps } = this.ctx.gameState.planet!;
        if (this.singlePlayer) {
            this.gameTickLoop = new UpdateLoop('gameTick', (delta) => {
                if (this.ctx.gameState.stage.mode === GameStage.running) {
                    info('game tick', { delta });
                    this.ctx.queue.post({
                        kind: 'gameTick'
                    })
                }
                return this.ctx.gameState.stage.mode === GameStage.done;
            }, tps);
            this.gameTickLoop.start();
        }
        if (this.singlePlayer) {
            this.startMatch();
        } else {
            this.syncToServer();
        }
    }

    private async syncToServer() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const { hostname, port } = window.location;
        const ws = new WebSocket(`${protocol}//${hostname}:${port}/ws`);
        ws.onopen = () => {
            // TODO stream current log to server if owner
        }
        ws.onmessage = (e: MessageEvent) => {
            console.log(e);
        }
    }

    private startMatch() {
        this.ctx.queue.post({
            kind: 'gameStageChange',
            mode: GameStage.running
        });
    }

    private directToEditor(msg?: string) {
        const popup = document.createElement('div');
        popup.classList.add('ui-leftbar');
        if (msg) {
            popup.innerText = msg;
        } else {
            popup.innerText = 'No map saved, please make one in the editor!';
        }
        const link = document.createElement('a');
        link.innerText = 'Go To Editor';
        link.classList.add("ui-button");
        link.href = '/test/chunk/editor.html';
        popup.appendChild(link);
        this.uiWrapper.appendChild(popup);
    }

    // only needs to run for single player
    // onTick should run after every game tick
    // it should not be called when replaying the event log
    // it does game tick work for appending new events
    onTick(): ServerEvent[] {
        const results: ServerEvent[] = [];
        while (this.asyncEvents.length > 0) {
            results.push(this.asyncEvents.shift()!);
        }

        onTick(this.ctx.gameState, this.asyncEvents);

        return results;
    }

    addAsyncEvent(event: ServerEvent) {
        this.asyncEvents.push(event);
    }
}