import { getParentContext, loadTemplate } from '.';
import { EditorSelection } from '../events';
import { EventContextElement } from './eventContext';

const holdingButtons = ['raiselower'];

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
      if (holdingButtons.includes(id)) {
        this.buttonMap[id].classList.add('pressed');
      }
      if (id === 'toggleLogViewer') {
        this.ctx.queue.post({
          kind: 'toggleLogViewer',
          state: 'open',
        });
      } else if (id === 'replay-fast') {
        this.ctx.replayFromFile('/test/chunk/testLog.json', false);
      } else if (id === 'replay-realtime') {
        this.ctx.replayFromFile('/test/chunk/testLog.json', true);
      } else {
        this.ctx.queue.post({
          kind: 'editorMode',
          selection,
        });
      }
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
