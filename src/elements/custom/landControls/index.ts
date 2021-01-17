import { getParentContext } from "../..";
import { EventContextElement } from "../../eventContext";
import _ from "lodash";
import { getDefaultEditorMap } from "../../mapEditor";
import templateStr from "./index.html";
import { CustomElement } from "../CustomElement";
import { EditorSelection } from "../../../events/actions/frontend";

const holdingButtons = [
  "raiselower",
  "rampRaiseLower",
  "newUnit",
  "removeUnit"
];

export class LandControlsElement extends CustomElement {
  private buttonMap: { [key: string]: Element } = {};
  private ctx: EventContextElement;
  private unitSelect: HTMLSelectElement;
  private userSelect: HTMLSelectElement;
  constructor() {
    super(templateStr);
    this.ctx = getParentContext(this);
    this.getButtons();
    this.unitSelect = document.getElementById("unit-select") as any;
    const gameState = this.ctx.frontendContext.state;
    this.unitSelect.onchange = e => {
      if (gameState.editorMode) {
        this.ctx.post({
          ...gameState.editorMode,
          user: this.userSelect.value as any,
          unitType: this.unitSelect.value as any
        });
      }
    };
    this.userSelect = document.getElementById("user-select") as any;
    this.userSelect.onchange = e => {
      if (gameState.editorMode) {
        this.ctx.post({
          ...gameState.editorMode,
          user: this.userSelect.value as any,
          unitType: this.unitSelect.value as any
        });
      }
    };
  }

  public onButtonPress(id: string) {
    const activeClass = "is-active";

    if (!id) {
      return;
    }
    const selection: EditorSelection = id as any;
    for (const button of Object.values(this.buttonMap)) {
      button.classList.remove(activeClass);
    }
    if (holdingButtons.includes(id)) {
      this.buttonMap[id].classList.add(activeClass);
    }
    if (id === "toggleLogViewer") {
      this.ctx.post({
        kind: "toggleLogViewer",
        state: "open"
      });
    } else if (id === "replay-fast") {
      const log = _.cloneDeep(_.map(this.ctx.events, e => e.event));
      const eventHandler = this.ctx.onGameEvent;
      delete this.ctx.onGameEvent;
      this.ctx.replayLog("replay", false, log, false);
      this.ctx.onGameEvent = eventHandler;
    } else if (id === "replay-realtime") {
      const log = _.cloneDeep(_.map(this.ctx.events, e => e.event));
      const eventHandler = this.ctx.onGameEvent;
      delete this.ctx.onGameEvent;
      this.ctx.replayLog("replay", false, log, true);
      this.ctx.onGameEvent = eventHandler;
    } else if (id === "replay-reset") {
      const chunkSizeInput = document.getElementById(
        "chunkSize"
      ) as HTMLInputElement;
      const mapChunksInput = document.getElementById(
        "mapChunks"
      ) as HTMLInputElement;
      const log = getDefaultEditorMap(
        Number(mapChunksInput.value),
        Number(chunkSizeInput.value)
      );
      this.ctx.loadLog(log);
    } else if (["raiseWater", "lowerWater"].includes(id)) {
      this.ctx.post({
        kind: "waterChange",
        amount: id === "raiseWater" ? 0.2 : -0.2
      });
    } else {
      this.ctx.post({
        kind: "editorMode",
        selection,
        user: this.userSelect.value as any,
        unitType: this.unitSelect.value as any
      });
    }
  }

  private updatePlaceUnit() {}

  private getButtons() {
    // eslint-disable-next-line
    const buttons: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
      "land-controls .button"
    );
    for (const button of buttons) {
      this.buttonMap[button.id] = button;
      button.onmouseup = this.onButtonPress.bind(this, button.id);
    }
  }
}
