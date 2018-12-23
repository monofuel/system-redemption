import {
  AxesHelper,
  CanvasTexture,
  DirectionalLight,
  HemisphereLight,
  Object3D,
} from 'three';
import { EditorMode } from '../events';
import { info } from '../logging';
import { getTileMesh, getTileTexture } from '../mesh/tiles';
import { getFlatMap } from '../planet/tiles';
import { FiniteMap } from '../types/SR';
import { toHexColor } from '../util';
import { ThreeSceneElement } from './threeScene';

export class MapEditorElement extends ThreeSceneElement {
  private opts = {
    landColor: 0x405136,
    edgeColor: 0x6f9240,
    cliffColor: 0x362e26,
    sunColor: 0xcccccc,
    name: 'foobar',
    size: 4,
    chunkSize: 8,
  };

  constructor() {
    super();

    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(new HemisphereLight(0xffffff, undefined, 0.3));
    const sun = new DirectionalLight(this.opts.sunColor, 0.8);
    sun.translateY(40);
    sun.translateX(50);
    sun.lookAt(0, 0, 0);

    this.scene.add(new AxesHelper());
    this.scene.add(sun);

    this.ctx.uiQueue.addListener(
      'editorMode',
      this.onEditorModeChange.bind(this),
    );

    this.loadMap();
  }

  public onEditorModeChange(event: EditorMode) {
    info('EDITOR | mode change', { mode: event.selection as any });
  }

  private loadMap() {
    const { name, size, chunkSize } = this.opts;
    const gameMap = getFlatMap(name, size, chunkSize);

    const tileTexture = getTileTexture(
      this.opts.landColor,
      this.opts.edgeColor,
    );
    const mapObj = new Object3D();
    mapObj.name = gameMap.name;

    for (let y = 0; y < gameMap.size; y++) {
      for (let x = 0; x < gameMap.size; x++) {
        const tiles = gameMap.grid[y][x];
        const chunk = getTileMesh(tiles, this.opts.cliffColor, tileTexture);
        chunk.translateX(x * chunkSize);
        chunk.translateZ(y * chunkSize);
        mapObj.add(chunk);
      }
    }
    const offset = -(size * chunkSize) / 2;

    mapObj.position.set(offset, 0, offset + chunkSize);
    this.scene.add(mapObj);
  }
}
