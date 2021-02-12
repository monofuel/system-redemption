import _ from "lodash";
import { getParentContext } from "../../..";
import { EditorSelection } from "../../../../events/actions/frontend";
import { EntityType } from "../../../../types/planefront";
import { EventContextElement } from "../../../eventContext";
import { getDefaultEditorMap } from "../editor";
import { CustomElement } from "../../CustomElement";
import templateStr from "./index.html";

const holdingButtons = [
  "raiselower",
  "rampRaiseLower",
  "newEntity",
  "removeUnit"
];

export class PFLandControlsElement extends CustomElement {
  private buttonMap: { [key: string]: Element } = {};
  private ctx: EventContextElement;
  private entitySelect: HTMLSelectElement;
  private smoothCheck: HTMLInputElement;
  private selection: EditorSelection = EditorSelection.clear;

  constructor() {
    super(templateStr);
    this.ctx = getParentContext(this);
    this.entitySelect = document.getElementById("entity-select") as HTMLSelectElement;
    this.smoothCheck = document.getElementById("smooth-check") as HTMLInputElement;

    this.smoothCheck.onchange = () => {
      this.updateState();
    }

    this.setupButtons();
    this.setupUnitDropdown();
    this.updateState();
  }

  public onButtonPress(id: string) {
    const activeClass = "is-active";

    if (!id) {
      return;
    }
    this.selection = id as any;
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
      this.updateState();
    }
  }

  private updateState() {
     this.ctx.post({
        kind: "editorMode",
        selection: this.selection,
        smoothMode: this.smoothCheck.checked,
        entityType: this.entitySelect.value as EntityType,
      });
  }

  private setupButtons() {
    // TODO improve this query to be generic for this element
    // eslint-disable-next-line
    const buttons: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
      "pf-land-controls .button"
    );
    for (const button of buttons) {
      this.buttonMap[button.id] = button;
      button.onmouseup = this.onButtonPress.bind(this, button.id);
    }
  }

  private setupUnitDropdown() {
    const gameState = this.ctx.frontendContext.state;

    for (const entity of Object.values(EntityType)) {
      const option = document.createElement('option');
      option.text = entity;
      option.value = entity;
      this.entitySelect.appendChild(option);
    }
    
    this.entitySelect.onchange = e => {
      this.updateState();
    };
  }
}
