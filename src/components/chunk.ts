import { Camera, Geometry, Line, LineBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { info } from '../logging';

export class ChunkTest extends HTMLElement {
    public renderer: WebGLRenderer;
    public scene: Scene;
    public camera: Camera;
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

        const material = new LineBasicMaterial({ color: 0x0000ff });
        const geometry = new Geometry();
        geometry.vertices.push(new Vector3(-10, 0, 0));
        geometry.vertices.push(new Vector3(0, 10, 0));
        geometry.vertices.push(new Vector3(10, 0, 0));

        const line = new Line(geometry, material);
        this.scene.add(line);

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(this.renderer.domElement);
        this.render();
    }

    private render() {
        if (!this.isConnected) {
            info('detaching chunk test render');
            return;
        }
        info(`children: ${this.scene.children.length}`);
        this.scene.children[0].rotateOnAxis(new Vector3(0, 1, 0), Math.PI / 100);
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.render());
    }
}
