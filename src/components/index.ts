import { ChunkTest } from './chunk';

class HelloWorld extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        const div = document.createElement('div');
        div.innerText = 'hello world from div';
        shadow.appendChild(div);
    }

}

export function loadComponents() {
    window.customElements.define('hello-world', HelloWorld);
    window.customElements.define('chunk-test', ChunkTest);
}
