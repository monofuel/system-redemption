import { ThreeSceneElement, UpdateLoop } from "./threeScene";
import { Entity } from "../mesh/entity";
import { PlanetElement } from "./planet";
import { OrbitControls, MOUSE } from "three";

export class PlayELement extends PlanetElement {
    uiWrapper: HTMLSpanElement;

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
}