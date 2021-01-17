import {
  Raycaster,
  Vector2,
  OrbitControls,
  MOUSE,
  Vector3,
  Vertex
} from "three";
import { mouseToVec } from ".";
import { getFlatMap } from "../planet/tiles";
import _ from "lodash";
import { defaultUnitDefinitions } from "../test/eventLogs/units";
import { newTank } from "../unit";
import { PlanetElement } from "./planet";
import { TileHeights } from "../types/SR";
import { info } from "../logging";
import { getHash } from "../services/hash";
import {
  EditorSelection,
  frontendEventList,
  EditorMode
} from "../events/actions/frontend";
import { ServerEvent } from "../events/actions/game";

export class MapEditorElement extends PlanetElement {
  private controls: OrbitControls;
  protected usePlanetCache: boolean = true;
  constructor() {
    super();

    const localLogStr = localStorage.getItem("default-eventlog");

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

    this.ctx.frontendQueue.addListener(
      "editorMode",
      this.onEditorModeChange.bind(this)
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
      if (!this.ctx.frontendContext.state.editorMode) {
        return;
      }
      const mode = this.ctx.frontendContext.state.editorMode;

      if (
        ![EditorSelection.raiselower, EditorSelection.newUnit].includes(
          mode.selection
        )
      ) {
        return;
      }
      this.hilightAtMouse(ev);
    };

    const mouseUp = (ev: MouseEvent) => {
      const editorMode = this.ctx.frontendContext.state.editorMode;
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
      const hilight = this.ctx.frontendContext.state.hilight;
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

            const start = Date.now();
            const perfFn = () => {
              this.ctx.gameQueue.removeListener("mapEdit", perfFn);
              const end = Date.now();
              info("map edit delta", { delta: end - start });
            };
            this.ctx.gameQueue.addListener("mapEdit", perfFn);
            this.ctx.post({
              kind: "mapEdit",
              edit: editType,
              loc: hilight.loc
            });
          }
          return;
        case EditorSelection.newUnit:
          if (hilight && hilight.loc) {
            this.ctx.post({
              kind: "newUnit",
              unit: {
                ...newTank(),
                type: editorMode.unitType!,
                color: editorMode.user!,
                loc: hilight.loc
              }
            });
          }
          return;
        case EditorSelection.removeUnit:
          // eslint-disable-next-line
          const uuid = this.getUnitAtMouse(ev);
          if (uuid) {
            this.ctx.post({
              kind: "destroyUnit",
              uuid
            });
          }
          // eslint-disable-next-line
        case EditorSelection.clear:
        default:
          return;
      }
    };
    // this.onmouseleave = mouseEnd;
    this.addEventListener("mouseup", mouseUp, true);

    this.controls = new OrbitControls(this.camera, this);

    // leave left mouse button free for the game
    this.controls.mouseButtons = {
      LEFT: MOUSE.RIGHT,
      RIGHT: MOUSE.MIDDLE
    } as any;

    this.controls.target.set(0, 0, 0);
    this.controls.update();
    this.controls.maxPolarAngle = (10 * Math.PI) / 21;
  }

  public onGameEvent() {
    const log = _.map(this.ctx.events, e => e.event);

    // only include server events
    const logStr = JSON.stringify(
      log.filter(e => !frontendEventList.includes(e.kind))
    );
    localStorage.setItem("default-eventlog", logStr);
  }

  public onEditorModeChange(event: EditorMode) {}
}
export function getDefaultEditorMap(
  size: number = 4,
  chunkSize: number = 8
): ServerEvent[] {
  const map = _.cloneDeep(getFlatMap("foobar", size, chunkSize, 1.8));
  map.grid[0][0].grid[0][0] = [1, 1, 1, 1];

  return [
    {
      kind: "newFiniteMap",
      map
    },
    ...defaultUnitDefinitions
  ];
}
