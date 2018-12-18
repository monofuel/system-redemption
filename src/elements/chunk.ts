import { noop } from 'lodash';
import {
    Color, DirectionalLight, DoubleSide, Face3,
    Geometry, HemisphereLight, Line,
    LineBasicMaterial, Mesh, MeshPhongMaterial, Texture, TextureLoader, Vector2, Vector3,
} from 'three';
import { info } from '../logging';
import { getChunkGenerator } from '../planet/chunk';
import { PlanetChunk } from '../types/SR';
import { ThreeSceneElement } from './threeScene';

interface ChunkTestOpts {
    landColor: number;
    sunColor: number;
    seed: number;
    rpm: number;
}

export class ChunkTestElement extends ThreeSceneElement {

    private opts: ChunkTestOpts = {
        landColor: 0x37DB67,
        sunColor: 0xcccccc,
        seed: 116332,
        rpm: 1,
    };

    constructor() {
        super();
        const { sunColor } = this.opts;
        this.loadChunk();
        info('foo');
        this.scene.add(new HemisphereLight(0xffffff, 0xFFBF00, 0.3));
        this.scene.add(new DirectionalLight(sunColor, 1));

        this.dat.add(this.opts, 'seed').onFinishChange(() => {
            this.loadChunk();
        });
        this.dat.add(this.opts, 'rpm', 0, 10);
    }

    private async loadChunk() {
        const chunkName = 'chunk-1';

        const { seed } = this.opts;
        const tileTex = await new Promise<Texture>((resolve, reject) => {
            new TextureLoader().load('/models/tile.png', resolve, noop, reject);
        });

        const chunkGen = getChunkGenerator(seed);
        const chunk = await chunkGen({ x: 0, y: 0, size: 32 });
        const chunkMesh = getChunkMesh(chunk, this.opts.landColor, tileTex);
        chunkMesh.name = chunkName;
        chunkMesh.geometry.center();
        chunkMesh.translateY(-10);
        const prevChunk = this.scene.getObjectByName(chunkName);
        if (prevChunk) {
            this.scene.remove(prevChunk);
        }
        this.scene.add(chunkMesh);
        this.addUpdateLoop('rotation', (delta: number) => {
            const rps = this.opts.rpm / 60;
            chunkMesh.rotateOnAxis(new Vector3(0, 1, 0), (Math.PI / (500 / delta)) * rps);
            return false;
        }, 40);
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

function getChunkMesh(chunk: PlanetChunk, landColor: number, tileTex: Texture): Mesh {
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

    // fiddle with the normals to give a nice 'tiled' look
    for (let i = 0; i < geom.faces.length; i += 2) {

        const vec1 = geom.faces[i].normal;
        const vec2 = geom.faces[i + 1].normal;
        const newVec = vec1.clone();
        newVec.add(vec2);
        newVec.divideScalar(2);

        for (let j = 0; j < 2; j++) {
            geom.faces[i].vertexNormals[j].copy(newVec);
            geom.faces[i + 1].vertexNormals[j].copy(newVec);
        }

        // set texture UV
        geom.faceVertexUvs[0][i] = [
            new Vector2(0, 1),
            new Vector2(0, 0),
            new Vector2(1, 1),
        ];

        geom.faceVertexUvs[0][i + 1] = [
            new Vector2(0, 0),
            new Vector2(1, 0),
            new Vector2(1, 1),
        ];

    }

    geom.normalsNeedUpdate = true;
    geom.uvsNeedUpdate = true;

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
