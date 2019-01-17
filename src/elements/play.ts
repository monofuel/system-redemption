import { PlanetElement } from "./planet";
import { OrbitControls, MOUSE, Vector2, Vector3 } from "three";
import { ServerEvent, GameStage, FrontendEvent, GameStageChange, frontendEventList } from "../events";
import { onTick, UpdateLoop } from "../events/serverContext";
import { info } from "../logging";
import { mouseToVec } from ".";
import { parseQueryOpts, QueryOpts, LoggedEvent } from "../matchMaker";
import { delay } from "../util";

export class PlayELement extends PlanetElement {
    private asyncEvents: ServerEvent[] = [];
    uiWrapper: HTMLSpanElement;

    private HUDPanel: HTMLCanvasElement;
    private HUDContext: CanvasRenderingContext2D;

    private opts: QueryOpts;
    private gameTickLoop?: UpdateLoop;

    private dragStart?: MouseEvent;
    private dragCurrent?: MouseEvent;

    constructor() {
        super();
        this.opts = parseQueryOpts(window.location.href);

        this.HUDPanel = document.createElement('canvas');
        this.HUDPanel.classList.add("HUDPanel");
        this.appendChild(this.HUDPanel);
        this.HUDContext = this.HUDPanel.getContext('2d')!;

        this.afterRender = () => {
            this.drawSelectionBox();
            if (
                this.HUDPanel.width === this.offsetWidth &&
                this.HUDPanel.height === this.offsetHeight
            ) {
                return;
            }
            this.HUDPanel.width = window.innerWidth;
            this.HUDPanel.height = window.innerHeight;
        }

        this.uiWrapper = document.createElement('span');
        this.uiWrapper.classList.add('ui-wrapper');
        this.appendChild(this.uiWrapper);

        this.camera.position.set(-20, 20, -20);
        this.camera.lookAt(0, 0, 0);

        const controls = new OrbitControls(this.camera, this);

        // leave left mouse button free for the game
        controls.mouseButtons = {
            LEFT: MOUSE.RIGHT,
            RIGHT: MOUSE.MIDDLE,
        } as any;

        if (this.opts.mode === 'single') {
            this.startMatch();
        } else {
            this.syncToServer();
        }

        controls.target.set(0, 0, 0);
        controls.update();
        controls.maxPolarAngle = (10 * Math.PI) / 21;

        this.addEventListener('mousedown', (e: MouseEvent) => {
            this.dragStart = e;
            this.dragCurrent = e;

        });

        this.addEventListener('mousemove', (ev: MouseEvent) => {
            this.dragCurrent = ev;

            if (this.ctx.gameState.selectedUnits.length > 0) {
                this.hilightAtMouse(ev);
            }
        })
        this.addEventListener('mouseup', (e: MouseEvent) => {
            if (e.button === 0) {
                this.ctx.post({
                    kind: 'hilightUpdate',
                })
                if (this.dragStart) {
                    const uuids = this.getSelectedUnits(this.dragStart, e);
                    this.ctx.post({
                        kind: 'selectUnits',
                        uuids
                    });
                }
                delete this.dragStart;
                delete this.dragCurrent;
            } else if (e.button === 2) {
                let dragDistance = 0;
                if (this.dragStart) {
                    const start = new Vector2(this.dragStart.x, this.dragStart.y);
                    const end = new Vector2(e.x, e.y);
                    dragDistance = start.distanceTo(end);
                }

                // ignore events if the mouse is dragged too far
                if (dragDistance > 5) {
                    return;
                }
                if (this.ctx.gameState.selectedUnits.length === 0) {
                    return;
                }
                const dest = this.getTileAtRay(mouseToVec(e, this.offsetWidth, this.offsetHeight), true)
                if (!dest) {
                    return;
                }
                this.ctx.post({
                    kind: 'hilightUpdate',
                    loc: dest,
                    color: 0xc60909,

                })
                this.ctx.post({
                    kind: 'setDestination',
                    uuids: this.ctx.gameState.selectedUnits,
                    dest
                })
            }
        });
        this.addEventListener('mouseleave', (e: MouseEvent) => {
            if (e.button === 0) {

                delete this.dragStart;
                delete this.dragCurrent;
            }
        })

        this.ctx.queue.addListener('gameTick', () => {
            if (this.opts.mode === 'single') {
                const events = this.onTick();
                for (const e of events) {
                    this.ctx.post(e);
                }
            }
        });

        if (this.opts.mode === 'single') {
            const { tps } = this.ctx.gameState.planet!;
            this.gameTickLoop = new UpdateLoop('gameTick', (delta) => {
                if (this.ctx.gameState.stage.mode === GameStage.running) {
                    info('game tick', { delta });
                    this.ctx.post({
                        kind: 'gameTick'
                    })
                }
                return this.ctx.gameState.stage.mode === GameStage.done;
            }, tps);
            this.gameTickLoop.start();
        }
    }

    private async syncToServer() {

        const localLogStr = localStorage.getItem('default-eventlog');
        const opts = parseQueryOpts(window.location.href);
        let localLog: (FrontendEvent | ServerEvent)[] = [];
        if (localLogStr && !opts.matchId) {
            try {
                const start = Date.now();
                localLog = JSON.parse(localLogStr);
                console.log(`LOADED FROM STORAGE ${Date.now() - start}ms`);
            } catch (err) {
                console.error(err);
                this.directToEditor('failed to load map, please reset map from the editor');
                return;
            }
        } else {
            if (!opts.matchId) {
                this.directToEditor();
                return;
            }
        }

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const { hostname, port } = window.location;
        const params = window.location.href.split('?')[1];
        const ws = new WebSocket(`${protocol}//${hostname}:${port}/ws?${params}`);
        ws.onopen = async () => {
            if (!opts.matchId) {
                let i = 0;
                for (const event of localLog) {
                    console.log(`syncing ${i++}`);
                    ws.send(JSON.stringify(event));
                    this.ctx.post(event);
                    await delay(0);
                }
            }
            this.ctx.post = (e) => {
                if (frontendEventList.includes(e.kind)) {
                    this.ctx.queue.post(e);
                } else {
                    ws.send(JSON.stringify(e));
                }
            }
            if (!opts.matchId) {
                this.ctx.post({
                    kind: 'gameStageChange',
                    // mode: GameStage.ready
                    mode: GameStage.running
                });
            }
            this.uiWrapper.innerHTML += '<admin-controls/>';
        }
        ws.onmessage = (e: MessageEvent) => {
            console.log(e);
            const event = JSON.parse(e.data);
            this.ctx.queue.post(event);
        }
    }

    private startMatch() {
        const localLogStr = localStorage.getItem('default-eventlog');

        if (localLogStr) {
            try {
                const start = Date.now();
                const localLog = JSON.parse(localLogStr);
                this.ctx.loadLog(localLog);
                this.ctx.post({
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
        this.ctx.post({
            kind: 'gameStageChange',
            mode: GameStage.running
        });
    }

    private drawSelectionBox() {
        this.HUDContext.clearRect(0, 0, this.HUDPanel.width, this.HUDPanel.height);
        if (!this.dragCurrent || !this.dragStart || this.dragStart.button !== 0) {
            return;
        }

        const startVec = new Vector2();
        startVec.x = (this.dragStart.clientX / this.HUDPanel.width) * 2 - 1;
        startVec.y = -(this.dragStart.clientY / this.HUDPanel.height) * 2 + 1;

        const curVec = new Vector2();
        curVec.x = (this.dragCurrent.clientX / this.HUDPanel.width) * 2 - 1;
        curVec.y = -(this.dragCurrent.clientY / this.HUDPanel.height) * 2 + 1;

        const widthHalf = 0.5 * this.HUDPanel.width;
        const heightHalf = 0.5 * this.HUDPanel.height;

        startVec.x = (startVec.x * widthHalf) + widthHalf;
        startVec.y = -(startVec.y * heightHalf) + heightHalf;

        curVec.x = (curVec.x * widthHalf) + widthHalf;
        curVec.y = - (curVec.y * heightHalf) + heightHalf;
        const maxX = Math.round(Math.max(startVec.x, curVec.x));
        const minX = Math.round(Math.min(startVec.x, curVec.x));
        const maxY = Math.round(Math.max(startVec.y, curVec.y));
        const minY = Math.round(Math.min(startVec.y, curVec.y));

        this.HUDContext.strokeStyle = '#7CFC00';
        this.HUDContext.lineWidth = 1;
        this.HUDContext.strokeRect(minX, minY, maxX - minX, maxY - minY);

    }

    private getSelectedUnits(dragStart: MouseEvent, dragEnd: MouseEvent) {
        const startVec = new Vector2();
        startVec.x = (dragStart.clientX / this.HUDPanel.width) * 2 - 1;
        startVec.y = -(dragStart.clientY / this.HUDPanel.height) * 2 + 1;

        const endVec = new Vector2();
        endVec.x = (dragEnd.clientX / this.HUDPanel.width) * 2 - 1;
        endVec.y = -(dragEnd.clientY / this.HUDPanel.height) * 2 + 1;

        const maxX = Math.max(startVec.x, endVec.x);
        const minX = Math.min(startVec.x, endVec.x);
        const maxY = Math.max(startVec.y, endVec.y);
        const minY = Math.min(startVec.y, endVec.y);

        const unitList: string[] = [];
        for (const key in this.ecs.graphical) {
            const comp = this.ecs.graphical[key];
            var vector = this.toScreenPosition(comp.mesh);
            if (vector.x < maxX && vector.x > minX && vector.y > minY && vector.y < maxY) {
                unitList.push(comp.key);
            }
        }
        return unitList;
    }

    toScreenPosition(obj: THREE.Object3D): THREE.Vector3 {
        const vector = new Vector3();
        obj.updateMatrixWorld(false);
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(this.camera);
        return vector;
    };

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

        onTick(this.ctx.gameState, this.asyncEvents);
        while (this.asyncEvents.length > 0) {
            results.push(this.asyncEvents.shift()!);
        }
        return results;
    }

    addAsyncEvent(event: ServerEvent) {
        this.asyncEvents.push(event);
    }
}