export abstract class CustomElement extends HTMLElement {
  constructor(templateStr?: string) {
    super();
    if (templateStr) {
      const template = this.template(templateStr);
      this.appendChild(template.content.cloneNode(true));
    }
  }

  template(templateStr: string) {
    const parser = new DOMParser();
    const document = parser.parseFromString(templateStr, "text/html");
    const head = document.head;
    const el = head.querySelector("template");
    if (!el) {
      throw new Error(`missing template for ${name}`);
    }
    return el;
  }
}
