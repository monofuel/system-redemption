import { filter } from 'lodash';
import { loadTemplate } from '.';
import { info } from '../logging';

export async function getLandControlsElement() {
  const template = await loadTemplate('landControls');

  return class LandControlsElement extends HTMLElement {
    private buttonMap: { [key: string]: Element } = {};
    private selected: string | undefined;
    constructor() {
      super();
      this.appendChild(template.content.cloneNode(true));
      this.getButtons();
    }

    public onButtonPress(id: string) {
      this.selected = id;
      info('button pressed', { id });
      for (const button of Object.values(this.buttonMap)) {
        button.classList.remove('pressed');
      }
      this.buttonMap[id].classList.add('pressed');
    }

    private getButtons() {
      const buttons: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
        'land-controls .ui-button',
      );
      for (const button of buttons) {
        this.buttonMap[button.id] = button;
        button.onmouseup = this.onButtonPress.bind(this, button.id);
      }
    }
  };
}
