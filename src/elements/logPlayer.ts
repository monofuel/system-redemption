import { EventContextElement } from "./eventContext";

import { PlanetElement } from "./planet";
import { OrbitControls } from "three";

export class LogPlayerElement extends PlanetElement {
  constructor(ctx?: EventContextElement, useDatGui?: boolean) {
    super(ctx, useDatGui);

    const controls = new OrbitControls(this.camera, this);
    controls.target.set(0, 0, 0);
    controls.update();
  }
}
