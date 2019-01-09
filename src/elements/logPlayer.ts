import { ThreeSceneElement, UpdateLoop } from './threeScene';
import { DirectionalLight, HemisphereLight, Mesh, Scene, Object3D, Vector2, Vector3, OrbitControls } from 'three';
import { info } from '../logging';
import { getPlanetObject } from '../mesh/tiles';
import { EventContextElement } from './eventContext';
import { Unit, UnitType, ModelType, GameColors } from '../types/SR';
import { Asset, coloredModel } from '../mesh/models';
import { getTile } from '../planet';
import { Entity } from '../mesh/entity';
import { PlanetElement } from './planet';

export class LogPlayerElement extends PlanetElement {

    constructor(ctx?: EventContextElement) {
        super(ctx);

        const controls = new OrbitControls(this.camera, this);
        controls.target.set(0, 0, 0);
        controls.update();
    }

}
