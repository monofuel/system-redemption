import {
  DirectionalLight,
  HemisphereLight,
  Object3D,
  Raycaster,
  Vector2,
  OrbitControls,
  MOUSE,
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
import { ThreeSceneElement, UpdateLoop } from './threeScene';
import _ from 'lodash';
import { defaultUnitDefinitions } from '../test/eventLogs/units';
import { newTank } from '../unit';
import { Entity } from '../mesh/entity';
import { Unit } from '../types/SR';

export class MapEditorElement extends ThreeSceneElement {

  private entities: { [key: string]: Entity } = {};
  animationLoop: UpdateLoop;

  private controls: OrbitControls;
  private opts = {
    sunColor: 0xcccccc,
  };
  constructor() {
    super();

    this.animationLoop = new UpdateLoop('animation', (delta: number): boolean => {
      for (const entity of Object.values(this.entities)) {
        entity.updateLoc();

      }
      return false;
    }, 40);
    this.animationLoop.start();

    const localLogStr = localStorage.getItem('default-eventlog');

    if (localLogStr) {
      try {
        const start = Date.now();
        const localLog = JSON.parse(localLogStr);
        this.ctx.loadLog(localLog);
        console.log(`LOADED FROM STORAGE ${Date.now() - start}ms`);
      } catch (err) {
        console.error(err);
        this.ctx.loadLog(getDefaultEditorMap());
      }
    } else {
      this.ctx.loadLog(getDefaultEditorMap());
    }


    this.ctx.onGameEvent = this.onGameEvent.bind(this);

    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);

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
    this.ctx.queue.addListener('newFiniteMap', () => {
      for (const entity of Object.values(this.entities)) {
        entity.remove();
        this.entities = {};
      }
      this.loadMap();
    });
    this.ctx.queue.addListener('mapEdit', this.loadMap.bind(this));
    this.ctx.queue.addListener('waterChange', this.loadMap.bind(this));

    this.oncontextmenu = (ev: MouseEvent) => {
      ev.preventDefault();
    };

    let dragStartEvent: MouseEvent | null = null;
    this.onmousedown = (ev: MouseEvent) => {
      dragStartEvent = ev;
    };

    this.onmousemove = (ev: MouseEvent) => {
      ev.preventDefault();
    };

    this.onAssetsLoaded = () => {
      this.ctx.queue.addListener('newUnit', (event) => {
        this.addUnit(this.ctx.gameState.units[event.unit.uuid]);
      });
      for (const unit of Object.values(this.ctx.gameState.units)) {
        this.addUnit(unit);
      }
    }

    const mouseUp = (ev: MouseEvent) => {
      const editorMode = this.ctx.gameState.editorMode;
      if (!editorMode) {
        return;
      }

      let dragDistance = 0;
      if (dragStartEvent) {
        const start = new Vector2(dragStartEvent.x, dragStartEvent.y);
        const end = new Vector2(ev.x, ev.y);
        dragDistance = start.distanceTo(end);
      }

      // ignore events if the mouse is dragged too far
      if (dragDistance > 5) {
        return;
      }

      const loc = this.getTileAtRay(
        mouseToVec(ev, this.offsetWidth, this.offsetHeight),
      );

      switch (editorMode.selection) {
        case EditorSelection.raiselower:
          let editType = MapEditType.raise;
          if (ev.button === 2) {
            editType = MapEditType.lower;
          }
          if (loc) {
            this.ctx.queue.post({
              kind: 'mapEdit',
              edit: editType,
              x: loc.x,
              y: loc.y,
            });
          }
          return;
        case EditorSelection.newUnit:
          if (loc) {

            this.ctx.queue.post({
              kind: 'newUnit',
              unit: {
                ...newTank(),
                color: editorMode.user!,
                x: loc.x,
                y: loc.y
              } // TODO look up unit type from editorMode
            })
          }
          return;
        case EditorSelection.clear:
        default:
          return;
      }
    };
    // this.onmouseleave = mouseEnd;
    this.addEventListener('mouseup', mouseUp, true);

    this.controls = new OrbitControls(this.camera, this);

    // leave left mouse button free for the game
    this.controls.mouseButtons = {
      LEFT: MOUSE.RIGHT,
      RIGHT: MOUSE.MIDDLE,
    } as any;


    this.controls.target.set(0, 0, 0);
    this.controls.update();
    this.controls.maxPolarAngle = (10 * Math.PI) / 21;

    this.loadMap();
  }

  private addUnit(unit: Unit) {
    if (this.entities[unit.uuid]) {
      this.entities[unit.uuid]
    }
    const entity = new Entity(this, unit);
    this.entities[unit.uuid] = entity;
  }

  public onGameEvent() {
    const log = _.map(this.ctx.events, (e) => e.event);
    const logStr = JSON.stringify(log);
    localStorage.setItem('default-eventlog', logStr);
  }

  // TODO landcontrol could probably just fire this event directly
  public onEditorModeChange(event: EditorMode) {
    if (['raiseWater', 'lowerWater'].includes(event.selection)) {
      this.ctx.queue.post({
        kind: 'waterChange',
        amount: event.selection === 'raiseWater' ? 0.2 : -0.2,
      });
      return;
    }
  }

  private getTileAtRay(screenLoc: Vector2): { x: number; y: number } | null {
    const raycaster = new Raycaster();
    raycaster.setFromCamera(screenLoc, this.camera);

    const mapObj = this.scene.getObjectByName('foobar');
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
    const gameMap = this.ctx.gameState.planet!;
    const { name, size, chunkSize } = gameMap;

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

export function getDefaultEditorMap(): ServerEvent[] {

  const map = _.cloneDeep(getFlatMap(
    'foobar',
    2,
    8,
    1.8,
  ));
  map.grid[0][0].grid[0][0] = [1, 1, 1, 1];

  return [
    {
      kind: 'newFiniteMap',
      map
    },
    ...defaultUnitDefinitions
  ]
}
