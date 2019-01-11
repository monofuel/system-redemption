import {
  Raycaster,
  Vector2,
  OrbitControls,
  MOUSE,
} from 'three';
import { mouseToVec } from '.';
import {
  EditorMode,
  EditorSelection,
  MapEditType,
  ServerEvent,
  frontendEventList,
} from '../events';
import { getFlatMap } from '../planet/tiles';
import { UpdateLoop } from './threeScene';
import _ from 'lodash';
import { defaultUnitDefinitions } from '../test/eventLogs/units';
import { newTank } from '../unit';
import { PlanetElement } from './planet';

export class MapEditorElement extends PlanetElement {

  private controls: OrbitControls;
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

    // this.camera.position.set(20, 20, 20);
    this.camera.lookAt(0, 0, 0);

    this.ctx.queue.addListener(
      'editorMode',
      this.onEditorModeChange.bind(this),
    );

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
        mouseToVec(ev, this.offsetWidth, this.offsetHeight), true
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
  }

  public onGameEvent() {
    const log = _.map(this.ctx.events, (e) => e.event);

    // only include server events
    const logStr = JSON.stringify(log.filter((e) => !frontendEventList.includes(e.kind)));
    localStorage.setItem('default-eventlog', logStr);
  }

  public onEditorModeChange(event: EditorMode) {

  }

  private getTileAtRay(screenLoc: Vector2, ignoreWater: boolean): { x: number; y: number } | null {
    const raycaster = new Raycaster();
    raycaster.setFromCamera(screenLoc, this.camera);

    const mapObj = this.scene.getObjectByName('foobar');
    if (!mapObj) {
      return null;
    }

    const intersects = raycaster.intersectObjects(mapObj.children);
    let intersection = intersects.length > 0 ? intersects[0] : null;
    // HACK for ignoring water, ignore transparent faces
    if (ignoreWater) {
      for (const inter of intersects) {
        const face = inter.face;
        if (face && face.materialIndex === 2) {
          console.log(face.materialIndex);
          intersection = null;
          continue;
        } else {
          intersection = inter;
          break;
        }
      }
    }
    if (intersection) {



      const vec = intersection.point.applyMatrix4(mapObj.matrix);
      let x = Math.floor(vec.x);
      let y = Math.floor(vec.z);
      const maxSize = this.ctx.gameState.planet!.size * this.ctx.gameState.planet!.chunkSize;
      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (x > maxSize - 1) {
        x = maxSize - 1;
      }
      if (y > maxSize - 1) {
        y = maxSize - 1;
      }

      return { x, y };
    } else {
      return null;
    }
  }
}

export function getDefaultEditorMap(): ServerEvent[] {

  const map = _.cloneDeep(getFlatMap(
    'foobar',
    1,
    4,
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
