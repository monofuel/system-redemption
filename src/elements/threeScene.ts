import { Camera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { info } from '../logging';

export class ThreeSceneElement extends HTMLElement {
    public renderer: WebGLRenderer;
    public scene: Scene;
    public camera: Camera;

    private updateLoops: { [key: string]: UpdateLoop } = {};

    constructor() {
        super();

        this.renderer = new WebGLRenderer();
        const height = 500;
        const width = 500;

        this.renderer.setSize(height, width);
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(45, width / height, 1, 500);
        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(0, 0, 0);

        this.render();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(this.renderer.domElement);
    }

    public addUpdateLoop(name: string, fn: () => boolean, freq: number) {
        info('attaching update loop', { name, freq });
        const loop = new UpdateLoop(name, fn, freq);
        this.updateLoops[name] = loop;
        loop.start();
    }

    private render() {
        if (!this.isConnected) {
            info('detaching scene render');
            return;
        }

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.render());
    }
}

export class UpdateLoop {
    private name: string;
    private fn: () => boolean;
    private freq: number;
    private stopFlag: boolean = false;

    constructor(name: string, fn: () => boolean, freq: number) {
        this.name = name;
        this.fn = fn;
        this.freq = freq;
    }

    public start() {
        const loopFn = () => {
            if (this.stopFlag) {
                info('detaching loop', { name: this.name });
                return;
            }
            const startTime = Date.now();
            const end = this.fn();
            if (end) {
                info('detaching loop', { name: this.name });
                return;
            }
            setTimeout(loopFn, (1000 / this.freq) - (Date.now() - startTime));

        };
        loopFn();
    }

    public stop() {
        this.stopFlag = true;
    }
}
