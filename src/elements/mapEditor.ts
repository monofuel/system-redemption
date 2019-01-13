import {
  Raycaster,
  Vector2,
  OrbitControls,
  MOUSE,
  Vector3,
  Vertex,
} from 'three';
import { mouseToVec } from '.';
import {
  EditorMode,
  EditorSelection,
  MapEditType,
  ServerEvent,
  frontendEventList,
  HlightUpdate,
} from '../events';
import { getFlatMap } from '../planet/tiles';
import _ from 'lodash';
import { defaultUnitDefinitions } from '../test/eventLogs/units';
import { newTank } from '../unit';
import { PlanetElement } from './planet';

export class MapEditorElement extends PlanetElement {

  private controls: OrbitControls;
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

      if (this.ctx.gameState.editorMode && this.ctx.gameState.editorMode.selection !== EditorSelection.raiselower) {
        return;
      }
      const vec = this.getPointAtRay(
        mouseToVec(ev, this.offsetWidth, this.offsetHeight), true
      );
      if (!vec) {
        if (this.ctx.gameState.hilight) {
          this.ctx.queue.post({
            kind: 'hilightUpdate'
          })
        }
        return;
      }

      const loc: [number, number] = [Math.floor(vec.x), Math.floor(vec.z)];

      const corners: Array<0 | 1 | 2 | 3> = [];
      const deltaX = vec.x - loc[0];
      const deltaY = vec.z - loc[1];
      const lb = 0.30;
      const ub = 0.70;
      console.log(deltaX, deltaY);
      if (deltaX < lb) {
        if (deltaY < lb) {
          corners.push(3);
        } else if (deltaY > ub) {
          corners.push(0);
        } else {
          corners.push(0, 3);
        }
      } else if (deltaX > ub) {
        if (deltaY < lb) {
          corners.push(2);
        } else if (deltaY > ub) {
          corners.push(1);
        } else {
          corners.push(1, 2);
        }
      } else {
        if (deltaY < lb) {
          corners.push(3, 2);
        } else if (deltaY > ub) {
          corners.push(1, 0);
        } else {
          corners.push(0, 1, 2, 3)
        }
      }


      const existing = this.ctx.gameState.hilight;
      const newState: HlightUpdate = {
        kind: 'hilightUpdate',
        loc,
        corner: corners.length > 0 ? corners : undefined
      }

      if (_.isEqual(existing, newState)) {
        return;
      }


      this.ctx.queue.post(newState);

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
    const vec = this.getPointAtRay(screenLoc, ignoreWater);
    if (!vec) {
      return null;
    }
    let x = Math.floor(vec.x);
    let y = Math.floor(vec.z);
    return { x, y };

  }


  private getPointAtRay(screenLoc: Vector2, ignoreWater: boolean): Vector3 | null {
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
      let { x, y } = vec;
      const maxSize = this.ctx.gameState.planet!.size * this.ctx.gameState.planet!.chunkSize;
      if (x < 0) {
        vec.x = 0;
      }
      if (y < 0) {
        vec.z = 0;
      }
      if (x > maxSize - 1) {
        vec.x = maxSize - 1;
      }
      if (y > maxSize - 1) {
        vec.z = maxSize - 1;
      }
      return vec;
    } else {
      return null;
    }
  }
}
export function getDefaultEditorMap(): ServerEvent[] {

  const map = _.cloneDeep(getFlatMap(
    'foobar',
    2,
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
