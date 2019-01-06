import {
  DirectionalLight,
  HemisphereLight,
  Object3D,
  Raycaster,
  Vector2,
} from 'three';
import { mouseToVec } from '.';
import {
  EditorMode,
  EditorSelection,
  MapEdit,
  MapEditType,
} from '../events';
import { info } from '../logging';
import { getPlanetObject, getTileMesh, getTileTexture } from '../mesh/tiles';
import { getFlatMap } from '../planet/tiles';
import { FiniteMap } from '../types/SR';
import { ThreeSceneElement } from './threeScene';

export class MapEditorElement extends ThreeSceneElement {
  private editorSelection: EditorSelection = EditorSelection.clear;
  private opts = {
    landColor: 0x405136,
    edgeColor: 0x6f9240,
    cliffColor: 0x362e26,
    waterColor: 0x53b0e2,
    waterHeight: 1.8,
    sunColor: 0xcccccc,
    name: 'foobar',
    size: 2,
    chunkSize: 8,
  };
  private gameMap: FiniteMap;
  constructor() {
    super();

    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);
    this.gameMap = getFlatMap(
      this.opts.name,
      this.opts.size,
      this.opts.chunkSize,
      1.8,
    );
    this.gameMap.grid[0][0].grid[0][0] = [1, 1, 1, 1];

    this.scene.add(new HemisphereLight(0xffffff, undefined, 0.3));
    const sun = new DirectionalLight(this.opts.sunColor, 0.8);
    sun.translateY(40);
    sun.translateX(50);
    sun.lookAt(0, 0, 0);
    /*
    const axesHelper = new AxesHelper();
    axesHelper.position.y += 2 * 0.9;
    this.scene.add(axesHelper);
    */
    this.scene.add(sun);

    this.ctx.queue.addListener(
      'editorMode',
      this.onEditorModeChange.bind(this),
    );
    this.ctx.queue.addListener('mapEdit', this.onEditMap.bind(this));
    this.ctx.queue.addListener('waterChange', (e) => {
      this.opts.waterHeight += e.amount;
      this.loadMap();
    });

    this.oncontextmenu = (ev: MouseEvent) => {
      ev.preventDefault();
    };

    this.onmousedown = (ev: MouseEvent) => {
      // TODO
    };

    this.onmousemove = (ev: MouseEvent) => {
      ev.preventDefault();
    };

    const mouseEnd = (ev: MouseEvent) => {
      switch (this.editorSelection) {
        case EditorSelection.raiselower:
          let editType = MapEditType.raise;
          if (ev.button === 2) {
            editType = MapEditType.lower;
          }
          const loc = this.getTileAtRay(
            mouseToVec(ev, this.offsetWidth, this.offsetHeight),
          );
          if (loc) {
            this.ctx.queue.post({
              kind: 'mapEdit',
              edit: editType,
              x: loc.x,
              y: loc.y,
            });
          }
          return;
        case EditorSelection.clear:
        default:
          return;
      }
    };
    this.onmouseleave = mouseEnd;
    this.onmouseup = mouseEnd;

    this.loadMap();
  }

  public onEditorModeChange(event: EditorMode) {
    if (['raiseWater', 'lowerWater'].includes(event.selection)) {
      this.ctx.queue.post({
        kind: 'waterChange',
        amount: event.selection === 'raiseWater' ? 0.2 : -0.2,
      });
      return;
    }
    this.editorSelection = event.selection;
  }

  public onEditMap(event: MapEdit) {
    const { size, chunkSize } = this.opts;

    const chunkX = Math.floor(event.x / chunkSize);
    const chunkY = Math.floor(event.y / chunkSize);
    const chunk = this.gameMap.grid[chunkY][chunkX];
    const tileX = event.x % chunkSize;
    const tileY = event.y % chunkSize;
    const tile = chunk.grid[tileY][tileX];
    let delta = [0, 0, 0, 0];
    if (event.edit === MapEditType.raise) {
      delta = [1, 1, 1, 1];
    } else if (event.edit === MapEditType.lower) {
      delta = [-1, -1, -1, -1];
    }
    for (let i = 0; i < tile.length; i++) {
      tile[i] += delta[i];
      if (tile[i] <= 0) {
        tile[i] = 0;
      }
    }
    this.loadMap();
  }

  private getTileAtRay(screenLoc: Vector2): { x: number; y: number } | null {
    const raycaster = new Raycaster();
    raycaster.setFromCamera(screenLoc, this.camera);

    const mapObj = this.scene.getObjectByName(this.opts.name);
    if (!mapObj) {
      return null;
    }
    const intersects = raycaster.intersectObjects(mapObj.children);
    if (intersects.length > 0) {
      const vec = intersects[0].point.applyMatrix4(mapObj.matrix);
      const x = Math.floor(vec.x);
      const y = Math.floor(vec.z);
      return { x, y };
    } else {
      return null;
    }
  }

  private loadMap() {
    const { name, size, chunkSize } = this.opts;
    const gameMap = this.gameMap;

    info('loading map', { name: gameMap.name });
    const existing = this.scene.getObjectByName(gameMap.name);
    if (existing) {
      this.scene.remove(existing);
    }
    const mapObj = getPlanetObject({
      gameMap: this.gameMap,
    });
    mapObj.rotateY(Math.PI);
    const offset = (size * chunkSize) / 2;

    mapObj.position.set(offset, 0, offset);
    this.scene.add(mapObj);
  }
}
