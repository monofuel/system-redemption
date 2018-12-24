import { assert } from 'chai';
import { EditorMode, EditorSelection, UIEvents } from '../events';
import { EventQueue } from '../events/queues';

describe('test event system', () => {
  const uiQueue = new EventQueue<keyof UIEvents, UIEvents>();
  const expectedEvent: EditorMode = {
    kind: 'editorMode',
    selection: EditorSelection.raiselower,
  };
  let callCount = 0;
  const fn = (event: EditorMode) => {
    assert.deepEqual(event, expectedEvent);
    callCount++;
  };

  it('attach listeners', () => {
    uiQueue.addListener('editorMode', fn);
    uiQueue.post(expectedEvent);
    assert.equal(callCount, 1);
    callCount = 0;
  });

  it('remove listener', () => {
    uiQueue.removeListener('editorMode', fn);
    uiQueue.post(expectedEvent);
    assert.equal(callCount, 0);
  });

  it('multiple listeners', () => {
    uiQueue.addListener('editorMode', fn);
    uiQueue.addListener('editorMode', fn);
    uiQueue.post(expectedEvent);
    assert.equal(callCount, 2);
    uiQueue.removeListener('editorMode', fn);
    uiQueue.post(expectedEvent);
    assert.equal(callCount, 3);
  });
});
