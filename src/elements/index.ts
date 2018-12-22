import { ChunkTestElement } from './chunk';
import { getLandControlsElement } from './landControls';
import { MapEditorElement } from './mapEditor';
import { ThreeSceneElement } from './threeScene';
import { TileTestElement } from './tiles';

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
  window.customElements.define('tile-test', TileTestElement);
  window.customElements.define('chunk-test', ChunkTestElement);
  window.customElements.define('three-scene', ThreeSceneElement);
  window.customElements.define('map-editor', MapEditorElement);
}

// NB. loading elements asyncronously kind of sucks, but
// I don't want to have to include the <template> elements on every page
export async function loadAsyncElements() {
  // TODO: with more elements, should load them in parallel
  window.customElements.define('land-controls', await getLandControlsElement());
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
