import {
    Camera, Face3, Geometry, Line, LineBasicMaterial, Mesh,
    MeshBasicMaterial, MeshLambertMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer, WireframeGeometry,
} from 'three';
import { info } from '../logging';
import { getChunkGenerator } from '../planet/chunk';
import { PlanetChunk } from '../types/SR';

export class ChunkTest extends HTMLElement {
    public renderer: WebGLRenderer;
    public scene: Scene;
    public camera: Camera;

    public chunk: PlanetChunk | undefined;

    constructor() {
        super();

        this.loadChunk();

        this.renderer = new WebGLRenderer();
        const height = 500;
        const width = 500;

        this.renderer.setSize(height, width);
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(45, width / height, 1, 500);
        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(0, 0, 0);

        // this.scene.add(getLine());

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(this.renderer.domElement);
        this.render();
    }

    private async loadChunk() {
        const chunkGen = getChunkGenerator(5);
        const chunk = await chunkGen({ x: 0, y: 0, size: 16 });
        this.chunk = chunk;
        const mesh = getChunkMesh(chunk);
        this.scene.add(mesh);
    }

    private render() {
        if (!this.isConnected) {
            info('detaching chunk test render');
            return;
        }
        if (this.scene.children.length !== 0) {
            this.scene.children[0].rotateOnAxis(new Vector3(0, 1, 0), Math.PI / 100);
        }
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.render());
    }
}

function getLine() {
    const material = new LineBasicMaterial({ color: 0x0000ff });
    const geometry = new Geometry();
    geometry.vertices.push(new Vector3(-10, 0, 0));
    geometry.vertices.push(new Vector3(0, 10, 0));
    geometry.vertices.push(new Vector3(10, 0, 0));

    return new Line(geometry, material);
}

function getChunkMesh(chunk: PlanetChunk): Mesh {
    const { grid } = chunk;
    const geom = new Geometry();
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            geom.vertices.push(new Vector3(y, x, grid[y][x]));
        }
    }

    for (let y = 0; y < grid.length - 1; y++) {
        for (let x = 0; x < grid[y].length - 1; x++) {

            const landFace1 = new Face3(
                y * (grid.length) + x,
                y * (grid.length) + 1 + x,
                (y + 1) * (grid.length) + x);
            const landFace2 = new Face3(
                y * (grid.length) + x + 1,
                (y + 1) * (grid.length) + x + 1,
                (y + 1) * (grid.length) + x);

            geom.faces.push(landFace1, landFace2);
        }
    }
    geom.computeFaceNormals();
    geom.computeVertexNormals();

    geom.rotateX(-Math.PI / 2);

    const wireGeom = new WireframeGeometry(geom);
    const material = new MeshBasicMaterial({ color: 0x0000ff });
    const mesh = new Mesh(wireGeom, material);
    return mesh;

}
