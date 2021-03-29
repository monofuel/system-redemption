/* global THREE */
import { ThreeSceneElement } from "./threeScene";
import {
  DirectionalLight,
  HemisphereLight,
  AxesHelper,
  PlaneHelper,
  Plane,
  Vector3
} from "three";
import { PlanetElement } from "./planet";

export async function getXRTestElement() {
  // @ts-ignore
  if (!THREE.WebXRUtils) {
    console.log("three.xr.js not detected, skipping");
    return undefined;
  }
  const displays = await getDisplays();

  return class XRTestElement extends PlanetElement {
    activeRealityType?: string;
    vrButton?: HTMLDivElement;
    arButton?: HTMLDivElement;
    uiWrapper: HTMLSpanElement;

    constructor() {
      super();

      this.uiWrapper = document.createElement("span");
      this.uiWrapper.classList.add("ui-wrapper");
      this.appendChild(this.uiWrapper);

      this.camera.position.set(7, 5, -7);
      this.camera.lookAt(0, 0, 0);

      // this.scene.add(new AxesHelper());
      // this.scene.add(new PlaneHelper(new Plane(new Vector3(0, 1, 0)), 3));

      const options = {
        AR_AUTOSTART: false
      };

        // @ts-ignore
      this.renderer.xr = new THREE.WebXRManager(
        options,
        displays,
        this.renderer,
        this.camera,
        this.scene,
        this.update.bind(this)
      );

      // Listen when a session is started or stopped
      // @ts-ignore
      this.renderer.xr.addEventListener(
        "sessionStarted",
        this.sessionStarted.bind(this)
      );
      // @ts-ignore
      this.renderer.xr.addEventListener(
        "sessionEnded",
        this.sessionEnded.bind(this)
      );

      // Auto start if only has one AR display supported
      // @ts-ignore
      if (!this.renderer.xr.autoStarted) {
        // Add as many buttons as there are displays that can be started
        this.addEnterButtons();
      }

      this.ctx.loadLog(xrTestLog.map(e => e.event));
      // this.addVRButton();
      // this.addARButton();
    }

    update() {
      // not sure if this is neccessary with setAnimationLoop also being used?
      this.render();
    }

    sessionStarted() {
      console.log("session started");
    }

    sessionEnded() {
      console.log("session ended");
    }

    addVRButton() {
      const d = document.createElement("div");
      d.classList.add("ui-leftbar");
      const s = document.createElement("span");
      s.classList.add("ui-button");
      s.innerText = "Enter VR";
      s.onclick = () => {
        // @ts-ignore
        this.renderer.xr.startPresenting();

        // NB. the vr camera seems to stay at 0,0, so move the map over.
        const mapObj = this.scene.getObjectByName("foobar");
        if (!mapObj) {
          return;
        }
        mapObj.position.set(-1, -1, -1);
      };
      // @ts-ignore
      s.ontouchend = s.onclick;
      d.appendChild(s);
      this.uiWrapper.appendChild(d);
      this.vrButton = d;
    }

    addARButton(display: any) {
      const d = document.createElement("div");
      d.classList.add("ui-leftbar");
      const s = document.createElement("span");
      s.classList.add("ui-button");
      s.innerText = "Enter AR";
      s.onclick = () => {
        // @ts-ignore
        this.renderer.xr.startSession(display, "ar", true);
      };
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
          console.log("DETECTED VR");
          if (!this.vrButton) {
            this.addVRButton();
          }
        }
        if (display.supportedRealities.ar) {
          console.log("DETECTED AR");
          if (!this.arButton) {
            this.addARButton(display);
          }
        }
      }
    }
  };
}

async function getDisplays(): Promise<any> {
  return new Promise(resolve => {
    // @ts-ignore
    return THREE.WebXRUtils.getDisplays().then(resolve);
  });
}

const xrTestLog: any[] = [
  {
    event: {
      kind: "newFiniteMap",
      map: {
        name: "foobar",
        version: 1,
        tps: 2,
        landColor: 4215094,
        edgeColor: 7311936,
        cliffColor: 3550758,
        waterColor: 5484770,
        sunColor: 13421772,
        zScale: 0.4,
        size: 1,
        chunkSize: 4,
        waterHeight: 1.8,
        grid: [
          [
            {
              x: 0,
              y: 0,
              grid: [
                [[1, 1, 1, 1], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]],
                [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]]
              ]
            }
          ]
        ]
      }
    },
    timestamp: 1547100309265,
    listeners: 1
  },
  {
    event: {
      kind: "defineUnit",
      unit: {
        type: "tank",
        size: 1,
        buildTime: 10,
        cost: 100,
        maxHealth: 200,
        layer: "ground",
        graphical: {
          model: "LightTankLvl1"
        },
        move: {
          cooldown: 2
        }
      }
    },
    timestamp: 1547100309285,
    listeners: 0
  },
  {
    event: {
      kind: "editorMode",
      selection: "raiselower",
      user: "blue",
      unitType: "tank"
    },
    timestamp: 1547100316080,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [-1, -1, -1, -1],
      x: 0,
      y: 0
    },
    timestamp: 1547100316754,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [-1, -1, -1, -1],
      x: 1,
      y: 0
    },
    timestamp: 1547100317424,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [-1, -1, -1, -1],
      x: 0,
      y: 1
    },
    timestamp: 1547100318252,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [-1, -1, -1, -1],
      x: 1,
      y: 1
    },
    timestamp: 1547100318647,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [-1, -1, -1, -1],
      x: 0,
      y: 2
    },
    timestamp: 1547100319104,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [-1, -1, -1, -1],
      x: 1,
      y: 2
    },
    timestamp: 1547100319415,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [-1, -1, -1, -1],
      x: 2,
      y: 0
    },
    timestamp: 1547100320628,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [-1, -1, -1, -1],
      x: 2,
      y: 1
    },
    timestamp: 1547100321071,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [1, 1, 1, 1],
      x: 3,
      y: 3
    },
    timestamp: 1547100321864,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [1, 1, 1, 1],
      x: 3,
      y: 2
    },
    timestamp: 1547100322295,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [1, 1, 1, 1],
      x: 2,
      y: 2
    },
    timestamp: 1547100323063,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [1, 1, 1, 1],
      x: 2,
      y: 3
    },
    timestamp: 1547100323988,
    listeners: 1
  },
  {
    event: {
      kind: "mapEdit",
      edit: [1, 1, 1, 1],
      x: 3,
      y: 3
    },
    timestamp: 1547100324622,
    listeners: 1
  },
  {
    event: {
      kind: "editorMode",
      selection: "newEntity",
      user: "blue",
      unitType: "tank"
    },
    timestamp: 1547100328966,
    listeners: 1
  },
  {
    event: {
      kind: "newEntity",
      unit: {
        uuid: "a9cf0354-9615-4fdc-b6f7-83a5a5134b91",
        type: "tank",
        facing: "E",
        size: 1,
        x: 2,
        y: 2,
        color: "blue",
        map: "test",
        moveCooldown: 0
      }
    },
    timestamp: 1547100329496,
    listeners: 1
  },
  {
    event: {
      kind: "editorMode",
      selection: "newEntity",
      user: "red",
      unitType: "tank"
    },
    timestamp: 1547100332172,
    listeners: 1
  },
  {
    event: {
      kind: "newEntity",
      unit: {
        uuid: "1af26dab-6bdd-4aa2-9704-c2b9bb8b6bb9",
        type: "tank",
        facing: "E",
        size: 1,
        x: 0,
        y: 3,
        color: "red",
        map: "test",
        moveCooldown: 0
      }
    },
    timestamp: 1547100333107,
    listeners: 1
  },
  {
    event: {
      kind: "editorMode",
      selection: "newEntity",
      user: "white",
      unitType: "tank"
    },
    timestamp: 1547100336395,
    listeners: 1
  },
  {
    event: {
      kind: "newEntity",
      unit: {
        uuid: "5852b123-929b-42a2-900a-3e7fd713cf4b",
        type: "tank",
        facing: "E",
        size: 1,
        x: 3,
        y: 0,
        color: "white",
        map: "test",
        moveCooldown: 0
      }
    },
    timestamp: 1547100337258,
    listeners: 1
  }
];
