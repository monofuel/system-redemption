import { getParentContext, loadTemplate } from '.';
import { EditorSelection } from '../events';
import { EventContextElement } from './eventContext';
import _ from 'lodash';
import { getDefaultEditorMap } from './mapEditor';

const holdingButtons = ['raiselower', 'rampRaiseLower'];

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
        const log = _.cloneDeep(_.map(this.ctx.events, (e) => e.event));
        const eventHandler = this.ctx.onGameEvent;
        delete this.ctx.onGameEvent;
        this.ctx.replayLog('replay', false, log, false);
        this.ctx.onGameEvent = eventHandler;

      } else if (id === 'replay-realtime') {
        const log = _.cloneDeep(_.map(this.ctx.events, (e) => e.event));
        const eventHandler = this.ctx.onGameEvent;
        delete this.ctx.onGameEvent;
        this.ctx.replayLog('replay', false, log, true);
        this.ctx.onGameEvent = eventHandler;
      } else if (id === 'replay-reset') {
        this.ctx.loadLog(getDefaultEditorMap());
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
