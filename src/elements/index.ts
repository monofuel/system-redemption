import { Vector2 } from 'three';
import { EventContextElement } from './eventContext';
import { getLandControlsElement } from './landControls';
import { LogPlayerElement } from './logPlayer';
import { getLogViewerElement } from './logViewer';
import { MapEditorElement } from './mapEditor';
import { ThreeSceneElement } from './threeScene';
import { TileTestElement } from './tiles';
import { LogTestElement } from './log-tests';

class HelloWorld extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const div = document.createElement('div');
    div.innerText = 'hello world from div';
    shadow.appendChild(div);
  }
}

export function loadElements() {
  window.customElements.define('hello-world', HelloWorld);
  window.customElements.define('event-context', EventContextElement);
  window.customElements.define('tile-test', TileTestElement);
  window.customElements.define('log-player', LogPlayerElement);
  window.customElements.define('three-scene', ThreeSceneElement);
  window.customElements.define('map-editor', MapEditorElement);
  window.customElements.define('log-tests', LogTestElement);
}

// NB. loading elements asyncronously kind of sucks, but
// I don't want to have to include the <template> elements on every page
export async function loadAsyncElements() {
  // TODO: with more elements, should load them in parallel
  window.customElements.define('land-controls', await getLandControlsElement());
  window.customElements.define('log-viewer', await getLogViewerElement());
}

export async function loadTemplate(name: string): Promise<HTMLTemplateElement> {
  const url = `/templates/${name}.html`;
  const resp = await fetch(url);
  const parser = new DOMParser();
  const document = parser.parseFromString(await resp.text(), 'text/html');
  const head = document.head;
  const el = head.querySelector('template');
  if (!el) {
    throw new Error(`missing template for ${name}`);
  }
  return el;
}

export function getParentContext(el: HTMLElement) {
  while (el && !(el instanceof EventContextElement)) {
    const parent = el.parentElement;
    if (!parent) {
      throw new Error('null parent when searching for scene');
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
