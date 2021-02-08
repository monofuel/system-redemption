import { HemisphereLight, AxesHelper, PlaneHelper, Plane, Vector3, DirectionalLight, OrbitControls, Mesh } from "three";
import { basicModel, loadAssets } from "../../../../mesh/models";
import { ModelType } from "../../../../types/SR";
import { ThreeSceneElement } from "../../../threeScene";

export class PFModelViewElement extends ThreeSceneElement {
    selected: ModelType = ModelType.tree_1;
    mesh?: Mesh;
    constructor() {
        super();

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

        if (this.dat) {
            this.dat.add(this, 'selected', [
                ModelType.tree_1,
                ModelType.rock,
                ModelType.iron_rock,
                ModelType.gold_rock,
                ModelType.green_guy,
                ModelType.berry_bush,
                ModelType.grass,
            ]).onFinishChange(() => this.loadModel())
        }

        this.loadModel();
    }

    async loadModel() {
        console.log("loading: " + this.selected);
        const assets = await loadAssets((current: number, total: number) => {
            // console.log(`ASSETS: ${current}/${total}`);
        });

        this.scene.add(new AxesHelper());
        this.scene.add(new PlaneHelper(new Plane(new Vector3(0, 1, 0)), 3));

        if (this.mesh) {
            this.scene.remove(this.mesh)
        }

        this.mesh = basicModel(assets[this.selected]);
        this.scene.add(this.mesh);
    }
}
