import { loadTemplate } from ".";

export async function getUITestElement() {
  const template = await loadTemplate("uiTest");
  return class UITestElement extends HTMLElement {
    constructor() {
      super();
      this.appendChild(template.content.cloneNode(true));
    }
  };
}
