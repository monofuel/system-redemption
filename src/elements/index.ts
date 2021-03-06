import { Vector2 } from "three";
import { EventContextElement } from "./eventContext";
import { LogPlayerElement } from "./logPlayer";
import { MapEditorElement } from "./mapEditor";
import { ThreeSceneElement } from "./threeScene";
import { TileTestElement } from "./tiles";
import { LogTestElement } from "./log-tests";
import { ModelViewElement } from "./modelView";
import _ from "lodash";
import { getXRTestElement } from "./xrTest";
import { PlayELement } from "./play";
import CustomElements from "./custom";

class HelloWorld extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const div = document.createElement("div");
    div.innerText = "hello world from div";
    shadow.appendChild(div);
  }
}

export function loadElements() {
  // NB. this one has to load first
  // other elements traverse the dom to find it
  window.customElements.define("event-context", EventContextElement);

  for (const e of Object.keys(CustomElements)) {
    window.customElements.define(e, CustomElements[e]);
  }

  // TODO remove these
  window.customElements.define("hello-world", HelloWorld);
  window.customElements.define("tile-test", TileTestElement);
  window.customElements.define("log-player", LogPlayerElement);
  window.customElements.define("three-scene", ThreeSceneElement);
  window.customElements.define("map-editor", MapEditorElement);
  window.customElements.define("log-tests", LogTestElement);
  window.customElements.define("model-view", ModelViewElement);
  window.customElements.define("play-sr", PlayELement);
}

export async function loadAsyncElements() {
  const xrELement = await getXRTestElement();
  if (xrELement) {
    window.customElements.define("xr-test", xrELement);
  }
}

// TODO remove this
export async function loadTemplate(name: string): Promise<HTMLTemplateElement> {
  const url = `/templates/${name}.html`;
  const resp = await fetch(url);
  const parser = new DOMParser();
  const document = parser.parseFromString(await resp.text(), "text/html");
  const head = document.head;
  const el = head.querySelector("template");
  if (!el) {
    throw new Error(`missing template for ${name}`);
  }
  return el;
}

export function getParentContext(el: HTMLElement) {
  while (el && !(el instanceof EventContextElement)) {
    const parent = el.parentElement;
    if (!parent) {
      throw new Error("null parent when searching for scene");
    }
    el = parent;
  }
  return el;
}

export function mouseToVec(ev: MouseEvent, width: number, height: number) {
  const mouseVec = new Vector2();
  mouseVec.x = (ev.offsetX / width) * 2 - 1;
  mouseVec.y = -(ev.offsetY / height) * 2 + 1;
  return mouseVec;
}

// simple rolling average statistics
export class RollingStats {
  stats: number[] = [];
  size: number;
  constructor(size: number = 10) {
    this.size = size;
  }
  add(x: number) {
    this.stats.push(x);
    if (this.stats.length > this.size) {
      this.stats.shift();
    }
  }
  get(): number {
    const avg = _.mean(this.stats);
    if (isNaN(avg)) {
      return 0;
    }
    return avg;
  }
}
