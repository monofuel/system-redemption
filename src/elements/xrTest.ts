import { ThreeSceneElement } from "./threeScene";
import { DirectionalLight, HemisphereLight, AxesHelper, PlaneHelper, Plane, Vector3 } from "three";



export async function getXRTestElement() {

    // @ts-ignore
    if (!THREE.WebXRUtils) {
        console.log('three.xr.js not detected, skipping');
        return undefined;
    }
    const displays = await getDisplays();

    return class XRTestElement extends ThreeSceneElement {
        activeRealityType?: string;
        vrButton?: HTMLDivElement;
        arButton?: HTMLDivElement;
        uiWrapper: HTMLSpanElement;

        constructor() {
            super();

            this.uiWrapper = document.createElement('span');
            this.uiWrapper.classList.add('ui-wrapper');
            this.appendChild(this.uiWrapper);

            this.camera.position.set(7, 5, -7);
            this.camera.lookAt(0, 0, 0);
            const hemisphereLight = new HemisphereLight(0xcccccc, undefined, 1);
            this.scene.add(hemisphereLight);

            const sun = new DirectionalLight(0xffffff, 3);
            sun.translateY(10);
            sun.translateX(10);
            sun.lookAt(0, 0, 0);
            this.scene.add(sun);

            this.scene.add(new AxesHelper());
            this.scene.add(new PlaneHelper(new Plane(new Vector3(0, 1, 0)), 3));

            const options = {
                AR_AUTOSTART: false,
            }

            // @ts-ignore
            this.renderer.xr = new THREE.WebXRManager(options, displays, this.renderer, this.camera, this.scene);

            // Listen when a session is started or stopped
            // @ts-ignore
            this.renderer.xr.addEventListener('sessionStarted', this.sessionStarted.bind(this));
            // @ts-ignore
            this.renderer.xr.addEventListener('sessionEnded', this.sessionEnded.bind(this));

            // Auto start if only has one AR display supported
            // @ts-ignore
            if (!this.renderer.xr.autoStarted) {
                // Add as many buttons as there are displays that can be started
                this.addEnterButtons();
            }

            // this.addVRButton();
            // this.addARButton();

        }

        sessionStarted() {
            console.log('session started');

        }

        sessionEnded() {
            console.log('session ended');

        }

        addVRButton() {
            const d = document.createElement('div');
            d.classList.add('ui-leftbar');
            const s = document.createElement('span');
            s.classList.add('ui-button');
            s.innerText = 'Enter VR';
            s.onclick = () => {
                // @ts-ignore
                this.renderer.xr.startPresenting();
            }
            // @ts-ignore
            s.ontouchend = s.onclick;
            d.appendChild(s);
            this.uiWrapper.appendChild(d);
            this.vrButton = d;
        }

        addARButton() {
            const d = document.createElement('div');
            d.classList.add('ui-leftbar');
            const s = document.createElement('span');
            s.classList.add('ui-button');
            s.innerText = 'Enter AR';
            s.onclick = () => {
                // @ts-ignore
                this.renderer.xr.startSession(display, 'ar', true);
            }
            // @ts-ignore
            s.ontouchend = s.onclick;
            d.appendChild(s);
            this.uiWrapper.appendChild(d);
            this.arButton = d;
        }

        addEnterButtons() {
            console.log(displays);
            for (var i = 0; i < displays.length; i++) {
                var display = displays[i];
                if (display.supportedRealities.vr) {
                    console.log('DETECTED VR');
                    if (!this.vrButton) {
                        this.addVRButton();
                    }
                }
                if (display.supportedRealities.ar) {
                    console.log('DETECTED AR');
                    if (!this.arButton) {
                        this.addARButton();
                    }
                }
            }
        }
    }
}

async function getDisplays(): Promise<any> {
    return new Promise((resolve) => {
        // @ts-ignore
        return THREE.WebXRUtils.getDisplays().then(resolve);
    });
}