import { LogEditorElement } from './logEditor';
import { CustomElement } from './CustomElement';
import { LandControlsElement } from './landControls';
import { LogViewerElement } from './logViewer';
import { AdminControlsElement } from './adminControls';
import { UITestElement } from './uiTest';
import { LoadingBarElement } from './loadingBar';
import { TestMenuElement } from './testMenu';
import { LitElement } from 'lit-element';
import { PlanefrontUITestElement } from './planefront/ui';
import { DPadElement } from './dpad';

const events: { [key: string]: new () => CustomElement | LitElement } = {
  'log-editor': LogEditorElement,
  'land-controls': LandControlsElement,
  'log-viewer': LogViewerElement,
  'admin-controls': AdminControlsElement,
  'ui-test': UITestElement,
  'loading-bar': LoadingBarElement,
  'test-menu': TestMenuElement,
  'planefront-test-menu': PlanefrontUITestElement,
  'd-pad': DPadElement,
};

export default events;
