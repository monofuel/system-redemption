import { noop } from 'lodash';
import {
  CanvasRenderer,
  CanvasTexture,
  DirectionalLight,
  DirectionalLightHelper,
  DoubleSide,
  Face3,
  FrontSide,
  Geometry,
  HemisphereLight,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';
import { PlanetTiles, TileHeights } from '../types/SR';
import { toHexColor } from '../util';
import { ThreeSceneElement } from './threeScene';

interface ChunkTestOpts {
  landColor: number;
  cliffColor: number;
  edgeColor: number;
  sunColor: number;
  wireframe: boolean;
  zScale: number;
  rpm: number;
}

/*
  palette
  0x6F9240
  0x405136
  0x362E26
  0x7D9C5B
  0xF0EFB9
*/

export class TileTestElement extends ThreeSceneElement {
  private opts: ChunkTestOpts = {
    landColor: 0x405136,
    edgeColor: 0x6f9240,
    cliffColor: 0x362e26,
    sunColor: 0xcccccc,
    wireframe: false,
    zScale: 0.5,
    rpm: 2,
  };

  private canvas: HTMLCanvasElement;

  constructor() {
    super();
    const { sunColor } = this.opts;

    this.scene.add(new HemisphereLight(0xffffff, undefined, 0.3));
    const sun = new DirectionalLight(sunColor, 0.8);
    sun.translateY(40);
    sun.translateX(50);
    sun.lookAt(0, 0, 0);

    this.scene.add(sun);

    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    canvas.height = 32;
    canvas.width = 32;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = toHexColor(this.opts.edgeColor);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = toHexColor(this.opts.landColor);
    ctx.fillRect(1, 1, canvas.width - 2, canvas.height - 2);

    this.root.appendChild(canvas);

    this.loadChunk();

    this.dat.add(this.opts, 'rpm', 0, 10);
    this.dat.add(this.opts, 'zScale', 0, 1).onFinishChange(() => {
      this.loadChunk();
    });
    this.dat.add(this.opts, 'wireframe').onFinishChange(() => {
      this.loadChunk();
    });
  }

  private async loadChunk() {
    const chunkName = 'chunk-1';

    const tileTex = new CanvasTexture(this.canvas);

    const chunkMesh = getTileMesh(
      testTiles,
      this.opts.landColor,
      this.opts.cliffColor,
      tileTex,
      {
        wireframe: this.opts.wireframe,
        zScale: this.opts.zScale,
      },
    );
    chunkMesh.name = chunkName;
    chunkMesh.geometry.center();
    chunkMesh.translateY(-10);
    const prevChunk = this.scene.getObjectByName(chunkName);
    if (prevChunk) {
      this.scene.remove(prevChunk);
    }
    chunkMesh.geometry.scale(10, 10, 10);
    chunkMesh.rotateOnAxis(new Vector3(0, 1, 0), Math.PI);
    this.scene.add(chunkMesh);
    // TODO this listener leaks on seed changes
    this.addUpdateLoop(
      'rotation',
      (delta: number) => {
        const rps = this.opts.rpm / 60;
        chunkMesh.rotateOnAxis(
          new Vector3(0, 1, 0),
          (Math.PI / (500 / delta)) * rps,
        );
        return false;
      },
      40,
    );
  }
}

interface MeshOpts {
  wireframe: boolean;
  zScale: number;
}

function getTileMesh(
  tiles: PlanetTiles,
  landColor: number,
  cliffColor: number,
  tileTex: Texture,
  opts: Partial<MeshOpts> = {},
): Mesh {
  const geom = new Geometry();

  for (let y = 0; y < tiles.size; y++) {
    for (let x = 0; x < tiles.size; x++) {
      const tile = tiles.grid[x][y];
      const matrix = new Matrix4().makeTranslation(x, y, 0);
      geom.merge(getGeomForTile(tile, opts.zScale), matrix);
    }
  }

  // geom.mergeVertices();
  geom.computeFaceNormals();
  geom.computeVertexNormals();

  geom.rotateX(-Math.PI / 2);

  const landMaterial = new MeshPhongMaterial({
    // color: landColor,
    shininess: 0,
    side: FrontSide,
    map: tileTex,
    flatShading: true,

    wireframe: opts.wireframe || false,
  });
  const cliffMaterial = new MeshPhongMaterial({
    color: cliffColor,
    side: FrontSide,
    flatShading: true,
    shininess: 0,
    wireframe: opts.wireframe || false,
  });

  const mesh = new Mesh(geom, [landMaterial, cliffMaterial]);
  return mesh;
}

function getGeomForTile(corners: TileHeights, zScale: number = 0): Geometry {
  const geom = new Geometry();

  geom.vertices.push(
    new Vector3(0, 0, corners[0] * zScale), // 0
    new Vector3(0, 1, corners[1] * zScale), // 1
    new Vector3(1, 0, corners[2] * zScale), // 2
    new Vector3(1, 1, corners[3] * zScale), // 3
  );

  geom.faces.push(new Face3(3, 1, 0, undefined, undefined, 0));
  geom.faces.push(new Face3(0, 2, 3, undefined, undefined, 0));

  /*
  geom.computeFaceNormals();
  geom.uvsNeedUpdate = true;

  const face1 = geom.faces[0];
  const face2 = geom.faces[1];
  const normal = face1.normal
  .clone()
  .add(face2.normal)
    .divideScalar(2);
    for (var i = 0; i <= 2; i++) {
        geom.faces[0].vertexNormals[i] = normal;
        geom.faces[1].vertexNormals[i] = normal;
  }
  */

  // add cliff around sides

  geom.vertices.push(
    new Vector3(0, 0, -1), // 4
    new Vector3(0, 1, -1), // 5
    new Vector3(1, 0, -1), // 6
    new Vector3(1, 1, -1), // 7
  );

  geom.faces.push(new Face3(4, 0, 5, undefined, undefined, 1));
  geom.faces.push(new Face3(0, 1, 5, undefined, undefined, 1));

  geom.faces.push(new Face3(2, 4, 6, undefined, undefined, 1));
  geom.faces.push(new Face3(4, 2, 0, undefined, undefined, 1));

  geom.faces.push(new Face3(3, 2, 6, undefined, undefined, 1));
  geom.faces.push(new Face3(6, 7, 3, undefined, undefined, 1));

  geom.faces.push(new Face3(1, 3, 7, undefined, undefined, 1));
  geom.faces.push(new Face3(5, 1, 7, undefined, undefined, 1));

  // set texture UV
  for (let i = 0; i < geom.faces.length; i += 2) {
    geom.faceVertexUvs[0][i] = [
      new Vector2(0, 0),
      new Vector2(0, 1),
      new Vector2(1, 1),
    ];

    geom.faceVertexUvs[0][i + 1] = [
      new Vector2(0, 0),
      new Vector2(1, 0),
      new Vector2(1, 1),
    ];
  }
  geom.computeFaceNormals();
  geom.computeFlatVertexNormals();

  geom.uvsNeedUpdate = true;
  return geom;
}

const testTiles: PlanetTiles = {
  x: 0,
  y: 0,
  size: 4,
  grid: [
    [[1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[1, 1, 1, 1], [1, 1, 1, 1], [1, 0, 1, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  ],
};
