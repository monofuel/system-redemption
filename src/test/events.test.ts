import { assert } from 'chai';
import { EditorMode, EditorSelection, UIEvents, UIEventType } from '../events';
import { EventQueue } from '../events/queues';

describe('test event system', () => {
  const uiQueue = new EventQueue<UIEventType, UIEvents>();
  const expectedEvent: EditorMode = {
    selection: EditorSelection.raise,
  };
  let callCount = 0;
  const fn = (event: EditorMode) => {
    assert.deepEqual(event, expectedEvent);
    callCount++;
  };

  it('attach listeners', () => {
    uiQueue.addListener('editorMode', fn);
    uiQueue.post('editorMode', expectedEvent);
    assert.equal(callCount, 1);
    callCount = 0;
  });

  it('remove listener', () => {
    uiQueue.removeListener('editorMode', fn);
    uiQueue.post('editorMode', expectedEvent);
    assert.equal(callCount, 0);
  });

  it('multiple listeners', () => {
    uiQueue.addListener('editorMode', fn);
    uiQueue.addListener('editorMode', fn);
    uiQueue.post('editorMode', expectedEvent);
    assert.equal(callCount, 2);
    uiQueue.removeListener('editorMode', fn);
    uiQueue.post('editorMode', expectedEvent);
    assert.equal(callCount, 3);
  });
});
