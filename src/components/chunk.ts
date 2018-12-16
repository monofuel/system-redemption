import { noop } from 'lodash';
import {
    Camera, DirectionalLight, DoubleSide, Face3, Geometry,
    HemisphereLight, Line, LineBasicMaterial,
    Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, Texture, TextureLoader, Vector3, WebGLRenderer,
} from 'three';
import { info } from '../logging';
import { getChunkGenerator } from '../planet/chunk';
import { PlanetChunk } from '../types/SR';

const landColor = 0x37DB67;
const sunColor = 0xcccccc;

export class ChunkTest extends HTMLElement {
    public renderer: WebGLRenderer;
    public scene: Scene;
    public camera: Camera;

    public chunkMesh: Mesh | undefined;

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

        this.scene.add(new HemisphereLight(0xffffff, 0xFFBF00, 0.3));
        this.scene.add(new DirectionalLight(sunColor, 1));

        // this.scene.add(getLine());

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(this.renderer.domElement);
        this.render();
    }

    private async loadChunk() {

        const tileTex = await new Promise<Texture>((resolve, reject) => {
            new TextureLoader().load('/models/tile.png', resolve, noop, reject);
        });

        const chunkGen = getChunkGenerator(5);
        const chunk = await chunkGen({ x: 0, y: 0, size: 64 });
        this.chunkMesh = getChunkMesh(chunk, tileTex);
        this.chunkMesh.geometry.center();
        this.chunkMesh.translateY(-10);
        this.scene.add(this.chunkMesh);
    }

    private render() {
        if (!this.isConnected) {
            info('detaching chunk test render');
            return;
        }
        if (this.chunkMesh) {
            this.chunkMesh.rotateOnAxis(new Vector3(0, 1, 0), Math.PI / 200);
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

function getChunkMesh(chunk: PlanetChunk, tileTex: Texture): Mesh {
    const { grid, size } = chunk;
    const geom = new Geometry();
    for (let y = 0; y <= size; y++) {
        for (let x = 0; x <= size; x++) {
            geom.vertices.push(new Vector3(y, x, grid[y][x]));
        }
    }

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            // console.log(x, y);
            const landFace1 = new Face3(
                y * (size + 1) + x,
                y * (size + 1) + 1 + x,
                (y + 1) * (size + 1) + x);
            const landFace2 = new Face3(
                y * (size + 1) + x + 1,
                (y + 1) * (size + 1) + x + 1,
                (y + 1) * (size + 1) + x);

            geom.faces.push(landFace1, landFace2);
        }
    }
    geom.computeBoundingSphere();
    geom.computeFaceNormals();
    geom.computeVertexNormals();

    geom.rotateX(Math.PI / 2);

    const material = new MeshPhongMaterial({
        color: landColor,
        map: tileTex,
        shininess: 1,
        side: DoubleSide,
    });
    const mesh = new Mesh(geom, material);
    return mesh;

}
