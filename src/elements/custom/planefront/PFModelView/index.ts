import { HemisphereLight, AxesHelper, PlaneHelper, Plane, Vector3, DirectionalLight, OrbitControls } from "three";
import { basicModel, loadAssets } from "../../../../mesh/models";
import { ThreeSceneElement } from "../../../threeScene";

export class PFModelViewElement extends ThreeSceneElement {
    constructor() {
        super();
        console.log('foobar')

        this.camera.position.set(7, 5, -7);
        this.camera.lookAt(0, 0, 0);
        const hemisphereLight = new HemisphereLight(0xcccccc, undefined, 1);
        this.scene.add(hemisphereLight);

        const sun = new DirectionalLight(0xffffff, 3);
        sun.translateY(10);
        sun.translateX(10);
        sun.lookAt(0, 0, 0);
        this.scene.add(sun);

        const controls = new OrbitControls(this.camera, this);
        controls.target.set(0, 0, 0);
        controls.update();

        this.loadModel();
    }

    async loadModel() {
        const assets = await loadAssets((current: number, total: number) => {
            // console.log(`ASSETS: ${current}/${total}`);
        });

        this.scene.add(new AxesHelper());
        this.scene.add(new PlaneHelper(new Plane(new Vector3(0, 1, 0)), 3));

        const mesh = basicModel(assets.tree_1);
        this.scene.add(mesh);
    }
}
