import { loadTemplate } from '.';

export async function getLandControlsElement() {
  const template = await loadTemplate('landControls');
  return class LandControlsElement extends HTMLElement {
    protected root: ShadowRoot;
    constructor() {
      super();
      this.root = this.attachShadow({ mode: 'open' });
      this.root.appendChild(template.content.cloneNode(true));
    }
  };
}
