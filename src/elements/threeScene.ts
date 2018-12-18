import { Camera, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { info } from '../logging';
import './styles/threeScene.scss';

export class ThreeSceneElement extends HTMLElement {
    public renderer: WebGLRenderer;
    public scene: Scene;
    public camera: PerspectiveCamera;

    private updateLoops: { [key: string]: UpdateLoop } = {};

    constructor() {
        super();

        this.renderer = new WebGLRenderer();
        const height = this.offsetHeight;
        const width = this.offsetWidth;

        this.renderer.setSize(height, width);
        this.scene = new Scene();
        const aspectRatio = this.offsetWidth / this.offsetHeight;
        this.camera = new PerspectiveCamera(45, aspectRatio, 1, 500);
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

    private resize() {
        const renderSize = this.renderer.getSize();
        if (renderSize.width === this.offsetWidth &&
            renderSize.height === this.offsetHeight) {
            return;
        }
        /*
        info('detecting size', {
            offsetHeight: this.offsetHeight,
            offsetWidth: this.offsetWidth,
            renderWidth: renderSize.width,
            renderHeight: renderSize.height,
        });
        */
        this.camera.aspect = this.offsetWidth / this.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.offsetWidth, this.offsetHeight);
    }

    private render() {
        this.resize();
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
