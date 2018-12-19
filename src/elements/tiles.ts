import { noop } from 'lodash';
import {
    DirectionalLight, DoubleSide, Face3, Geometry,
    GridHelper, HemisphereLight, Mesh, MeshPhongMaterial, Texture, TextureLoader, Vector2, Vector3,
} from 'three';
import { PlanetTiles } from '../types/SR';
import { ThreeSceneElement } from './threeScene';

interface ChunkTestOpts {
    landColor: number;
    sunColor: number;
    seed: number;
    rpm: number;
}

export class TileTestElement extends ThreeSceneElement {

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
        const chunkMesh = getTileMesh(testTiles, this.opts.landColor, tileTex);
        chunkMesh.name = chunkName;
        chunkMesh.geometry.center();
        chunkMesh.translateY(-10);
        const prevChunk = this.scene.getObjectByName(chunkName);
        if (prevChunk) {
            this.scene.remove(prevChunk);
        }
        this.scene.add(chunkMesh);
        // TODO this listener leaks on seed changes
        this.addUpdateLoop('rotation', (delta: number) => {
            const rps = this.opts.rpm / 60;
            chunkMesh.rotateOnAxis(new Vector3(0, 1, 0), (Math.PI / (500 / delta)) * rps);
            return false;
        }, 40);
    }
}

type TileVerts = [Vector3, Vector3, Vector3, Vector3];

function getTileMesh(tiles: PlanetTiles, landColor: number, tileTex: Texture): Mesh {

    // make 4 verticies for each tile
    const vertices: TileVerts[][] = [];
    const geom = new Geometry();

    for (let x = 0; x < tiles.size; x++) {
        const vertRow: TileVerts[] = [];
        vertices.push(vertRow);

        for (let y = 0; y < tiles.size; y++) {
            const tileVerts: TileVerts = [
                new Vector3(x, y, tiles.grid[y][x][0]),
                new Vector3(x, y + 1, tiles.grid[y][x][1]),
                new Vector3(x + 1, y, tiles.grid[y][x][2]),
                new Vector3(x + 1, y + 1, tiles.grid[y][x][3]),
            ];
            geom.vertices.push(...tileVerts);
            vertRow.push(tileVerts);

        }
    }

    const { size } = tiles;

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

    // set texture UV
    for (let i = 0; i < geom.faces.length; i += 2) {
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

/*
function getTileGenerator(seed: number) {
    return (x: number, y: number, size: number) => {

    };
}
*/

const testTiles: PlanetTiles = {
    x: 0,
    y: 0,
    size: 4,
    grid: [
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 0, 0],
            [1, 1, 0, 0],
            [1, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
    ],
};
