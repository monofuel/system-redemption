import { filter } from 'lodash';
import { getParentContext, loadTemplate } from '.';
import { EditorSelection } from '../events';
import { info } from '../logging';
import { EventContextElement } from './eventContext';
import { ThreeSceneElement } from './threeScene';

export async function getLandControlsElement() {
  const template = await loadTemplate('landControls');

  return class LandControlsElement extends HTMLElement {
    private buttonMap: { [key: string]: Element } = {};
    private ctx: EventContextElement;
    constructor() {
      super();
      this.ctx = getParentContext(this);
      this.appendChild(template.content.cloneNode(true));
      this.getButtons();
    }

    public onButtonPress(id: string) {
      const selection: EditorSelection = id as any;
      for (const button of Object.values(this.buttonMap)) {
        button.classList.remove('pressed');
      }
      this.buttonMap[id].classList.add('pressed');
      this.ctx.uiQueue.post('editorMode', {
        selection,
      });
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
