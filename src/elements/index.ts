import { ChunkTestElement } from './chunk';
import { MapEditorElement } from './map-editor';
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
