import { LogEditorElement } from './logEditor';
import { CustomElement } from './CustomElement';
import { LandControlsElement } from './landControls';
import { LogViewerElement } from './logViewer';
import { AdminControlsElement } from './adminControls';
import { UITestElement } from './uiTest';
import { LoadingBarElement } from './loadingBar';
import { TestMenuElement } from './testMenu';
import { LitElement } from 'lit-element';
import { MapEditorControlsElement } from './mapEditorControls';

const events: { [key: string]: new () => CustomElement | LitElement } = {
  'log-editor': LogEditorElement,
  'land-controls': LandControlsElement,
  'log-viewer': LogViewerElement,
  'admin-controls': AdminControlsElement,
  'ui-test': UITestElement,
  'loading-bar': LoadingBarElement,
  'test-menu': TestMenuElement,
  'map-editor-controls': MapEditorControlsElement,
};

export default events;
