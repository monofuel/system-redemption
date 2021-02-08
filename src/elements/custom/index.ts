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
import {DualfrontUITestElement } from './dualfront/test/'
import { DPadElement } from './dpad';
import { PFModelViewElement } from './planefront/PFModelView';

const events: { [key: string]: new () => CustomElement | LitElement | HTMLElement } = {
  'log-editor': LogEditorElement,
  'land-controls': LandControlsElement,
  'log-viewer': LogViewerElement,
  'admin-controls': AdminControlsElement,
  'ui-test': UITestElement,
  'loading-bar': LoadingBarElement,
  'test-menu': TestMenuElement,
  'planefront-test-menu': PlanefrontUITestElement,
  'dualfront-ui-test': DualfrontUITestElement,
  'd-pad': DPadElement,
  'pf-model-view': PFModelViewElement,
};

export default events;
