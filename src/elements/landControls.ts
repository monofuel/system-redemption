import { getParentContext, loadTemplate } from '.';
import { EditorSelection } from '../events';
import { EventContextElement } from './eventContext';
import _ from 'lodash';
import { getDefaultEditorMap } from './mapEditor';

const holdingButtons = ['raiselower', 'rampRaiseLower', 'newUnit'];

export async function getLandControlsElement() {
  const template = await loadTemplate('landControls');

  return class LandControlsElement extends HTMLElement {
    private buttonMap: { [key: string]: Element } = {};
    private ctx: EventContextElement;
    private unitSelect: HTMLSelectElement;
    private userSelect: HTMLSelectElement;
    constructor() {
      super();
      this.ctx = getParentContext(this);
      this.appendChild(template.content.cloneNode(true));
      this.getButtons();
      this.unitSelect = document.getElementById('unit-select') as any;
      const gameState = this.ctx.gameState;
      this.unitSelect.onchange = (e) => {
        if (gameState.editorMode) {
          this.ctx.queue.post({
            ...gameState.editorMode,
            user: this.userSelect.value as any,
            unitType: this.unitSelect.value as any,
          });
        }
      }
      this.userSelect = document.getElementById('user-select') as any;
      this.userSelect.onchange = (e) => {
        if (gameState.editorMode) {
          this.ctx.queue.post({
            ...gameState.editorMode,
            user: this.userSelect.value as any,
            unitType: this.unitSelect.value as any,
          });
        }
      }
    }

    public onButtonPress(id: string) {
      if (!id) {
        return;
      }
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
      } else if (['raiseWater', 'lowerWater'].includes(id)) {
        this.ctx.queue.post({
          kind: 'waterChange',
          amount: id === 'raiseWater' ? 0.2 : -0.2,
        });
      } else {
        this.ctx.queue.post({
          kind: 'editorMode',
          selection,
          user: this.userSelect.value as any,
          unitType: this.unitSelect.value as any,
        });
      }
    }

    private updatePlaceUnit() {

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
