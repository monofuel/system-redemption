import { assert } from 'chai';
import { EventQueue } from '../events/queues';
import {
  FrontendEventKinds,
  FrontendEvents,
  FrontendEvent,
  EditorMode,
  EditorSelection,
  ToggleLogViewer,
} from '../events/actions/frontend';

describe('test event system', () => {
  describe('posting syncronously', () => {
    const uiQueue = new EventQueue<FrontendEventKinds, FrontendEvents>({
      logger: (event: FrontendEvent) => {
        eventLog.push(event);
      },
    });
    const expectedEvent: EditorMode = {
      kind: 'editorMode',
      selection: EditorSelection.raiselower,
      smoothMode: false,
    };
    let callCount = 0;
    const eventLog: FrontendEvent[] = [];
    const fn = (event: EditorMode) => {
      assert.deepEqual(event, expectedEvent);
      callCount++;
    };

    it('attach listeners', () => {
      uiQueue.addListener('editorMode', fn);
      uiQueue.post(expectedEvent);
      assert.equal(callCount, 1);
      callCount = 0;
      assert.equal(eventLog.length, 1);
    });

    it('remove listener', () => {
      uiQueue.removeListener('editorMode', fn);
      uiQueue.post(expectedEvent);
      assert.equal(callCount, 0);
      assert.equal(eventLog.length, 2);
    });

    it('multiple listeners', () => {
      uiQueue.addListener('editorMode', fn);
      uiQueue.addListener('editorMode', fn);
      uiQueue.post(expectedEvent);
      assert.equal(callCount, 2);
      assert.equal(eventLog.length, 3);
      uiQueue.removeListener('editorMode', fn);
      uiQueue.post(expectedEvent);
      assert.equal(callCount, 3);
      assert.equal(eventLog.length, 4);
    });
  });
  describe('posting async', () => {
    describe('should post but not fire', () => {
      const uiQueue = new EventQueue<FrontendEventKinds, FrontendEvents>({
        postSyncronous: false,
        logger: (event: FrontendEvent) => {
          eventLog.push(event);
        },
      });
      const expectedEvent: ToggleLogViewer = {
        kind: 'toggleLogViewer',
        state: 'open',
      };
      let callCount = 0;
      const eventLog: FrontendEvent[] = [];
      const fn = (event: ToggleLogViewer) => {
        assert.deepEqual(event, expectedEvent);
        callCount++;
      };

      it('attach listeners', () => {
        uiQueue.addListener('toggleLogViewer', fn);
        uiQueue.post(expectedEvent);
        assert.equal(callCount, 0);
        assert.equal(eventLog.length, 0);

        uiQueue.flush('editorMode');
        assert.equal(callCount, 0);
        assert.equal(eventLog.length, 0);

        uiQueue.flushAll();
        assert.equal(callCount, 1);
        callCount = 0;
        assert.equal(eventLog.length, 1);
      });
    });
  });
});
