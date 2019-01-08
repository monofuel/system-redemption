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
  ServerEvents,
  ServerEvent,
} from '../events';
import { info } from '../logging';
import { getPlanetObject } from '../mesh/tiles';
import { getFlatMap } from '../planet/tiles';
import { ThreeSceneElement } from './threeScene';
import _ from 'lodash';
import { RTSControls } from '../mesh/rtsControls';

export class MapEditorElement extends ThreeSceneElement {
  private editorSelection: EditorSelection = EditorSelection.clear;
  private controls: RTSControls;
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
  constructor() {
    super();

    const localLogStr = localStorage.getItem('default-eventlog');

    if (localLogStr) {
      try {
        const start = Date.now();
        const localLog = JSON.parse(localLogStr);
        this.ctx.loadLog(localLog);
        console.log(`LOADED FROM STORAGE ${Date.now() - start}ms`);
      } catch (err) {
        console.error(err);
        this.ctx.loadLog(this.getDefaultLog());
      }
    } else {
      this.ctx.loadLog(this.getDefaultLog());
    }


    this.ctx.onGameEvent = () => {
      const log = _.map(this.ctx.events, (e) => e.event);
      const logStr = JSON.stringify(log);
      localStorage.setItem('default-eventlog', logStr);
      console.log(`LOCAL STORAGE ${log.length}`)
    }

    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);
    this.controls = new RTSControls(this.camera, this);

    this.scene.add(new HemisphereLight(0xffffff, undefined, 0.6));
    const sun = new DirectionalLight(0xffffff, 2);
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
    this.ctx.queue.addListener('mapEdit', this.loadMap.bind(this));
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

  public getDefaultLog(): ServerEvent[] {

    const map = getFlatMap(
      this.opts.name,
      this.opts.size,
      this.opts.chunkSize,
      1.8,
    );
    map.grid[0][0].grid[0][0] = [1, 1, 1, 1];

    return [
      {
        kind: 'newFiniteMap',
        map
      }
    ]
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
    const gameMap = this.ctx.gameState.planet!;

    info('loading map', { name: gameMap.name });
    const existing = this.scene.getObjectByName(gameMap.name);
    if (existing) {
      this.scene.remove(existing);
    }
    const mapObj = getPlanetObject({
      gameMap,
    });
    mapObj.rotateY(Math.PI);
    const offset = (size * chunkSize) / 2;

    mapObj.position.set(offset, 0, offset);
    this.scene.add(mapObj);
  }
}
