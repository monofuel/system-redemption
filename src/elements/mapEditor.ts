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
import { TileHeights } from '../types/SR';

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
      if (!this.ctx.gameState.editorMode) {
        return;
      }
      const mode = this.ctx.gameState.editorMode;

      if (!([EditorSelection.raiselower, EditorSelection.newUnit].includes(mode.selection))) {
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
      if (mode.selection === EditorSelection.raiselower) {

        const deltaX = vec.x - loc[0];
        const deltaY = vec.z - loc[1];
        const lb = 0.20;
        const ub = 1 - lb;
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
      const hilight = this.ctx.gameState.hilight;
      switch (editorMode.selection) {
        case EditorSelection.raiselower:
          if (hilight && hilight.loc && hilight.corner) {
            const editType: TileHeights = [0, 0, 0, 0];

            // TODO
            // make map corners line up with hilight corners
            if (hilight.corner.includes(0)) {
              if (ev.button === 2) {
                editType[2]--;
              } else {
                editType[2]++;
              }
            }
            if (hilight.corner.includes(3)) {
              if (ev.button === 2) {
                editType[0]--;
              } else {
                editType[0]++;
              }
            }
            if (hilight.corner.includes(1)) {
              if (ev.button === 2) {
                editType[3]--;
              } else {
                editType[3]++;
              }
            }
            if (hilight.corner.includes(2)) {
              if (ev.button === 2) {
                editType[1]--;
              } else {
                editType[1]++;
              }
            }


            this.ctx.queue.post({
              kind: 'mapEdit',
              edit: editType,
              x: hilight.loc[0],
              y: hilight.loc[1],
            });
          }
          return;
        case EditorSelection.newUnit:
          if (hilight && hilight.loc) {

            this.ctx.queue.post({
              kind: 'newUnit',
              unit: {
                ...newTank(),
                color: editorMode.user!,
                x: hilight.loc[0],
                y: hilight.loc[1]
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
      // fudge the number over a little to prevent flickering over cliffs
      vec.add(new Vector3(0.001, 0.001, 0.001));
      let { x, y } = vec;
      const maxSize = this.ctx.gameState.planet!.size * this.ctx.gameState.planet!.chunkSize;
      if (x < 0) {
        vec.x = 0;
      }
      if (y < 0) {
        vec.z = 0;
      }
      if (x > maxSize - 0.002) {
        vec.x = maxSize - 0.002;
      }
      if (y > maxSize - 0.002) {
        vec.z = maxSize - 0.002;
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
    4,
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
