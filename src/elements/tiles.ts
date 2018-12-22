import {
  CanvasTexture,
  DirectionalLight,
  HemisphereLight,
  Vector3,
} from 'three';
import { getTileMesh } from '../mesh/tiles';
import { testTiles } from '../planet/tiles';
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

  private loadChunk() {
    const chunkName = 'chunk-1';

    const tileTex = new CanvasTexture(this.canvas);

    const chunkMesh = getTileMesh(testTiles, this.opts.cliffColor, tileTex, {
      wireframe: this.opts.wireframe,
      zScale: this.opts.zScale,
    });
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